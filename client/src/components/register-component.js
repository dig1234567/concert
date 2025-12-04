import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authServices from "../services/auth-services";

const RegisterComponent = () => {
  const navigate = useNavigate();
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleButton = () => {
    authServices
      .register(username, email, password)
      .then(() => {
        window.alert("註冊成功,您即將被導向到登入頁面");
        navigate("/login");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div style={styles.container}>
      <div>
        <div>
          <label htmlFor="username">用戶名稱</label>
          <input
            onChange={handleUsername}
            type="text"
            className="form-control"
            name="username"
            placeholder="英文名字或中文名字"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="email">電子信箱</label>
          <input
            onChange={handleEmail}
            type="text"
            className="form-control"
            name="email"
            placeholder="email or gmail"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">密碼</label>
          <input
            onChange={handlePassword}
            type="password"
            className="form-control"
            name="password"
            placeholder="長度至少超過6個英文或數字"
          />
        </div>
        <br />
        <br />
        <button
          onClick={handleButton}
          style={styles.button}
          className="btn btn-primary"
        >
          <span>註冊會員</span>
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "300px",
    margin: "100px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginBottom: "10px",
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#8a8000",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default RegisterComponent;
