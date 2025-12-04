import axios from "axios";

const API_URL = "http://localhost:5000/api/user";

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
