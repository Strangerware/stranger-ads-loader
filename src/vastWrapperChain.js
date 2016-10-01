import { isVastWrapper, getVastTagUri } from './selectors';

function vastWrapperChain (fetchAd, config, adChain=[]) {
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

export default (fetchAd, config={}) => {
  return vastWrapperChain(fetchAd, config);
}
