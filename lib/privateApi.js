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

HuobiPrivate.prototype.getBalance = function(uid) { // https://huobiapi.github.io/docs/spot/v1/en/#get-account-balance-of-a-specific-account
  const path="/v1/account/accounts/"+uid+"/balance";
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

HuobiPrivate.prototype.getDepositAddress = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#query-deposit-address
  const path="/v2/account/deposit/address";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.getWithdrawQuota = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#query-withdraw-quota
  const path="/v2/account/withdraw/quota";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.getWithdrawAddress = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#query-withdraw-address
  const path="/v2/account/withdraw/address";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.createWithdrawRequest = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#create-a-withdraw-request
  const path="/v1/dw/withdraw/api/create";
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.getWithdrawal = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#query-withdrawal-order-by-client-order-id
  const path="/v1/query/withdraw/client-order-id";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.cancelWithdrawal = function(id) { // https://huobiapi.github.io/docs/spot/v1/en/#cancel-a-withdraw-request
  const path="/v1/dw/withdraw-virtual/"+id+"/cancel";
  return this.otherQuery("POST", path, {});
};

HuobiPrivate.prototype.getWithdrawalsDeposits = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#search-for-existed-withdraws-and-deposits
  const path="/v1/query/deposit-withdraw";
  return this.getQuery(path, options);
};

//
// SUB-USER
//

HuobiPrivate.prototype.setDeductionMode = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#set-a-deduction-for-parent-and-sub-user
  const path="/v2/sub-user/deduct-mode";
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.getAPIKeys = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#api-key-query
  const path="/v2/user/api-key";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.getUID = function() { // https://huobiapi.github.io/docs/spot/v1/en/#get-uid
  const path="/v2/user/uid";
  return this.getQuery(path, {});
};

HuobiPrivate.prototype.createSubUser = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#sub-user-creation
  const path="/v2/sub-user/creation";
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.getSubUsersList = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#get-sub-user-39-s-list
  const path="/v2/sub-user/user-list";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.updateSubUser = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#lock-unlock-sub-user
  const path="/v2/sub-user/management";
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.getSubUsersStatus = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#get-sub-user-39-s-status
  const path="/v2/sub-user/user-state";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.setTradeableMarkets = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#set-tradable-market-for-sub-users
  const path="/v2/sub-user/tradable-market";
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.setAssetTransferPermission = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#set-asset-transfer-permission-for-sub-users
  const path="/v2/sub-user/transferability";
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.getSubUsersAccountList = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#get-sub-user-39-s-account-list
  const path="/v2/sub-user/account-list";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.createSubUserAPIKey = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#sub-user-api-key-creation
  const path="/v2/sub-user/api-key-generation";
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.updateSubUserAPIKey = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#sub-user-api-key-modification
  const path="/v2/sub-user/api-key-modification";
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.deleteSubUserAPIKey = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#sub-user-api-key-deletion
  const path="/v2/sub-user/api-key-deletion";
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.transferSubUserAsset = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#transfer-asset-between-parent-and-sub-account
  const path="/v1/subuser/transfer";
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.getSubUserDepositAddress = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#query-deposit-address-of-sub-user
  const path="/v2/sub-user/deposit-address";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.getSubUserDeposits = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#query-deposit-history-of-sub-user
  const path="/v2/sub-user/query-deposit";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.getAggregatedBalance = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#get-the-aggregated-balance-of-all-sub-users
  const path="/v1/subuser/aggregate-balance";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.getSubUserBalance = function(uid) { // https://huobiapi.github.io/docs/spot/v1/en/#get-account-balance-of-a-sub-user
  const path="/v1/account/accounts/"+uid";
  return this.getQuery(path, {});
};

//
// TRADING
//

