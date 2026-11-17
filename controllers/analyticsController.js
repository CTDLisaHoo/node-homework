//controllers/analyticsController.js

const prisma = require("../db/prisma");

const getUserAnalytics = async (req, res, next) => {
  try {
    // Parse and validate user ID
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({
        error: "Invalid user ID"
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    // Use groupBy to count tasks by completion status
    const taskStats = await prisma.task.groupBy({
      by: ['isCompleted'],
      where: { userId },
      _count: {
        id: true
      }
    });

    // Include recent task activity with eager loading
    const recentTasks = await prisma.task.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        isCompleted: true,
        priority: true,
        createdAt: true,
        userId: true,
        User: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Calculate weekly progress using groupBy
    // First, calculate the date from one week ago
    // Hint: Use new Date() and setDate() to subtract 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Then use groupBy with a where clause filtering by createdAt >= oneWeekAgo
    const weeklyProgress = await prisma.task.groupBy({
      by: ['createdAt'],
      where: {
        userId,
        createdAt: { gte: oneWeekAgo }
      },
      _count: { id: true }
    });

    // Return response with taskStats, recentTasks, and weeklyProgress
    res.status(200).json({
      // ... you need to return the three properties
      taskStats,
      recentTasks,
      weeklyProgress
    });

  } catch (err) {
    return next(err);
  }
};

const getUsersWithStats = async (req, res, next) => {
  try {
    // Parse pagination parameters (similar to how you did in the task index method in section 3 above)
    // Hint: Parse page and limit from req.query, calculate skip
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(
        Math.max(parseInt(req.query.limit) || 10, 1),
        100
    );
    const skip = (page - 1) * limit;
    // Get users with task counts using _count aggregation
    // Note: In Prisma, you need to use include for relations, then transform the result
    const usersRaw = await prisma.user.findMany({
      include: {
        Task: {
          where: { isCompleted: false },
          select: { id: true },
          take: 5
        },
        _count: {
          select: {
            Task: true
          }
        }
      },
      skip: skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    // Transform to only include the fields we want
    const users = usersRaw.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      _count: user._count,
      Task: user.Task
    }));

    // Get total count for pagination
    const totalUsers = await prisma.user.count();

    // Build pagination object with page, limit, total, pages, hasNext, hasPrev
    // Hint: Use Math.ceil() for pages, compare page * limit with total for hasNext
    const pagination = {
      page,
      limit,
      total: totalUsers,
      pages: Math.ceil(totalUsers / limit),
      hasNext: page * limit < totalUsers,
      hasPrev: page > 1
    };

      // Return users and pagination
      res.status(200).json({
        // ... you need to return users and pagination
        users,
        pagination
      });

  } catch (err) {
    return next(err);
  }
};

const searchTasks = async (req, res, next) => {
  try {
    // 1. Get search query
    const searchQuery = req.query.q;

    // 2. Validate search query
    if (!searchQuery || searchQuery.trim().length < 2) {
      return res.status(400).json({
        error: "Search query must be at least 2 characters long"
      });
    }

    // 3. Get limit (default to 20)
    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 20, 1),
      100
    );

    // 4. Create search patterns
    const searchPattern = `%${searchQuery.trim()}%`;
    const exactMatch = searchQuery.trim();
    const startsWith = `${searchQuery.trim()}%`;

    // 5. Search using parameterized raw SQL
    const searchResults = await prisma.$queryRaw`
      SELECT
        t.id,
        t.title,
        t.is_completed AS "isCompleted",
        t.priority,
        t.created_at AS "createdAt",
        t.user_id AS "userId",
        u.name AS "user_name"
      FROM tasks t
      JOIN users u ON t.user_id = u.id
      WHERE t.title ILIKE ${searchPattern}
         OR u.name ILIKE ${searchPattern}
      ORDER BY
        CASE
          WHEN t.title ILIKE ${exactMatch} THEN 1
          WHEN t.title ILIKE ${startsWith} THEN 2
          WHEN t.title ILIKE ${searchPattern} THEN 3
          ELSE 4
        END,
        t.created_at DESC
      LIMIT ${limit}
    `;

    // 6. Return results
    return res.status(200).json({
      results: searchResults,
      query: searchQuery,
      count: searchResults.length
    });

  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getUserAnalytics,
  getUsersWithStats,
  searchTasks,
};