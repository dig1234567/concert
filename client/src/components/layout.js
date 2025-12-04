import { Outlet } from "react-router-dom";
import React from "react";
import Nav from "./nav-component";
import HomeComponent from "./home-component";
const Layout = ({ currentUser, setCurrentUser }) => {
  return (
    <>
      <Nav currentUser={currentUser} setCurrentuser={setCurrentUser} />
      <HomeComponent
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />
      <Outlet />
    </>
  );
};

export default Layout;
