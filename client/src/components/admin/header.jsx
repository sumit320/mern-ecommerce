import { logoutUser } from "@/store/auth-slice";
import { LogOut, Menu } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";

const AdminHeader = ({ setOpen }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(true)}
        className="
          lg:hidden inline-flex items-center justify-center 
          p-2 rounded-md
          bg-black text-white
          cursor-pointer
        "
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Right Side: Logout */}
      <div className="flex flex-1 justify-end">
        <button
          onClick={handleLogout}
          className="
            inline-flex items-center gap-2 px-4 py-2 rounded-md
            bg-black text-white text-sm font-medium
            cursor-pointer
          "
        >
          <LogOut className="h-5 w-5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
