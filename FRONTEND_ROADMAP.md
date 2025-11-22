# SEOchain 프론트엔드 개발 로드맵

## 📋 현재 상태

✅ **완료된 백엔드 API:**
- Web3 인증 (SIWE)
- 지갑 생성 및 조회
- 토큰 관리 (배포 준비 완료)
- Polygon Amoy 테스트넷 연결

## 🎯 프론트엔드 개발 목표

사용자가 Web3 지갑으로 로그인하고, 새 지갑을 생성하며, ERC-20 토큰을 발행할 수 있는 DApp 구축

---

## 📐 1단계: 기획 및 UI/UX 디자인

### 핵심 페이지 구성

```
SEOchain DApp
│
├── 홈/랜딩 페이지
│   ├── 프로젝트 소개
│   ├── "Connect Wallet" 버튼
│   └── 주요 기능 안내
│
├── 대시보드 (로그인 후)
│   ├── 연결된 지갑 정보 (주소, 잔액)
│   ├── 네트워크 정보
│   └── Quick Actions
│
├── 지갑 관리
│   ├── 새 지갑 생성
│   ├── 지갑 정보 조회
│   └── 잔액 확인
│
└── 토큰 발행
    ├── 토큰 배포 폼
    │   ├── 이름 (Name)
    │   ├── 심볼 (Symbol)
    │   └── 초기 공급량 (Initial Supply)
    ├── 토큰 민트
    └── 토큰 정보 조회
```

### 주요 기능 플로우

#### 1️⃣ Web3 로그인 플로우
```
사용자 → [Connect Wallet 클릭] 
      → MetaMask 팝업 
      → 주소 선택
      → [Sign Message] (SIWE)
      → 서명 완료
      → JWT 토큰 받기
      → 로그인 완료!
```

#### 2️⃣ 지갑 생성 플로우
```
사용자 → [Create New Wallet]
      → 백엔드 API 호출
      → 지갑 정보 표시 (주소, Private Key, Mnemonic)
      → "⚠️ 반드시 저장하세요!" 경고
      → 다운로드/복사 옵션
```

#### 3️⃣ 토큰 발행 플로우
```
사용자 → [Deploy Token] 탭
      → 폼 작성 (Name, Symbol, Supply)
      → [Deploy] 클릭
      → MetaMask 트랜잭션 확인
      → 배포 완료
      → 토큰 주소 표시
```

---

## 🛠️ 2단계: 기술 스택 선택

### 추천 스택 (Modern & Best Practice)

```javascript
{
  "프레임워크": "Next.js 14 (App Router) + TypeScript",
  "Web3 라이브러리": "wagmi v2 + viem",
  "지갑 연결": "RainbowKit 또는 ConnectKit",
  "UI 라이브러리": "shadcn/ui + Tailwind CSS",
  "상태 관리": "Zustand (간단) 또는 Redux Toolkit",
  "HTTP 클라이언트": "Axios 또는 Fetch API",
  "폼 관리": "React Hook Form + Zod"
}
```

### 대안 (더 간단한 스택)

```javascript
{
  "프레임워크": "Vite + React + TypeScript",
  "Web3": "ethers.js v6",
  "지갑": "MetaMask SDK",
  "UI": "Material-UI 또는 Ant Design",
  "상태": "Context API"
}
```

**권장: Next.js + wagmi + RainbowKit** 
- 최신 Web3 개발 표준
- 자동 지갑 연결 UI
- 타입 안전성

---

## 🚀 3단계: 프로젝트 초기화

### Option A: Next.js (권장)

```bash
# 프로젝트 생성
npx create-next-app@latest seochain-frontend --typescript --tailwind --app

cd seochain-frontend

# Web3 라이브러리 설치
npm install wagmi viem @tanstack/react-query
npm install @rainbow-me/rainbowkit

# UI 라이브러리
npx shadcn-ui@latest init

# 유틸리티
npm install axios react-hook-form zod @hookform/resolvers
npm install lucide-react # 아이콘
```

### Option B: Vite (가벼움)

```bash
# 프로젝트 생성
npm create vite@latest seochain-frontend -- --template react-ts

cd seochain-frontend
npm install

# Web3
npm install ethers

# UI
npm install @mui/material @emotion/react @emotion/styled
```

---

## 📝 4단계: 환경 설정

### `.env.local` 파일 생성

```bash
# 백엔드 API URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# Polygon Amoy Chain ID
NEXT_PUBLIC_CHAIN_ID=80002

# WalletConnect Project ID (RainbowKit 사용 시)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Alchemy API Key (선택사항)
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
```

---

## 💻 5단계: 핵심 컴포넌트 구현 순서

### Phase 1: 기본 설정 (1-2일)
- [x] 프로젝트 초기화
- [ ] Wagmi/RainbowKit 설정
- [ ] 레이아웃 및 네비게이션
- [ ] API 클라이언트 설정

### Phase 2: Web3 인증 (2-3일)
- [ ] Connect Wallet 버튼
- [ ] SIWE 인증 구현
- [ ] JWT 토큰 관리
- [ ] 로그인 상태 관리
- [ ] Protected Routes

