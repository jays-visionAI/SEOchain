# Web3 프로젝트 상세 아키텍처 설계

> [!IMPORTANT]
> 본 문서는 폴리곤 기반 Web3 서비스, 자체 메인넷 개발, 그리고 하이브리드 접근 방식에 대한 포괄적인 기술 아키텍처를 다룹니다.

---

## 📊 목차

1. [시스템 개요](#시스템-개요)
2. [아키텍처 옵션 비교](#아키텍처-옵션-비교)
3. [Option 1: 폴리곤 기반 아키텍처](#option-1-폴리곤-기반-아키텍처)
4. [Option 2: 자체 메인넷 아키텍처](#option-2-자체-메인넷-아키텍처)
5. [Option 3: 하이브리드 아키텍처](#option-3-하이브리드-아키텍처)
6. [구현 로드맵](#구현-로드맵)
7. [비용 및 리소스 분석](#비용-및-리소스-분석)

---

## 시스템 개요

### 핵심 요구사항

1. **폴리곤 기반 지갑 생성 및 관리**
2. **Web3 로그인 기능**
3. **자체 메인넷 개발 (선택적)**
4. **블록체인 노드 구성**
5. **토큰 발행 서비스**

### 전체 시스템 다이어그램

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Web DApp] --> B[Wallet Integration]
        A --> C[Web3 Authentication]
    end
    
    subgraph "Backend Layer"
        D[API Server] --> E[Authentication Service]
        D --> F[Token Service]
        D --> G[Blockchain Service]
    end
    
    subgraph "Blockchain Layer - Option 1"
        H[Polygon Network]
        I[Smart Contracts]
        H --> I
    end
    
    subgraph "Blockchain Layer - Option 2"
        J[Custom Mainnet]
        K[Validator Nodes]
        L[Native Token]
        J --> K
        J --> L
    end
    
    B --> H
    B --> J
    G --> H
    G --> J
```

---

## 아키텍처 옵션 비교

| 측면 | Option 1: Polygon | Option 2: Custom Mainnet | Option 3: Hybrid |
|------|-------------------|--------------------------|------------------|
| **개발 기간** | 2-3개월 | 12-18개월 | 6-9개월 |
| **기술 복잡도** | 중간 | 매우 높음 | 높음 |
| **초기 비용** | $10K-50K | $500K-2M | $100K-500K |
| **운영 비용/월** | $1K-5K | $50K-200K | $10K-50K |
| **확장성** | 높음 (Polygon 인프라) | 완전 제어 가능 | 높음 |
| **보안** | 검증됨 | 자체 책임 | 검증됨 + 자체 |
| **팀 규모** | 3-5명 | 15-30명 | 8-15명 |
| **권장 사용** | MVP, 빠른 출시 | 장기 프로젝트, 특수 요구사항 | 점진적 확장 |

---

## Option 1: 폴리곤 기반 아키텍처

> [!TIP]
> MVP 개발과 빠른 시장 진출에 최적화된 접근 방식입니다.

### 1.1 시스템 아키텍처

```mermaid
graph LR
    subgraph "Client Side"
        A[React DApp] --> B[ethers.js/web3.js]
        B --> C[MetaMask/WalletConnect]
    end
    
    subgraph "Backend Services"
        D[Node.js API] --> E[SIWE Auth]
        D --> F[Database]
        D --> G[IPFS/Arweave]
    end
    
    subgraph "Polygon Network"
        H[Polygon PoS] --> I[Smart Contracts]
        I --> J[ERC-20 Token]
        I --> K[NFT Contracts]
        I --> L[Custom Logic]
    end
    
    C --> H
    D --> H
```

### 1.2 기술 스택

#### Frontend
```javascript
{
  "framework": "React 18 + TypeScript",
  "web3": "ethers.js v6 또는 viem",
  "wallet": "WalletConnect v2 + MetaMask SDK",
  "ui": "wagmi + RainbowKit (지갑 UI)",
  "state": "Zustand 또는 Redux Toolkit"
}
```

#### Backend
```javascript
{
  "runtime": "Node.js 20 LTS",
  "framework": "Express.js 또는 Fastify",
  "auth": "SIWE (Sign-In with Ethereum)",
  "database": "PostgreSQL + Prisma ORM",
  "cache": "Redis",
  "storage": "IPFS (Pinata/web3.storage)"
}
```

#### Smart Contracts
```solidity
{
  "language": "Solidity 0.8.20+",
  "framework": "Hardhat 또는 Foundry",
  "standards": "OpenZeppelin Contracts",
  "testing": "Hardhat-Chai + Foundry Tests",
  "deployment": "Defender (OpenZeppelin)"
}
```

### 1.3 핵심 컴포넌트 설계

#### A. Web3 지갑 연동

```typescript
// wallet-service.ts
import { ethers } from 'ethers';
import { WalletClient } from 'viem';

class PolygonWalletService {
  private provider: ethers.Provider;
  
  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      'https://polygon-rpc.com'
    );
  }
  
  async connectWallet(): Promise<string> {
    // MetaMask 연동
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      // Polygon 네트워크로 전환
      await this.switchToPolygon();
      
      return accounts[0];
    }
    throw new Error('MetaMask not installed');
  }
  
  async switchToPolygon(): Promise<void> {
    const polygonNetwork = {
      chainId: '0x89', // 137 in hex
      chainName: 'Polygon Mainnet',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18
      },
      rpcUrls: ['https://polygon-rpc.com'],
      blockExplorerUrls: ['https://polygonscan.com']
    };
    
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [polygonNetwork]
    });
  }
  
  async createWallet(): Promise<{address: string, privateKey: string}> {
    // 새 지갑 생성 (서버 사이드에서만 사용)
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey
    };
  }
}
```

#### B. Web3 인증 (SIWE)

```typescript
// auth-service.ts
import { SiweMessage } from 'siwe';
import { ethers } from 'ethers';

