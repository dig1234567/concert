const router = require("express").Router();
const CryptoJS = require("crypto-js");

// ----------- 綠界測試環境 -----------
const MerchantID = "2000132";
const HashKey = "5294y06JbISpM5x9";
const HashIV = "v77hoKGq4kWxNNIS";
const paymentURL = "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";

// ⚡ 外網可訪問的測試 URL (ngrok 或正式網址)
const SERVER_PUBLIC_URL =
  process.env.SERVER_PUBLIC_URL || "https://abcd1234.ngrok.io";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// 產生隨機訂單編號
function genTradeNo() {
  return "TS" + Date.now();
}

// 綠界規定的時間格式 yyyy/MM/dd HH:mm:ss
function formatDate() {
  const dt = new Date();
  const yyyy = dt.getFullYear();
  const MM = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const hh = String(dt.getHours()).padStart(2, "0");
  const mm = String(dt.getMinutes()).padStart(2, "0");
  const ss = String(dt.getSeconds()).padStart(2, "0");
  return `${yyyy}/${MM}/${dd} ${hh}:${mm}:${ss}`;
}

// 產生 CheckMacValue
function generateCheckMacValue(params) {
  let raw = `HashKey=${HashKey}`;
  Object.keys(params)
    .sort()
    .forEach((key) => {
      raw += `&${key}=${params[key]}`;
    });
  raw += `&HashIV=${HashIV}`;

  const encoded = encodeURIComponent(raw)
    .toLowerCase()
    .replace(/%20/g, "+")
    .replace(/%21/g, "!")
    .replace(/%28/g, "(")
    .replace(/%29/g, ")")
    .replace(/%2a/g, "*");

  return CryptoJS.SHA256(encoded).toString().toUpperCase();
}

// ---------------------------
// 🔥 產生綠界訂單
// ---------------------------
router.post("/checkout", (req, res) => {
  const { totalAmount, selectedSeats } = req.body;

  if (!totalAmount || !selectedSeats || selectedSeats.length === 0) {
    return res.status(400).json({ message: "資料缺失或座位未選擇" });
  }

  const TradeNo = genTradeNo();

  const params = {
    MerchantID,
    MerchantTradeNo: TradeNo,
    MerchantTradeDate: formatDate(),
    PaymentType: "aio",
    TotalAmount: totalAmount,
    TradeDesc: "演唱會門票",
    ItemName: selectedSeats.join("#"),

    // ⭐ 使用外網可訪問的 PaymentInfoURL/ ReturnURL
    ReturnURL: `${SERVER_PUBLIC_URL}/api/pay/return`,
    PaymentInfoURL: `${SERVER_PUBLIC_URL}/api/pay/notify`,


    ChoosePayment: "Credit",
    EncryptType: 1,
  };

  const CheckMacValue = generateCheckMacValue(params);
  console.log("NotifyURL =", `${SERVER_PUBLIC_URL}/api/pay/notify`);

  res.json({
    paymentURL,
    params: { ...params, CheckMacValue },
  });
});

// ---------------------------
// 🔥 綠界伺服器背景通知（NotifyURL）
// ---------------------------
router.post("/notify", (req, res) => {
  console.log("📌 綁定付款成功 Notify：", req.body);

  // TODO: 更新資料庫訂單狀態
  // updateOrderStatus(req.body.MerchantTradeNo, "paid");

  // ⭐ 綠界要求固定回傳 1|OK
  res.send("1|OK");
});

// ---------------------------
// 🔥 前端導回頁面（ReturnURL）
// ---------------------------
router.post("/return", (req, res) => {
  console.log("📌 ReturnURL 回傳：", req.body);

  // 導回前端成功頁
  res.redirect(`${CLIENT_URL}/success`);
});

module.exports = router;
