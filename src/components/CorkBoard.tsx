import { useEffect, useRef, useState } from "react";
<<<<<<< HEAD
import { Canvas as FabricCanvas, FabricImage, Circle, Rect, Path, Polyline, Polygon, Point, util, Group, Shadow, Control, Ellipse, Triangle, FabricText } from "fabric";
import { useImageContext } from "@/contexts/ImageContext";
import { useEditorContext, ShapeType, PinColor, ReorderOp } from "@/contexts/EditorContext";
=======
import { Canvas as FabricCanvas, FabricImage, Circle, Rect, Path } from "fabric";
import { useImageContext } from "@/contexts/ImageContext";
import { useEditorContext, ShapeType } from "@/contexts/EditorContext";
>>>>>>> d453ff0 (Add image cropping shapes)
import { toast } from "sonner";

// Helper: delete control for objects
const createDeleteControl = () =>
  new Control({
    x: 0.5,
    y: -0.5,
    offsetX: 8,
    offsetY: -8,
    cursorStyle: 'pointer',
    mouseUpHandler: (_evt, transform) => {
      const target = transform.target as any;
      const canvas = target?.canvas as FabricCanvas | undefined;
      if (canvas && target) {
        canvas.remove(target);
        canvas.requestRenderAll();
      }
      return true;
    },
    render: (ctx: CanvasRenderingContext2D, left: number, top: number) => {
      const r = 10;
      ctx.save();
      ctx.translate(left, top);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-5, -5);
      ctx.lineTo(5, 5);
      ctx.moveTo(-5, 5);
      ctx.lineTo(5, -5);
      ctx.stroke();
      ctx.restore();
    },
    sizeX: 24,
    sizeY: 24,
  });

const createLayerControl = (dir: 'up' | 'down') =>
  new Control({
    x: dir === 'up' ? 0.3 : 0.1,
    y: -0.5,
    offsetX: 0,
    offsetY: -8,
    cursorStyle: 'pointer',
    mouseUpHandler: (_evt, transform) => {
      const target = transform.target as any;
      const canvas = target?.canvas as FabricCanvas | undefined;
      if (canvas && target) {
        // Use precise layerable-based stepping
        reorderWithinLayerables(canvas, target, dir === 'up' ? 'forward' : 'backward');
        canvas.setActiveObject(target);
        canvas.requestRenderAll();
      }
      return true;
    },
    render: (ctx: CanvasRenderingContext2D, left: number, top: number) => {
      const r = 10;
      ctx.save();
      ctx.translate(left, top);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = '#111827';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (dir === 'up') {
        ctx.moveTo(-4, 3);
        ctx.lineTo(0, -3);
        ctx.lineTo(4, 3);
      } else {
        ctx.moveTo(-4, -3);
        ctx.lineTo(0, 3);
        ctx.lineTo(4, -3);
      }
      ctx.stroke();
      ctx.restore();
    },
    sizeX: 24,
    sizeY: 24,
  });

const attachControls = (obj: any) => {
  if (!obj?.controls) return;
  obj.controls.deleteControl = createDeleteControl();
  obj.controls.layerUp = createLayerControl('up');
  obj.controls.layerDown = createLayerControl('down');
};

// Layering helpers: operate only on "layerable" objects to ensure predictable one-step moves
function isLayerable(obj: any): boolean {
  return !!obj && obj.visible !== false && obj.selectable !== false && obj.evented !== false;
}

function getLayerables(canvas: FabricCanvas): any[] {
  const objs = canvas.getObjects();
  return objs.filter(isLayerable);
}

function reorderWithinLayerables(
  canvas: FabricCanvas,
  target: any,
  op: 'forward' | 'backward' | 'front' | 'back'
) {
  const objs = canvas.getObjects();
  if (!objs.length || !target) return;

  const layerables = getLayerables(canvas);
  const pos = layerables.indexOf(target);
  if (pos === -1) return; // target not layerable

  // Use Fabric's simpler reordering methods to avoid moveTo complications
  if (op === 'forward') {
    if (pos >= layerables.length - 1) return; // already top among layerables
    canvas.bringObjectForward(target);
    return;
  }

  if (op === 'backward') {
    if (pos <= 0) return; // already bottom among layerables
    canvas.sendObjectBackwards(target);
    return;
  }

  if (op === 'front') {
    canvas.bringObjectToFront(target);
    return;
  }

  if (op === 'back') {
    canvas.sendObjectToBack(target);
    return;
  }
}

