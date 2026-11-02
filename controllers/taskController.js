//controllers/taskController.js

const { taskSchema, patchTaskSchema } = require("../validation/taskSchema");
const pool = require("../db/pg-pool");

const create = async (req, res) => {
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

    const result = await pool.query(
        `INSERT INTO tasks (title, is_completed, user_id)
         VALUES ($1, $2, $3)
         RETURNING id, title, is_completed`,
        [value.title, value.isCompleted, global.user_id]
    );

    const newTask = result.rows[0];

    return res.status(201).json({
        id: newTask.id,
        title: newTask.title,
        isCompleted: newTask.is_completed
    });
};

const index = async (req, res) => {
    if (!global.user_id) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    const result = await pool.query(
        "SELECT id, title, is_completed FROM tasks WHERE user_id = $1",
        [global.user_id]
    );

    const tasks = result.rows;

    if (tasks.length === 0) {
        return res.status(404).json({
            message: "The user has no tasks",
        });
    }

    return res.status(200).json(tasks);
};

const show = async (req, res) => {
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

    const result = await pool.query(
        `SELECT id, title, is_completed
         FROM tasks
         WHERE id = $1 AND user_id = $2`,
        [taskId, global.user_id]
    );

    const task = result.rows[0];

    if (!task) {
        return res.status(404).json({
            message: "No matching task exists.",
        });
    }

    return res.status(200).json(task);
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

        const taskId = parseInt(req.params?.id);

        if (!taskId || Number.isNaN(taskId)) {
            return res.status(400).json({
                message: "The task ID passed is not valid.",
            });
        }

        let keys = Object.keys(value);

        keys = keys.map((key) =>
            key === "isCompleted" ? "is_completed" : key
        );

        const setClauses = keys
            .map((key, i) => `${key} = $${i + 1}`)
            .join(", ");

        const idParm = `$${keys.length + 1}`;
        const userParm = `$${keys.length + 2}`;

        const result = await pool.query(
            `UPDATE tasks SET ${setClauses}
             WHERE id = ${idParm} AND user_id = ${userParm}
             RETURNING id, title, is_completed`,
            [...Object.values(value), taskId, global.user_id]
        );

        const updatedTask = result.rows[0];

        if (!updatedTask) {
            return res.status(404).json({
                message: "No matching task exists.",
            });
        }

        return res.status(200).json(updatedTask);

    } catch (err) {
        next(err);
    }
};

const deleteTask = async (req, res, next) => {
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

        const result = await pool.query(
            `DELETE FROM tasks
             WHERE id = $1 AND user_id = $2
             RETURNING id, title, is_completed`,
            [taskId, global.user_id]
        );

        const deletedTask = result.rows[0];

        if (!deletedTask) {
            return res.status(404).json({
                message: "No matching task exists.",
            });
        }

        return res.status(200).json(deletedTask);

    } catch (err) {
        next(err);
    }
};

module.exports = {
    create,
    index,
    show,
    update,
    deleteTask,
};