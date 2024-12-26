import { motion } from "framer-motion";
import type { NoteData } from "./Canvas";
import { useEffect, useState, useRef } from "react";
import ColorThief from "colorthief";

interface NoteProps {
  note: NoteData;
  onPositionChange: (id: string, x: number, y: number) => void;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

const Note = ({ note, onPositionChange }: NoteProps) => {
  const [palette, setPalette] = useState<RGB[]>([]);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (note.type === "image" && imgRef.current && imgRef.current.complete) {
      extractColors();
    }
  }, [note.type, note.imageUrl]);

  const extractColors = async () => {
    if (!imgRef.current) return;
    
    try {
      const colorThief = new ColorThief();
      const rawPalette = colorThief.getPalette(imgRef.current, 5);
      
      const rgbPalette = rawPalette.map(([r, g, b]) => ({ r, g, b }));
      setPalette(rgbPalette);
    } catch (error) {
      console.error("Error extracting colors:", error);
    }
  };

  return (
    <motion.div
      className="absolute bg-canvas-note p-4 rounded-lg shadow-lg cursor-move"
      style={{
        width: note.type === "image" ? "auto" : "200px",
      }}
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
      {note.type === "text" ? (
        <textarea
          className="w-full h-full min-h-[100px] resize-none border-none focus:outline-none bg-transparent"
          defaultValue={note.content}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div className="relative">
          <img
            ref={imgRef}
            src={note.imageUrl}
            alt="Note"
            className="max-w-[300px] max-h-[300px] object-contain"
            onClick={(e) => e.stopPropagation()}
            onLoad={extractColors}
            crossOrigin="anonymous"
          />
          {palette.length > 0 && (
            <div className="absolute -right-8 top-0 flex flex-col gap-1">
              {palette.map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded shadow-sm"
                  style={{
                    backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
                  }}
                  title={`RGB(${color.r}, ${color.g}, ${color.b})`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Note;