import { useState } from "react";
import { VisionBoard } from "@/components/VisionBoard";
import { Auth } from "./Auth";

const Index = () => {
  const [showBoard, setShowBoard] = useState(false);

  const handleStart = () => {
    setShowBoard(true);
  };

  if (!showBoard) {
    return <Auth onStart={handleStart} />;
  }

  return <VisionBoard />;
};

export default Index;
