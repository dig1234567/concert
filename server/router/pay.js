const router = require("express").Router();
const CryptoJS = require("crypto-js");

// 🔥 綠界測試環境商店資訊（不會扣款）
const MerchantID = "2000132";
const HashKey = "5294y06JbISpM5x9";
const HashIV = "v77hoKGq4kWxNNIS";

// 🔥 綠界測試付款網址（表單要 POST 到這）
const paymentURL = "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";

// ======================================================
// 產生亂數訂單編號
// ======================================================
function genTradeNo() {
  return "TS" + Date.now();
}

// ======================================================
// ⭐ 綠界規定的時間格式 yyyy/MM/dd HH:mm:ss
// ======================================================
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

// ======================================================
// SHA256 CheckMacValue（綠界規定寫法）
// ======================================================
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

  const hash = CryptoJS.SHA256(encoded).toString().toUpperCase();
  return hash;
}

// ======================================================
// 🔥 API：產生綠界訂單（前端會拿到 infos 並 POST form）
// ======================================================
router.post("/checkout", (req, res) => {
  const { totalAmount, selectedSeats } = req.body;

  if (!totalAmount || !selectedSeats) {
    return res.status(400).json({ message: "資料缺失" });
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

    // ======================================================
    // ⭐ Render 上請換成你的 domain，比如：
    // https://concert-ipok.onrender.com/api/pay/notify
    // ======================================================
    ReturnURL: `${process.env.SERVER_URL}/api/pay/return`,
    NotifyURL: `${process.env.SERVER_URL}/api/pay/notify`,

    ChoosePayment: "Credit",
    EncryptType: 1,
  };

  // 加上 CheckMacValue
  const CheckMacValue = generateCheckMacValue(params);

  // 回傳給前端（前端會自動 POST form）
  res.json({
    paymentURL,
    params: { ...params, CheckMacValue },
  });
});

// ======================================================
//

