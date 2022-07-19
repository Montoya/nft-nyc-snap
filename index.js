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
      return await addNFT(request.params.contractAddress, request.params.id);
    case 'removeNFT':
      return await removeNFT(request.params.contractAddress, request.params.id);
    case 'removeAllNFTs':
      return await removeAllNFTs();
    case 'startWatching':
      return await startWatching();
    case 'stopWatching':
      return stopWatching();
    case 'getWatchList':
      return await getNFTWatchList();
    default:
      throw new Error('method not found.');
  }
};
