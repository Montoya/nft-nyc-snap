import { 
  addNFT,
  getNFTWatchList, 
  removeNFT, 
  removeAllNFTs,
  startWatching, 
  stopWatching 
} from './snap/NFT';

module.exports.onRpcRequest = async ({ origin, request }) => {
  switch (request.method) {
    case 'addNFT':
      await addNFT(request.params.contractAddress, request.params.id);
    case 'removeNFT':
      await removeNFT(request.params.contractAddress, request.params.id);
    case 'removeAllNFTs':
      await removeAllNFTs();
    case 'startWatching':
      startWatching();
    case 'stopWatching':
      stopWatching();
    case 'getWatchList':
      return getNFTWatchList();
    default:
      throw new Error('method not found.');
  }
};
