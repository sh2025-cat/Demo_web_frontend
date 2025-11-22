import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('메모가 없을 때 표시되는 메시지를 렌더링해야 합니다', () => {
    render(<EmptyState />)

    expect(screen.getByText('아직 메모가 없어요.')).toBeInTheDocument()
    expect(screen.getByText('첫 메모를 남겨 보세요!')).toBeInTheDocument()
  })

  it('이모지 아이콘을 표시해야 합니다', () => {
    render(<EmptyState />)

    const emoji = screen.getByText('🐾')
    expect(emoji).toBeInTheDocument()
  })

  it('올바른 클래스명을 가진 컨테이너를 렌더링해야 합니다', () => {
    const { container } = render(<EmptyState />)

    const mainDiv = container.firstChild as HTMLElement
    expect(mainDiv).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center')
  })
})

