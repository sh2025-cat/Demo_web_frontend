import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../utils'
import userEvent from '@testing-library/user-event'
import { CatBoard } from '@/components/CatBoard'
import * as useMemosHook from '@/hooks/useMemos'
import type { Memo } from '@/types/memo'

// hooks 모킹
vi.mock('@/hooks/useMemos')
vi.mock('@/assets/Softbank_mobile_logo.svg', () => ({
  default: '/mock-logo.svg',
}))

const mockMemos: Memo[] = [
  {
    id: 1,
    content: '첫 번째 메모',
    createdAt: '2024-01-01T12:00:00Z',
  },
  {
    id: 2,
    content: '두 번째 메모',
    createdAt: '2024-01-02T14:30:00Z',
  },
]

describe('CatBoard', () => {
  const mockUseMemos = vi.fn()
  const mockUseCreateMemo = vi.fn()
  const mockUseDeleteMemo = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // 기본 모킹 설정
    mockUseMemos.mockReturnValue({
      data: mockMemos,
      isLoading: false,
      error: null,
    })

    mockUseCreateMemo.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    })

    mockUseDeleteMemo.mockReturnValue({
      mutate: vi.fn(),
    })

    vi.mocked(useMemosHook.useMemos).mockImplementation(mockUseMemos)
    vi.mocked(useMemosHook.useCreateMemo).mockImplementation(() => mockUseCreateMemo())
    vi.mocked(useMemosHook.useDeleteMemo).mockImplementation(() => mockUseDeleteMemo())
  })

  it('should render header with logo and title', () => {
    render(<CatBoard />)

    expect(screen.getByText('Softbank Board')).toBeInTheDocument()
    expect(screen.getByAltText('Softbank Logo')).toBeInTheDocument()
  })

  it('should render input field with placeholder', () => {
    render(<CatBoard />)

    const input = screen.getByPlaceholderText('오늘 할 일이나 떠오르는 생각을 적어 보세요...')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })

  it('should render Add Memo button', () => {
    render(<CatBoard />)

    const addButton = screen.getByRole('button', { name: /Add Memo/i })
    expect(addButton).toBeInTheDocument()
  })

  it('should display memos when data is loaded', () => {
    render(<CatBoard />)

    expect(screen.getByText('첫 번째 메모')).toBeInTheDocument()
    expect(screen.getByText('두 번째 메모')).toBeInTheDocument()
  })

  it('should show loading state', () => {
    mockUseMemos.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    })

    render(<CatBoard />)

    expect(screen.getByText('메모를 불러오는 중...')).toBeInTheDocument()
  })

  it('should show empty state when no memos', () => {
    mockUseMemos.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    })

    render(<CatBoard />)

    expect(screen.getByText('아직 메모가 없어요.')).toBeInTheDocument()
  })

  it('should show empty state when error occurs', () => {
    mockUseMemos.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network error'),
    })

    render(<CatBoard />)

    expect(screen.getByText('서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인해주세요.')).toBeInTheDocument()
    expect(screen.getByText('아직 메모가 없어요.')).toBeInTheDocument()
  })

  it('should update input value when typing', async () => {
    const user = userEvent.setup()
    render(<CatBoard />)

    const input = screen.getByPlaceholderText('오늘 할 일이나 떠오르는 생각을 적어 보세요...') as HTMLInputElement

    await user.type(input, '새로운 메모')

    expect(input.value).toBe('새로운 메모')
  })

  it('should call createMemo mutation when form is submitted', async () => {
    const user = userEvent.setup()
    const mockMutate = vi.fn()

    mockUseCreateMemo.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    })

    render(<CatBoard />)

    const input = screen.getByPlaceholderText('오늘 할 일이나 떠오르는 생각을 적어 보세요...')
    const addButton = screen.getByRole('button', { name: /Add Memo/i })

    await user.type(input, '새로운 메모')
    await user.click(addButton)

    expect(mockMutate).toHaveBeenCalledWith(
      { content: '새로운 메모' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      })
    )
  })

  it('should disable submit button when input is empty', () => {
    render(<CatBoard />)

    const addButton = screen.getByRole('button', { name: /Add Memo/i })
    expect(addButton).toBeDisabled()
  })

  it('should disable submit button when only whitespace is entered', async () => {
    const user = userEvent.setup()
    render(<CatBoard />)

    const input = screen.getByPlaceholderText('오늘 할 일이나 떠오르는 생각을 적어 보세요...')
    const addButton = screen.getByRole('button', { name: /Add Memo/i })

    await user.type(input, '   ')

    expect(addButton).toBeDisabled()
  })

  it('should show pending state when creating memo', () => {
    mockUseCreateMemo.mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    })

    render(<CatBoard />)

    const addButton = screen.getByRole('button', { name: /추가 중.../i })
    expect(addButton).toBeInTheDocument()
    expect(addButton).toBeDisabled()
  })

  it('should call deleteMemo mutation when delete button is clicked', async () => {
    const user = userEvent.setup()
    const mockDeleteMutate = vi.fn()

    mockUseDeleteMemo.mockReturnValue({
      mutate: mockDeleteMutate,
    })

    render(<CatBoard />)

    // NoteCard의 delete 버튼 찾기
    const deleteButtons = screen.getAllByLabelText('Delete note')
    expect(deleteButtons.length).toBeGreaterThan(0)

    await user.click(deleteButtons[0])

    expect(mockDeleteMutate).toHaveBeenCalledWith(1)
  })

  it('should not submit form with empty input', async () => {
    const user = userEvent.setup()
    const mockMutate = vi.fn()

    mockUseCreateMemo.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    })

    render(<CatBoard />)

    const input = screen.getByPlaceholderText('오늘 할 일이나 떠오르는 생각을 적어 보세요...')
    const form = input.closest('form')

    await user.click(form!)

    expect(mockMutate).not.toHaveBeenCalled()
  })
})

