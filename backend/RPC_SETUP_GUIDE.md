# Polygon RPC 설정 가이드

## 🚨 현재 상황

**Polygon Mumbai 테스트넷이 대부분의 Public RPC에서 지원 종료되었습니다.**

테스트 결과:
- ❌ **Ankr** - 403 Forbidden (API key 필요)
- ❌ **PublicNode** - 503 Deprecated  
- ❌ **Blast API** - 403 Shutdown (Alchemy로 이전 권장)

## ✅ 해결 방법

### Option 1: Polygon Amoy (새 테스트넷) 사용 🌟 권장

Polygon Mumbai는 deprecated 되었고, **Amoy가 새로운 공식 테스트넷**입니다.

#### 1-1. Alchemy로 Amoy 사용
1. [Alchemy](https://dashboard.alchemy.com/) 가입
2. 새 앱 생성: **Network = Polygon Amoy** 선택
3. API Key 복사
4. `.env` 파일 수정:
```bash
POLYGON_NETWORK=amoy
POLYGON_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_API_KEY
```

#### 1-2. Public RPC로 Amoy 사용
```bash
# .env 파일
POLYGON_NETWORK=amoy
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
```

**필요한 코드 수정:**
```typescript
// src/services/wallet.service.ts
constructor() {
    const rpcUrl = process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology';
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    // Amoy chainId = 80002
    this.chainId = process.env.POLYGON_NETWORK === 'mainnet' ? 137 : 80002;
}
```

### Option 2: Infura 사용

Alchemy 가입이 안 되면 Infura를 시도해보세요.

1. [Infura](https://infura.io/) 가입
2. 새 프로젝트 생성
3. Polygon Mumbai 또는 Amoy 선택
4. API Key 복사
5. `.env` 파일:
```bash
POLYGON_RPC_URL=https://polygon-mumbai.infura.io/v3/YOUR_PROJECT_ID
# 또는 Amoy:
POLYGON_RPC_URL=https://polygon-amoy.infura.io/v3/YOUR_PROJECT_ID
```

### Option 3: QuickNode 사용

1. [QuickNode](https://www.quicknode.com/) 무료 계정 생성
2. Polygon 엔드포인트 생성
3. HTTP URL 사용

### Option 4: 네트워크 연결 없이 개발

현재 **지갑 생성, 인증 기능은 완벽하게 작동**합니다!

RPC 연결 없이도 사용 가능한 기능:
- ✅ 지갑 생성 (`POST /api/wallet/create`)
- ✅ Web3 인증 (`GET /api/auth/nonce`, `POST /api/auth/verify`)
- ✅ 주소 검증 (`POST /api/wallet/validate`)

RPC 연결 필요한 기능:
- ⚠️ 잔액 조회
- ⚠️ 네트워크 정보
- ⚠️ 토큰 정보 조회
- ⚠️ 트랜잭션 전송

**프론트엔드 개발은 RPC 없이도 가능**합니다. 사spin용자의 MetaMask가 RPC를 처리하기 때문입니다.

## 🎯 권장: Polygon Amoy로 마이그레이션

Mumbai는 deprecated되었으므로, **Amoy로 전환**하는 것이 장기적으로 좋습니다.

변경 사항:
1. Chain ID: 80001 (Mumbai) → 80002 (Amoy)
2. RPC URL: Amoy 엔드포인트 사용
3. Faucet: https://faucet.polygon.technology/ 에서 Amoy 선택

## 📝 현재 프로젝트 상태

- ✅ 백엔드 API 완성
- ✅ Web3 인증 구현
- ✅ 지갑 생성 작동
- ⚠️ RPC 연결 필요 (Alchemy/Infura 가입 또는 Amoy로 전환)

어떤 옵션을 선택하시겠어요?
