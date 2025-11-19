import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMemos, createMemo, deleteMemo } from '@/api/memoService'
import type { CreateMemoRequest } from '@/types/memo'

// 메모 목록 조회
export const useMemos = () => {
  return useQuery({
    queryKey: ['memos'],
    queryFn: getMemos,
  })
}

// 메모 생성
export const useCreateMemo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateMemoRequest) => createMemo(request),
    onSuccess: () => {
      // 메모 생성 후 목록 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ['memos'] })
    },
  })
}

// 메모 삭제
export const useDeleteMemo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteMemo(id),
    onSuccess: () => {
      // 메모 삭제 후 목록 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ['memos'] })
    },
  })
}
