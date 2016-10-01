import { isVastWrapper, getVastTagUri } from './selectors';

const defaults = { maxChainDepth: 5 };

function vastWrapperChain (fetchAd, config, adChain=[]) {
  if(adChain.length >= config.maxChainDepth) {
    const maxChainDepthErr = new Error(`VastWrapperChain 'maxChainDepth' reached`);
    maxChainDepthErr.adChain = adChain;
    return Promise.reject(maxChainDepthErr);
  }

  return fetchAd(config.adTag, config)
    .then((vastAdObj) => {
      const newAdChain = [...adChain, vastAdObj];

      if(isVastWrapper(vastAdObj)) {
        const adTag = getVastTagUri(vastAdObj)
        return vastWrapperChain(fetchAd, {...config, adTag}, newAdChain);
      }

      return Promise.resolve(newAdChain);
    });
}

export default (fetchAd, config={}) => 
  vastWrapperChain(fetchAd, {...defaults, ...config});
