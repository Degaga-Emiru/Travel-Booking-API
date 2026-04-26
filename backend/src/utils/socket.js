const { Server } = require('socket.io');
const { Message, User } = require('../models');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a personal room
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their personal room`);
    });

    // Handle sending message
    socket.on('sendMessage', async (data) => {
      const { senderId, receiverId, content } = data;
      try {
        const message = await Message.create({
          senderId,
          receiverId,
          content
        });

        const fullMessage = await Message.findByPk(message.id, {
          include: [{ model: User, as: 'Sender', attributes: ['firstName', 'lastName'] }]
        });

        // Send to receiver
        io.to(receiverId).emit('receiveMessage', fullMessage);
        // Send back to sender (for confirmation/other devices)
        io.to(senderId).emit('messageSent', fullMessage);
      } catch (error) {
        console.error('Socket Message Error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initSocket, getIO };
