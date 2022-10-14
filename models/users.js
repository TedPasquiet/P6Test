const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const express = require("express");


const userSchema = new mongoose.Schema({
  // Schéma utilisateur
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

module.exports = User;
