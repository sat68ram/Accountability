import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 text-gray-50 px-5 py-4 rounded-xl flex items-center justify-between">
      <h1 className="text-lg font-semibold">Enterprise Accountability</h1>
      <div className="text-sm opacity-85">
        Welcome · Please Sign In or Register
      </div>
    </header>
  );
};

export default Header;
