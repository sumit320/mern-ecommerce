import {
  UserStar,
  LayoutDashboard,
  Package,
  ShoppingBasket,
} from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  { id: "orders", label: "Orders", path: "/admin/orders", icon: <Package /> },
];

const MenuItems = ({ setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-6 flex flex-col gap-1">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = location.pathname === menuItem.path;

        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              setOpen && setOpen(false); // close mobile sheet
            }}
            className={`flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer 
                        transition-colors duration-200
                        ${
                          isActive
                            ? "bg-black text-white hover:bg-gray-900"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
          >
            {menuItem.icon}
            <span className="text-md font-medium">{menuItem.label}</span>
          </div>
        );
      })}
    </nav>
  );
};

const AdminSidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-grey bg-opacity-30 transition-opacity duration-300
                      ${
                        open ? "opacity-100" : "opacity-0 pointer-events-none"
                      }`}
          onClick={() => setOpen(false)}
        />

        {/* Sheet Content */}
        <SheetContent
          side="left"
          className="w-64 p-6 lg:hidden
                     transition-transform duration-300 ease-in-out
                     data-[state=closed]:-translate-x-full
                     data-[state=open]:translate-x-0"
          aria-describedby="sheet-description"
        >
          <SheetHeader className="border-b cursor-pointer">
            <SheetTitle className="flex items-center gap-2">
              <UserStar size={32} className="text-black dark:text-white" />
              <span className="text-xl font-extrabold">Admin Panel</span>
            </SheetTitle>
          </SheetHeader>

          <MenuItems setOpen={setOpen} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col border-r bg-white dark:bg-gray-950 p-6 w-64">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-3 cursor-pointer mb-6 group"
        >
          <UserStar
            size={32}
            className="text-black dark:text-white"
          />
          <h1 className="text-2xl font-extrabold group-hover:text-black dark:group-hover:text-white">
            Admin Panel
          </h1>
        </div>

        <MenuItems />
      </aside>
    </>
  );
};

export default AdminSidebar;
