import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../utils'
import userEvent from '@testing-library/user-event'
import { NoteCard } from '@/components/NoteCard'
import type { Note } from '@/types/memo'

const mockNote: Note = {
  id: '1',
  text: '테스트 메모입니다.',
  date: '2024-01-01 12:00',
  color: 'bg-yellow-200',
  rotation: 2,
}

describe('NoteCard', () => {
  it('should render note content correctly', () => {
    const onDelete = vi.fn()
    render(<NoteCard note={mockNote} onDelete={onDelete} />)

    expect(screen.getByText('테스트 메모입니다.')).toBeInTheDocument()
    expect(screen.getByText('2024-01-01 12:00')).toBeInTheDocument()
  })

  it('should apply correct color class', () => {
    const onDelete = vi.fn()
    const { container } = render(<NoteCard note={mockNote} onDelete={onDelete} />)

    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('bg-yellow-200')
  })

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<NoteCard note={mockNote} onDelete={onDelete} />)

    // 호버 시에만 버튼이 보이므로 직접 찾기
    const deleteButton = screen.getByLabelText('Delete note')
    await user.click(deleteButton)

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('should display delete button with correct aria-label', () => {
    const onDelete = vi.fn()
    render(<NoteCard note={mockNote} onDelete={onDelete} />)

    const deleteButton = screen.getByLabelText('Delete note')
    expect(deleteButton).toBeInTheDocument()
  })

  it('should render with different note data', () => {
    const onDelete = vi.fn()
    const differentNote: Note = {
      id: '2',
      text: '다른 메모',
      date: '2024-02-02 14:30',
      color: 'bg-pink-200',
      rotation: -2,
    }

    render(<NoteCard note={differentNote} onDelete={onDelete} />)

    expect(screen.getByText('다른 메모')).toBeInTheDocument()
    expect(screen.getByText('2024-02-02 14:30')).toBeInTheDocument()
  })

  it('should handle multi-line text correctly', () => {
    const onDelete = vi.fn()
    const multiLineNote: Note = {
      ...mockNote,
      text: '첫 번째 줄\n두 번째 줄\n세 번째 줄',
    }

    render(<NoteCard note={multiLineNote} onDelete={onDelete} />)

    expect(screen.getByText(/첫 번째 줄/)).toBeInTheDocument()
  })
})

