var axios = require('axios');

var HuobiPublic = function() {
  this.endPoint = "https://api.huobi.pro";
  this.timeout = 5000;
  this.keepalive = false;
};

var publicApi = module.exports = function() {
  return new HuobiPublic();
};

HuobiPublic.prototype.query = async function(path) {
  const request={
      url: this.endPoint + path,
      method: "GET",
      timeout: this.timeout,
      forever: this.keepalive
    };
  return result=await axios(request)
    .then(function(res) {
      return res.data;
    })
    .catch(function(err) {
      console.log("Error: " + err);
      throw new Error(err.statusCode);
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

HuobiPublic.prototype.getMarketSymbolSettings = function(symbols="NA", stamp) { // https://huobiapi.github.io/docs/spot/v1/en/#get-market-symbols-setting
  var path = "/v1/settings/common/market-symbols?symbols="+symbols;
  if (stamp !== undefined) { path += "&ts=" + stamp;
  };
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

HuobiPublic.prototype.getMarketSymbolSettings = function() { // https://huobiapi.github.io/docs/spot/v1/en/#get-current-timestamp
  var path = "/v1/common/timestamp";
  return this.query(path);
};

//
// MARKET DATA
//



