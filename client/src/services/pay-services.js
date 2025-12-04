import axios from "axios";

const API = "http://localhost:5000/api/pay";

class PayService {
  checkout(totalAmount, selectedSeats) {
    return axios.post(`${API}/checkout`, {
      totalAmount,
      selectedSeats,
    });
  }
}

export default new PayService();