class Web3AuthService {
  async generateNonce(): Promise<string> {
    return ethers.hexlify(ethers.randomBytes(16));
  }
  
  async createSiweMessage(
    address: string,
    statement: string,
    nonce: string
  ): Promise<string> {
    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement,
      uri: window.location.origin,
      version: '1',
      chainId: 137, // Polygon
      nonce,
      issuedAt: new Date().toISOString()
    });
    
    return message.prepareMessage();
  }
  
  async verifySignature(
    message: string,
    signature: string
  ): Promise<boolean> {
    try {
      const siweMessage = new SiweMessage(message);
      const result = await siweMessage.verify({ signature });
      return result.success;
    } catch (error) {
      return false;
    }
  }
  
  async login(address: string, signature: string): Promise<string> {
    // 서명 검증 후 JWT 토큰 발급
    if (await this.verifySignature(message, signature)) {
      return this.generateJWT(address);
    }
    throw new Error('Invalid signature');
  }
}
```

#### C. 토큰 스마트 컨트랙트

```solidity
// MyToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract MyToken is ERC20, ERC20Burnable, Ownable, Pausable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 10억 토큰
    
    mapping(address => bool) public blacklisted;
    
    event TokensMinted(address indexed to, uint256 amount);
    event AddressBlacklisted(address indexed account);
    event AddressWhitelisted(address indexed account);
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        require(initialSupply <= MAX_SUPPLY, "Exceeds max supply");
        _mint(msg.sender, initialSupply);
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    function pause() public onlyOwner {
        _pause();
    }
    
    function unpause() public onlyOwner {
        _unpause();
    }
    
    function blacklist(address account) public onlyOwner {
        blacklisted[account] = true;
        emit AddressBlacklisted(account);
    }
    
    function whitelist(address account) public onlyOwner {
        blacklisted[account] = false;
        emit AddressWhitelisted(account);
    }
    
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        require(!blacklisted[from], "Sender is blacklisted");
        require(!blacklisted[to], "Recipient is blacklisted");
        super._update(from, to, amount);
    }
}
```

#### D. 토큰 발행 서비스

```typescript
// token-issuance-service.ts
import { ethers } from 'ethers';
import MyTokenABI from './abis/MyToken.json';

interface TokenConfig {
  name: string;
  symbol: string;
  initialSupply: string;
  decimals: number;
}

class TokenIssuanceService {
  private provider: ethers.Provider;
  private wallet: ethers.Wallet;
  
