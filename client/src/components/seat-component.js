import React, { useEffect, useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import authServices from "../services/auth-services";
import seatServices from "../services/seat.services";

const SeatComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const ticketPrice = 2000; // 單張票價，可自由修改

  // 取得所有座位
  useEffect(() => {
    seatServices.getSeats().then((res) => {
      setSeats(res.data);
    });
  }, []);

  // 點選座位
  const toggleSeat = (seatCode) => {
    if (selectedSeats.includes(seatCode)) {
      // 再按一次取消
      setSelectedSeats(selectedSeats.filter((s) => s !== seatCode));
    } else {
      // 加入多張選取
      setSelectedSeats([...selectedSeats, seatCode]);
    }
  };
  // 送出訂位
  const handleSubmit = async () => {
    if (!currentUser) {
      alert("請先登入");
      navigate("/login");
      return;
    }

    if (selectedSeats.length === 0) {
      alert("請先選擇座位!");
      return;
    }

    try {
      const res = await seatServices.holdSeats(
        currentUser.user.id,
        selectedSeats
      );

      const bookedSeats = res.data.reserved || selectedSeats;

      // 建立 orderId（如果後端沒有）
      const orderId = res.data.orderId || "ORDER_" + Date.now();

      const amount = bookedSeats.length * ticketPrice;

      // ⭐ 導向付款頁並傳資料過去
      navigate("/pay", {
        state: {
          selectedSeats,
          totalAmount: selectedSeats.length * 2000, // 或你後端回傳的總金額
        },
      });
    } catch (err) {
      console.error(err);
      alert("訂票失敗!");
    }
  };

  const handleLogin = () => {
    alert("導向至登入頁面");
    navigate("/login");
  };

  const handleRegister = () => {
    alert("導向至註冊頁面");
    navigate("/register");
  };

  const handleLogout = () => {
    authServices.logout();
    localStorage.removeItem("user");
    setCurrentUser(null);
    alert("登出成功");
    navigate("/");
  };

  return (
    <div>
      <header className="header">
        <h1 className="title">台灣知名藝人演唱會訂票系統</h1>

        {!currentUser && (
          <>
            <button onClick={handleLogin} className="nav_btn">
              登入
            </button>
            <button onClick={handleRegister} className="nav_btn">
              註冊
            </button>
          </>
        )}

        {currentUser && (
          <button onClick={handleLogout} className="nav_btn">
            登出
          </button>
        )}
      </header>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <h2>選擇座位</h2>

        {/* 座位區 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
            maxWidth: "300px",
            margin: "auto",
            marginTop: "10px",
          }}
        >
          {seats.map((seat) => (
            <button
              key={seat.seatCode}
              onClick={() => toggleSeat(seat.seatCode)}
              disabled={seat.isBooked}
              style={{
                padding: "10px",
                borderRadius: "5px",
                cursor: seat.isBooked ? "not-allowed" : "pointer",
                backgroundColor: seat.isBooked
                  ? "gray"
                  : selectedSeats.includes(seat.seatCode)
                  ? "green"
                  : "lightgray",
                color: "white",
                border: "none",
              }}
            >
              {seat.seatCode}
            </button>
          ))}
        </div>

        {/* 顯示座位資訊 */}
        <p style={{ marginTop: "10px" }}>
          已選：{selectedSeats.join(", ") || "尚未選擇"}
        </p>
        <p>金額：{selectedSeats.length * ticketPrice} 元</p>

        {/* 送出訂票 */}
        <button
          onClick={handleSubmit}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          送出訂票
        </button>
      </div>
    </div>
  );
};

export default SeatComponent;
