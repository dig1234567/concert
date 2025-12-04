require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const auth = require("./router/auth");
const seat = require("./router/seat");
const pay = require("./router/pay");
const app = express();

app.use(cors()); // 允許所有來源
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("伺服器連接成功");
  })
  .catch((err) => {
    console.log(err);
  });

// API router
app.use("/api/user", auth);
app.use("/api/seats", seat);
app.use("/api/pay", pay);

app.get("/", (req, res) => {
  res.send("演唱會訂票API啟動");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))