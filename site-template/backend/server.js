require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./db");

const app = express();
connectDB();

app.use(express.json());

// serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// api routes
app.use("/api", require("./routes/api"));

// fallback to index.html
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});