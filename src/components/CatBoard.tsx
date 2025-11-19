import { useState } from "react"
import { Plus } from 'lucide-react'
import { NoteCard } from "@/components/NoteCard"
import { EmptyState } from "@/components/EmptyState"
import { useMemos, useCreateMemo, useDeleteMemo } from "@/hooks/useMemos"
import { memoToNote } from "@/types/memo"

export function CatBoard() {
  const [inputValue, setInputValue] = useState("")

  // React Query hooks
  const { data: memos, isLoading, error } = useMemos()
  const createMemo = useCreateMemo()
  const deleteMemo = useDeleteMemo()

  const addMemo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    createMemo.mutate(
      { content: inputValue },
      {
        onSuccess: () => {
          setInputValue("")
        },
      }
    )
  }

  const deleteNote = (id: string) => {
    deleteMemo.mutate(Number(id))
  }

  // Convert memos to notes for UI
  const notes = memos?.map(memoToNote) || []

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* Header Area */}
      <header className="mb-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <span className="text-4xl">😺</span>
          <h1 className="font-sans text-4xl font-bold tracking-tight text-gray-800">Cat Board</h1>
        </div>
      </header>

      {/* Input Area */}
      <div className="mx-auto mb-16 max-w-xl">
        <form onSubmit={addMemo} className="relative flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="오늘 할 일이나 떠오르는 생각을 적어 보세요..."
            className="h-14 w-full rounded-full border-2 border-orange-200 bg-white px-6 text-lg shadow-sm outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
            disabled={createMemo.isPending}
          />
          <button
            type="submit"
            className="absolute right-2 top-2 flex h-10 items-center gap-2 rounded-full bg-orange-400 px-6 font-medium text-white transition-colors hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={createMemo.isPending || !inputValue.trim()}
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">
              {createMemo.isPending ? "추가 중..." : "Add Memo"}
            </span>
          </button>
        </form>
        {error && (
          <p className="mt-2 text-center text-sm text-orange-600">
            서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인해주세요.
          </p>
        )}
      </div>

      {/* Memo List Area */}
      {isLoading ? (
        <div className="text-center text-gray-500">메모를 불러오는 중...</div>
      ) : error ? (
        <EmptyState />
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onDelete={deleteNote} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}
