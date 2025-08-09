import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";

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

  const applyShapeCrop = useCallback((shape: ShapeType) => applyShapeCropFn(shape), [applyShapeCropFn]);
  const setApplyShapeCrop = useCallback((fn: ApplyShapeFn) => setApplyShapeCropFn(() => fn), []);
  const startFreeCut = useCallback(() => startFreeCutFn(), [startFreeCutFn]);
  const setStartFreeCut = useCallback((fn: StartFreeCutFn) => setStartFreeCutFn(() => fn), []);

  const value = useMemo(
    () => ({
      applyShapeCrop,
      setApplyShapeCrop,
      startFreeCut,
      setStartFreeCut,
    }),
    [applyShapeCrop, setApplyShapeCrop, startFreeCut, setStartFreeCut]
  );

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};