const PIN_COLORS: Record<PinColor, string> = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
};

export const CorkBoard = () => {
<<<<<<< HEAD
  const { draggedImage, setDraggedImage, draggedPin, setDraggedPin } = useImageContext();
  const { setApplyShapeCrop, setStartFreeCut, setApplyPolaroidFrame, setPinAction, setReorderLayer, setAddText, setExportSelected } = useEditorContext();
=======
  const { draggedImage, setDraggedImage } = useImageContext();
  const { setApplyShapeCrop } = useEditorContext();
>>>>>>> d453ff0 (Add image cropping shapes)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<any[]>([]);
  const [selectionBounds, setSelectionBounds] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric.js canvas
    const canvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth, // Start with full width, will be adjusted
      height: window.innerHeight,
      backgroundColor: "transparent",
      selection: true,
      selectionBorderColor: 'rgba(255, 105, 180, 0.8)',
      selectionLineWidth: 2,
      selectionColor: 'rgba(255, 105, 180, 0.1)',
      selectionDashArray: [5, 5],
    });

    // Do not change z-order on selection; arrows/buttons control layering
    canvas.preserveObjectStacking = true;

    // Enable object controls and multi-selection tracking
    canvas.on('selection:created', (e) => {
      const selection = e.selected;
      setSelectedObjects(selection || []);
      
      if (selection && selection.length === 1) {
        // Only attach controls for single object selection
        attachControls(selection[0]);
        setSelectionBounds(null);
      } else if (selection && selection.length > 1) {
        // Track selection bounds for multi-selection delete button
        const activeSelection = canvas.getActiveObject();
        if (activeSelection) {
          const bounds = activeSelection.getBoundingRect();
          setSelectionBounds(bounds);
        }
      }
      canvas.renderAll();
    });

    canvas.on('selection:updated', (e) => {
      const selection = e.selected;
      setSelectedObjects(selection || []);
      
      if (selection && selection.length === 1) {
        // Only attach controls for single object selection
        attachControls(selection[0]);
        setSelectionBounds(null);
      } else if (selection && selection.length > 1) {
        // Track selection bounds for multi-selection delete button
        const activeSelection = canvas.getActiveObject();
        if (activeSelection) {
          const bounds = activeSelection.getBoundingRect();
          setSelectionBounds(bounds);
        }
      }
      canvas.renderAll();
    });

    canvas.on('selection:cleared', () => {
      setSelectedObjects([]);
      setSelectionBounds(null);
      canvas.renderAll();
    });

    setFabricCanvas(canvas);

    // Handle window resize and panel changes
    const handleResize = () => {
      if (!canvas) return;
      
      // Calculate canvas width based on available space
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        canvas.setDimensions({ 
          width: rect.width, 
          height: window.innerHeight 
        });
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Use ResizeObserver to detect changes when parent container resizes
    const resizeObserver = new ResizeObserver(handleResize);
    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current.parentElement!);
    }

    // Initial resize
    setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
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