  constructor(privateKey: string) {
    this.provider = new ethers.JsonRpcProvider(
      process.env.POLYGON_RPC_URL
    );
    this.wallet = new ethers.Wallet(privateKey, this.provider);
  }
  
  async deployToken(config: TokenConfig): Promise<string> {
    // 컨트랙트 팩토리 생성
    const factory = new ethers.ContractFactory(
      MyTokenABI.abi,
      MyTokenABI.bytecode,
      this.wallet
    );
    
    // 토큰 배포
    const initialSupply = ethers.parseUnits(
      config.initialSupply,
      config.decimals
    );
    
    const contract = await factory.deploy(
      config.name,
      config.symbol,
      initialSupply
    );
    
    await contract.waitForDeployment();
    const address = await contract.getAddress();
    
    console.log(`Token deployed at: ${address}`);
    return address;
  }
  
  async mintTokens(
    tokenAddress: string,
    recipient: string,
    amount: string
  ): Promise<string> {
    const contract = new ethers.Contract(
      tokenAddress,
      MyTokenABI.abi,
      this.wallet
    );
    
    const tx = await contract.mint(
      recipient,
      ethers.parseUnits(amount, 18)
    );
    
    const receipt = await tx.wait();
    return receipt.hash;
  }
  
  async getTokenInfo(tokenAddress: string) {
    const contract = new ethers.Contract(
      tokenAddress,
      MyTokenABI.abi,
      this.provider
    );
    
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply()
    ]);
    
    return {
      name,
      symbol,
      decimals,
      totalSupply: ethers.formatUnits(totalSupply, decimals)
    };
  }
}
```

### 1.4 인프라 구성

```yaml
# docker-compose.yml
version: '3.8'

services:
  # API 서버
  api:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/web3db
      - REDIS_URL=redis://redis:6379
      - POLYGON_RPC_URL=https://polygon-rpc.com
      - PRIVATE_KEY=${DEPLOYER_PRIVATE_KEY}
    depends_on:
      - postgres
      - redis
  
  # PostgreSQL 데이터베이스
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=web3db
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  # Redis 캐시
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
  
  # Frontend (개발 환경)
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:3000

volumes:
  postgres_data:
  redis_data:
```

### 1.5 보안 고려사항

> [!CAUTION]
> Private Key는 절대 클라이언트 사이드에 노출되어서는 안 됩니다.

- **Private Key 관리**: AWS KMS, HashiCorp Vault 사용
- **Rate Limiting**: API 요청 제한
- **스마트 컨트랙트 감사**: CertiK, OpenZeppelin 등을 통한 감사
- **Multisig 지갑**: Gnosis Safe를 통한 다중 서명 관리
- **모니터링**: Tenderly, Defender로 트랜잭션 모니터링

---

## Option 2: 자체 메인넷 아키텍처

> [!WARNING]
> 자체 메인넷 개발은 매우 복잡하고 높은 기술력과 리소스가 필요합니다.

### 2.1 시스템 아키텍처

```mermaid
graph TB
    subgraph "Application Layer"
        A[DApp] --> B[Custom Wallet]
        A --> C[Block Explorer]
    end
    
    subgraph "RPC Layer"
        D[JSON-RPC Server] --> E[Node Manager]
    end
    
    subgraph "Consensus Layer"
        F[Validator Node 1] --> G[Consensus Engine]
        H[Validator Node 2] --> G
        I[Validator Node 3] --> G
        G --> J[Tendermint/PoS]
    end
    
    subgraph "Execution Layer"
        K[EVM Compatible] --> L[State Machine]
        K --> M[Transaction Pool]
    end
    
    subgraph "Storage Layer"
        N[LevelDB/RocksDB] --> O[State DB]
        N --> P[Block DB]
    end
    
    D --> F
    D --> H
    D --> I
    G --> K
    K --> N
```

### 2.2 기술 스택 선택

#### Option A: Cosmos SDK 기반

```go
// app.go - Cosmos SDK 기반 체인
package app

import (
    "github.com/cosmos/cosmos-sdk/baseapp"
    "github.com/cosmos/cosmos-sdk/types/module"
    "github.com/cosmos/cosmos-sdk/x/auth"
    "github.com/cosmos/cosmos-sdk/x/bank"
    "github.com/cosmos/cosmos-sdk/x/staking"
    // ... 기타 모듈
)

