const { Message, User } = require('../models');
const { Op } = require('sequelize');
const { createNotification } = require('./notificationController');

// @desc    Get messages between two users
// @route   GET /api/chat/:receiverId
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user.id;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      },
      order: [['createdAt', 'ASC']],
      include: [
        { model: User, as: 'Sender', attributes: ['firstName', 'lastName', 'profileImage'] }
      ]
    });

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active conversations for current user
// @route   GET /api/chat/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // This is a simplified query to get unique users the current user has chatted with
    const sentMessages = await Message.findAll({
      where: { senderId: userId },
      attributes: ['receiverId'],
      group: ['receiverId']
    });

    const receivedMessages = await Message.findAll({
      where: { receiverId: userId },
      attributes: ['senderId'],
      group: ['senderId']
    });

    const contactIds = [...new Set([
      ...sentMessages.map(m => m.receiverId),
      ...receivedMessages.map(m => m.senderId)
    ])];

    const contacts = await User.findAll({
      where: { id: { [Op.in]: contactIds } },
      attributes: ['id', 'firstName', 'lastName', 'profileImage', 'role']
    });

    // Always include admins in the contact list so users can message support
    const admins = await User.findAll({
      where: { role: 'admin' },
      attributes: ['id', 'firstName', 'lastName', 'profileImage', 'role']
    });

    const existingIds = new Set(contacts.map(c => c.id));
    admins.forEach(admin => {
      // Don't add if the user IS the admin, or if they're already in the list
      if (admin.id !== userId && !existingIds.has(admin.id)) {
        // Change admin display name slightly to indicate they are support
        admin.lastName = '(Support)';
        contacts.push(admin);
      }
    });

    res.status(200).json({
      success: true,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content, messageType } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide receiverId and content'
      });
    }

    const receiver = await User.findByPk(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    const message = await Message.create({
      senderId,
      receiverId,
      content,
      messageType: messageType || 'text',
      isRead: false
    });

    // Automatically trigger a notification to the receiver
    await createNotification(
      receiverId,
      'system',
      'New Message',
      `You have received a new message from ${req.user.firstName}.`,
      message.id
    );

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};
