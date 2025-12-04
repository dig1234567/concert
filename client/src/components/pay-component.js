import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import authServices from "../services/auth-services";

const PayComponent = ({ currentUser, setCurrentUser }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // 接著從SeatComponent 傳來的座位資料
  const selectedSeats = location.state?.selectedSeats || [];

  // 假設每張票 2000 元
  const pricePerSeat = 2000;
  const totalAmount = selectedSeats.length * pricePerSeat;
  const handleLogin = () => {
    window.alert("正在導向至登入頁面");
    navigate("/login");
  };

  const handleRegister = () => {
    window.alert("正在導向至註冊頁面");
    navigate("/register");
  };

  const handleLogout = () => {
    authServices.logout();
    localStorage.removeItem("user"); // 清空使用者資料
    setCurrentUser(null);
    window.alert("登出成功");
    navigate("/");
  };

  const handlePay = () => {
    // 接著會導向後端 API（下一步再做）
    navigate("/payment", {
      state: { selectedSeats, totalAmount },
    });
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

      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>付款頁面</h2>

        {selectedSeats.length === 0 ? (
          <p style={{ color: "red" }}>沒有收到座位資料！請重新選位。</p>
        ) : (
          <>
            <h3>您選擇的座位：</h3>
            <ul>
              {selectedSeats.map((code) => (
                <li key={code}>{code}</li>
              ))}
            </ul>

            <h3>總金額：NT$ {totalAmount}</h3>

            <button
              onClick={handlePay}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              前往付款
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PayComponent;
