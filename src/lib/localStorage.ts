// localStorage utilities for persisting vision board data

const STORAGE_KEYS = {
  UPLOADED_IMAGES: 'visionboard_uploaded_images',
  CANVAS_STATE: 'visionboard_canvas_state',
  APP_STATE: 'visionboard_app_state'
} as const;

// Helper to safely access localStorage
const getStorageItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(`Failed to access localStorage for key ${key}:`, error);
    return null;
  }
};

const setStorageItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to save to localStorage for key ${key}:`, error);
  }
};

// Convert File objects to base64 for storage
export const saveUploadedImages = async (files: File[]): Promise<void> => {
  try {
    const fileData = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        data: await fileToBase64(file)
      }))
    );
    setStorageItem(STORAGE_KEYS.UPLOADED_IMAGES, JSON.stringify(fileData));
  } catch (error) {
    console.warn('Failed to save uploaded images:', error);
  }
};

// Convert base64 back to File objects
export const loadUploadedImages = async (): Promise<File[]> => {
  try {
    const data = getStorageItem(STORAGE_KEYS.UPLOADED_IMAGES);
    if (!data) return [];
    
    const fileData = JSON.parse(data);
    return await Promise.all(
      fileData.map(async (item: any) => 
        base64ToFile(item.data, item.name, item.type)
      )
    );
  } catch (error) {
    console.warn('Failed to load uploaded images:', error);
    return [];
  }
};

// Canvas state persistence
export const saveCanvasState = (canvasData: string): void => {
  setStorageItem(STORAGE_KEYS.CANVAS_STATE, canvasData);
};

export const loadCanvasState = (): string | null => {
  return getStorageItem(STORAGE_KEYS.CANVAS_STATE);
};

// App state persistence (for things like panel visibility, etc.)
export const saveAppState = (state: Record<string, any>): void => {
  setStorageItem(STORAGE_KEYS.APP_STATE, JSON.stringify(state));
};

export const loadAppState = (): Record<string, any> => {
  try {
    const data = getStorageItem(STORAGE_KEYS.APP_STATE);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.warn('Failed to load app state:', error);
    return {};
  }
};

// Utility functions for File conversion
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const base64ToFile = (base64: string, name: string, type: string): File => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], name, { type });
};

// Clear all stored data
export const clearAllStoredData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn('Failed to clear stored data:', error);
  }
};