# Cat Board Frontend 

React + TypeScript + Vite 기반의 메모 보드 애플리케이션입니다.

## 기술 스택

- **Framework**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: TanStack React Query
- **HTTP Client**: Axios

## 시작하기

### 개발 환경

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 환경 변수

`.env.example`을 참고하여 `.env` 파일을 생성하세요.

```
VITE_API_BASE_URL=http://localhost:8080/api
```

## Docker

멀티스테이지 빌드를 사용하여 최적화된 프로덕션 이미지를 생성합니다.

```bash
# 이미지 빌드
docker build -t cat-board-frontend .

# 컨테이너 실행 (포트 3000)
docker run -p 3000:3000 cat-board-frontend
```

## 프로젝트 구조

```
src/
├── api/          # API 서비스 레이어
├── assets/       # 정적 리소스
├── components/   # React 컴포넌트
├── hooks/        # 커스텀 훅
├── lib/          # 유틸리티 함수
├── types/        # TypeScript 타입 정의
├── App.tsx       # 루트 컴포넌트
└── main.tsx      # 엔트리 포인트
```

## CI/CD

GitHub Actions를 통한 자동 배포 파이프라인:

1. **Test & SAST**: 테스트 실행 및 Snyk 보안 스캔
2. **Build**: Docker 멀티스테이지 빌드 및 ECR 푸시

### 필요한 Secrets

| Secret | 설명 |
|--------|------|
| `AWS_ACCESS_KEY` | AWS 액세스 키 |
| `AWS_SECRET_KEY` | AWS 시크릿 키 |
| `SNYK_TOKEN` | Snyk 인증 토큰 |
| `CICD_WEBHOOK` | 배포 웹훅 URL |