type CustomChain struct {
    *baseapp.BaseApp
    cdc               *codec.LegacyAmino
    appCodec          codec.Codec
    interfaceRegistry types.InterfaceRegistry
    
    // 모듈 키퍼
    AccountKeeper     authkeeper.AccountKeeper
    BankKeeper        bankkeeper.Keeper
    StakingKeeper     stakingkeeper.Keeper
    // ... 커스텀 모듈
}

func NewCustomChain() *CustomChain {
    // 체인 초기화 로직
    // ...
}
```

**장점**:
- IBC (Inter-Blockchain Communication) 지원
- 검증된 Tendermint 합의 알고리즘
- 빠른 최종성 (1-3초)
- 모듈러 아키텍처

**단점**:
- EVM 호환성 별도 구현 필요 (Ethermint 사용)
- Solidity보다는 CosmWasm 사용

#### Option B: Polygon Edge (권장)

```yaml
# genesis.json
{
  "name": "CustomChain",
  "genesis": {
    "chainId": 12345,
    "difficulty": "0x1",
    "gasLimit": "0x1312D00",
    "alloc": {
      "0x...": {
        "balance": "1000000000000000000000"
      }
    }
  },
  "params": {
    "engine": {
      "type": "ibft",
      "ibft": {
        "epochSize": 100000,
        "blockTime": 2
      }
    }
  }
}
```

**장점**:
- EVM 완전 호환
- Polygon 생태계 통합
- 기존 Ethereum 도구 사용 가능
- 빠른 블록 생성 (2초)

**단점**:
- 상대적으로 새로운 프레임워크
- Cosmos SDK보다 적은 커뮤니티

#### Option C: Substrate (Polkadot)

```rust
// runtime/lib.rs
#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
    construct_runtime, parameter_types,
    traits::{Currency, Randomness},
};
use sp_runtime::{
    create_runtime_str, generic, impl_opaque_keys,
    traits::{BlakeTwo256, Block as BlockT, IdentityLookup},
};

pub type BlockNumber = u32;
pub type Balance = u128;

construct_runtime!(
    pub enum Runtime where
        Block = Block,
        NodeBlock = opaque::Block,
        UncheckedExtrinsic = UncheckedExtrinsic
    {
        System: frame_system,
        Balances: pallet_balances,
        TransactionPayment: pallet_transaction_payment,
        // 커스텀 팔렛
        CustomToken: pallet_custom_token,
    }
);
```

**장점**:
- 가장 유연한 커스터마이징
- Polkadot 생태계 접근
- WebAssembly 기반 (업그레이드 용이)

**단점**:
- 가장 높은 학습 곡선
- Rust 전문성 필요
- EVM 호환성 별도 구현

### 2.3 추천: Polygon Edge로 시작

```bash
# Polygon Edge 설치
wget https://github.com/0xPolygon/polygon-edge/releases/download/v1.0.0/polygon-edge

# Genesis 파일 생성
polygon-edge genesis \
  --consensus ibft \
  --ibft-validator-prefixes-path ./validators \
  --bootnode /ip4/127.0.0.1/tcp/10001/p2p/<node-id> \
  --premine 0x<your-address>:1000000000000000000000

# 검증자 노드 시작
polygon-edge server \
  --data-dir ./data \
  --chain genesis.json \
  --libp2p 0.0.0.0:10001 \
  --jsonrpc 0.0.0.0:8545 \
  --grpc 0.0.0.0:9632 \
  --seal