<<<<<<< HEAD
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
        // Convert canvas points to image-local coords and center them to image center
        const inv = util.invertTransform(img.calcTransformMatrix());
        const imgW = img.width ?? 0;
        const imgH = img.height ?? 0;
        const cx = imgW / 2;
        const cy = imgH / 2;
        const localCentered = points.map((p) => {
          const pt = util.transformPoint(new Point(p.x, p.y), inv);
          return { x: pt.x - cx, y: pt.y - cy };
        });

        const polygon = new Polygon(localCentered, {
          fill: 'black',
          selectable: false,
          evented: false,
          left: 0,
          top: 0,
          originX: 'center',
          originY: 'center',
        });

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

    const applyPolaroidFrame = () => {
      const obj = fabricCanvas.getActiveObject();
      if (!obj || obj.type !== 'image') {
        toast.error('Select an image on the board to add a polaroid frame.');
        return;
      }
      const img = obj as FabricImage;

      const scaledW = (img.width ?? 0) * (img.scaleX ?? 1);
      const scaledH = (img.height ?? 0) * (img.scaleY ?? 1);
      const side = 16;
      const marginTop = 16;
      const marginBottom = 48;

      const rectWidth = scaledW + side * 2;
      const rectHeight = scaledH + marginTop + marginBottom;

      const imageOffsetY = (marginTop - marginBottom) / 2;

      const angle = img.angle ?? 0;
      const centerX = (img.left ?? 0) + scaledW / 2;
      const centerY = (img.top ?? 0) + scaledH / 2;
      const existingShadow = img.shadow;

      const frame = new Rect({
        width: rectWidth,
        height: rectHeight,
        rx: 8,
        ry: 8,
        fill: '#ffffff',
        stroke: 'rgba(0,0,0,0.12)',
        strokeWidth: 1,
        originX: 'center',
        originY: 'center',
      });

      fabricCanvas.remove(img);

      img.set({
        left: 0,
        top: imageOffsetY,
        originX: 'center',
        originY: 'center',
      });

      const group = new Group([frame, img], {
        left: centerX,
        top: centerY,
        originX: 'center',
        originY: 'center',
        angle,
        shadow: existingShadow ?? new Shadow({
          color: 'rgba(0,0,0,0.25)',
          blur: 12,
          offsetX: 4,
          offsetY: 6,
        }),
      });

      fabricCanvas.add(group);
      attachControls(group);
      fabricCanvas.setActiveObject(group as any);
      fabricCanvas.requestRenderAll();
      toast.success('Polaroid frame added');
    };

    const pinAction = (color: PinColor) => {
      const colorHex = PIN_COLORS[color];
      const active = fabricCanvas.getActiveObject();

      // If a pin is selected, recolor its plastic parts
      if (active && active.type === 'group' && (active as any).name === 'pin') {
        const grp = active as Group;
        grp.getObjects().forEach((o) => {
          if ((o as any).name === 'plastic') {
            o.set({ fill: colorHex });
          }
        });
        fabricCanvas.requestRenderAll();
        toast.success('Pin color updated');
        return;
      }

      // Otherwise, add a new pin in the chosen color at canvas center
      const head = new Circle({ radius: 10, top: -28, fill: colorHex, originX: 'center', originY: 'center' } as any);
      (head as any).name = 'plastic';
      const neck = new Rect({ width: 8, height: 24, rx: 4, ry: 4, top: -8, fill: colorHex, originX: 'center', originY: 'center' } as any);
      (neck as any).name = 'plastic';
      const base = new Ellipse({ rx: 16, ry: 10, top: 6, fill: colorHex, originX: 'center', originY: 'center' } as any);
      (base as any).name = 'plastic';
      const spike = new Triangle({ width: 6, height: 22, top: 22, originX: 'center', originY: 'center', angle: 180, fill: '#c0c0c0' });

      const centerX = fabricCanvas.getWidth() / 2;
      const centerY = fabricCanvas.getHeight() / 2;

      const pinGroup = new Group([spike, base, neck, head], {
        left: centerX,
        top: centerY,
        originX: 'center',
        originY: 'center',
        shadow: new Shadow({ color: 'rgba(0,0,0,0.25)', blur: 8, offsetX: 2, offsetY: 4 }),
      } as any);
      (pinGroup as any).name = 'pin';

      fabricCanvas.add(pinGroup);
      attachControls(pinGroup);
      fabricCanvas.setActiveObject(pinGroup as any);
      fabricCanvas.requestRenderAll();
      toast.success('Pin added');
    };

    const addText = (text: string) => {
      const centerX = fabricCanvas.getWidth() / 2;
      const centerY = fabricCanvas.getHeight() / 2;

      const textObject = new FabricText(text, {
        left: centerX,
        top: centerY,
        originX: 'center',
        originY: 'center',
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 'hsl(25, 20%, 15%)', // foreground color from design system
        fontWeight: 'normal',
        shadow: new Shadow({
          color: 'rgba(0,0,0,0.1)',
          blur: 4,
          offsetX: 1,
          offsetY: 2,
        }),
      });

      fabricCanvas.add(textObject);
      attachControls(textObject);
      fabricCanvas.setActiveObject(textObject);
      fabricCanvas.requestRenderAll();
    };

    const exportSelected = () => {
      const activeObjects = fabricCanvas.getActiveObjects();
      
      if (activeObjects.length === 0) {
        toast.error('Please select objects to export');
        return;
      }

      // Calculate bounds of selected objects
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      activeObjects.forEach(obj => {
        const bounds = obj.getBoundingRect();
        minX = Math.min(minX, bounds.left);
        minY = Math.min(minY, bounds.top);
        maxX = Math.max(maxX, bounds.left + bounds.width);
        maxY = Math.max(maxY, bounds.top + bounds.height);
      });

      const padding = 20;
      const exportWidth = maxX - minX + padding * 2;
      const exportHeight = maxY - minY + padding * 2;

      // Create a temporary canvas for export
      const tempCanvas = new FabricCanvas(null, {
        backgroundColor: 'transparent',
        width: exportWidth,
        height: exportHeight
      });

      // Instead of cloning, we'll render the selection area directly
      // Create a cropped version of the main canvas
      const originalObjects = fabricCanvas.getObjects();
      const visibleObjects: any[] = [];

      // Temporarily hide objects outside selection bounds
      originalObjects.forEach(obj => {
        const bounds = obj.getBoundingRect();
        const objCenterX = bounds.left + bounds.width / 2;
        const objCenterY = bounds.top + bounds.height / 2;
        
        // Check if object overlaps with selection area
        const overlaps = !(bounds.left > maxX || 
                          bounds.left + bounds.width < minX || 
                          bounds.top > maxY || 
                          bounds.top + bounds.height < minY);
        
        if (overlaps && activeObjects.includes(obj)) {
          visibleObjects.push(obj);
        }
      });

      if (visibleObjects.length === 0) {
        toast.error('No valid objects to export');
        return;
      }

      // Create export by rendering only selected objects
      try {
        // Store original positions and adjust for export
        const originalStates: any[] = [];
        
        visibleObjects.forEach((obj, index) => {
          originalStates[index] = {
            left: obj.left,
            top: obj.top
          };
          
          // Adjust position for export canvas
          obj.set({
            left: obj.left - minX + padding,
            top: obj.top - minY + padding
          });
          
          tempCanvas.add(obj);
        });

        // Render and export
        tempCanvas.renderAll();
        
        const dataURL = tempCanvas.toDataURL({
          format: 'png',
          quality: 1.0,
          multiplier: 1
        });

        // Restore original positions
        visibleObjects.forEach((obj, index) => {
          obj.set(originalStates[index]);
          tempCanvas.remove(obj);
          fabricCanvas.add(obj);
        });

        fabricCanvas.renderAll();

        // Create download link
        const link = document.createElement('a');
        link.download = `vision-board-export-${Date.now()}.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Cleanup
        tempCanvas.dispose();
        toast.success('Export complete! Check your downloads.');

      } catch (error) {
        console.error('Export error:', error);
        toast.error('Failed to export selection');
        
        // Cleanup on error
        tempCanvas.dispose();
      }
    };

    setApplyShapeCrop(applyFn);
    setStartFreeCut(startFreeCut);
    setApplyPolaroidFrame(applyPolaroidFrame);
    setPinAction(pinAction);
    setAddText(addText);
    setExportSelected(exportSelected);

    const reorderLayer = (op: ReorderOp) => {
      const obj = fabricCanvas.getActiveObject();
      if (!obj) {
        toast.error('Select an item to change layer.');
        return;
      }
      reorderWithinLayerables(fabricCanvas, obj as any, op);
      fabricCanvas.setActiveObject(obj);
      fabricCanvas.requestRenderAll();
    };

    setReorderLayer(reorderLayer);
  }, [fabricCanvas, setApplyShapeCrop, setStartFreeCut, setApplyPolaroidFrame, setPinAction, setReorderLayer, setAddText, setExportSelected]);
=======
    setApplyShapeCrop(applyFn);
  }, [fabricCanvas, setApplyShapeCrop]);
>>>>>>> d453ff0 (Add image cropping shapes)

  // Handle drop events
  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    if (!fabricCanvas) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Handle pin drop
    if (draggedPin) {
      const colorHex = PIN_COLORS[draggedPin];
      const head = new Circle({ radius: 10, top: -28, fill: colorHex, originX: 'center', originY: 'center' } as any);
      (head as any).name = 'plastic';
      const neck = new Rect({ width: 8, height: 24, rx: 4, ry: 4, top: -8, fill: colorHex, originX: 'center', originY: 'center' } as any);
      (neck as any).name = 'plastic';
      const base = new Ellipse({ rx: 16, ry: 10, top: 6, fill: colorHex, originX: 'center', originY: 'center' } as any);
      (base as any).name = 'plastic';
      const spike = new Triangle({ width: 6, height: 22, top: 22, originX: 'center', originY: 'center', angle: 180, fill: '#c0c0c0' });

      const pinGroup = new Group([spike, base, neck, head], {
        left: x,
        top: y,
        originX: 'center',
        originY: 'center',
        shadow: new Shadow({ color: 'rgba(0,0,0,0.25)', blur: 8, offsetX: 2, offsetY: 4 }),
      } as any);
      (pinGroup as any).name = 'pin';

      fabricCanvas.add(pinGroup);
      attachControls(pinGroup);
      fabricCanvas.setActiveObject(pinGroup as any);
      fabricCanvas.requestRenderAll();
      setDraggedPin(null);
      toast.success('Pin added');
      return;
    }

    // Handle image drop
    if (!draggedImage) return;

    try {
      const imageUrl = URL.createObjectURL(draggedImage);

      FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' })
        .then((img) => {
          const maxSize = 200;
          const scale = Math.min(maxSize / img.width!, maxSize / img.height!);

          img.set({
            left: x - (img.width! * scale) / 2,
            top: y - (img.height! * scale) / 2,
            scaleX: scale,
            scaleY: scale,
            shadow: { color: 'rgba(0,0,0,0.3)', blur: 10, offsetX: 3, offsetY: 3 },
          });

          attachControls(img);
          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
          fabricCanvas.renderAll();

          toast.success('Image added to board!');
          URL.revokeObjectURL(imageUrl);
          setDraggedImage(null);
        })
        .catch((error) => {
          console.error('Error loading image:', error);
          toast.error('Failed to add image to board');
          URL.revokeObjectURL(imageUrl);
          setDraggedImage(null);
        });
    } catch (error) {
      console.error('Error handling drop:', error);
      toast.error('Failed to process dropped item');
      setDraggedImage(null);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  // Handle bulk delete for multi-selection
  const handleBulkDelete = () => {
    if (!fabricCanvas || selectedObjects.length === 0) return;
    
    selectedObjects.forEach(obj => {
      fabricCanvas.remove(obj);
    });
    
    fabricCanvas.discardActiveObject();
    fabricCanvas.requestRenderAll();
    setSelectedObjects([]);
    setSelectionBounds(null);
    toast.success(`Deleted ${selectedObjects.length} object${selectedObjects.length === 1 ? '' : 's'}`);
  };

  return (
    <div 
      className="w-full h-full relative"
      style={{ backgroundImage: "url(/lovable-uploads/4c184447-f9b9-473e-ad94-93eb0138dafd.png)", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
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
              Drag images from the left panel or add text to this cork board
            </p>
          </div>
        </div>
      )}

      {/* Multi-selection delete button */}
      {selectionBounds && selectedObjects.length > 1 && (
        <button
          onClick={handleBulkDelete}
          className="absolute z-30 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-colors"
          style={{
            left: selectionBounds.left + selectionBounds.width - 16,
            top: selectionBounds.top - 16,
          }}
          title={`Delete ${selectedObjects.length} selected objects`}
        >
          ×
        </button>
      )}
    </div>
  );
};