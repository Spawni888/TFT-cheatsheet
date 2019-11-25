'use strict';

const merge = require('deepmerge');
// const clonedeep = require('lodash/clonedeep');

let config = require('../config/config');

try {
    let localConfig = require('../../../config');
    config = merge(
        config,
        localConfig,
        {arrayMerge: (dest, source) => source}
    );


}
catch (error) {
    // console.log('no local config');
}

module.exports = config;
