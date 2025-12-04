import React from "react";
import "../App.css";
import img1 from "../img/640.jpeg";
import img2 from "../img/cover_mayday-658x400.jpg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const HomeComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();

  const handleButton = () => {
    navigate("/buy");
  };

  return (
    <div>
      <main className="main">
        <div className="main-content1">
          <h1>五月天演唱會</h1>
          <img src={img2} alt="" />
          <h2 className="text-content">近期演出</h2>
          <p className="text-content2">
            2024 五月天 [回到那一天] 25 週年-北京演唱會｜演唱會 |
            國家體育場-鳥巢
          </p>
          <button onClick={handleButton} className="button">
            立即訂票
          </button>
        </div>
        <div className="main-content2">
          <h1>周杰倫演唱會</h1>
          <img src={img1} alt="" />
          <h2 className="text-content">近期演出</h2>
          <p className="text-content2">
            周杰倫《嘉年華》2025 香港演唱會2025 | 啟德體育園主場館
          </p>
          <p style={{ marginTop: "10px" }} className="text-content2">
            目前尚未開放購票
          </p>
          <button onClick={handleButton} className="button">
            立即訂票
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomeComponent;
