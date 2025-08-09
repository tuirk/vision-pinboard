<<<<<<< HEAD
import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";

export type ShapeType = "circle" | "square" | "heart";
export type PinColor = "red" | "blue" | "green" | "yellow" | "purple";
export type ReorderOp = "forward" | "backward" | "front" | "back";

type ApplyShapeFn = (shape: ShapeType) => void;
type StartFreeCutFn = () => void;
type ApplyPolaroidFn = () => void;
type PinActionFn = (color: PinColor) => void;
type ReorderLayerFn = (op: ReorderOp) => void;
type AddTextFn = (text: string) => void;
type ExportSelectedFn = () => void;
=======
import { createContext, useContext, useState, ReactNode } from "react";

export type ShapeType = "circle" | "square" | "heart";

type ApplyShapeFn = (shape: ShapeType) => void;
<<<<<<< HEAD
>>>>>>> d453ff0 (Add image cropping shapes)
=======
type StartFreeCutFn = () => void;
>>>>>>> ea03ed0 (Add freecut function)

interface EditorContextType {
  applyShapeCrop: ApplyShapeFn;
  setApplyShapeCrop: (fn: ApplyShapeFn) => void;
<<<<<<< HEAD
<<<<<<< HEAD
  startFreeCut: StartFreeCutFn;
  setStartFreeCut: (fn: StartFreeCutFn) => void;
  applyPolaroidFrame: ApplyPolaroidFn;
  setApplyPolaroidFrame: (fn: ApplyPolaroidFn) => void;
  pinAction: PinActionFn;
  setPinAction: (fn: PinActionFn) => void;
  reorderLayer: ReorderLayerFn;
  setReorderLayer: (fn: ReorderLayerFn) => void;
  addText: AddTextFn;
  setAddText: (fn: AddTextFn) => void;
  exportSelected: ExportSelectedFn;
  setExportSelected: (fn: ExportSelectedFn) => void;
=======
  startFreeCut: StartFreeCutFn;
  setStartFreeCut: (fn: StartFreeCutFn) => void;
>>>>>>> ea03ed0 (Add freecut function)
}

const noop: ApplyShapeFn = () => {};
const noopVoid: StartFreeCutFn = () => {};
<<<<<<< HEAD
const noopPolaroid: ApplyPolaroidFn = () => {};
const noopPinAction: PinActionFn = () => {};
const noopReorder: ReorderLayerFn = () => {};
const noopAddText: AddTextFn = () => {};
const noopExportSelected: ExportSelectedFn = () => {};
=======
}

const noop: ApplyShapeFn = () => {};
>>>>>>> d453ff0 (Add image cropping shapes)
=======
>>>>>>> ea03ed0 (Add freecut function)

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditorContext = () => {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditorContext must be used within EditorProvider");
  return ctx;
};

export const EditorProvider = ({ children }: { children: ReactNode }) => {
<<<<<<< HEAD
  const [applyShapeCropFn, setApplyShapeCropFn] = useState<ApplyShapeFn>(() => noop);
<<<<<<< HEAD
  const [startFreeCutFn, setStartFreeCutFn] = useState<StartFreeCutFn>(() => noopVoid);
  const [applyPolaroidFrameFn, setApplyPolaroidFrameFn] = useState<ApplyPolaroidFn>(() => noopPolaroid);
  const [pinActionFn, setPinActionFn] = useState<PinActionFn>(() => noopPinAction);
  const [reorderLayerFn, setReorderLayerFn] = useState<ReorderLayerFn>(() => noopReorder);
  const [addTextFn, setAddTextFn] = useState<AddTextFn>(() => noopAddText);
  const [exportSelectedFn, setExportSelectedFn] = useState<ExportSelectedFn>(() => noopExportSelected);

  const applyShapeCrop = useCallback((shape: ShapeType) => applyShapeCropFn(shape), [applyShapeCropFn]);
  const setApplyShapeCrop = useCallback((fn: ApplyShapeFn) => setApplyShapeCropFn(() => fn), []);
  const startFreeCut = useCallback(() => startFreeCutFn(), [startFreeCutFn]);
  const setStartFreeCut = useCallback((fn: StartFreeCutFn) => setStartFreeCutFn(() => fn), []);
  const applyPolaroidFrame = useCallback(() => applyPolaroidFrameFn(), [applyPolaroidFrameFn]);
  const setApplyPolaroidFrame = useCallback((fn: ApplyPolaroidFn) => setApplyPolaroidFrameFn(() => fn), []);
  const pinAction = useCallback((color: PinColor) => pinActionFn(color), [pinActionFn]);
  const setPinAction = useCallback((fn: PinActionFn) => setPinActionFn(() => fn), []);
  const reorderLayer = useCallback((op: ReorderOp) => reorderLayerFn(op), [reorderLayerFn]);
  const setReorderLayer = useCallback((fn: ReorderLayerFn) => setReorderLayerFn(() => fn), []);
  const addText = useCallback((text: string) => addTextFn(text), [addTextFn]);
  const setAddText = useCallback((fn: AddTextFn) => setAddTextFn(() => fn), []);
  const exportSelected = useCallback(() => exportSelectedFn(), [exportSelectedFn]);
  const setExportSelected = useCallback((fn: ExportSelectedFn) => setExportSelectedFn(() => fn), []);

  const value = useMemo(
    () => ({
      applyShapeCrop,
      setApplyShapeCrop,
      startFreeCut,
      setStartFreeCut,
      applyPolaroidFrame,
      setApplyPolaroidFrame,
      pinAction,
      setPinAction,
      reorderLayer,
      setReorderLayer,
      addText,
      setAddText,
      exportSelected,
      setExportSelected,
    }),
    [applyShapeCrop, setApplyShapeCrop, startFreeCut, setStartFreeCut, applyPolaroidFrame, setApplyPolaroidFrame, pinAction, setPinAction, reorderLayer, setReorderLayer, addText, setAddText, exportSelected, setExportSelected]
  );

  return (
    <EditorContext.Provider value={value}>
=======
=======
const [applyShapeCropFn, setApplyShapeCropFn] = useState<ApplyShapeFn>(() => noop);
  const [startFreeCutFn, setStartFreeCutFn] = useState<StartFreeCutFn>(() => noopVoid);
>>>>>>> ea03ed0 (Add freecut function)

  return (
    <EditorContext.Provider
      value={{
        applyShapeCrop: (shape) => applyShapeCropFn(shape),
        setApplyShapeCrop: (fn) => setApplyShapeCropFn(() => fn),
        startFreeCut: () => startFreeCutFn(),
        setStartFreeCut: (fn) => setStartFreeCutFn(() => fn),
      }}
    >
>>>>>>> d453ff0 (Add image cropping shapes)
      {children}
    </EditorContext.Provider>
  );
};