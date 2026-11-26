//controllers/taskController.js

const { taskSchema, patchTaskSchema } = require("../validation/taskSchema");
const prisma = require("../db/prisma");

const create = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new TypeError("User ID is required");
        }

        if (!req.body) req.body = {};

        const { error, value } = taskSchema.validate(req.body, {
            abortEarly: false,
        });

        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        const newTask = await prisma.task.create({
            data: {
                title: value.title,
                isCompleted: value.isCompleted,
                priority: value.priority,
                userId: req.user.id,
            },
            select: {
                id: true,
                title: true,
                isCompleted: true,
                priority: true,
            },
        });

        return res.status(201).json(newTask);

    } catch (err) {
        next(err);
    }
};

// Bulk create with validation
const bulkCreate = async (req, res, next) => {

    // Check authentication
    if (!req.user || !req.user.id) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    const { tasks } = req.body || {};

    // Validate the tasks array
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
        return res.status(400).json({
            error: "Invalid request data. Expected an array of tasks."
        });
    }

    // Validate all tasks before insertion
    const validTasks = [];
    for (const task of tasks) {
        const { error, value } = taskSchema.validate(task);
        if (error) {
            return res.status(400).json({
                error: "Validation failed",
                details: error.details,
            });
        }
        validTasks.push({
            title: value.title,
            isCompleted: value.isCompleted || false,
            priority: value.priority || 'medium',
            userId : req.user.id
        });
    }

    // Use createMany for batch insertion
    try {
        const result = await prisma.task.createMany({
            data: validTasks,
            skipDuplicates: false
        });

        res.status(201).json({
            message: "Bulk task creation successful",
            tasksCreated: result.count,
            totalRequested: validTasks.length
        });
    } catch (err) {
        return next(err);
    }
};

const index = async (req, res, next) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    try {
        // Parse pagination parameters
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(
            Math.max(parseInt(req.query.limit) || 10, 1),
            100
        );
        const skip = (page - 1) * limit;

        // Build where clause with optional search filter
        const whereClause = {
            userId: req.user.id
        };

        if (req.query.find) {
            whereClause.title = {
                contains: req.query.find,
                mode: 'insensitive'
            };
        }

        const getOrderBy = (query) => {
            const validSortFields = ["title", "priority", "createdAt", "id", "isCompleted"];
            const sortBy = query.sortBy || "createdAt";
            const sortDirection = query.sortDirection === "asc" ? "asc" : "desc";

            if (validSortFields.includes(sortBy)) {
                return { [sortBy]: sortDirection };
            }
            return { createdAt: "desc" }; // default fallback
        };

        // Get tasks with pagination and eager loading
        const tasks = await prisma.task.findMany({
            where: whereClause,
            select: {
                id: true,
                title: true,
                isCompleted: true,
                priority: true,
                createdAt: true,
                User: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            skip: skip,
            take: limit,
            orderBy: getOrderBy(req.query),
        });

        // Get total count for pagination metadata
        const totalTasks = await prisma.task.count({
            where: whereClause
        });

        // Build pagination object with complete metadata
        // Hint: The test expects page, limit, total, pages, hasNext, hasPrev
        // Use Math.ceil() to calculate pages, and compare page * limit with total for hasNext
        const pagination = {
            page,
            limit,
            total: totalTasks,
            pages: Math.ceil(totalTasks / limit),
            hasNext: page * limit < totalTasks,
            hasPrev: page > 1
        };

        if (tasks.length === 0) {
            return res.status(404).json({
                message: "The user has no tasks",
            });
        }

        return res.status(200).json({
            tasks,
            pagination
        });

    } catch (err) {
        next(err);
    }
};

const show = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const taskId = parseInt(req.params?.id);

        if (!taskId || Number.isNaN(taskId)) {
            return res.status(400).json({
                message: "The task ID passed is not valid.",
            });
        }

        const task = await prisma.task.findUnique({
            where: {
                id: taskId,
                userId: req.user.id,
            },
            select: {
                id: true,
                title: true,
                isCompleted: true,
                priority: true,
                User: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        if (!task) {
            return res.status(404).json({
                message: "No matching task exists.",
            });
        }

        return res.status(200).json(task);

    } catch (err) {
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        if (!req.body) req.body = {};

        const { error, value } = patchTaskSchema.validate(req.body, {
            abortEarly: false,
        });

        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        const id = parseInt(req.params?.id);

        if (!id || Number.isNaN(id)) {
            return res.status(400).json({
                message: "The task ID passed is not valid.",
            });
        }

        const task = await prisma.task.update({
            data: value,
            where: {
                id,
                userId: req.user.id,
            },
            select: {
                title: true,
                isCompleted: true,
                id: true,
                priority: true,
            },
        });

        return res.status(200).json(task);

    } catch (err) {
        if (err.code === "P2025") {
            return res.status(404).json({
                message: "The task was not found.",
            });
        } else {
            return next(err);
        }
    }
};

const deleteTask = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const id = parseInt(req.params?.id);

        if (!id || Number.isNaN(id)) {
            return res.status(400).json({
                message: "The task ID passed is not valid.",
            });
        }

        const deletedTask = await prisma.task.delete({
            where: {
                id,
                userId: req.user.id,
            },
            select: {
                id: true,
                title: true,
                isCompleted: true,
            },
        });

        return res.status(200).json(deletedTask);

    } catch (err) {
        if (err.code === "P2025") {
            return res.status(404).json({
                message: "No matching task exists.",
            });
        } else {
            return next(err);
        }
    }
};

module.exports = {
    create,
    bulkCreate,
    index,
    show,
    update,
    deleteTask,
};