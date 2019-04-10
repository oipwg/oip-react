import { Networks } from 'js-oip'

const { floMainnet, floTestnet } = Networks

const networks = {
  floMainnet: floMainnet.network,
  floTestnet: floTestnet.network
}

export default networks
