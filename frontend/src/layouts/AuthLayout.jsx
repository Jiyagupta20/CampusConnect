import React from 'react';
import { Outlet } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="auth-page">
      <Outlet />
    </div>
  );
};

export default AuthLayout;

