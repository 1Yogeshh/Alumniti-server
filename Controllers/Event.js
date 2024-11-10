const express = require('express');
const Event = require('../models/Event');

exports.CreateEvent= async (req, res) => {
  const { title, dateTime, topic, organizedBy, format, joinLink, description } = req.body;

  try {
    const newEvent = new Event({
      title,
      dateTime,
      topic,
      organizedBy,
      format,
      joinLink,
      description,
      postedBy: req.user._id
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


exports.GetEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('postedBy', 'name role');
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

