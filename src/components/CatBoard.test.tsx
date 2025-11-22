import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { CatBoard } from './CatBoard'
import * as memoService from '@/api/memoService'
import type { Memo } from '@/types/memo'

// memoService 모킹
vi.mock('@/api/memoService', () => ({
  getMemos: vi.fn(),
  createMemo: vi.fn(),
  deleteMemo: vi.fn(),
}))

describe('CatBoard 통합 테스트', () => {
  const mockMemos: Memo[] = [
    {
      id: 1,
      content: '첫 번째 메모',
      createdAt: '2024-01-01T10:00:00Z',
    },
    {
      id: 2,
      content: '두 번째 메모',
      createdAt: '2024-01-02T11:00:00Z',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('로딩 중일 때 로딩 메시지를 표시해야 합니다', async () => {
    vi.mocked(memoService.getMemos).mockImplementation(
      () => new Promise(() => {}) // 무한 대기로 로딩 상태 유지
    )

    render(<CatBoard />)

    expect(screen.getByText('메모를 불러오는 중...')).toBeInTheDocument()
  })

  it('메모가 없을 때 EmptyState를 표시해야 합니다', async () => {
    vi.mocked(memoService.getMemos).mockResolvedValue([])

    render(<CatBoard />)

    await waitFor(() => {
      expect(screen.getByText('아직 메모가 없어요.')).toBeInTheDocument()
    })
  })

  it('메모 목록을 올바르게 표시해야 합니다', async () => {
    vi.mocked(memoService.getMemos).mockResolvedValue(mockMemos)

    render(<CatBoard />)

    await waitFor(() => {
      expect(screen.getByText('첫 번째 메모')).toBeInTheDocument()
      expect(screen.getByText('두 번째 메모')).toBeInTheDocument()
    })
  })

  it('새 메모를 추가할 수 있어야 합니다', async () => {
    const user = userEvent.setup()
    const newMemo: Memo = {
      id: 3,
      content: '새로운 메모',
      createdAt: new Date().toISOString(),
    }

    vi.mocked(memoService.getMemos).mockResolvedValue(mockMemos)
    vi.mocked(memoService.createMemo).mockResolvedValue(newMemo)

    render(<CatBoard />)

    // 메모 목록이 로드될 때까지 대기
    await waitFor(() => {
      expect(screen.getByText('첫 번째 메모')).toBeInTheDocument()
    })

    // 입력 필드 찾기
    const input = screen.getByPlaceholderText('오늘 할 일이나 떠오르는 생각을 적어 보세요...')
    expect(input).toBeInTheDocument()

    // 메모 입력
    await user.type(input, '새로운 메모')

    // 추가 버튼 찾기 및 클릭
    const addButton = screen.getByRole('button', { name: /add memo/i })
    await user.click(addButton)

    // createMemo가 호출되었는지 확인
    await waitFor(() => {
      expect(memoService.createMemo).toHaveBeenCalledWith({ content: '새로운 메모' })
    })
  })

  it('빈 내용으로는 메모를 추가할 수 없어야 합니다', async () => {
    const user = userEvent.setup()

    vi.mocked(memoService.getMemos).mockResolvedValue(mockMemos)

    render(<CatBoard />)

    await waitFor(() => {
      expect(screen.getByText('첫 번째 메모')).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText('오늘 할 일이나 떠오르는 생각을 적어 보세요...')
    const addButton = screen.getByRole('button', { name: /add memo/i })

    // 빈 입력으로 버튼 클릭 시도
    expect(addButton).toBeDisabled()

    // 공백만 입력
    await user.type(input, '   ')
    expect(addButton).toBeDisabled()

    // createMemo가 호출되지 않아야 함
    expect(memoService.createMemo).not.toHaveBeenCalled()
  })

  it('메모를 삭제할 수 있어야 합니다', async () => {
    const user = userEvent.setup()

    vi.mocked(memoService.getMemos).mockResolvedValue(mockMemos)
    vi.mocked(memoService.deleteMemo).mockResolvedValue(undefined)

    render(<CatBoard />)

    // 메모 목록이 로드될 때까지 대기
    await waitFor(() => {
      expect(screen.getByText('첫 번째 메모')).toBeInTheDocument()
    })

    // 첫 번째 메모 카드의 삭제 버튼 찾기
    const deleteButtons = screen.getAllByLabelText('Delete note')
    expect(deleteButtons.length).toBeGreaterThan(0)

    // 첫 번째 삭제 버튼 클릭
    await user.click(deleteButtons[0])

    // deleteMemo가 호출되었는지 확인
    await waitFor(() => {
      expect(memoService.deleteMemo).toHaveBeenCalledWith(1)
    })
  })

  it('에러 발생 시 에러 메시지를 표시해야 합니다', async () => {
    vi.mocked(memoService.getMemos).mockRejectedValue(new Error('Network error'))

    render(<CatBoard />)

    await waitFor(() => {
      expect(screen.getByText('서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인해주세요.')).toBeInTheDocument()
    })
  })

  it('헤더에 Softbank Board 제목을 표시해야 합니다', async () => {
    vi.mocked(memoService.getMemos).mockResolvedValue(mockMemos)

    render(<CatBoard />)

    await waitFor(() => {
      expect(screen.getByText('Softbank Board')).toBeInTheDocument()
    })
  })

  it('입력 필드와 추가 버튼이 올바르게 렌더링되어야 합니다', async () => {
    vi.mocked(memoService.getMemos).mockResolvedValue(mockMemos)

    render(<CatBoard />)

    await waitFor(() => {
      const input = screen.getByPlaceholderText('오늘 할 일이나 떠오르는 생각을 적어 보세요...')
      const addButton = screen.getByRole('button', { name: /add memo/i })

      expect(input).toBeInTheDocument()
      expect(addButton).toBeInTheDocument()
    })
  })
})

