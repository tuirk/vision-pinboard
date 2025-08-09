import { useState, createContext, useContext, ReactNode } from "react";

interface ImageContextType {
  uploadedImages: File[];
  setUploadedImages: (images: File[]) => void;
  draggedImage: File | null;
  setDraggedImage: (image: File | null) => void;
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

  return (
    <ImageContext.Provider value={{
      uploadedImages,
      setUploadedImages,
      draggedImage,
      setDraggedImage
    }}>
      {children}
    </ImageContext.Provider>
  );
};