HuobiPrivate.prototype.placeOrder = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#place-a-new-order
  const path="/v1/order/orders/place";
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.placeOrders = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#place-a-batch-of-orders
  const path="/v1/order/batch-orders";
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.cancelOrder = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#submit-cancel-for-an-order
  var path;                                              // https://huobiapi.github.io/docs/spot/v1/en/#submit-cancel-for-an-order-based-on-client-order-id
  if(options.hasOwnProperty("order-id")) {
    path="/v1/order/orders/"+options["order-id"]+"/submitcancel";
  } else {
    path="/v1/order/orders/submitCancelClientOrder";
  };
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.getOrders = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#get-all-open-orders
  const path="/v1/order/openOrders";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.cancelOrders = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#submit-cancel-for-multiple-orders-by-criteria
  var path;                                               // https://huobiapi.github.io/docs/spot/v1/en/#submit-cancel-for-multiple-orders-by-ids
  if(options.hasOwnProperty("order-ids") || options.hasOwnProperty("client-order-ids")) {
    path="/v1/order/orders/batchcancel";
  } else {
    path="/v1/order/orders/batchCancelOpenOrders";
  };
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.cancelAllOrders = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#dead-man-s-switch
  const path="/v2/algo-orders/cancel-all-after";
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.getOrderDetails = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#get-the-order-detail-of-an-order
  var path;                                                  // https://huobiapi.github.io/docs/spot/v1/en/?json#get-the-order-detail-of-an-order-based-on-client-order-id
  if(options.hasOwnProperty("order-id")) {
    path="/v1/order/orders/"+options["order-id"]; options={};
  } else {
    path="/v1/order/orders/getClientOrder";
  };
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.getMatchResult = function(id) { // https://huobiapi.github.io/docs/spot/v1/en/#get-the-match-result-of-an-order
  const path="/v1/order/orders/"+id+"/matchresults";
  return this.getQuery(path, {});
};

HuobiPrivate.prototype.searchPastOrders = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#search-past-orders
  const path="/v1/order/orders";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.searchHistoricalOrders = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#search-historical-orders-within-48-hours
  const path="/v1/order/history";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.searchMatchResults = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#search-match-results
  const path="/v1/order/matchresults";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.getFeeRate = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#get-current-fee-rate-applied-to-the-user
  const path="/v2/reference/transact-fee-rate";
  return this.getQuery(path, options);
};

//
// CONDITIONAL ORDER
//

HuobiPrivate.prototype.placeConditionalOrder = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#place-a-conditional-order
  const path="/v2/algo-orders";
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.cancelConditionalOrder = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#cancel-conditional-orders-before-triggering
  const path="/v2/algo-orders/cancellation";
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.getConditionalOrders = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#query-open-conditional-orders-before-triggering
  const path="/v2/algo-orders/opening";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.searchConditionalOrderHistory = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#query-conditional-order-history
  const path="/v2/algo-orders/history";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.searchConditionalOrder = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#query-a-specific-conditional-order
  const path="/v2/algo-orders/specific";
  return this.getQuery(path, options);
};

//
// MARGIN
//

HuobiPrivate.prototype.repayMarginLoan = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#repay-margin-loan-cross-isolated
  const path="/v2/account/repayment";
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.transferToMargin = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#transfer-asset-from-spot-trading-account-to-isolated-margin-account-isolated
  var path;                                                   // https://huobiapi.github.io/docs/spot/v1/en/#transfer-asset-from-spot-trading-account-to-cross-margin-account-cross
  if(options.hasOwnProperty("symbol")) {
    path="/v1/dw/transfer-in/margin"; // Isolated
  } else {
    path="/v1/cross-margin/transfer-in"; // Cross
  };
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.transferFromMargin = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#transfer-asset-from-isolated-margin-account-to-spot-trading-account-isolated
  var path;                                                     // https://huobiapi.github.io/docs/spot/v1/en/#transfer-asset-from-cross-margin-account-to-spot-trading-account-cross
  if(options.hasOwnProperty("symbol")) {
    path="/v1/dw/transfer-out/margin"; // Isolated
  } else {
    path="/v1/cross-margin/transfer-out"; // Cross
  };
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.getIsolatedLoanInfo = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#get-loan-interest-rate-and-quota-isolated
  const path="/v1/margin/loan-info";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.getCrossLoanInfo = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#get-loan-interest-rate-and-quota-cross
  const path="/v1/cross-margin/loan-info";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.requestMarginLoan = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#request-a-margin-loan-isolated
  var path;                                                    // https://huobiapi.github.io/docs/spot/v1/en/#request-a-margin-loan-cross
  if(options.hasOwnProperty("symbol")) {
    path="/v1/margin/orders"; // Isolated
  } else {
    path="/v1/cross-margin/orders"; // Cross
  };
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.repayIsolatedMarginLoan = function(id) { // https://huobiapi.github.io/docs/spot/v1/en/#repay-margin-loan-isolated
  const path="/v1/margin/orders/"+id+"/repay";
  return this.otherQuery("POST", path, {});
};

