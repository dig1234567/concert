const router = require("express").Router();
const user = require("../models/user-model");
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("路由正在middleWare");
  next();
});

// 註冊Router
router.post("/register", async (req, res) => {
  // 確認數據是否符合規範
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const checkEmail = await user.findOne({ email: req.body.email });
  if (checkEmail) {
    res.send("此用戶已存在,請重新註冊");
  }
  let { username, email, password } = req.body;
  let newUser = new user({ username, email, password });
  console.log("新戶用資訊:", newUser);

  // 儲存到mongoDB
  try {
    let saveUser = await newUser.save();
    return res.send({
      message: "用戶已儲存到資料庫",
      saveUser,
    });
  } catch (e) {
    return res.status(500).send("無法儲存使用者");
  }
});

// 登入Router
router.post("/login", async (req, res) => {
  // 確認數據是否符合規範
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // 確認有無使用者
  const checkUser = await user.findOne({ email: req.body.email });
  if (!checkUser) {
    return res.status(401).send("使用者不存在,請註冊新帳戶");
  }

  //比較密碼
  checkUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) return res.status(500).send(err);
    // 製作Json web token
    if (isMatch) {
      const tokenObject = {
        _id: checkUser._id,
        email: checkUser.email,
      };
      const token = jwt.sign(tokenObject, process.env.JWT_SECRET);
      return res.send({
        msg: "成功登入",
        token: token,
        user: checkUser,
      });
    } else {
      return res.status(401).send("密碼錯誤");
    }
  });
});

module.exports = router;
