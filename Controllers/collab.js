const express = require("express");
const Collab = require("../models/Collab");

exports.CreateCollab = async (req, res) => {
  const { collabTitle, RoleNeed, skills,  startDate, endDate } =
    req.body;

  try {
    const newCollab = new Collab({
      collabTitle,
      RoleNeed,
      skills,
      startDate,
      endDate,
      postedBy: req.user._id,
    });

    const savedCollab = await newCollab.save();
    res.status(201).json(savedCollab);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.GetCollabs = async (req, res) => {
  try {
    const collabs = await Collab.find().populate("postedBy", "name role");
    res.json(collabs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