```

### 2.4 노드 인프라 구성

```yaml
# kubernetes/validator-node.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: validator-node
spec:
  serviceName: validator
  replicas: 4  # 최소 4개의 검증자
  selector:
    matchLabels:
      app: validator
  template:
    metadata:
      labels:
        app: validator
    spec:
      containers:
      - name: polygon-edge
        image: custom-chain:latest
        ports:
        - containerPort: 8545  # JSON-RPC
        - containerPort: 10001 # P2P
        - containerPort: 9632  # gRPC
        volumeMounts:
        - name: data
          mountPath: /data
        resources:
          requests:
            memory: "8Gi"
            cpu: "4"
          limits:
            memory: "16Gi"
            cpu: "8"
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 500Gi  # SSD 필수
```

### 2.5 네트워크 토폴로지

```
┌─────────────────────────────────────────────────────────┐
│                    Public Internet                       │
└────────────┬────────────────────────────────────────────┘
             │
    ┌────────▼────────┐
    │  Load Balancer  │
    │   (RPC Nodes)   │
    └────────┬────────┘
             │
    ┌────────▼────────────────────────┐
    │         RPC Layer                │
    │  ┌─────┐  ┌─────┐  ┌─────┐     │
    │  │RPC-1│  │RPC-2│  │RPC-3│     │
    │  └──┬──┘  └──┬──┘  └──┬──┘     │
    └─────┼────────┼────────┼─────────┘
          │        │        │
    ┌─────▼────────▼────────▼─────────┐
    │      Validator Network           │
    │  ┌─────┐  ┌─────┐  ┌─────┐     │
    │  │Val-1│◄─┤Val-2│─►│Val-3│     │
    │  └─────┘  └──┬──┘  └─────┘     │
    │             │                    │
    │          ┌──▼──┐                │
    │          │Val-4│                │
    │          └─────┘                │
    └──────────────────────────────────┘
```

### 2.6 커스텀 지갑 개발

```typescript
// custom-wallet/src/wallet.ts
import { HDNode, Wallet } from 'ethers';
import * as bip39 from 'bip39';

class CustomChainWallet {
  private wallet: Wallet;
  private chainId: number = 12345; // 커스텀 체인 ID
  
  async createWallet(password: string): Promise<{
    address: string;
    mnemonic: string;
    encrypted: string;
  }> {
    // BIP-39 니모닉 생성
    const mnemonic = bip39.generateMnemonic();
    const hdNode = HDNode.fromMnemonic(mnemonic);
    const wallet = new Wallet(hdNode.privateKey);
    
    // 지갑 암호화
    const encrypted = await wallet.encrypt(password);
    
    return {
      address: wallet.address,
      mnemonic,
      encrypted
    };
  }
  
  async connect(rpcUrl: string): Promise<void> {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = this.wallet.connect(provider);
    
    // 커스텀 체인 ID 확인
    const network = await provider.getNetwork();
    if (network.chainId !== BigInt(this.chainId)) {
      throw new Error('Wrong network');
    }
  }
  
  async sendTransaction(to: string, amount: string): Promise<string> {
    const tx = await this.wallet.sendTransaction({
      to,
      value: ethers.parseEther(amount),
      chainId: this.chainId
    });
    
    const receipt = await tx.wait();
    return receipt.hash;
  }
}
```

### 2.7 블록 익스플로러

```javascript
// blockscout 사용 (오픈소스)
version: '3.8'

services:
  blockscout:
    image: blockscout/blockscout:latest
    environment:
      - DATABASE_URL=postgresql://postgres:@postgres:5432/blockscout
      - ETHEREUM_JSONRPC_VARIANT=geth
      - ETHEREUM_JSONRPC_HTTP_URL=http://rpc-node:8545
      - CHAIN_ID=12345
      - SUBNETWORK=CustomChain Mainnet
    ports:
      - "4000:4000"
    depends_on:
      - postgres
  
  postgres:
    image: postgres:14
    environment:
      - POSTGRES_DB=blockscout
      - POSTGRES_HOST_AUTH_METHOD=trust
```

### 2.8 토큰 이코노미 설계

```solidity
// NativeToken.sol - 네이티브 토큰 래핑
pragma solidity ^0.8.20;

contract WrappedNativeToken is ERC20 {
    event Deposit(address indexed from, uint256 amount);
    event Withdrawal(address indexed to, uint256 amount);
    
    constructor() ERC20("Wrapped Native Token", "WNATIVE") {}
    
    receive() external payable {
        deposit();
    }
    
    function deposit() public payable {
        _mint(msg.sender, msg.value);
        emit Deposit(msg.sender, msg.value);
    }
    
    function withdraw(uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _burn(msg.sender, amount);
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }
}
```

---

## Option 3: 하이브리드 아키텍처

> [!TIP]
> 점진적 확장이 가능한 가장 실용적인 접근 방식입니다.

### 3.1 단계별 전략

#### Phase 1: Polygon에서 시작 (0-6개월)

```mermaid
graph LR
    A[DApp] --> B[Polygon Network]
    B --> C[ERC-20 Token]
    B --> D[Smart Contracts]
