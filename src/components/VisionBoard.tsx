import { useState } from "react";
import { ToolsPanel } from "./ToolsPanel";
import { CorkBoard } from "./CorkBoard";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { ImageProvider } from "@/contexts/ImageContext";
import { EditorProvider } from "@/contexts/EditorContext";

export const VisionBoard = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <ImageProvider>
      <EditorProvider>
        <div className="flex h-screen w-full bg-background overflow-hidden">
          {/* Collapsible Tools Panel */}
          <div
            className={`
              relative transition-all duration-300 ease-smooth
              ${isPanelOpen ? "w-80" : "w-0"}
              bg-panel-bg border-r border-panel-border shadow-panel
            `}
          >
<<<<<<< HEAD
            <div className={`${isPanelOpen ? "panel-slide-in" : "panel-slide-out"} h-full overflow-hidden`}>
=======
            <div className={`${isPanelOpen ? "panel-slide-in" : "panel-slide-out"} h-full`}>
>>>>>>> d453ff0 (Add image cropping shapes)
              {isPanelOpen && <ToolsPanel />}
            </div>
          </div>

          {/* Main Workspace */}
          <div className="flex-1 relative">
            {/* Toggle Button */}
            <Button
              onClick={togglePanel}
              variant="secondary"
              size="sm"
<<<<<<< HEAD
              className="absolute top-4 left-4 z-20 shadow-pin hover:shadow-lg transition-all"
=======
              className="absolute top-4 left-4 z-10 shadow-pin"
>>>>>>> d453ff0 (Add image cropping shapes)
            >
              {isPanelOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeftOpen className="h-4 w-4" />
              )}
            </Button>

            {/* Cork Board */}
            <CorkBoard />
          </div>
        </div>
      </EditorProvider>
    </ImageProvider>
  );
};