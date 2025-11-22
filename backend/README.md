# SEOchain Backend - Quick Start Guide

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
cd backend
npm install
```

### 2. 환경 변수 설정
```bash
# .env.example을 .env로 복사
cp .env.example .env

# .env 파일을 열어서 다음 값들을 설정하세요:
# - JWT_SECRET: 강력한 비밀키
# - POLYGON_RPC_URL: Alchemy 또는 Infura RPC URL
```

### 3. RPC URL 받기 (필수)

#### Alchemy (권장)
1. https://www.alchemy.com 가입
2. "Create App" 클릭
3. Network: Polygon Mumbai 선택
4. API Key 복사
5. `.env`에 설정:
   ```
   POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR-API-KEY
   ```

#### 또는 Public RPC (테스트용)
```
POLYGON_RPC_URL=https://rpc.ankr.com/polygon_mumbai
```

### 4. 서버 실행
```bash
# 개발 모드 (hot reload)
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

### 5. API 테스트
```bash
# Health Check
curl http://localhost:3000/health

# 지갑 생성
curl -X POST http://localhost:3000/api/wallet/create

# Nonce 생성 (Web3 로그인용)
curl http://localhost:3000/api/auth/nonce
```

## 📚 API 문서

전체 API 문서는 [walkthrough.md](walkthrough.md) 참조

## 🔗 유용한 링크

- [Polygon Faucet](https://faucet.polygon.technology/) - 테스트 MATIC 받기
- [Alchemy Dashboard](https://dashboard.alchemy.com/) - API 키 관리
- [Polygon Mumbai Explorer](https://mumbai.polygonscan.com/) - 트랜잭션 확인
