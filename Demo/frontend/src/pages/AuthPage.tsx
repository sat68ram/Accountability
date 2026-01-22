import React from "react";
import AuthLayout from "../layouts/AuthLayout";
import SignInForm from "../components/auth/SignInForm";
import RegisterForm from "../components/auth/RegisterForm";

export type AuthMode = "signin" | "register";

interface AuthPageProps {
  mode: AuthMode;
}

const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  return (
    <AuthLayout mode={mode}>
      {mode === "signin" ? <SignInForm /> : <RegisterForm />}
    </AuthLayout>
  );
};

export default AuthPage;
