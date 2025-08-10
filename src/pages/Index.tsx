import { useState, useEffect } from "react";
import { VisionBoard } from "@/components/VisionBoard";
import { Auth } from "./Auth";
import { saveAppState, loadAppState } from "@/lib/localStorage";

const Index = () => {
  const [showBoard, setShowBoard] = useState(false);

  // Load app state on mount
  useEffect(() => {
    const appState = loadAppState();
    if (appState.showBoard) {
      setShowBoard(true);
    }
  }, []);

  // Save app state when showBoard changes
  useEffect(() => {
    saveAppState({ showBoard });
  }, [showBoard]);

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
