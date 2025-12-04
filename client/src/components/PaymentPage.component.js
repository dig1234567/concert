import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import payService from "../services/pay-services";
const PaymentPage = () => {
  const location = useLocation();

  // 從 SeatComponent 傳來的資料
  const { selectedSeats, totalAmount } = location.state || {};

  useEffect(() => {
    if (!selectedSeats || !totalAmount) {
      alert("付款資料不足，將返回首頁");
      window.location.href = "/";
      return;
    }

    // 呼叫後端 /api/pay/checkout 產生綠界訂單
    payService.checkout(totalAmount, selectedSeats).then((res) => {
      const { paymentURL, params } = res.data;

      // 建立表單
      const form = document.createElement("form");
      form.method = "POST";
      form.action = paymentURL;

      // 把參數塞進 form
      Object.keys(params).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);

      // 自動送出 POST → 綠界
      form.submit();
    });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>正在前往綠界付款頁面...</h2>
      <p>請稍候，不要關閉視窗。</p>
    </div>
  );
};

export default PaymentPage;
