import React, { useState } from "react";
import './../index.css';


const API_BASE_URL = "http://localhost:4000";

// --- Icons (Using simple inline SVG for example, replace with an icon library if available)
const EyeIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.066 7-9.543 7-4.478 0-8.268-2.943-9.543-7z" />
  </svg>
);

const EyeOffIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.517-3.085m3.717-1.472A9.95 9.95 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.517 3.085M12 13a1 1 0 100-2 1 1 0 000 2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M.458.458l23.084 23.084" />
  </svg>
);

export default function LoginForm() {
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState(null);

  const isEmailValid =
    email.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const minPasswordLength = 8;
  const isPasswordValid = password.length >= minPasswordLength;

  const canSubmit = isEmailValid && isPasswordValid && !loading;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    setEmailTouched(true);
    setPasswordTouched(true);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      setToken(data.token);
      setSuccess(
        mode === "login"
          ? "Login successful! Redirecting to your workspace..."
          : "Registration successful! You're ready to explore the console."
      );
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
    setSuccess("");
    // --- UX Improvement: Reset form state when switching modes
    setEmail("");
    setPassword("");
    setEmailTouched(false);
    setPasswordTouched(false);
    setToken(null);
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      {/* UX Improvement: Changed max-w-4xl to max-w-3xl for better fit on laptops */}
      <div className="w-full max-w-lg md:max-w-3xl bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
        {/* UX Improvement: Changed grid-cols-5 to grid-cols-3 for better form space */}
        <div className="grid md:grid-cols-3">
          {/* Left panel / brand area (1/3 width) */}
          

          {/* Right panel / form area (2/3 width) */}
          <div className="md:col-span-2 p-6 sm:p-8 lg:p-10">
            {/* Header + mode toggle */}
            <div className="flex items-start justify-between gap-4 mb-8">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-slate-900">
                  {mode === "login"
                    ? "Sign in to your workspace"
                    : "Create your workspace"}
                </h2>
                <p className="text-sm text-slate-500">
                  {mode === "login"
                    ? "Use your work email to access dashboards, pipelines, and governance tools."
                    : "Use your work email to provision a secure, isolated environment."}
                </p>
              </div>

              {/* Segmented control for Login / Register */}
              <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-medium shadow-sm">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={`px-4 py-1.5 rounded-full transition-all ${
                    mode === "login"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-white"
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className={`px-4 py-1.5 rounded-full transition-all ${
                    mode === "register"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-white"
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Error / success messages (Moved here for better visibility) */}
            {(error || success) && (
              <div className="space-y-2 mb-4">
                {error && (
                  <div className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                    {success}
                  </div>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium uppercase tracking-[0.12em] text-slate-500"
                  >
                    Work email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition
                      focus:ring-2 focus:ring-slate-900 focus:border-slate-900
                      ${
                        emailTouched && !isEmailValid
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-slate-200"
                      }`}
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    autoComplete="email"
                    aria-invalid={emailTouched && !isEmailValid ? "true" : "false"}
                    required
                  />
                  {emailTouched && !isEmailValid && (
                    <p className="text-[11px] text-red-600">
                      Enter a valid work email address.
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-xs font-medium uppercase tracking-[0.12em] text-slate-500"
                    >
                      Password
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        className="text-xs font-medium text-slate-500 hover:text-slate-800"
                        // This should ideally trigger a modal/link for password reset
                      >
                        Forgot?
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={`w-full rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 shadow-sm outline-none transition
                        focus:ring-2 focus:ring-slate-900 focus:border-slate-900
                        ${
                          passwordTouched && !isPasswordValid
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-slate-200"
                        }`}
                      placeholder={`Minimum ${minPasswordLength} characters`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setPasswordTouched(true)}
                      autoComplete={
                        mode === "login"
                          ? "current-password"
                          : "new-password"
                      }
                      aria-invalid={passwordTouched && !isPasswordValid ? "true" : "false"}
                      required
                      minLength={minPasswordLength}
                    />
                    {/* UX Improvement: Switched to an icon toggle */}
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-900"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    {passwordTouched && !isPasswordValid ? (
                      <p className="text-[11px] text-red-600">
                        Use at least **{minPasswordLength} characters** for better security.
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400">
                        Use a strong password. Avoid reusing credentials.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full inline-flex items-center justify-center rounded-xl bg-slate-900 text-sm font-medium text-white py-3 px-4 transition shadow-md
                  disabled:opacity-60 disabled:cursor-not-allowed
                  hover:bg-black hover:-translate-y-0.5 active:translate-y-0 transform`}
              >
                {loading && (
                  <span className="mr-2 inline-flex h-4 w-4 items-center justify-center">
                    <span className="inline-block h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  </span>
                )}
                {loading
                  ? mode === "login"
                    ? "Signing you in..."
                    : "Creating your account..."
                  : mode === "login"
                  ? "Sign in"
                  : "Create account"}
              </button>

              {/* Secondary text / helper */}
              <p className="mt-1 text-[11px] text-slate-500 text-center">
                {mode === "login" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("register")}
                      className="font-medium text-slate-800 hover:underline"
                    >
                      Register
                    </button>
                  </>
                ) : (
                  <>
                    Already registered?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      className="font-medium text-slate-800 hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>

              <p className="mt-3 text-[10px] text-slate-400 text-center">
                By continuing, you agree to the workspace terms and data
                processing policies configured by your organization.
              </p>
            </form>

            {/* Token display (demo) */}
            {token && (
              <div className="mt-6 space-y-1.5">
                <p className="text-[11px] text-slate-500">
                  Demo only: your JWT (in a real app this would live in memory
                  or an httpOnly cookie):
                </p>
                <div className="text-[10px] break-all bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono">
                  {token}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}