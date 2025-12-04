const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

// 創建用戶規範
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10,
  },
  email: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.methods.comparePassword = async function (password, cb) {
  let result = await bcrypt.compare(password, this.password);
  return cb(null, result);
};

// mongoose middleware
// 若使用者為新用戶或正在更改密碼 , 則進行雜湊處理
userSchema.pre("save", async function (next) {
  // this代表mongodb內部的document
  if (this.isNew || this.isModified("password")) {
    const hashValue = await bcrypt.hash(this.password, 10);
    this.password = hashValue;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
