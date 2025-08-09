import { useRef } from "react";
import { useImageContext } from "@/contexts/ImageContext";
import { useEditorContext } from "@/contexts/EditorContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Upload, 
  Image as ImageIcon, 
  Crop, 
  Heart, 
  Circle, 
  Square,
  Scissors,
  Frame
} from "lucide-react";
import { toast } from "sonner";

export const ToolsPanel = () => {
  const { uploadedImages, setUploadedImages, setDraggedImage } = useImageContext();
  const { applyShapeCrop } = useEditorContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          <Button variant="outline" size="sm" className="text-xs">
            <Scissors className="h-3 w-3 mr-1" />
            Free Cut
          </Button>
        </div>
        
        <Separator className="my-3" />
        
        <Button variant="outline" size="sm" className="w-full text-xs">
          <FrameIcon className="h-3 w-3 mr-1" />
          Polaroid Frame
        </Button>
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