import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { NoteCard } from './NoteCard'
import type { Note } from '@/types/memo'

const mockNote: Note = {
  id: '1',
  text: '테스트 메모 내용입니다',
  date: '2024-01-01 12:00',
  color: 'bg-yellow-200',
  rotation: 2,
}

describe('NoteCard', () => {
  it('메모 내용을 올바르게 표시해야 합니다', () => {
    render(<NoteCard note={mockNote} onDelete={vi.fn()} />)

    expect(screen.getByText('테스트 메모 내용입니다')).toBeInTheDocument()
    expect(screen.getByText('2024-01-01 12:00')).toBeInTheDocument()
  })

  it('삭제 버튼을 클릭하면 onDelete가 호출되어야 합니다', async () => {
    const user = userEvent.setup()
    const onDeleteMock = vi.fn()

    render(<NoteCard note={mockNote} onDelete={onDeleteMock} />)

    // 삭제 버튼은 기본적으로 opacity-0이므로 hover 상태를 시뮬레이션
    const deleteButton = screen.getByLabelText('Delete note')
    
    // 버튼이 존재하는지 확인
    expect(deleteButton).toBeInTheDocument()
    
    // 클릭 이벤트 발생
    await user.click(deleteButton)

    expect(onDeleteMock).toHaveBeenCalledTimes(1)
    expect(onDeleteMock).toHaveBeenCalledWith('1')
  })

  it('올바른 색상 클래스를 적용해야 합니다', () => {
    const { container } = render(<NoteCard note={mockNote} onDelete={vi.fn()} />)

    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('bg-yellow-200')
  })

  it('회전 각도가 올바르게 적용되어야 합니다', () => {
    const { container } = render(<NoteCard note={mockNote} onDelete={vi.fn()} />)

    const card = container.firstChild as HTMLElement
    expect(card).toHaveStyle({ transform: 'rotate(2deg)' })
  })

  it('다양한 메모 데이터로 올바르게 렌더링되어야 합니다', () => {
    const anotherNote: Note = {
      id: '2',
      text: '다른 메모 내용',
      date: '2024-02-02 15:30',
      color: 'bg-pink-200',
      rotation: -1.5,
    }

    render(<NoteCard note={anotherNote} onDelete={vi.fn()} />)

    expect(screen.getByText('다른 메모 내용')).toBeInTheDocument()
    expect(screen.getByText('2024-02-02 15:30')).toBeInTheDocument()
  })
})

