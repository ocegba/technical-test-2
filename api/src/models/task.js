const mongoose = require("mongoose");

const MODELNAME = "task";

const Schema = new mongoose.Schema(
  {
    name: { type: String, trim: true, unique: true },
    description: { type: String },
    status: { type: String, enum: ["todo", "inprogress", "done"], default: "todo" },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    organisation: { type: String, trim: true, required: true },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;