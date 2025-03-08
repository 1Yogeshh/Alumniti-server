const express = require('express');
const Message = require('../models/Message'); // Adjust the path accordingly

// Send a message
exports.sendmessage= async (req, res) => {
    const { content } = req.body;
    const senderId = req.user.id; // Assuming you are getting the sender's ID from the logged-in user
    const recipientId = req.params.recipientId;

    try {
        const newMessage = new Message({
            content,
            senderId, // Include senderId here
            recipientId // Get recipientId from the URL
        });

        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

// Fetch messages between two users
exports.receivemessage= async (req, res) => {
    const userId = req.params.userId;

    try {
      const messages = await Message.find({
        $or: [
          { senderId: userId },
          { recipientId: userId }
        ]
      })
      .populate('senderId', 'name') // Assuming you have a name field in your User model
      .populate('recipientId', 'name');
  
      res.json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};