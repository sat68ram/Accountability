import React from 'react';
import './index.css';

import LoginForm from './components/LoginForm.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <LoginForm />
    </div>
  );
}
