import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, FabricImage, Circle, Rect, Path, Polyline, Polygon } from "fabric";
import { useImageContext } from "@/contexts/ImageContext";
import { useEditorContext, ShapeType } from "@/contexts/EditorContext";
import { toast } from "sonner";

export const CorkBoard = () => {
  const { draggedImage, setDraggedImage } = useImageContext();
  const { setApplyShapeCrop, setStartFreeCut } = useEditorContext();
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

  // Register editor actions
  useEffect(() => {
    if (!fabricCanvas) return;

    const applyFn = (shape: ShapeType) => {
      const obj = fabricCanvas.getActiveObject();
      if (!obj || obj.type !== 'image') {
        toast.error('Select an image on the board to apply a crop.');
        return;
      }

      const img = obj as FabricImage;
      const w = img.width ?? 0;
      const h = img.height ?? 0;
      const size = Math.min(w, h);

      let clip: Circle | Rect | Path | undefined;

      switch (shape) {
        case 'circle':
          clip = new Circle({
            radius: size / 2,
            left: 0,
            top: 0,
            originX: 'center',
            originY: 'center',
          });
          break;
        case 'square':
          clip = new Rect({
            width: size,
            height: size,
            rx: 8,
            ry: 8,
            left: 0,
            top: 0,
            originX: 'center',
            originY: 'center',
          });
          break;
        case 'heart': {
          const pathStr = "M 50 15 C 35 0 0 20 0 50 C 0 80 25 95 50 110 C 75 95 100 80 100 50 C 100 20 65 0 50 15 Z";
          const heart = new Path(pathStr, {
            left: 0,
            top: 0,
            originX: 'center',
            originY: 'center',
            fill: 'black',
          });
          heart.scaleX = size / 100;
          heart.scaleY = size / 100;
          clip = heart;
          break;
        }
      }

      if (clip) {
        img.set({ clipPath: clip });
        fabricCanvas.requestRenderAll();
        toast.success('Crop applied');
      }
    };

    const startFreeCut = () => {
      const obj = fabricCanvas.getActiveObject();
      if (!obj || obj.type !== 'image') {
        toast.error('Select an image on the board to free cut.');
        return;
      }
      const img = obj as FabricImage;

      // Instructions
      toast.info('Free Cut: Click to add points. Enter to finish, Esc to cancel.');

      let points: { x: number; y: number }[] = [];
      let tempPolyline: Polyline | null = null;

      const updatePreview = (previewPoints: { x: number; y: number }[]) => {
        if (tempPolyline) {
          tempPolyline.set({ points: previewPoints });
        } else {
          tempPolyline = new Polyline(previewPoints, {
            stroke: 'rgba(0,0,0,0.9)',
            strokeWidth: 2,
            fill: 'rgba(0,0,0,0.1)',
            selectable: false,
            evented: false,
          });
          fabricCanvas.add(tempPolyline);
        }
        fabricCanvas.requestRenderAll();
      };

      const onMouseDown = (opt: any) => {
        const pointer = fabricCanvas.getPointer(opt.e);
        points.push({ x: pointer.x, y: pointer.y });
        const preview = points.length > 1 ? [...points, points[points.length - 1]] : points;
        updatePreview(preview);
      };

      const onMouseMove = (opt: any) => {
        if (!points.length) return;
        const pointer = fabricCanvas.getPointer(opt.e);
        const preview = [...points, { x: pointer.x, y: pointer.y }];
        updatePreview(preview);
      };

      const cleanup = () => {
        fabricCanvas.off('mouse:down', onMouseDown);
        fabricCanvas.off('mouse:move', onMouseMove);
        window.removeEventListener('keydown', onKeyDown);
        fabricCanvas.selection = true;
        fabricCanvas.skipTargetFind = false;
        if (tempPolyline) {
          fabricCanvas.remove(tempPolyline);
          tempPolyline = null;
        }
        fabricCanvas.requestRenderAll();
      };

      const finish = () => {
        if (points.length < 3) {
          toast.error('Need at least 3 points to create a shape.');
          cleanup();
          return;
        }
        if (tempPolyline) {
          fabricCanvas.remove(tempPolyline);
          tempPolyline = null;
        }
        const polygon = new Polygon(points, {
          fill: 'black',
          selectable: false,
          evented: false,
        });
        // Use absolute positioning so we don't need to transform into image space
        // fabric supports absolute-positioned clipPath for canvas coords
        polygon.absolutePositioned = true;
        img.set({ clipPath: polygon });
        fabricCanvas.requestRenderAll();
        toast.success('Free cut applied');
        cleanup();
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          finish();
        } else if (e.key === 'Escape') {
          toast.info('Free cut cancelled');
          cleanup();
        }
      };

      fabricCanvas.selection = false;
      fabricCanvas.skipTargetFind = true;
      fabricCanvas.on('mouse:down', onMouseDown);
      fabricCanvas.on('mouse:move', onMouseMove);
      window.addEventListener('keydown', onKeyDown);
    };

    setApplyShapeCrop(applyFn);
    setStartFreeCut(startFreeCut);
  }, [fabricCanvas, setApplyShapeCrop, setStartFreeCut]);

  // Handle drop events
  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    console.log("Drop event triggered");
    
    if (!fabricCanvas || !draggedImage) {
      console.log("No canvas or dragged image available");
      return;
    }

    try {
      console.log("Processing image:", draggedImage.name);
      
      // Create image URL
      const imageUrl = URL.createObjectURL(draggedImage);
        
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
          console.log("Image successfully added to canvas");
          
          // Clean up
          URL.revokeObjectURL(imageUrl);
          setDraggedImage(null);
          
        }).catch((error) => {
          console.error('Error loading image:', error);
          toast.error("Failed to add image to board");
          URL.revokeObjectURL(imageUrl);
          setDraggedImage(null);
        });
        
    } catch (error) {
      console.error('Error handling drop:', error);
      toast.error("Failed to process dropped item");
      setDraggedImage(null);
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