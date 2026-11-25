import { createConfig, http } from 'wagmi'
import { avalancheFuji } from 'viem/chains'
import { injected, metaMask } from 'wagmi/connectors'

export const config = createConfig({
  chains: [avalancheFuji],
  connectors: [injected(), metaMask()],
  transports: {
    [avalancheFuji.id]: http('https://api.avax-test.network/ext/bc/C/rpc'),
  },
})
