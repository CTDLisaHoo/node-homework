//controllers/taskController.js

const { taskSchema, patchTaskSchema } = require("../validation/taskSchema");

const taskCounter = (() => {
    let lastTaskNumber = 0;
    return () => {
        lastTaskNumber += 1;
        return lastTaskNumber;
    };
})();

const create = (req, res) => {
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

    const newTask = {
        id: taskCounter(),
        userId: global.user_id.email,
        ...value,
    };
    
    global.tasks.push(newTask);
    const { userId, ...sanitizedTask } = newTask;
    return res.status(201).json(sanitizedTask);
};

const index = (req, res) => {
    if (!global.user_id) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    const userTasks = global.tasks.filter(
        (task) => task.userId === global.user_id.email,
    );

    if (userTasks.length === 0) {
        return res.status(404).json({
            message: "The user has no tasks",
        });
    }

    const sanitizedTasks = userTasks.map((task) => {
        const { userId, ...sanitizedTask } = task;
        return sanitizedTask;
    });

    return res.status(200).json(sanitizedTasks);
};

const show = (req, res) => {
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

    const task = global.tasks.find(
        (task) => task.id === taskId && task.userId === global.user_id.email
    );

    if (!task) {
        return res.status(404).json({
            message: "No matching task exists.",
        });
    }

    const { userId, ...sanitizedTask } = task;
    return res.status(200).json(sanitizedTask);
};

const update = (req, res) => {
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

    const task = global.tasks.find(
        (task) => task.id === taskId && task.userId === global.user_id.email
    );

    if (!task) {
        return res.status(404).json({
            message: "No matching task exists.",
        });
    }

    Object.assign(task, value);
    const { userId, ...sanitizedTask } = task;
    return res.status(200).json(sanitizedTask);
};

const deleteTask = (req, res) => {
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

    const taskIndex = global.tasks.findIndex(
        (task) => task.id === taskId && task.userId === global.user_id.email
    );

    if (taskIndex === -1) {
        return res.status(404).json({
            message: "No matching task exists.",
        });
    }

    const task = global.tasks[taskIndex];
    const { userId, ...sanitizedTask } = task;

    global.tasks.splice(taskIndex, 1);

    return res.status(200).json(sanitizedTask);
};

module.exports = {
    create,
    index,
    show,
    update,
    deleteTask,
};