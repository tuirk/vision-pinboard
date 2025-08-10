import { useState, createContext, useContext, ReactNode, useEffect } from "react";
import type { PinColor } from "@/contexts/EditorContext";
import { saveUploadedImages, loadUploadedImages } from "@/lib/localStorage";

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

  // Load images from localStorage on mount
  useEffect(() => {
    const loadImages = async () => {
      const storedImages = await loadUploadedImages();
      if (storedImages.length > 0) {
        setUploadedImages(storedImages);
      }
    };
    loadImages();
  }, []);

  // Save images to localStorage whenever they change
  useEffect(() => {
    if (uploadedImages.length > 0) {
      saveUploadedImages(uploadedImages);
    }
  }, [uploadedImages]);

  const handleSetUploadedImages = (images: File[]) => {
    setUploadedImages(images);
    // Auto-save will happen via useEffect
  };

  return (
    <ImageContext.Provider value={{
      uploadedImages,
      setUploadedImages: handleSetUploadedImages,
      draggedImage,
      setDraggedImage,
      draggedPin,
      setDraggedPin,
    }}>
      {children}
    </ImageContext.Provider>
  );
};