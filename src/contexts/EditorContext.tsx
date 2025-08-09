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

interface EditorContextType {
  applyShapeCrop: ApplyShapeFn;
  setApplyShapeCrop: (fn: ApplyShapeFn) => void;
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
}

const noop: ApplyShapeFn = () => {};
const noopVoid: StartFreeCutFn = () => {};
const noopPolaroid: ApplyPolaroidFn = () => {};
const noopPinAction: PinActionFn = () => {};
const noopReorder: ReorderLayerFn = () => {};
const noopAddText: AddTextFn = () => {};
const noopExportSelected: ExportSelectedFn = () => {};

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditorContext = () => {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditorContext must be used within EditorProvider");
  return ctx;
};

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [applyShapeCropFn, setApplyShapeCropFn] = useState<ApplyShapeFn>(() => noop);
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
      {children}
    </EditorContext.Provider>
  );
};