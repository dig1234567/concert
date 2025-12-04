import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import HomeComponent from "./components/home-component";
import RegisterComponent from "./components/register-component";
import LoginComponent from "./components/login-component";
import BuyComponent from "./components/buy-component";
import Layout from "./components/layout";
import NavComponent from "./components/nav-component";
import SeatComponent from "./components/seat-component";
import PayComponent from "./components/pay-component";
import PaymentPage from "./components/PaymentPage.component";

import AuthService from "./services/auth-services";

function App() {
  let [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout currentUser={currentUser} setCurrentUser={setCurrentUser} />
          }
        />

        <Route path="/register" element={<RegisterComponent />} />

        <Route
          path="/login"
          element={
            <LoginComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
        />

        <Route
          path="/buy"
          element={
            <BuyComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
        />

        <Route
          path="/seat"
          element={
            <SeatComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
        />

        <Route
          path="/pay"
          element={
            <PayComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
        />

        {/* 🔥 設定付款頁 */}
        <Route
          path="/payment"
          element={<PaymentPage currentUser={currentUser} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
