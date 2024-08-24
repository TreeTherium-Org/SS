import React from "react";
import Sidebar from "../../components/Sidebar";

const Layout = ({ children }) => {
  return (
    <div>
      <Sidebar />
      {children}
    </div>
  );
};

export default Layout;