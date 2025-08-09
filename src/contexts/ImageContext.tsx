import { useState, createContext, useContext, ReactNode } from "react";
import type { PinColor } from "@/contexts/EditorContext";

interface ImageContextType {
  uploadedImages: File[];
  setUploadedImages: (images: File[]) => void;
  draggedImage: File | null;
  setDraggedImage: (image: File | null) => void;
  draggedPin: PinColor | null;
  setDraggedPin: (color: PinColor | null) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImageContext must be used within an ImageProvider");
  }
  return context;
};

export const ImageProvider = ({ children }: { children: ReactNode }) => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [draggedImage, setDraggedImage] = useState<File | null>(null);
  const [draggedPin, setDraggedPin] = useState<PinColor | null>(null);

  return (
    <ImageContext.Provider value={{
      uploadedImages,
      setUploadedImages,
      draggedImage,
      setDraggedImage,
      draggedPin,
      setDraggedPin,
    }}>
      {children}
    </ImageContext.Provider>
  );
};