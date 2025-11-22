import { describe, it, expect } from 'vitest'
import { render, screen } from '../utils'
import { EmptyState } from '@/components/EmptyState'

describe('EmptyState', () => {
  it('should render empty state message correctly', () => {
    render(<EmptyState />)

    // 메시지가 정확히 표시되는지 확인
    expect(screen.getByText('아직 메모가 없어요.')).toBeInTheDocument()
    expect(screen.getByText('첫 메모를 남겨 보세요!')).toBeInTheDocument()
  })

  it('should display emoji icon', () => {
    render(<EmptyState />)

    // 이모지가 포함된 요소 찾기
    const emojiElement = screen.getByText('🐾')
    expect(emojiElement).toBeInTheDocument()
  })

  it('should have correct structure', () => {
    const { container } = render(<EmptyState />)

    // 구조 확인
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center')
  })
})

