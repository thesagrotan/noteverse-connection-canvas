import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import Note from "./Note";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

export interface NoteData {
  id: string;
  x: number;
  y: number;
  content: string;
}

const Canvas = () => {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  const backgroundX = useTransform(x, (value) => value * 0.5);
  const backgroundY = useTransform(y, (value) => value * 0.5);

  const handleWheel = (event: WheelEvent) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      const delta = -event.deltaY;
      const newScale = Math.min(Math.max(scale.get() + delta * 0.001, 0.1), 5);
      scale.set(newScale);
    }
  };

  useEffect(() => {
    const element = document.querySelector('.canvas-container');
    if (element) {
      element.addEventListener('wheel', handleWheel, { passive: false });
      return () => element.removeEventListener('wheel', handleWheel);
    }
  }, []);

  const handleAddNote = () => {
    const newNote: NoteData = {
      id: `note-${Date.now()}`,
      x: -x.get() + window.innerWidth / 2 - 100,
      y: -y.get() + window.innerHeight / 2 - 50,
      content: "New note",
    };
    setNotes([...notes, newNote]);
  };

  const handleNotePositionChange = (id: string, newX: number, newY: number) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, x: newX, y: newY } : note
      )
    );
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-canvas-bg relative">
      <div className="absolute top-4 right-4 z-50">
        <Button onClick={handleAddNote} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="canvas-container w-full h-full">
        <motion.div
          className="w-full h-full cursor-grab active:cursor-grabbing relative"
          style={{
            x,
            y,
            scale,
          }}
          drag
          dragConstraints={false}
          dragElastic={0}
          dragTransition={{ power: 0.2, timeConstant: 200 }}
          whileTap={{ cursor: "grabbing" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(circle at 1px 1px, rgb(229 231 235) 1px, transparent 0),
                radial-gradient(circle at 1px 1px, rgb(229 231 235 / 0.5) 1px, transparent 0)
              `,
              backgroundSize: '40px 40px, 20px 20px',
              transform: `translate(${backgroundX.get()}px, ${backgroundY.get()}px)`,
            }}
          />
          {notes.map((note) => (
            <Note
              key={note.id}
              note={note}
              onPositionChange={handleNotePositionChange}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Canvas;