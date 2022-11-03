var axios = require('axios');
var crypto = require('crypto');
//var querystring = require('querystring');

var HuobiPrivate = function(api) {
  this.endPoint = "https://api.huobi.pro";
  this.apikey = api.apikey;
  this.secret = api.secret;
  this.timeout = 5000;
  this.keepalive = false;
};

var privateApi = module.exports = function(api) {
  return new HuobiPrivate(api);
};

HuobiPrivate.prototype.query = function(options) {

  common={
    AccessKeyId: this.apikey,
    SignatureMethod: "HmacSHA256",
    SignatureVersion: 2,
    Timestamp: new Date().toISOString().split(".")[0]
  };
  Object.assign(common,options.qs);
  delete options.qs;

  var query=Object.keys(common)
    .sort( (a,b)=> (a > b) ? 1 : -1 )
    .reduce(function (a, k) {
      a.push(k + '=' + encodeURIComponent(common[k]));
      return a;
    }, []).join('&');

  //console.log("Query %s",query);

  var source=options.method+'\n'+
             this.endPoint.replace("https://","")+'\n'+
             options.url.replace(this.endPoint,"")+'\n'+
             query;

  let signature = encodeURIComponent( crypto.createHmac('sha256', this.secret).update(source).digest('base64') );
  options.url+= "?" + query + "&Signature="+signature;

  //console.log("Options %s",options);

  return axios(options).then(function(res) {
    return res.data
  }).catch(function(err) {
    console.log(err);
    throw new Error(err.statusCode);
  });
};

HuobiPrivate.prototype.getQuery = function(path, query) {
  var options = {
    method: "GET",
    url: this.endPoint + path,
    qs: query,
    json: true
  };
  return this.query(options);
};

HuobiPrivate.prototype.otherQuery = function(method, path, query) {
  var options = {
    method: method,
    url: this.endPoint + path,
    body: query,
    json: true
  };
  return this.query(options);
};

//
// ACCOUNT
//

HuobiPrivate.prototype.getAccounts = function() { // https://huobiapi.github.io/docs/spot/v1/en/#get-all-accounts-of-the-current-user
  const path="/v1/account/accounts";
  return this.getQuery(path, {});
};

HuobiPrivate.prototype.getBalance = function(id) { // Ghttps://huobiapi.github.io/docs/spot/v1/en/#get-account-balance-of-a-specific-account
  const path="/v1/account/accounts/"+id+"/balance";
  return this.getQuery(path, {});
};

HuobiPrivate.prototype.getPlatformValue = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#get-the-total-valuation-of-platform-assets
  const path="/v2/account/valuation";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.getAssetValuation = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#get-asset-valuation
  const path="/v2/account/asset-valuation";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.transferAsset = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#asset-transfer
  const path="/v1/account/transfer";
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.transferSubAccountAsset = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#asset-transfer
  const path="/v2/sub-user/transferability";
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.getAccountHistory = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#get-account-history
  const path="/v1/account/history";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.getAccountLedger = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#get-account-ledger
  const path="/v2/account/ledger";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.transferSpotFuture = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#transfer-fund-between-spot-account-and-future-contract-account
  const path="/v1/futures/transfer";
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.getPointBalance = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#get-point-balance
  const path="/v2/point/account";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.transferPoints = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#point-transfer
  const path="/v2/point/transfer";
  return this.otherQuery("POST", path, options);
};

//
// WALLET
//


//
// SUB-USER
//


//
// TRADING
//


//
// CONDITIONAL ORDER
//


//
// MARGIN
//
