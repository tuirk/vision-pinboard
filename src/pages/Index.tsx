import { useState } from "react";
import { VisionBoard } from "@/components/VisionBoard";
import { Auth } from "./Auth";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return <VisionBoard />;
};

export default Index;