```

**목표**: MVP 출시, 사용자 확보

#### Phase 2: Polygon Supernet 구축 (6-12개월)

```mermaid
graph TB
    A[DApp] --> B{Bridge}
    B --> C[Polygon PoS<br/>메인 토큰]
    B --> D[Supernet<br/>앱 전용 체인]
    D --> E[Custom Features]
```

**목표**: 독립적인 체인으로 확장, 낮은 가스비

#### Phase 3: 완전 독립 메인넷 (12-18개월)

```mermaid
graph TB
    A[DApp] --> B[Custom Mainnet]
    B --> C[Native Token]
    B --> D{Cross-Chain Bridge}
    D --> E[Polygon]
    D --> F[Ethereum]
```

**목표**: 완전한 독립성, 자체 검증자 네트워크

### 3.2 Polygon Supernet 구현

```bash
# Polygon Supernet 초기화
polygon-edge polybft-secrets \
  --data-dir test-chain- \
  --num 4

# Genesis 생성
polygon-edge genesis \
  --block-gas-limit 10000000 \
  --epoch-size 10 \
  --chain-id 12345 \
  --name "CustomSupernet" \
  --premine 0x<address>:1000000000000000000000 \
  --validators-path ./ \
  --validators-prefix test-chain- \
  --consensus polybft

# 노드 시작
polygon-edge server \
  --data-dir ./test-chain-1 \
  --chain genesis.json \
  --grpc-address :10000 \
  --libp2p :30301 \
  --jsonrpc :10002 \
  --seal \
  --log-level DEBUG
