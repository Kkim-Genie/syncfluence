import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export default function Input({
  label,
  error,
  className = "",
  fullWidth = false,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`${fullWidth ? "w-full" : ""} space-y-2`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`block rounded-md border border-gray-300 px-4 py-2 shadow-sm 
                   focus:border-primary-500 focus:ring-primary-500 
                   ${error ? "border-red-500" : ""}
                   ${fullWidth ? "w-full" : ""}
                   ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
