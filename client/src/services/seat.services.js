import axios from "axios";

const API_URL = "http://localhost:5000/api/seats";

// 取得全部座位清單
const getSeats = () => {
  return axios.get(API_URL);
};

// ⭐ 暫時鎖座（付款前）
const holdSeats = (userId, seats) => {
  return axios.post(API_URL + "/hold", {
    userId,
    seats,
  });
};

// ⭐ 最終確認（付款成功）
const confirmSeats = (seats) => {
  return axios.post(API_URL + "/confirm", {
    seats,
  });
};

export default {
  getSeats,
  holdSeats,
  confirmSeats,
};
