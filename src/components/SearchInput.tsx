import React from "react";

const SearchInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  ...props
}) => {
  return (
    <div className="relative">
      <input
        type="text"
        className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:border-blue-500"
        placeholder="Pesquisar..."
        {...props}
      />
      <svg
        className="absolute right-3 top-3 h-5 w-5 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-5.2-5.2M15 10a5 5 0 11-10 0 5 5 0 0110 0z"
        ></path>
      </svg>
    </div>
  );
};

export default SearchInput;
