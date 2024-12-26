import { motion } from "framer-motion";
import type { NoteData } from "./Canvas";

interface NoteProps {
  note: NoteData;
  onPositionChange: (id: string, x: number, y: number) => void;
}

const Note = ({ note, onPositionChange }: NoteProps) => {
  return (
    <motion.div
      className="absolute bg-canvas-note p-4 rounded-lg shadow-lg w-[200px] cursor-move"
      initial={{ x: note.x, y: note.y }}
      animate={{ x: note.x, y: note.y }}
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        onPositionChange(
          note.id,
          note.x + info.offset.x,
          note.y + info.offset.y
        );
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <textarea
        className="w-full h-full min-h-[100px] resize-none border-none focus:outline-none bg-transparent"
        defaultValue={note.content}
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
};

export default Note;