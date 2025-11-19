import { X } from 'lucide-react'
import type { Note } from '@/types/memo'

interface NoteCardProps {
  note: Note
  onDelete: (id: string) => void
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  return (
    <div
      className={`group relative flex min-h-[200px] flex-col justify-between p-6 shadow-md transition-transform hover:z-10 hover:scale-105 ${note.color}`}
      style={{
        transform: `rotate(${note.rotation}deg)`,
      }}
    >
      {/* Pin effect */}
      <div className="absolute -top-3 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-red-400 shadow-sm opacity-80" />

      <div className="mb-4 whitespace-pre-wrap font-medium leading-relaxed text-gray-800">{note.text}</div>

      <div className="flex items-end justify-between">
        <span className="text-xs font-medium text-gray-500/80">{note.date}</span>
        <button
          onClick={() => onDelete(note.id)}
          className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
          aria-label="Delete note"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
