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
      const { params } = request;
      await addNFT(params.contractAddress, params.id);
    case 'removeNFT':
      const { params } = request;
      await removeNFT(params.contractAddress, params.id);
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
