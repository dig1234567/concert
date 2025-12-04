const router = require("express").Router();
// 模擬座位清單（改成 let 才能更新）

let seats = [
  { seatCode: "A-1-1", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "A-1-3", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "A-1-4", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "A-1-5", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "A-1-6", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "A-1-7", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "A-1-8", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "A-1-9", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "A-1-10", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "B-1-1", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "B-1-2", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "B-1-3", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "B-1-4", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "B-1-5", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "B-1-6", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "B-1-7", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "B-1-8", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "B-1-9", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "B-1-10", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "C-1-1", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "C-1-2", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "C-1-3", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "C-1-4", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "C-1-5", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "C-1-6", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "C-1-7", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "C-1-8", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "C-1-9", isBooked: false, holdBy: null, holdExpireAt: null },
  { seatCode: "C-1-10", isBooked: false, holdBy: null, holdExpireAt: null },
];

// 🔄 自動清除過期 Hold（每 5 秒）
// =======================================================
setInterval(() => {
  const now = Date.now();
  seats = seats.map((seat) => {
    if (
      seat.holdExpireAt &&
      seat.holdExpireAt < now &&
      seat.isBooked === false
    ) {
      console.log("➡ 自動解除暫時鎖座：", seat.seatCode);
      return { ...seat, holdBy: null, holdExpireAt: null };
    }
    return seat;
  });
}, 5000);

// =======================================================
// 取得座位清單
// =======================================================
router.get("/", (req, res) => {
  res.json(seats);
});

// =======================================================
// ⭐ 使用者進入付款 → 暫時鎖座 (Hold Seat 60 秒)
// =======================================================
router.post("/hold", (req, res) => {
  const { userId, seats: selectedSeats } = req.body;

  const now = Date.now();
  const expire = now + 60000; // 60 秒

  // 檢查座位是否被人 hold 或已售出
  const conflict = selectedSeats.filter((seatCode) => {
    const seat = seats.find((s) => s.seatCode === seatCode);
    return seat.isBooked === true || (seat.holdBy && seat.holdBy !== userId);
  });

  if (conflict.length > 0) {
    return res.status(400).json({
      message: "座位已被暫時鎖定或售出",
      seats: conflict,
    });
  }

  // 實際鎖座
  seats = seats.map((seat) => {
    if (selectedSeats.includes(seat.seatCode)) {
      return {
        ...seat,
        holdBy: userId,
        holdExpireAt: expire,
      };
    }
    return seat;
  });

  res.json({
    message: "已成功暫時鎖座 60 秒",
    holdExpireAt: expire,
  });
});

// =======================================================
// ⭐ 綠界付款成功後 → 最終訂位成功
// =======================================================
router.post("/confirm", (req, res) => {
  const { seats: selectedSeats } = req.body;

  seats = seats.map((seat) => {
    if (selectedSeats.includes(seat.seatCode)) {
      return {
        ...seat,
        isBooked: true,
        holdBy: null,
        holdExpireAt: null,
      };
    }
    return seat;
  });

  res.json({
    message: "付款成功，座位已確定售出",
  });
});

module.exports = router;
