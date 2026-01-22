import React from "react";
import { Link } from "react-router-dom";
import { AuthMode } from "../../pages/AuthPage";

interface AuthTabsProps {
  mode: AuthMode;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ mode }) => {
  return (
    <div
      className="inline-flex rounded-full bg-gray-100 p-1 text-sm"
      role="tablist"
      aria-label="Auth mode"
    >
      <Link
        to="/login"
        className={`px-3 py-1 rounded-full transition-all ${
          mode === "signin"
            ? "bg-gray-900 text-gray-50 -translate-y-[1px]"
            : "text-gray-600"
        }`}
        role="tab"
        aria-selected={mode === "signin"}
      >
        Sign in
      </Link>
      <Link
        to="/register"
        className={`px-3 py-1 rounded-full transition-all ${
          mode === "register"
            ? "bg-gray-900 text-gray-50 -translate-y-[1px]"
            : "text-gray-600"
        }`}
        role="tab"
        aria-selected={mode === "register"}
      >
        Register
      </Link>
    </div>
  );
};

export default AuthTabs;
