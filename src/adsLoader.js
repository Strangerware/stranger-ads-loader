"use strict";

const defaults = {};

class AdsLoader {

  constructor (config) {
    this.config = {...config, ...defaults}
  }

  requestAd(masterAdTag) {
    return Promise.resolve();
  }
}

export default AdsLoader;