"use strict";

const defaults = {};

class AdsLoader {

  constructor (config) {
    this.config = {...defaults, ...config}
  }

  fetch(masterAdTag, options) {
    //TODO: MAGIC YET TO HAPPEN
    return Promise.resolve();
  }
}

export default AdsLoader;