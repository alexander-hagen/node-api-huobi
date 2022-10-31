var axios = require('axios');

var HuobiPublic = function() {
  this.endPoint = "https://api.huobi.pro";
  this.timeout = 5000;
  this.keepalive = false;
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

// Reference Data

HuobiPublic.prototype.GetAllSupportedTradingSymbol = function(stamp) {
  var path = "/v2/settings/common/symbols";
  if (stamp !== undefined) {
    path = path + "?ts=" + stamp;
  }
  return this.query(path);
};

HuobiPublic.prototype.GetAllSupportedCurrencies = function(stamp) {
  var path = "/v2/settings/common/currencies" ;
  if (stamp !== undefined) { 
    path = path + "?ts=" + stamp;
  };
  return this.query(path);
};


var publicApi = module.exports = function() {
  return new HuobiPublic();
};
