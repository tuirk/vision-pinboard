import { useState } from "react";
import { ToolsPanel } from "./ToolsPanel";
import { CorkBoard } from "./CorkBoard";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelLeftClose, Home } from "lucide-react";
import { ImageProvider } from "@/contexts/ImageContext";
import { EditorProvider } from "@/contexts/EditorContext";

interface VisionBoardProps {
  onGoHome?: () => void;
}

export const VisionBoard = ({ onGoHome }: VisionBoardProps) => {
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
            <div className={`${isPanelOpen ? "panel-slide-in" : "panel-slide-out"} h-full overflow-hidden`}>
              {isPanelOpen && <ToolsPanel />}
            </div>
          </div>

          {/* Main Workspace */}
          <div className="flex-1 relative">
            {/* Control Buttons */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              <Button
                onClick={togglePanel}
                variant="secondary"
                size="sm"
                className="shadow-pin hover:shadow-lg transition-all"
              >
                {isPanelOpen ? (
                  <PanelLeftClose className="h-4 w-4" />
                ) : (
                  <PanelLeftOpen className="h-4 w-4" />
                )}
              </Button>
              
              {onGoHome && (
                <Button
                  onClick={onGoHome}
                  variant="secondary"
                  size="sm"
                  className="shadow-pin hover:shadow-lg transition-all"
                >
                  <Home className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Cork Board */}
            <CorkBoard />
          </div>
        </div>
      </EditorProvider>
    </ImageProvider>
  );
};