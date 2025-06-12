import React from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackToHomeProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  showText?: boolean;
  position?: "top-left" | "top-right" | "inline";
}

const BackToHome: React.FC<BackToHomeProps> = ({ 
  variant = "outline", 
  size = "default",
  className = "",
  showText = true,
  position = "inline"
}) => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  const buttonClasses = position === "top-left" 
    ? "fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm border shadow-lg hover:bg-white"
    : position === "top-right"
    ? "fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm border shadow-lg hover:bg-white"
    : "";

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBackToHome}
      className={`${buttonClasses} ${className}`}
    >
      {position === "top-left" ? (
        <>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {showText && "Back"}
        </>
      ) : (
        <>
          <Home className="mr-2 h-4 w-4" />
          {showText && "Back to Home"}
        </>
      )}
    </Button>
  );
};

export default BackToHome;
