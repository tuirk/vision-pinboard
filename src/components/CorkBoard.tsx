import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, FabricImage } from "fabric";
import { toast } from "sonner";

export const CorkBoard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric.js canvas
    const canvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth - 320, // Adjust for panel width
      height: window.innerHeight,
      backgroundColor: "transparent",
      selection: true,
    });

    // Enable object controls
    canvas.on('selection:created', () => {
      canvas.renderAll();
    });

    canvas.on('selection:updated', () => {
      canvas.renderAll();
    });

    canvas.on('selection:cleared', () => {
      canvas.renderAll();
    });

    setFabricCanvas(canvas);

    // Handle window resize
    const handleResize = () => {
      const newWidth = window.innerWidth - 320;
      const newHeight = window.innerHeight;
      canvas.setDimensions({ width: newWidth, height: newHeight });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, []);

  // Handle drop events
  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    
    if (!fabricCanvas) return;

    try {
      const data = event.dataTransfer.getData("application/json");
      const dropData = JSON.parse(data);

      if (dropData.type === "image" && dropData.file) {
        const file = dropData.file as File;
        
        // Create image URL
        const imageUrl = URL.createObjectURL(file);
        
        // Get drop position relative to canvas
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Load image and add to canvas
        FabricImage.fromURL(imageUrl, {
          crossOrigin: 'anonymous'
        }).then((img) => {
          // Scale image to reasonable size
          const maxSize = 200;
          const scale = Math.min(maxSize / img.width!, maxSize / img.height!);
          
          img.set({
            left: x - (img.width! * scale) / 2,
            top: y - (img.height! * scale) / 2,
            scaleX: scale,
            scaleY: scale,
            shadow: {
              color: 'rgba(0,0,0,0.3)',
              blur: 10,
              offsetX: 3,
              offsetY: 3,
            }
          });

          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
          fabricCanvas.renderAll();
          
          toast.success("Image added to board!");
          
          // Clean up object URL
          URL.revokeObjectURL(imageUrl);
        }).catch((error) => {
          console.error('Error loading image:', error);
          toast.error("Failed to add image to board");
          URL.revokeObjectURL(imageUrl);
        });
      }
    } catch (error) {
      console.error('Error handling drop:', error);
      toast.error("Failed to process dropped item");
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div 
      className="w-full h-full cork-texture relative"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Cork board texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-50" />
      
      {/* Fabric.js Canvas */}
      <canvas 
        ref={canvasRef} 
        className="relative z-10"
      />
      
      {/* Instructions overlay */}
      {fabricCanvas && fabricCanvas.getObjects().length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-cork-dark mb-2">
              Start Creating Your Vision Board
            </h3>
            <p className="text-cork-medium">
              Drag images from the left panel onto this cork board
            </p>
          </div>
        </div>
      )}
    </div>
  );
};