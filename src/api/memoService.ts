import apiClient from './axios'
import type { CreateMemoRequest, CreateMemoResponse, GetMemosResponse } from '@/types/memo'

// 메모 목록 조회
export const getMemos = async (): Promise<GetMemosResponse> => {
  const response = await apiClient.get<GetMemosResponse>('/memos')
  return response.data
}

// 메모 생성
export const createMemo = async (
  request: CreateMemoRequest
): Promise<CreateMemoResponse> => {
  const response = await apiClient.post<CreateMemoResponse>('/memos', request)
  return response.data
}

// 메모 삭제
export const deleteMemo = async (id: number): Promise<void> => {
  await apiClient.delete(`/memos/${id}`)
}