HuobiPrivate.prototype.repayCrossMarginLoan = function(id) { // https://huobiapi.github.io/docs/spot/v1/en/#repay-margin-loan-cross
  const path="/v1/cross-margin/orders/"+id+"/repay";
  return this.otherQuery("POST", path, {});
};


HuobiPrivate.prototype.searchMarginOrders = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#search-past-margin-orders-isolated
  var path;                                                     // https://huobiapi.github.io/docs/spot/v1/en/#search-past-margin-orders-cross
  if(options.hasOwnProperty("symbol")) {
    path="/v1/margin/loan-orders"; // Isolated
  } else {
    path="/v1/cross-margin/loan-orders"; // Cross
  };
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.getMarginBalance = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#get-the-balance-of-the-margin-loan-account-isolated
  var path;                                                   // https://huobiapi.github.io/docs/spot/v1/en/#get-the-balance-of-the-margin-loan-account-cross
  if(options.hasOwnProperty("symbol")) {
    path="/v1/margin/accounts/balance"; // Isolated
  } else {
    path="/v1/cross-margin/accounts/balance"; // Cross
  };
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.getRepaymentReference = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#repayment-record-reference
  const path="/v2/account/repayment;
  return this.getQuery(path, options);
};

//
// STABLE COIN EXCHANGE
//

HuobiPrivate.prototype.getExchangeRate = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#stable-coin-exchange
  const path="/v1/stable-coin/quote";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.exchangeCoin = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#exchange-stable-coin
  const path="/v1/stable-coin/exchange";
  return this.otherQuery("POST", path, options);
};

//
// EXCHANGE TRADED PRODUCTS (ETP)
//

HuobiPrivate.prototype.getETPData = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#get-reference-data-of-etp
  const path="/v2/etp/reference";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.placeETPOrder = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#etp-creation
  const path="/v2/etp/creation";
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.redeemETP = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#etp-redemption
  const path="/v2/etp/redemption";
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.getETPHistory = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#get-etp-creation-amp-redemption-history
  const path="/v2/etp/transactions";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.getETPTransaction = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#get-specific-etp-creation-or-redemption-record
  const path="/v2/etp/transaction";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.getRebalanceHistory = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#get-position-rebalance-history
  const path="/v2/etp/rebalance";
  return this.getQuery(path, options);
};

HuobiPrivate.prototype.cancelETPOrder = function(id) { // https://huobiapi.github.io/docs/spot/v1/en/#submit-cancel-for-an-etp-order
  const path="/v2/etp/"+id+"/cancel";
  return this.otherQuery("POST", path, {});
};

HuobiPrivate.prototype.cancelETPOrders = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#batch-cancellation-for-etp-orders
  const path="/v2/etp/batch-cancel";
  return this.otherQuery("POST", path, options);
};

HuobiPrivate.prototype.getETPHoldingLimit = function(options) { // https://huobiapi.github.io/docs/spot/v1/en/#get-holding-limit-of-leveraged-etp
  const path="/v2/etp/limit";
  return this.getQuery(path, options);
};