```

### 3.3 크로스체인 브릿지

```solidity
// Bridge.sol
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenBridge is Ownable {
    IERC20 public token;
    
    mapping(bytes32 => bool) public processedTransfers;
    
    event Deposit(
        address indexed from,
        uint256 amount,
        uint256 indexed targetChain,
        bytes32 indexed transferId
    );
    
    event Withdrawal(
        address indexed to,
        uint256 amount,
        bytes32 indexed transferId
    );
    
    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
    }
    
    function deposit(uint256 amount, uint256 targetChain) external {
        require(amount > 0, "Amount must be greater than 0");
        
        // 토큰 락업
        token.transferFrom(msg.sender, address(this), amount);
        
        // 전송 ID 생성
        bytes32 transferId = keccak256(
            abi.encodePacked(
                msg.sender,
                amount,
                targetChain,
                block.timestamp
            )
        );
        
        emit Deposit(msg.sender, amount, targetChain, transferId);
    }
    
    function withdraw(
        address to,
        uint256 amount,
        bytes32 transferId,
        bytes memory signature
    ) external onlyOwner {
        require(!processedTransfers[transferId], "Already processed");
        
        // 서명 검증 (오프체인 검증자)
        require(_verifySignature(to, amount, transferId, signature), "Invalid signature");
        
        processedTransfers[transferId] = true;
        token.transfer(to, amount);
        
        emit Withdrawal(to, amount, transferId);
    }
    
    function _verifySignature(
        address to,
        uint256 amount,
        bytes32 transferId,
        bytes memory signature
    ) private pure returns (bool) {
        // ECDSA 서명 검증 로직
        // ...
        return true;
    }
}
```

---

## 구현 로드맵

### Option 1: Polygon 기반 (빠른 출시)

| 단계 | 기간 | 작업 내용 | 인력 |
|------|------|-----------|------|
| **Week 1-2** | 2주 | 프로젝트 설정, 개발 환경 구축 | 2명 |
| **Week 3-4** | 2주 | 지갑 연동, Web3 인증 구현 | 2명 |
| **Week 5-6** | 2주 | 스마트 컨트랙트 개발 및 테스트 | 3명 |
| **Week 7-8** | 2주 | 토큰 발행 서비스 개발 | 2명 |
| **Week 9-10** | 2주 | Frontend 통합 | 2명 |
| **Week 11** | 1주 | 테스트넷 배포 및 테스트 | 3명 |
| **Week 12** | 1주 | 보안 감사 및 메인넷 배포 | 5명 |

**총 기간**: 3개월  
**팀 구성**: Frontend 2명, Backend 2명, Smart Contract 1명

### Option 2: 자체 메인넷 (풀스택)

| 단계 | 기간 | 작업 내용 | 인력 |
|------|------|-----------|------|
| **Q1** | 3개월 | 블록체인 프레임워크 연구 및 선택 | 5명 |
| **Q2** | 3개월 | 코어 개발 (합의, 네트워킹, 스토리지) | 10명 |
| **Q3** | 3개월 | EVM 통합, RPC 개발, 지갑 개발 | 12명 |
| **Q4** | 3개월 | 테스트넷 운영, 블록 익스플로러 | 15명 |
| **Q5** | 3개월 | 보안 감사, 버그 수정 | 15명 |
| **Q6** | 3개월 | 메인넷 런칭, 검증자 온보딩 | 20명 |

**총 기간**: 18개월  
**팀 구성**: 
- 블록체인 개발자 8명
- Backend 개발자 4명
- Frontend 개발자 3명
- DevOps 3명
- 보안 전문가 2명

### Option 3: 하이브리드

| Phase | 기간 | 작업 내용 |
|-------|------|-----------|
| **Phase 1** | 3개월 | Polygon 기반 MVP |
| **Phase 2** | 6개월 | Supernet 개발 및 마이그레이션 |
| **Phase 3** | 6개월 | 독립 메인넷 전환 (선택) |

---

## 비용 및 리소스 분석

### Option 1: Polygon 기반

#### 개발 비용
```
인건비 (3개월):
- Frontend (2명 × $8K/월 × 3) = $48K
- Backend (2명 × $8K/월 × 3) = $48K
- Smart Contract (1명 × $10K/월 × 3) = $30K
총 개발비: $126K
```

#### 운영 비용 (월간)
```
- 서버 (AWS/GCP): $1,000
- RPC 서비스 (Alchemy/Infura): $500
- 데이터베이스: $300
- CDN/Storage: $200
- 모니터링: $100
월 운영비: $2,100
```

#### 스마트 컨트랙트 배포
```
- 컨트랙트 배포 (Polygon): ~$50 (0.1 MATIC)
- 감사 (선택): $10K-50K
- 보험 (선택): $5K/년
```

### Option 2: 자체 메인넷

#### 개발 비용
```
인건비 (18개월):
- 블록체인 개발자 (8명 × $12K/월 × 18) = $1,728K
- Backend (4명 × $8K/월 × 18) = $576K
- Frontend (3명 × $8K/월 × 18) = $432K
- DevOps (3명 × $10K/월 × 18) = $540K
- 보안 (2명 × $12K/월 × 18) = $432K
총 개발비: $3,708K
```

#### 인프라 비용 (월간)
```
검증자 노드 (최소 7개):
- EC2 c5.2xlarge × 7 = $1,500
- 스토리지 (500GB SSD × 7) = $350
- 네트워크 트래픽 = $1,000

RPC 노드 (3개):
- EC2 c5.4xlarge × 3 = $1,200
- Load Balancer = $200

모니터링 & 기타:
- Datadog/New Relic = $500
- 백업 = $300

