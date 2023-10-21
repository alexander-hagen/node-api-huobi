var axios = require('axios');

var HuobiPublic = function() {
  this.endPoint = "https://api-aws.huobi.pro";
  this.timeout = 5000;
  this.keepalive = false;
};

var publicApi = module.exports = function() {
  return new HuobiPublic();
};

HuobiPublic.prototype.query = async function(path) {
  const options={
    url: this.endPoint + path,
    method: "GET",
    timeout: this.timeout,
    forever: this.keepalive
  };
  return await axios(options)
    .then(function(res) { return res.data; })
    .catch(function(err) {
      var response;
      if(err.hasOwnProperty("response")) {
        response={
          status: err.response.status,
          error: err.response.data.error.message,
          reason: err.response.data.error.code,
          data: options
        };
      } else {
        response={
          status: err.code,
          data: options
        };
      };
      return Promise.reject(response);
    });
};

//
// REFERENCE DATA
//

HuobiPublic.prototype.getMarketStatus = function() { // https://huobiapi.github.io/docs/spot/v1/en/#get-market-status
  var path = "/v2/market-status";
  return this.query(path);
};

HuobiPublic.prototype.getSymbols = function(stamp) { // https://huobiapi.github.io/docs/spot/v1/en/#get-all-supported-trading-symbol-v2
  var path = "/v2/settings/common/symbols";
  if (stamp !== undefined) { path += "?ts=" + stamp; };
  return this.query(path);
};

HuobiPublic.prototype.getCurrencies = function(stamp) { // https://huobiapi.github.io/docs/spot/v1/en/#get-all-supported-currencies-v2
  var path = "/v2/settings/common/currencies";
  if (stamp !== undefined) { path += "?ts=" + stamp; };
  return this.query(path);
};

HuobiPublic.prototype.getCurrencySettings = function(stamp) { // https://huobiapi.github.io/docs/spot/v1/en/#get-currencys-settings
  var path = "/v1/settings/common/currencys";
  if (stamp !== undefined) { path += "?ts=" + stamp; };
  return this.query(path);
};

HuobiPublic.prototype.getSymbolSettings = function(stamp) { // https://huobiapi.github.io/docs/spot/v1/en/#get-symbols-setting
  var path = "/v1/settings/common/symbols" ;
  if (stamp !== undefined) { path += "?ts=" + stamp; };
  return this.query(path);
};

HuobiPublic.prototype.getMarketSettings = function(symbols,stamp) { // https://huobiapi.github.io/docs/spot/v1/en/#get-market-symbols-setting
  var path = "/v1/settings/common/market-symbols";
  var sep = "?";

  if (symbols !== undefined) { path += sep + "symbols=" + symbols; sep="&"; };
  if (stamp !== undefined) { path += sep + "ts=" + stamp; sep="&"; };
  return this.query(path);
};

HuobiPublic.prototype.getChainsInfo = function(show,currency,stamp) { // https://huobiapi.github.io/docs/spot/v1/en/#get-chains-information
  var path = "/v1/settings/common/chains";
  var sep = "?";

  if (show !== undefined) { path += sep + "show-desc=" + show; sep="&"; };
  if (currency !== undefined) { path += sep + "currency=" + currency; sep="&"; };
  if (stamp !== undefined) { path += sep + "ts=" + stamp; sep="&"; };
  return this.query(path);
};

HuobiPublic.prototype.getChainCurrencies = function(currency,authorized) { // https://huobiapi.github.io/docs/spot/v1/en/#apiv2-currency-amp-chains
  var path = "/v2/reference/currencies";
  var sep = "?";

  if (currency !== undefined) { path += sep + "currency=" + currency; sep="&"; };
  if (authorized !== undefined) { path += sep + "authorizedUser=" + authorized; sep="&"; };
  return this.query(path);
};

HuobiPublic.prototype.getTimestamp = function() { // https://huobiapi.github.io/docs/spot/v1/en/#get-current-timestamp
  var path = "/v1/common/timestamp";
  return this.query(path);
};

//
// MARKET DATA
//

HuobiPublic.prototype.getKlines = function(symbol,period,size) { // https://huobiapi.github.io/docs/spot/v1/en/#get-klines-candles
  var path = "/market/history/kline?symbol=" + symbol;
  if (period !== undefined) { path += "&period=" + period; };
  if (size !== undefined) { path += "&size=" + size; };
  return this.query(path);
};

HuobiPublic.prototype.getTicker = function(symbol) { // https://huobiapi.github.io/docs/spot/v1/en/#get-latest-aggregated-ticker
  var path = "/market/history/kline?symbol=" + symbol;
  return this.query(path);
};

HuobiPublic.prototype.getAllTickers = function() { // https://huobiapi.github.io/docs/spot/v1/en/#get-latest-tickers-for-all-pairs
  var path = "/market/tickers";
  return this.query(path);
};

HuobiPublic.prototype.getMarketDepth = function(symbol,depth,type="step0") { // https://huobiapi.github.io/docs/spot/v1/en/#get-market-depth
  var path = "/market/depth?symbol=" + symbol + "&type=" + type;
  if (depth !== undefined) { path += "&depth=" + depth; };
  return this.query(path);
};

HuobiPublic.prototype.getLastTrade = function(symbol) { // https://huobiapi.github.io/docs/spot/v1/en/#get-the-last-trade
  var path = "/market/trade?symbol=" + symbol;
  return this.query(path);
};

HuobiPublic.prototype.getRecentTrades = function(symbol,size) { // https://huobiapi.github.io/docs/spot/v1/en/#get-the-most-recent-trades
  var path = "/market/history/trade?symbol=" + symbol;
  if (size !== undefined) { path += "&size=" + size; };
  return this.query(path);
};

HuobiPublic.prototype.getMarketSummary = function(symbol) { // https://huobiapi.github.io/docs/spot/v1/en/#get-the-last-24h-market-summary
  var path = "/market/detail?symbol=" + symbol;
  return this.query(path);
};

HuobiPublic.prototype.getNetAssetValue = function(symbol) { // https://huobiapi.github.io/docs/spot/v1/en/#get-real-time-nav
  var path = "/market/etp?symbol=" + symbol;
  return this.query(path);
};
