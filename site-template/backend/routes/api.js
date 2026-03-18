const express = require("express");
const router = express.Router();
const Message = require("../models/message");

router.post("/message", async (req, res) => {
  const msg = await Message.create({ text: req.body.text });
  res.json({ success: true, message: "Saved to DB", data: msg });
});

module.exports = router;