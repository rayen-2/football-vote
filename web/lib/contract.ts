export const CONTRACT_ADDRESS = (
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '0x6B1B6C80aEc2335a6994d05A76820240dFd9e7f2'
) as `0x${string}`

export const CONTRACT_ABI = [
  {
    name: 'votar',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'jugador', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'haVotado',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'billetera', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'obtenerVotos',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'jugador', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'obtenerGanador',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const
