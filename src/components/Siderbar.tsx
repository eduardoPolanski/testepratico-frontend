import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white  w-1/5 sm:w-[200px] p-2 sm:p-4">
      <h2 className="text-lg sm:text-3xl font-bold mb-10">Menu</h2>
      <ul>
        <li className="mb-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              [
                "text-base sm:text-xl ",
                isActive ? "text-blue-500" : "block hover:text-gray-300",
              ].join(" ")
            }
          >
            Home
          </NavLink>
        </li>
        <li className="mb-2">
          <NavLink
            to="/clientes"
            className={({ isActive }) =>
              [
                "text-base sm:text-xl ",
                isActive ? "text-blue-500" : "block hover:text-gray-300",
              ].join(" ")
            }
          >
            Clientes
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/roteadores"
            className={({ isActive }) =>
              [
                "text-base sm:text-xl ",
                isActive ? "text-blue-500" : "block hover:text-gray-300",
              ].join(" ")
            }
          >
            Roteadores
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
