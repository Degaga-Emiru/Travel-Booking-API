const { Notification } = require('../models');
const { Op } = require('sequelize');

exports.getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, isRead } = req.query;
    const offset = (page - 1) * limit;

    let where = { userId: req.user.id };
    if (isRead !== undefined) where.isRead = isRead === 'true';

    const notifications = await Notification.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: notifications.count,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(notifications.count / limit)
      },
      data: notifications.rows
    });
  } catch (error) {
    next(error);
  }
};

exports.getUnreadCount = async (req, res, next) => {
  try {
    const unreadCount = await Notification.count({
      where: {
        userId: req.user.id,
        isRead: false
      }
    });

    res.status(200).json({
      success: true,
      data: {
        unreadCount
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.update({ isRead: true });

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.update(
      { isRead: true },
      {
        where: {
          userId: req.user.id,
          isRead: false
        }
      }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.destroy();

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to create notification (used by other controllers)
exports.createNotification = async (userId, type, title, message, relatedId = null) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      relatedId,
      isRead: false
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Helper function to create admin notification
exports.createAdminNotification = async (type, title, message, relatedId = null) => {
  try {
    // This would typically get all admin users
    // For now, we'll just log it
    console.log('Admin Notification:', { type, title, message, relatedId });
    
    // In a real implementation, you would:
    // 1. Get all admin users
    // 2. Create notifications for each admin
    // 3. Possibly send email/SMS notifications
    
    return true;
  } catch (error) {
    console.error('Error creating admin notification:', error);
  }
};