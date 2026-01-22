import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:4000";

interface SignInErrors {
  email?: string;
  password?: string;
  global?: string;
}

const SignInForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [errors, setErrors] = useState<SignInErrors>({});
   const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const validate = (): boolean => {
    const nextErrors: SignInErrors = {};
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

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };
  
 const navigate = useNavigate(); 

 async function handleSubmit(e) {
        e.preventDefault();
        console.log("Register", { email, password });
        if (!validate()) return;
    
        //  submit
        setLoading(true);
        
        try {
                  const res =  await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                  });
            
                  const data =  await res.json();
		 
		 // later inside your code:
		 if (!res.ok) {
		     throw new Error(data.message || "Request failed");
		 } else {
		     
		 
		     setErrors({ global: "User signed in successfully." });
		 
		    
		     navigate("/shell");
		     
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
        <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
          {errors.global}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label
          htmlFor="signin-email"
          className="text-xs font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="signin-email"
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
          htmlFor="signin-password"
          className="text-xs font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="signin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={`rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/70 focus:border-gray-900 ${
            errors.password ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors.password && (
          <span className="text-[11px] text-red-500">{errors.password}</span>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
        <label className="inline-flex items-center gap-1">
          <input
            type="checkbox"
            className="rounded"
            checked={keepSignedIn}
            onChange={(e) => setKeepSignedIn(e.target.checked)}
          />
          <span>Keep me signed in</span>
        </label>
        <button
          type="button"
          className="text-gray-900 font-medium hover:underline"
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 hover:opacity-90"
      >
        Continue
      </button>

      <p className="mt-1 text-[11px] text-gray-400">
        Don’t have an account? Click{" "}
        <span className="font-semibold text-gray-700">Register</span> above.
      </p>
    </form>
  );
};

export default SignInForm;
