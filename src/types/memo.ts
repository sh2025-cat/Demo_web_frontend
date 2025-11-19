// Memo API 타입 정의
export interface Memo {
  id: number
  content: string
  createdAt: string
}

// 메모 생성 요청
export interface CreateMemoRequest {
  content: string
}

// 메모 생성 응답
export interface CreateMemoResponse extends Memo {}

// 메모 목록 조회 응답
export type GetMemosResponse = Memo[]

// UI에서 사용할 Note 타입 (V0 컴포넌트 호환)
export interface Note {
  id: string
  text: string
  date: string
  color: string
  rotation: number
}

// Memo를 Note로 변환하는 헬퍼
export const memoToNote = (memo: Memo): Note => ({
  id: memo.id.toString(),
  text: memo.content,
  date: new Date(memo.createdAt).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }),
  color: getColorByMemoId(memo.id),
  rotation: getRotationByMemoId(memo.id),
})

const PASTEL_COLORS = [
  "bg-yellow-200",
  "bg-pink-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-purple-200",
  "bg-orange-200",
]

// 메모 ID를 기반으로 일관된 색상 반환
const getColorByMemoId = (id: number): string => {
  return PASTEL_COLORS[id % PASTEL_COLORS.length]
}

// 메모 ID를 기반으로 일관된 회전 각도 반환 (-3도 ~ +3도)
const getRotationByMemoId = (id: number): number => {
  // ID를 시드로 사용하여 일관된 난수 생성
  const seed = id * 9301 + 49297
  const randomValue = (seed % 233280) / 233280
  return randomValue * 6 - 3
}
