import { DragControls } from "framer-motion";


export function ReorderIcon({ dragControls }) {
  return (
    <i onPointerDown={(event) => dragControls.start(event)} className="fa-solid fa-grip-lines"></i>
  );
}
