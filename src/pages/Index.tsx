import { useState } from "react";
import { VisionBoard } from "@/components/VisionBoard";
import { Auth } from "./Auth";

const Index = () => {
  const [showBoard, setShowBoard] = useState(false);

  const handleStart = () => {
    setShowBoard(true);
  };

  const handleGoHome = () => {
    setShowBoard(false);
  };

  if (!showBoard) {
    return <Auth onStart={handleStart} />;
  }

  return <VisionBoard onGoHome={handleGoHome} />;
};

export default Index;
