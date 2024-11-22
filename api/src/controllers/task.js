const express = require("express");
const passport = require("passport");
const router = express.Router();

const TaskObject = require("../models/task");

const SERVER_ERROR = "SERVER_ERROR";

// GET all tasks
router.get("/", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const tasks = await TaskObject.find({ organisation: req.user.organisation }).sort("-last_updated_at");
    res.status(200).send({ ok: true, data: tasks });
  } catch (error) {
    console.log(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR });
  }
});

// POST create a task
router.post("/", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const task = await TaskObject.create({ ...req.body, organisation: req.user.organisation });
    res.status(200).send({ ok: true, data: task });
  } catch (error) {
    console.log(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR });
  }
});

// PUT update a task
router.put("/:id", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const task = await TaskObject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send({ ok: true, data: task });
  } catch (error) {
    console.log(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR });
  }
});

// DELETE a task
router.delete("/:id", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    await TaskObject.findByIdAndDelete(req.params.id);
    res.status(200).send({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR });
  }
});

module.exports = router;
