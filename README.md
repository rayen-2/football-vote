# ⚽ Jugador del Partido — Football Vote

Prototipo funcional desplegado en **Avalanche Fuji Testnet** para el Hackathon de Blockchain (IN3863).

## ¿Qué hace y qué problema resuelve?
Permite a los usuarios votar de forma transparente y verificable por el **Jugador del Partido** entre 3 candidatos (**Lionel Messi**, **Cristiano Ronaldo** y **Lamine Yamal**).

El smart contract en Avalanche Fuji garantiza las reglas sin intermediarios:
- Solo se aceptan votos por uno de los 3 jugadores válidos.
- **Anti-doble-voto:** cada billetera puede votar una sola vez.
- Cualquier persona puede consultar el conteo de votos y el ganador actual en tiempo real.

## 🔗 Contrato Inteligente (Avalanche Fuji Testnet)
- **Red:** Avalanche Fuji C-Chain (Chain ID `43113`)
- **Dirección del contrato:** `0x6B1B6C80aEc2335a6994d05A76820240dFd9e7f2`
- **Ver en Snowtrace:** https://testnet.snowtrace.io/address/0x6B1B6C80aEc2335a6994d05A76820240dFd9e7f2
- **Transacciones de prueba:**
  - https://testnet.snowtrace.io/tx/0x4bd698c560b32ee7ac40910c44e04cd9d7a4bc13bb52c19a258ba063e31b131f
  - https://testnet.snowtrace.io/tx/0x0c4623b03ce425b3f26ecd2218381230f9db9fce72c396da88596e169faca4da

## 🌐 Demo en vivo
- **URL:** https://weblockchain.vercel.app/

## 📁 Estructura del proyecto
- `contracts/`: Smart contract en Solidity (`FootballVote.sol`) con Hardhat 3 + viem y pruebas.
- `web/`: Interfaz web en Next.js + wagmi + viem.

## 🚀 Cómo correrlo localmente

### 1. Clonar el repositorio
```bash
git clone https://github.com/rayen-2/football-vote
cd football-vote
```

### 2. Correr la web
```bash
cd web
npm install
cp .env.example .env.local
npm run dev
```
Luego abre [http://localhost:3000](http://localhost:3000) en tu navegador con MetaMask o Core conectado a la red **Avalanche Fuji**.

### 3. Correr pruebas del contrato (opcional)
```bash
cd contracts
npm install
npx hardhat test
```
