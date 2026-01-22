import React, { FormEvent, useState } from "react";
import './../../index.css';


const API_BASE_URL = "http://localhost:4000";

interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  terms?: string;
  global?: string;
}

const RegisterForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);


  const validate = (): boolean => {
    const nextErrors: RegisterErrors = {};

    

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (!confirm) {
      nextErrors.confirm = "Please confirm your password.";
    } else if (confirm !== password) {
      nextErrors.confirm = "Passwords do not match.";
    }

    if (!acceptTerms) {
      nextErrors.terms = "You must agree to the terms.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

   //const handleSubmit = (e: FormEvent) => {
    async function handleSubmit(e) {
       e.preventDefault();
       console.log("Register", { email, password });
       if (!validate()) return;
   
       //  submit
       setLoading(true);
       
       try {
                 const res =  await fetch(`${API_BASE_URL}/api/auth/register`, {
                   method: "POST",
                   headers: {
                     "Content-Type": "application/json",
                   },
                   body: JSON.stringify({ email, password }),
                 });
           
                 const data =  await res.json();
           
                 if (!res.ok) {
                   throw new Error(data.message || "Request failed");
                 } else {
                       setErrors({ global: "User registered successfully." } );
                 }
           
                setToken(data.token);
                 
           } catch (err) {
                 setErrors({ global: (err.message || "Something went wrong.")});
           } finally {
                 setLoading(false);
    	   }
       
       
       
  };
    
    


  return (
    <form className="flex flex-col gap-3 mt-1" onSubmit={handleSubmit}>
      {errors.global && (
        <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
          {errors.global}
        </div>
      )}

      

      <div className="flex flex-col gap-1">
        <label
          htmlFor="register-email"
          className="text-xs font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={`rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/70 focus:border-gray-900 ${
            errors.email ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <span className="text-[11px] text-red-500">{errors.email}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="register-password"
          className="text-xs font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          className={`rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/70 focus:border-gray-900 ${
            errors.password ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors.password && (
          <span className="text-[11px] text-red-500">{errors.password}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="register-confirm"
          className="text-xs font-medium text-gray-700"
        >
          Confirm password
        </label>
        <input
          id="register-confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat your password"
          className={`rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/70 focus:border-gray-900 ${
            errors.confirm ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors.confirm && (
          <span className="text-[11px] text-red-500">{errors.confirm}</span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
        <label className="inline-flex items-center gap-1">
          <input
            type="checkbox"
            className="rounded"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
          />
          <span>I agree to the terms and privacy policy</span>
        </label>
      </div>
      {errors.terms && (
        <span className="text-[11px] text-red-500">{errors.terms}</span>
      )}

      <button
        type="submit"
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 hover:opacity-90"
      >
        Create account
      </button>

      <p className="mt-1 text-[11px] text-gray-400">
        Already have an account? Click{" "}
        <span className="font-semibold text-gray-700">Sign in</span> above.
      </p>
    </form>
  );
};

export default RegisterForm;
