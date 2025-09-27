import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Image Panel */}
      <div className="relative hidden lg:flex w-1/2 items-center justify-center overflow-hidden">
        <img
          src="https://plus.unsplash.com/premium_photo-1684785618727-378a3a5e91c5?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0"
          alt="Ecommerce Shopping"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-md space-y-6 text-center text-white px-6">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome to Ecommerce Shopping
          </h1>
          <p className="text-lg text-gray-200">
            Discover amazing deals and shop your favorite products effortlessly.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