월 인프라 비용: $5,050
```

#### 추가 비용
```
- 보안 감사: $100K-300K
- 법률 자문: $50K-150K
- 마케팅 (검증자 모집): $100K
- 예비 비용: $200K
```

### Option 3: 하이브리드

#### Phase 1 (Polygon): $126K + $2.1K/월
#### Phase 2 (Supernet): $400K + $10K/월
#### Phase 3 (독립): 추가 $1M + $30K/월

---

## 기술 스택 상세 비교

### Frontend

| 기술 | Polygon 기반 | 자체 메인넷 | 비고 |
|------|--------------|-------------|------|
| **Framework** | React/Next.js | React/Next.js | 동일 |
| **Web3 Library** | ethers.js, viem | ethers.js (EVM 호환시) | 동일 가능 |
| **Wallet** | MetaMask, WalletConnect | 커스텀 또는 포크 | 자체 개발 필요 |
| **UI Kit** | RainbowKit, wagmi | 커스텀 구현 | 추가 개발 |

### Backend

| 기술 | Polygon 기반 | 자체 메인넷 | 비고 |
|------|--------------|-------------|------|
| **Runtime** | Node.js | Node.js/Go | Go 추천 (성능) |
| **Framework** | Express/Fastify | Gin/Fiber | - |
| **Database** | PostgreSQL | PostgreSQL + TimescaleDB | 시계열 데이터 |
| **Cache** | Redis | Redis + Memcached | - |

### Blockchain

| 기술 | Polygon 기반 | 자체 메인넷 | 비고 |
|------|--------------|-------------|------|
| **Network** | Polygon PoS | Custom | - |
| **Consensus** | N/A (Polygon 사용) | IBFT/Tendermint/PoS | 선택 필요 |
| **Smart Contract** | Solidity | Solidity/CosmWasm/Rust | 프레임워크 의존 |
| **VM** | EVM | EVM/WASM | - |

---

## 보안 체크리스트

### 스마트 컨트랙트

- [ ] Reentrancy 공격 방어
- [ ] Integer Overflow/Underflow 방지 (Solidity 0.8+)
- [ ] Access Control 구현
- [ ] Pausable 패턴
- [ ] Rate Limiting
- [ ] Emergency Withdrawal
- [ ] 외부 감사 (CertiK, OpenZeppelin)

### 인프라

- [ ] Private Key 암호화 저장 (KMS)
- [ ] Multi-sig 지갑 사용
- [ ] DDoS 방어
- [ ] Rate Limiting (API)
- [ ] SSL/TLS 인증서
- [ ] 침입 탐지 시스템 (IDS)
- [ ] 정기적인 백업
- [ ] 재해 복구 계획

### 애플리케이션

- [ ] XSS 방어
- [ ] CSRF 방어
- [ ] SQL Injection 방지
- [ ] Input Validation
- [ ] JWT 보안
- [ ] Session 관리
- [ ] CORS 설정

---

## 모니터링 및 운영

### 메트릭

```typescript
// monitoring/metrics.ts
interface ChainMetrics {
  blockHeight: number;
  blockTime: number;
  transactionsPerSecond: number;
  activeValidators: number;
  networkHashrate?: string;
  gasPrice: {
    slow: string;
    standard: string;
    fast: string;
  };
}

interface NodeMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
  peerCount: number;
  syncStatus: boolean;
}
```

### 알림 설정

```yaml
# alerting-rules.yml
groups:
  - name: blockchain
    interval: 30s
    rules:
      - alert: HighBlockTime
        expr: block_time > 10
        for: 5m
        annotations:
          summary: "Block time is too high"
      
      - alert: ValidatorDown
        expr: validator_status == 0
        for: 1m
        annotations:
          summary: "Validator node is down"
      
      - alert: LowPeerCount
        expr: peer_count < 3
        for: 5m
        annotations:
          summary: "Low peer count"
```

---

## 권장 사항

### 즉시 시작하려면

1. **Polygon 기반 MVP**를 3개월 안에 구축
2. 시장 검증 및 사용자 피드백 수집
3. 성공 시 Supernet로 확장 고려

### 장기 프로젝트라면

1. **Polygon Edge** 또는 **Cosmos SDK** 선택
2. 최소 18개월 개발 기간 계획
3. 충분한 예산 확보 ($2M+)
4. 경험 있는 블록체인 팀 구성

### 리스크 최소화

1. 단계별 접근 (하이브리드 모델)
2. 철저한 보안 감사
3. 테스트넷 장기 운영 (3-6개월)
4. 커뮤니티 구축 및 검증자 네트워크 확보

---

## 다음 단계

이 아키텍처 문서를 기반으로:

1. **구체적인 구현 계획** 수립
2. **POC (Proof of Concept)** 개발
3. **기술 스택 최종 선정**
4. **팀 구성 및 예산 계획**

어떤 옵션으로 진행하시겠습니까? 구체적인 구현을 시작할 준비가 되면 알려주세요!
