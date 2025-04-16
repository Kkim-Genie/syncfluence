import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export default function Card({
  children,
  className = "",
  onClick,
  hoverable = false,
}: CardProps) {
  return (
    <div
      className={`rounded-lg border border-primary-100 bg-white p-6 shadow-md 
                 ${
                   hoverable
                     ? "transition-all hover:shadow-lg hover:border-primary-200"
                     : ""
                 } 
                 ${onClick ? "cursor-pointer" : ""}
                 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="mb-4 flex items-start justify-between">
      <div>
        <h3 className="text-lg font-bold text-primary-800">{title}</h3>
        {subtitle && (
          <p className="mt-1 text-sm text-primary-600">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
