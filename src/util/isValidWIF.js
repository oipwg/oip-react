import wif from 'wif'
import networks from '../networks'

/**
 * Check if a WIF is valid for a specific CoinNetwork
 * @param  {string} key - Base58 WIF Private Key
 * @param  {CoinNetwork} network
 * @return {Boolean}
 */
export default function isValidWIF (key, network) {
  network = network === 'mainnet' ? networks.floMainnet : networks.floTestnet
  
  try {
    let dec = wif.decode(key)
    
    if (network) {
      return dec.version === network.wif
    } else {
      return true
    }
  } catch (e) {
    // console.error(e)
    return false
  }
}
