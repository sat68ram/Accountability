import React, { PropsWithChildren } from "react";
import { AuthMode } from "../pages/AuthPage";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import InfoPanel from "../components/layout/InfoPanel";
import AuthTabs from "../components/auth/AuthTabs";

interface AuthLayoutProps extends PropsWithChildren {
  mode: AuthMode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ mode, children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Page container */}
      <div className="w-full max-w-5xl min-h-screen flex flex-col gap-3 p-3">
        {/* Header */}
        <Header />

        {/* Main content (grid center) */}
        <main className="flex-1 grid place-items-center">
          {/* Auth grid: 2 columns from md up, 1 column on small screens */}
          <div className="w-full max-w-4xl grid gap-5 md:grid-cols-2">
            {/* Left info panel */}
            <InfoPanel />

            {/* Right form panel */}
            <section className="bg-white rounded-2xl shadow-sm px-6 py-6 flex flex-col gap-4">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-lg font-semibold">
                  {mode === "signin" ? "Sign in" : "Register"}
                </h2>
                <AuthTabs mode={mode} />
              </div>

              {children}
            </section>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AuthLayout;
