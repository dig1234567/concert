import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authServices from "../services/auth-services";

const LoginComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authServices.login(email, password);
      const user = {
        user: response.data.user,
        token: response.data.token,
      };
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user); // ✅ 即時更新畫面
      window.alert("登入成功，您即將被導向到購買頁面");
      navigate("/buy");
    } catch (error) {
      console.error(error);
      setMessage("登入失敗，請確認帳號或密碼");
    }
  };

  return (
    <div style={styles.container}>
      {message && <div className="alert alert-danger">{message}</div>}
      <h2>登入帳密</h2>
      <form style={styles.form}>
        <input
          type="email"
          placeholder="電子郵件"
          onChange={handleEmail}
          value={email}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="密碼"
          onChange={handlePassword}
          value={password}
          style={styles.input}
          required
        />
        <button onClick={handleLogin} type="submit" style={styles.button}>
          登入
        </button>
      </form>
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
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default LoginComponent;
