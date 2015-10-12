var request = require('request');
var cachedRequest = require('cached-request')(request);
var url = require('url');

var _ = require('underscore');

exports = module.exports = function(options){

  cachedRequest.setCacheDirectory(options.cacheDir);

  return function(href, requestHandler) {
    var requestUrl = href;

    if (options.enableCache) {
      var link = url.parse(href);
      if (link.hash && !options.cacheWithHash) {
        requestUrl = link.href.split(link.hash).shift();
      }
    }

    var requestOptions = _.extend(this.defaultRequestOptions, {
      url: requestUrl,
      ttl: options.cacheTime || 60000 // 1 min cache by default
    });

    if (options.enableCache) {
      cachedRequest(requestOptions, requestHandler);
    } else {
      request(requestOptions, requestHandler);
    }
  }
}