### Phase 3: 지갑 기능 (2-3일)
- [ ] 지갑 정보 표시
- [ ] 잔액 조회
- [ ] 새 지갑 생성 UI
- [ ] 지갑 정보 다운로드

### Phase 4: 토큰 발행 (3-4일)
- [ ] 토큰 배포 폼
- [ ] 트랜잭션 처리
- [ ] 로딩 상태 관리
- [ ] 토큰 정보 조회

### Phase 5: UI/UX 개선 (2-3일)
- [ ] 반응형 디자인
- [ ] 로딩 스피너
- [ ] 에러 처리
- [ ] 알림 (Toasts)
- [ ] 다크 모드

---

## 🎨 6단계: UI 디자인 가이드라인

### 컬러 팔레트
```css
/* Primary - Polygon Purple */
--primary: #8247E5

/* Secondary - Green (성공) */
--success: #10B981

/* Background - 다크 모드 */
--bg-dark: #0F172A
--bg-card: #1E293B

/* Text */
--text-primary: #F1F5F9
--text-secondary: #94A3B8
```

### 주요 컴포넌트

1. **ConnectButton** - 지갑 연결 버튼
2. **WalletCard** - 지갑 정보 카드
3. **TokenForm** - 토큰 배포 폼
4. **TransactionStatus** - 트랜잭션 상태 표시
5. **NetworkBadge** - 네트워크 표시

---

## 📚 7단계: 코드 예시

### API 클라이언트 설정

```typescript
// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// JWT 토큰 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### SIWE 인증 훅

```typescript
// src/hooks/useSiweAuth.ts
import { useSignMessage, useAccount } from 'wagmi';
import { SiweMessage } from 'siwe';
import api from '@/lib/api';

export function useSiweAuth() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const login = async () => {
    if (!address) return;

    // 1. Nonce 받기
    const { data } = await api.get('/api/auth/nonce');
    const nonce = data.data.nonce;

    // 2. SIWE 메시지 생성
    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Sign in to SEOchain',
      uri: window.location.origin,
      version: '1',
      chainId: 80002,
      nonce,
    });

    // 3. 서명
    const signature = await signMessageAsync({
      message: message.prepareMessage(),
    });

    // 4. 서명 검증 및 JWT 받기
    const { data: authData } = await api.post('/api/auth/verify', {
      message: message.prepareMessage(),
      signature,
    });

    // 5. 토큰 저장
    localStorage.setItem('auth_token', authData.data.token);
    
    return authData.data;
  };

  return { login };
}
```

---

## ✅ 8단계: 개발 체크리스트

### 필수 기능
- [ ] MetaMask 연결
- [ ] SIWE 로그인
- [ ] 지갑 주소 표시
- [ ] 잔액 조회
- [ ] 새 지갑 생성
- [ ] 토큰 배포 (스마트 컨트랙트 필요)

### 선택 기능
- [ ] WalletConnect 지원
- [ ] 트랜잭션 히스토리
- [ ] 토큰 전송
- [ ] ENS 이름 표시
- [ ] Multi-chain 지원

---

## 🎯 다음 단계 추천 순서

### 🥇 우선순위 1: 빠른 프로토타입
1. **Vite + React로 시작** (빠름)
2. ethers.js로 MetaMask 연결
3. SIWE 로그인 구현
4. 지갑 정보 표시

**목표**: 2-3일 안에 작동하는 프로토타입

### 🥈 우선순위 2: 프로덕션 준비
1. **Next.js + wagmi 사용**
2. RainbowKit으로 지갑 UI
3. shadcn/ui로 디자인
4. 모든 기능 구현

**목표**: 1-2주 안에 완성도 높은 DApp

### 🥉 우선순위 3: 고급 기능
1. 데이터베이스 연동 (사용자 프로필)
2. 실시간 업데이트 (WebSocket)
3. Analytics
4. 배포 (Vercel/Netlify)

---

## 💡 추천 사항

**지금 바로 시작하려면:**

1. **Vite로 시작** - 가장 빠름, 학습 곡선 낮음
2. **ethers.js 사용** - 익숙하고 문서가 많음
3. **간단한 UI부터** - 기능 우선, 디자인은 나중에

**장기적으로 좋은 선택:**

1. **Next.js** - SEO, 서버 컴포넌트
2. **wagmi + viem** - 현대적, 타입 안전
3. **RainbowKit** - 전문적인 지갑 UI

---

## 📞 도움이 필요하면

1. **프로젝트 초기화** - 어떤 스택으로 시작할지 정하기
2. **Wagmi 설정** - 복잡할 수 있음
3. **SIWE 구현** - 서명 및 검증 로직
4. **UI 컴포넌트** - 디자인 및 구현

어떤 것부터 시작하시겠어요?

**제안:**
1. 🚀 **빠르게 시작**: Vite + React + ethers.js로 프로토타입
2. 🏗️ **제대로 시작**: Next.js + wagmi + RainbowKit으로 프로덕션급
3. 🎨 **디자인 먼저**: UI/UX를 Figma로 먼저 기획

어떤 방향이 좋을까요?
