import axios from "axios";

// ⭐ 改成 Render 後端的 API 路徑
const API_URL = "https://concert-ipok.onrender.com/api/user";

class AuthService {
  register(username, email, password) {
    return axios.post(API_URL + "/register", {
      email,
      password,
      username,
    });
  }

  login(email, password) {
    return axios.post(API_URL + "/login", {
      email,
      password,
    });
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();

