import { createContext, useContext, useState, ReactNode } from "react";

export type ShapeType = "circle" | "square" | "heart";

type ApplyShapeFn = (shape: ShapeType) => void;
type StartFreeCutFn = () => void;

interface EditorContextType {
  applyShapeCrop: ApplyShapeFn;
  setApplyShapeCrop: (fn: ApplyShapeFn) => void;
  startFreeCut: StartFreeCutFn;
  setStartFreeCut: (fn: StartFreeCutFn) => void;
}

const noop: ApplyShapeFn = () => {};
const noopVoid: StartFreeCutFn = () => {};

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditorContext = () => {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditorContext must be used within EditorProvider");
  return ctx;
};

export const EditorProvider = ({ children }: { children: ReactNode }) => {
const [applyShapeCropFn, setApplyShapeCropFn] = useState<ApplyShapeFn>(() => noop);
  const [startFreeCutFn, setStartFreeCutFn] = useState<StartFreeCutFn>(() => noopVoid);

  return (
    <EditorContext.Provider
      value={{
        applyShapeCrop: (shape) => applyShapeCropFn(shape),
        setApplyShapeCrop: (fn) => setApplyShapeCropFn(() => fn),
        startFreeCut: () => startFreeCutFn(),
        setStartFreeCut: (fn) => setStartFreeCutFn(() => fn),
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};