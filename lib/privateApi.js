var axios = require('axios');
var crypto = require('crypto');
var request = require('request');
var querystring = require('querystring');

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
// SPOT Trading
//

HuobiPrivate.prototype.getCurrentAccounts = function() {
  const path="/v1/account/accounts";
  return this.getQuery(path, {});
};

