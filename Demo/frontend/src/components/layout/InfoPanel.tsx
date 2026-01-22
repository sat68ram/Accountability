import React from "react";

const InfoPanel: React.FC = () => {
  return (
    <section className="bg-gray-900 text-gray-200 rounded-2xl px-6 py-7 flex flex-col justify-center gap-3">
      <h2 className="text-2xl font-semibold">Welcome back</h2>
      <p className="text-sm text-gray-400 max-w-[90%]">
        Use your account to access your dashboard, track metrics, and manage
        your workspace. New here? Switch to{" "}
        <span className="font-semibold text-gray-200">Register</span> and
        create an account in a few seconds.
      </p>

      <div className="mt-2 grid gap-2 grid-cols-1 sm:grid-cols-3">
        <div className="text-xs text-center rounded-full border border-gray-700 bg-gray-900/70 px-3 py-1">
          Secure login
        </div>
        <div className="text-xs text-center rounded-full border border-gray-700 bg-gray-900/70 px-3 py-1">
          Fast onboarding
        </div>
        <div className="text-xs text-center rounded-full border border-gray-700 bg-gray-900/70 px-3 py-1">
          Single dashboard view
        </div>
      </div>
    </section>
  );
};

export default InfoPanel;
