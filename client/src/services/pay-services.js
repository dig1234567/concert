import axios from "axios";

// ⭐ 改成 Render 後端的 pay API 路徑
const API = "https://concert-ipok.onrender.com/api/pay";

class PayService {
  checkout(totalAmount, selectedSeats) {
    return axios.post(`${API}/checkout`, {
      totalAmount,
      selectedSeats,
    });
  }
}

export default new PayService();
