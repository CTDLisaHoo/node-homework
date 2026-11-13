//controllers/taskController.js

const { taskSchema, patchTaskSchema } = require("../validation/taskSchema");
const prisma = require("../db/prisma");

const create = async (req, res, next) => {
    try {
        if (!global.user_id) {
            return res.status(401).json({
                message: "Unauthorized",
            });
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
                userId: global.user_id,
            },
            select: {
                id: true,
                title: true,
                isCompleted: true,
            },
        });

        return res.status(201).json(newTask);

    } catch (err) {
        next(err);
    }
};

const index = async (req, res, next) => {
    if (!global.user_id) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    try {
        const tasks = await prisma.task.findMany({
            where: {
                userId: global.user_id,
            },
            select: {
                title: true,
                isCompleted: true,
                id: true
            }
        });

        if (tasks.length === 0) {
            return res.status(404).json({
                message: "The user has no tasks",
            });
        }

        return res.status(200).json(tasks);

    } catch (err) {
        next(err);
    }
};

const show = async (req, res, next) => {
    try {
        if (!global.user_id) {
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
                userId: global.user_id,
            },
            select: {
                id: true,
                title: true,
                isCompleted: true,
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
        if (!global.user_id) {
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
                userId: global.user_id,
            },
            select: {
                title: true,
                isCompleted: true,
                id: true,
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
        if (!global.user_id) {
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
                userId: global.user_id,
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
    index,
    show,
    update,
    deleteTask,
};