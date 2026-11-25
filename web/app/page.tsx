'use client'

import { useEffect } from 'react'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
  useChainId,
} from 'wagmi'
import { injected } from 'wagmi/connectors'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract'

const FUJI_CHAIN_ID = 43113
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as `0x${string}`

const PLAYERS = [
  {
    id: 1,
    name: 'Lionel Messi',
    emoji: '🐐',
    country: '🇦🇷 Argentina',
    bar: 'bg-gradient-to-r from-sky-400 to-blue-500',
    btn: 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500',
    border: 'border-sky-500',
  },
  {
    id: 2,
    name: 'Cristiano Ronaldo',
    emoji: '🔥',
    country: '🇵🇹 Portugal',
    bar: 'bg-gradient-to-r from-red-400 to-rose-500',
    btn: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500',
    border: 'border-red-500',
  },
  {
    id: 3,
    name: 'Lamine Yamal',
    emoji: '⭐',
    country: '🇪🇸 España',
    bar: 'bg-gradient-to-r from-yellow-300 to-amber-400',
    btn: 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400',
    border: 'border-yellow-400',
  },
]

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const {
    writeContract,
    data: txHash,
    isPending: isVoting,
    error: voteError,
    reset: resetVote,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash })

  const isWrongNetwork = isConnected && chainId !== FUJI_CHAIN_ID

  const { data: contractData, refetch } = useReadContracts({
    contracts: [
      { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'obtenerVotos', args: [BigInt(1)] },
      { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'obtenerVotos', args: [BigInt(2)] },
      { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'obtenerVotos', args: [BigInt(3)] },
      { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'obtenerGanador' },
      {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'haVotado',
        args: [address ?? ZERO_ADDRESS],
      },
    ],
    query: { refetchInterval: 6000 },
  })

  const votes = [
    Number(contractData?.[0]?.result ?? BigInt(0)),
    Number(contractData?.[1]?.result ?? BigInt(0)),
    Number(contractData?.[2]?.result ?? BigInt(0)),
  ]
  const winner = Number(contractData?.[3]?.result ?? BigInt(0))
  const hasVoted = !!(contractData?.[4]?.result ?? false)
  const totalVotes = votes.reduce((a, b) => a + b, 0)

  useEffect(() => {
    if (isConfirmed) refetch()
  }, [isConfirmed, refetch])

  const handleVote = (playerId: number) => {
    resetVote()
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'votar',
      args: [BigInt(playerId)],
    })
  }

  const handleConnect = () => connect({ connector: injected() })

  const getPercent = (playerVotes: number) => {
    if (totalVotes === 0) return 0
    return Math.round((playerVotes / totalVotes) * 100)
  }

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : ''

  const isBusy = isVoting || isConfirming

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-green-950 to-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight">⚽ Jugador del Partido</h1>
            <p className="text-green-400 text-sm mt-1">Blockchain · Avalanche Fuji Testnet</p>
          </div>
          <div className="text-right">
            {!isConnected ? (
              <button
                onClick={handleConnect}
                className="bg-green-500 hover:bg-green-400 active:bg-green-600 text-black font-bold px-5 py-2 rounded-xl transition-all shadow-lg shadow-green-500/20"
              >
                Conectar Wallet
              </button>
            ) : (
              <div>
                <p className="text-xs text-gray-400 mb-1 font-mono">{shortAddress}</p>
                <button onClick={() => disconnect()} className="text-xs text-red-400 hover:text-red-300 transition">
                  Desconectar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Wrong network */}
        {isWrongNetwork && (
          <div className="flex items-center justify-between bg-yellow-900/40 border border-yellow-500/60 rounded-xl p-4 mb-5">
            <span className="text-yellow-300 text-sm">⚠️ Red incorrecta — necesitas <strong>Avalanche Fuji</strong></span>
            <button
              onClick={() => switchChain({ chainId: FUJI_CHAIN_ID })}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-4 py-1.5 rounded-lg text-sm transition"
            >
              Cambiar a Fuji
            </button>
          </div>
        )}

        {/* Already voted */}
        {isConnected && !isWrongNetwork && hasVoted && (
          <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-3 mb-5 text-center text-green-300 text-sm">
            ✅ Ya registraste tu voto · Gracias por participar
          </div>
        )}

        {/* Vote count */}
        <p className="text-center text-gray-500 text-sm mb-6">
          {totalVotes} voto{totalVotes !== 1 ? 's' : ''} registrado{totalVotes !== 1 ? 's' : ''} en la blockchain
        </p>

        {/* Player cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {PLAYERS.map((player) => {
            const playerVotes = votes[player.id - 1]
            const percent = getPercent(playerVotes)
            const isWinner = winner === player.id && totalVotes > 0
            const canVote = isConnected && !isWrongNetwork && !hasVoted && !isBusy

            return (
              <div
                key={player.id}
                className={`relative bg-gray-900 rounded-2xl p-5 border-2 transition-all duration-300 ${
                  isWinner ? `${player.border} shadow-lg` : 'border-gray-800'
                }`}
              >
                {isWinner && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-black px-3 py-0.5 rounded-full whitespace-nowrap">
                    🏆 Ganador actual
                  </div>
                )}

                <div className="text-center mb-4 mt-1">
                  <div className="text-6xl mb-2">{player.emoji}</div>
                  <h2 className="font-bold text-base leading-tight">{player.name}</h2>
                  <p className="text-gray-500 text-xs mt-0.5">{player.country}</p>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{playerVotes} votos</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${player.bar}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleVote(player.id)}
                  disabled={!canVote}
                  className={`w-full py-2 rounded-xl font-bold text-sm transition-all duration-200 ${
                    canVote
                      ? `${player.btn} text-white shadow-md active:scale-95`
                      : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {isBusy ? '⏳ Confirmando…' : hasVoted ? '✓ Votado' : 'Votar'}
                </button>
              </div>
            )
          })}
        </div>

        {/* Transaction result */}
        {txHash && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center mb-4">
            {isConfirming && (
              <p className="text-yellow-400 text-sm mb-2">⏳ Esperando confirmación en la blockchain…</p>
            )}
            {isConfirmed && (
              <p className="text-green-400 font-bold mb-2">✅ ¡Voto registrado exitosamente!</p>
            )}
            <a
              href={`https://testnet.snowtrace.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-xs underline font-mono break-all transition"
            >
              Ver transacción en Snowtrace →
            </a>
          </div>
        )}

        {/* Error */}
        {voteError && (
          <div className="bg-red-950/50 border border-red-700/60 rounded-xl p-3 text-red-300 text-sm text-center mb-4">
            ❌ {voteError.message.split('\n')[0]}
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-700 text-xs pt-4">
          Contrato:{' '}
          <a
            href={`https://testnet.snowtrace.io/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono hover:text-gray-400 transition"
          >
            {CONTRACT_ADDRESS}
          </a>
        </div>
      </div>
    </main>
  )
}
