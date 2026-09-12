import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const base = "px-4 py-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2";
  const styles = {
    primary: "bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-neutral-400",
    secondary: "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 focus:ring-neutral-300",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-400"
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};