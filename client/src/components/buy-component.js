import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import img1 from "../img/螢幕擷取畫面 2025-10-31 065512.png";
import authServices from "../services/auth-services";

const BuyComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const handlelogin = () => {
    window.alert("導向至登入頁面");
    navigate("/login");
  };

  const handleRegister = () => {
    window.alert("導向至註冊頁面");
    navigate("/register");
  };

  const handleLogout = () => {
    authServices.logout();
    localStorage.removeItem("user"); // 清空使用者資料
    setCurrentUser(null);
    window.alert("登出成功");
    navigate("/");
  };

  const handleSeat = () => {
    window.alert("正在導向置座位圖");
    navigate("/seat");
  };

  return (
    <div>
      <header className="header">
        <h1 className="title">台灣知名藝人演唱會訂票系統</h1>
        {!currentUser && (
          <>
            <button onClick={handlelogin} className="nav_btn">
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

      <main className="main-data">
        <h1 className="title-data">五月天演唱會｜時間地點</h1>
        <p className="text-data">演出日期</p>
        <p className="text-data">2025/12/27(六)</p>
        <p className="text-data">2025/12/28(日)</p>
        <p className="text-data">2025/12/31(三)</p>
        <p className="text-data">2025/01/01(四)</p>
        <p className="text-data">2025/01/03(六)</p>
        <p className="text-data">2025/01/04(日)</p>
        <p className="text-data">演出地點:台中洲際棒球場</p>
        <div className="img">
          <img src={img1} alt="" />
        </div>
        <h1 className="title-data">五月天演唱會｜售票時間</h1>
        <p className="text-data">
          【親子套票區優先購】
          <br /> 售票時間：2025/11/09（日）09:30 <br />
          售票平台：拓元售票系統 <br /> 【玉山卡友專區優先購】
          <br />
          售票時間：2025/11/09（日）10:00 <br /> 售票平台：拓元售票系統
        </p>
        <p className="text-data">
          【全面啟售】 <br /> 售票時間：2025/11/09（日）11:00 <br />{" "}
          售票平台：拓元售票系統
        </p>
        <h1 className="title-data">五月天演唱會｜票價、座位圖</h1>
        <p className="text-data">
          演出票價：NT$4580 / $3880 / $3280 / $2880 / $2280 / $1880 / $1280
        </p>
        <p className="text-data">
          跨年場票價：NT$5580 / $4580 / $3880 / $3280 / $2880 / $2280 / $1880
        </p>
        <p className="text-data">座位圖：待公布</p>
        {!currentUser && (
          <div
            style={{ fontSize: "2rem", marginLeft: "470px", marginTop: "10px" }}
          >
            在獲取你的個人資料前,你必須先登入
          </div>
        )}
        {currentUser && (
          <div className="my-data">
            <h1 className="title-data">以下是你的個人檔案</h1>
            <p className="text-data">姓名:{currentUser.user.username}</p>
            <p className="text-data">用戶ID:{currentUser.user._id}</p>
            <p className="text-data">電子信箱:{currentUser.user.email}</p>
            <button onClick={handleSeat} className="nav_btn1">
              查詢座位
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default BuyComponent;
