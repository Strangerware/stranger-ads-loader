"use strict";

import 'isomorphic-fetch';

const defaults = {};

function fetchAd(config, masterAdTag) {
  config = {...defaults, ...config};
  return Promise.reject(new Error('fetchAd missing config'));
}

export default fetchAd;