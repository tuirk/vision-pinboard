
import { useRef, useState } from "react";
import { useImageContext } from "@/contexts/ImageContext";
import { useEditorContext } from "@/contexts/EditorContext";
import type { PinColor } from "@/contexts/EditorContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  Image as ImageIcon, 
  Crop, 
  Heart, 
  Circle, 
  Square,
  Scissors,
  Frame,
  Pin,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  Layers,
  Type,
  Plus,
  Download
} from "lucide-react";
import { toast } from "sonner";

export const ToolsPanel = () => {
  const { uploadedImages, setUploadedImages, setDraggedImage, setDraggedPin } = useImageContext();
  const { applyShapeCrop, startFreeCut, applyPolaroidFrame, pinAction, reorderLayer, addText, exportSelected, exportWallpaper } = useEditorContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [textContent, setTextContent] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).filter(file => 
        file.type.startsWith('image/')
      );
      
      if (newImages.length > 0) {
        setUploadedImages([...uploadedImages, ...newImages]);
        toast.success(`${newImages.length} image(s) uploaded successfully!`);
      } else {
        toast.error("Please upload valid image files only.");
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDragStart = (event: React.DragEvent, file: File) => {
    console.log("Starting drag for file:", file.name);
    setDraggedImage(file);
    event.dataTransfer.setData("text/plain", "image-drag");
  };

  const pinOptions: { key: PinColor; hex: string; label: string }[] = [
    { key: 'red', hex: '#ef4444', label: 'Red' },
    { key: 'blue', hex: '#3b82f6', label: 'Blue' },
    { key: 'green', hex: '#22c55e', label: 'Green' },
    { key: 'yellow', hex: '#eab308', label: 'Yellow' },
    { key: 'purple', hex: '#a855f7', label: 'Purple' },
  ];

  const handlePinDragStart = (event: React.DragEvent, color: PinColor) => {
    setDraggedPin(color);
    event.dataTransfer.setData("text/plain", "pin-drag");
  };

  const handlePinClick = (color: PinColor) => {
    pinAction(color);
  };

  const handleAddText = () => {
    if (!textContent.trim()) {
      toast.error("Please enter some text before adding it to the board.");
      return;
    }
    
    addText(textContent);
    setTextContent("");
    toast.success("Text added to board!");
  };

  const handleExportSelected = () => {
    exportSelected();
  };

  const handleExportWallpaper = () => {
    exportWallpaper();
  };
  return (
    <div className="h-full flex flex-col p-4 bg-panel-bg custom-scrollbar overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2">Vision Board Tools</h2>
        <p className="text-sm text-muted-foreground">
          Upload and customize your images, then drag them to your board
        </p>
      </div>

      {/* Upload Section */}
      <Card className="p-4 mb-6 border-panel-border">
        <div className="flex items-center gap-2 mb-3">
          <Upload className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-foreground">Upload Images</h3>
        </div>
        
        <Button 
          onClick={triggerFileUpload}
          variant="secondary"
          className="w-full"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Choose Images
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </Card>

      {/* Text Editor Section */}
      <Card className="p-4 mb-6 border-panel-border">
        <div className="flex items-center gap-2 mb-3">
          <Type className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-foreground">Add Text</h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="text-content" className="text-sm">Text Content</Label>
            <Textarea
              id="text-content"
              placeholder="Enter your text here..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              className="mt-1 min-h-[80px] resize-none"
            />
          </div>
          
          <Button 
            onClick={handleAddText}
            variant="default"
            className="w-full"
            disabled={!textContent.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Text to Board
          </Button>
        </div>
      </Card>

      {/* Image Editing Tools */}
      <Card className="p-4 mb-6 border-panel-border">
        <div className="flex items-center gap-2 mb-3">
          <Crop className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-foreground">Editing Tools</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="text-xs" onClick={() => applyShapeCrop("circle")}>
            <Circle className="h-3 w-3 mr-1" />
            Circle
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => applyShapeCrop("square")}>
            <Square className="h-3 w-3 mr-1" />
            Square
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => applyShapeCrop("heart")}>
            <Heart className="h-3 w-3 mr-1" />
            Heart
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={startFreeCut}>
            <Scissors className="h-3 w-3 mr-1" />
            Free Cut
          </Button>
        </div>
        
        <Separator className="my-3" />
        
        <Button variant="outline" size="sm" className="w-full text-xs" onClick={applyPolaroidFrame}>
          <Frame className="h-3 w-3 mr-1" />
          Polaroid Frame
        </Button>
      </Card>

      {/* Export Section */}
      <Card className="p-4 mb-6 border-panel-border">
        <div className="flex items-center gap-2 mb-3">
          <Download className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-foreground">Export</h3>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={handleExportSelected}
            variant="outline"
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Selected as PNG
          </Button>
          
          <Button 
            onClick={handleExportWallpaper}
            variant="default"
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Full Wallpaper
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2 text-center space-y-1">
          <p>Selected: Export transparent PNG of selected objects</p>
          <p>Wallpaper: Export complete vision board with background</p>
        </div>
      </Card>

      {/* Layering */}
      <Card className="p-4 mb-6 border-panel-border">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-foreground">Layering</h3>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <Button variant="outline" size="sm" className="text-xs" onClick={() => reorderLayer('back')}>
            <ChevronsDown className="h-3 w-3 mr-1" />
            To Back
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => reorderLayer('backward')}>
            <ArrowDown className="h-3 w-3 mr-1" />
            Down
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => reorderLayer('forward')}>
            <ArrowUp className="h-3 w-3 mr-1" />
            Up
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => reorderLayer('front')}>
            <ChevronsUp className="h-3 w-3 mr-1" />
            To Front
          </Button>
        </div>
      </Card>

      {/* Pins */}
      <Card className="p-4 mb-6 border-panel-border">
        <div className="flex items-center gap-2 mb-3">
          <Pin className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-foreground">Pins</h3>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {pinOptions.map((opt) => (
            <div
              key={opt.key}
              role="button"
              aria-label={`Pin ${opt.label}`}
              title={`Drag to add, click to recolor (${opt.label})`}
              draggable
              onDragStart={(e) => handlePinDragStart(e, opt.key)}
              onClick={() => handlePinClick(opt.key)}
              className="h-10 rounded-md border border-panel-border flex items-center justify-center cursor-grab active:cursor-grabbing hover-scale"
              style={{ backgroundColor: opt.hex }}
            >
              <Pin className="h-4 w-4 text-white" />
            </div>
          ))}
        </div>
      </Card>

      {/* Uploaded Images Gallery */}
      {uploadedImages.length > 0 && (
        <Card className="p-4 border-panel-border">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-foreground">Your Images</h3>
            <span className="text-xs text-muted-foreground">
              ({uploadedImages.length})
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {uploadedImages.map((file, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, file)}
                className="relative aspect-square cursor-grab active:cursor-grabbing group"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover rounded-md border border-panel-border shadow-sm group-hover:shadow-md transition-shadow"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-md" />
              </div>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Drag images to your board to get started
          </p>
        </Card>
      )}
    </div>
  );
};
