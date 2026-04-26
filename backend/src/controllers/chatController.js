const { Message, User } = require('../models');
const { Op } = require('sequelize');

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

    res.status(200).json({
      success: true,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};
