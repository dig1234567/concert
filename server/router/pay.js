const router = require("express").Router();
const CryptoJS = require("crypto-js");

// 🔥 綠界測試環境商店資訊（不會扣款）
const MerchantID = "2000132";
const HashKey = "5294y06JbISpM5x9";
const HashIV = "v77hoKGq4kWxNNIS";

// 🔥 綠界測試付款網址
const paymentURL = "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";

// 產生亂數字串
function genTradeNo() {
  return "TS" + Date.now();
}

// 加密函式（綠界規定格式）
function generateCheckMacValue(params) {
  let raw = `HashKey=${HashKey}`;
  Object.keys(params)
    .sort()
    .forEach((key) => {
      raw += `&${key}=${params[key]}`;
    });
  raw += `&HashIV=${HashIV}`;

  // URL encode + 小寫轉大寫
  const encoded = encodeURIComponent(raw)
    .toLowerCase()
    .replace(/%20/g, "+")
    .replace(/%21/g, "!")
    .replace(/%28/g, "(")
    .replace(/%29/g, ")")
    .replace(/%2a/g, "*");

  // SHA256 加密
  const hash = CryptoJS.SHA256(encoded).toString().toUpperCase();
  return hash;
}

// ============================================
// 🔥 API：產生綠界訂單
// ============================================
router.post("/checkout", (req, res) => {
  const { totalAmount, selectedSeats } = req.body;

  if (!totalAmount || !selectedSeats) {
    return res.status(400).json({ message: "資料缺失" });
  }

  const TradeNo = genTradeNo();
  const TradeDesc = "演唱會門票";
  const ItemName = selectedSeats.join("#");

  const params = {
    MerchantID,
    MerchantTradeNo: TradeNo,
    MerchantTradeDate: new Date().toLocaleString("zh-TW", {
      hour12: false,
    }),
    PaymentType: "aio",
    TotalAmount: totalAmount,
    TradeDesc,
    ItemName,

    // ⭐⭐ 兩個一定要同時存在（非常重要） ⭐⭐
    ReturnURL: "http://localhost:8080/api/pay/return", // 使用者付款後 browser redirect
    NotifyURL: "http://localhost:8080/api/pay/notify", // 付款結果由綠界「伺服器主動通知」

    ChoosePayment: "Credit",
    EncryptType: 1,
  };

  const CheckMacValue = generateCheckMacValue(params);

  res.json({
    paymentURL,
    params: { ...params, CheckMacValue },
  });
});

router.post("/notify", async (req, res) => {
  console.log("綠界 NotifyURL 回調成功");

  const { MerchantTradeNo, RtnCode, TradeAmt } = req.body;

  if (RtnCode == 1) {
    // ⭐ 1 = 付款成功
    console.log("付款成功：", MerchantTradeNo);

    // TODO:
    // 從資料庫找到該筆訂單 → 把座位設為「已售出」
    await SeatModel.updateMany(
      { orderTradeNo: MerchantTradeNo },
      { $set: { isBooked: true } }
    );

    return res.send("1|OK"); // 一定要回傳 1|OK 才算成功
  }

  res.send("0|FAIL");
});

router.post("/return", (req, res) => {
  console.log("🔵 前端 ReturnURL：", req.body);
  res.send("付款成功！座位已鎖定！");
});

module.exports = router;
