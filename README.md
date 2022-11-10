# node-api-huobi

**WARNING: This package is still early beta! Expect breaking changes until this sees a major release.**

Non-official implementation of Huobi's API's. Developed for personal use.

For support on using the API's or development issues, please refer to the official API documentation. For questions regarding this package, please consult the code first.

## __PUBLIC API__

```javascript
  const huobi=require('node-api-huobi');

  const publicAPI=new huobi.publicApi();

```

### Reference Data

|  API   | DESCRIPTION  |
|  :----  | :----  |
| getSystemStatus | Not implemented |
| getMarketStatus | https://huobiapi.github.io/docs/spot/v1/en/#get-market-status |
| getSymbols | https://huobiapi.github.io/docs/spot/v1/en/#get-all-supported-trading-symbol-v2 |
| getCurrencies | https://huobiapi.github.io/docs/spot/v1/en/#get-all-supported-currencies-v2 |
| getCurrencySettings | https://huobiapi.github.io/docs/spot/v1/en/#get-currencys-settings |
| getSymbolSettings | https://huobiapi.github.io/docs/spot/v1/en/#get-symbols-setting |
| getMarketSymbolSettings | https://huobiapi.github.io/docs/spot/v1/en/#get-market-symbols-setting |
| getChainsInfo | https://huobiapi.github.io/docs/spot/v1/en/#get-chains-information |
| getChainCurrencies | https://huobiapi.github.io/docs/spot/v1/en/#apiv2-currency-amp-chains |
| getMarketSymbolSettings | https://huobiapi.github.io/docs/spot/v1/en/#get-current-timestamp |

### Market Data

|  API   | DESCRIPTION  |
|  :----  | :----  |
| getKlines | https://huobiapi.github.io/docs/spot/v1/en/#get-klines-candles |
| getTicker | https://huobiapi.github.io/docs/spot/v1/en/#get-latest-aggregated-ticker |
| getAllTickers | https://huobiapi.github.io/docs/spot/v1/en/#get-latest-tickers-for-all-pairs |
| getMarketDepth | https://huobiapi.github.io/docs/spot/v1/en/#get-market-depth |
| getLastTrade | https://huobiapi.github.io/docs/spot/v1/en/#get-the-last-trade |
| getRecentTrades | https://huobiapi.github.io/docs/spot/v1/en/#get-the-most-recent-trades |
| getMarketSummary | https://huobiapi.github.io/docs/spot/v1/en/#get-the-last-24h-market-summary |
| getNetAssetValue | https://huobiapi.github.io/docs/spot/v1/en/#get-real-time-nav |

## __PRIVATE API__

```javascript
  const huobi=require('node-api-huobi');

  const auth = {
    apikey: 'MY_API_KEY',
    secret: 'MY_API_SECRET'
  };

  const privateAPI=new huobi.privateApi(auth);

```

### Account

|  API   | DESCRIPTION  |
|  :----  | :----  |
| getAccounts | https://huobiapi.github.io/docs/spot/v1/en/#get-all-accounts-of-the-current-user |
| getBalance | https://huobiapi.github.io/docs/spot/v1/en/#get-account-balance-of-a-specific-account |
| getPlatformValue | https://huobiapi.github.io/docs/spot/v1/en/#get-the-total-valuation-of-platform-assets |
| getAssetValuation | https://huobiapi.github.io/docs/spot/v1/en/#get-asset-valuation |
| transferAsset | https://huobiapi.github.io/docs/spot/v1/en/#asset-transfer |
| transferSubAccountAsset | https://huobiapi.github.io/docs/spot/v1/en/#asset-transfer |
| getAccountHistory | https://huobiapi.github.io/docs/spot/v1/en/#get-account-history |
| getAccountLedger | https://huobiapi.github.io/docs/spot/v1/en/#get-account-ledger |
| transferSpotFuture | https://huobiapi.github.io/docs/spot/v1/en/#transfer-fund-between-spot-account-and-future-contract-account |
| getPointBalance | https://huobiapi.github.io/docs/spot/v1/en/#get-point-balance |
| transferPoints | https://huobiapi.github.io/docs/spot/v1/en/#point-transfer |

### Wallet

|  API   | DESCRIPTION  |
|  :----  | :----  |
| getDepositAddress | https://huobiapi.github.io/docs/spot/v1/en/#query-deposit-address |
| getWithdrawQuota | https://huobiapi.github.io/docs/spot/v1/en/#query-withdraw-quota |
| getWithdrawAddress | https://huobiapi.github.io/docs/spot/v1/en/#query-withdraw-address |
| createWithdrawRequest | https://huobiapi.github.io/docs/spot/v1/en/#create-a-withdraw-request |
| getWithdrawal | https://huobiapi.github.io/docs/spot/v1/en/#query-withdrawal-order-by-client-order-id |
| cancelWithdrawal | https://huobiapi.github.io/docs/spot/v1/en/#cancel-a-withdraw-request |
| getWithdrawalsDeposits | https://huobiapi.github.io/docs/spot/v1/en/#search-for-existed-withdraws-and-deposits |

### Sub-User

|  API   | DESCRIPTION  |
|  :----  | :----  |
| setDeductionMode | https://huobiapi.github.io/docs/spot/v1/en/#set-a-deduction-for-parent-and-sub-user |
| getAPIKeys | https://huobiapi.github.io/docs/spot/v1/en/#api-key-query |
| getUID | https://huobiapi.github.io/docs/spot/v1/en/#get-uid |
| createSubUser | https://huobiapi.github.io/docs/spot/v1/en/#sub-user-creation |
| getSubUsersList | https://huobiapi.github.io/docs/spot/v1/en/#get-sub-user-39-s-list |
| updateSubUser | https://huobiapi.github.io/docs/spot/v1/en/#lock-unlock-sub-user |
| getSubUsersStatus | https://huobiapi.github.io/docs/spot/v1/en/#get-sub-user-39-s-status |
| setTradeableMarkets | https://huobiapi.github.io/docs/spot/v1/en/#set-tradable-market-for-sub-users |
| setAssetTransferPermission | https://huobiapi.github.io/docs/spot/v1/en/#set-asset-transfer-permission-for-sub-users |
| getSubUsersAccountList | https://huobiapi.github.io/docs/spot/v1/en/#get-sub-user-39-s-account-list |
| createSubUserAPIKey | https://huobiapi.github.io/docs/spot/v1/en/#sub-user-api-key-creation |
| updateSubUserAPIKey | https://huobiapi.github.io/docs/spot/v1/en/#sub-user-api-key-modification |
| deleteSubUserAPIKey | https://huobiapi.github.io/docs/spot/v1/en/#sub-user-api-key-deletion |
| transferSubUserAsset | https://huobiapi.github.io/docs/spot/v1/en/#transfer-asset-between-parent-and-sub-account |
| getSubUserDepositAddress | https://huobiapi.github.io/docs/spot/v1/en/#query-deposit-address-of-sub-user |
| getSubUserDeposits | https://huobiapi.github.io/docs/spot/v1/en/#query-deposit-history-of-sub-user |
| getAggregatedBalance | https://huobiapi.github.io/docs/spot/v1/en/#get-the-aggregated-balance-of-all-sub-users |
| getSubUserBalance | https://huobiapi.github.io/docs/spot/v1/en/#get-account-balance-of-a-sub-user |

### Trading

|  API   | DESCRIPTION  |
|  :----  | :----  |
| placeOrder | https://huobiapi.github.io/docs/spot/v1/en/#place-a-new-order |
| placeOrders | https://huobiapi.github.io/docs/spot/v1/en/#place-a-batch-of-orders |
| cancelOrder | https://huobiapi.github.io/docs/spot/v1/en/#submit-cancel-for-an-order https://huobiapi.github.io/docs/spot/v1/en/#submit-cancel-for-an-order-based-on-client-order-id |
| getOrders | https://huobiapi.github.io/docs/spot/v1/en/#get-all-open-orders |
| cancelOrders | https://huobiapi.github.io/docs/spot/v1/en/#submit-cancel-for-multiple-orders-by-criteria https://huobiapi.github.io/docs/spot/v1/en/#submit-cancel-for-multiple-orders-by-ids |
| cancelAllOrders | https://huobiapi.github.io/docs/spot/v1/en/#dead-man-s-switch |
| getOrderDetails | https://huobiapi.github.io/docs/spot/v1/en/#get-the-order-detail-of-an-order https://huobiapi.github.io/docs/spot/v1/en/?json#get-the-order-detail-of-an- |
| getMatchResult | https://huobiapi.github.io/docs/spot/v1/en/#get-the-match-result-of-an-order |
| searchPastOrders | https://huobiapi.github.io/docs/spot/v1/en/#search-past-orders |
| searchHistoricalOrders | https://huobiapi.github.io/docs/spot/v1/en/#search-historical-orders-within-48-hours |
| searchMatchResults | https://huobiapi.github.io/docs/spot/v1/en/#search-match-results |
| getFeeRate | https://huobiapi.github.io/docs/spot/v1/en/#get-current-fee-rate-applied-to-the-user |

### Conditional Order

|  API   | DESCRIPTION  |
|  :----  | :----  |
| placeConditionalOrder | https://huobiapi.github.io/docs/spot/v1/en/#place-a-conditional-order |
| cancelConditionalOrder | https://huobiapi.github.io/docs/spot/v1/en/#cancel-conditional-orders-before-triggering |
| getConditionalOrders | https://huobiapi.github.io/docs/spot/v1/en/#query-open-conditional-orders-before-triggering |
| searchConditionalOrderHistory | https://huobiapi.github.io/docs/spot/v1/en/#query-conditional-order-history |
| searchConditionalOrder | https://huobiapi.github.io/docs/spot/v1/en/#query-a-specific-conditional-order |

### Margin

|  API   | DESCRIPTION  |
|  :----  | :----  |
| repayMarginLoan | https://huobiapi.github.io/docs/spot/v1/en/#repay-margin-loan-cross-isolated |
| transferToMargin | https://huobiapi.github.io/docs/spot/v1/en/#transfer-asset-from-spot-trading-account-to-isolated-margin-account-isolated https://huobiapi.github.io/docs/spot/v1/en/#transfer-asset-from-spot-trading-account-to-cross-margin-account-cross |
| transferFromMargin | https://huobiapi.github.io/docs/spot/v1/en/#transfer-asset-from-isolated-margin-account-to-spot-trading-account-isolated https://huobiapi.github.io/docs/spot/v1/en/#transfer-asset-from-cross-margin-account-to-spot-trading-account-cross |
| getIsolatedLoanInfo | https://huobiapi.github.io/docs/spot/v1/en/#get-loan-interest-rate-and-quota-isolated |
| getCrossLoanInfo | https://huobiapi.github.io/docs/spot/v1/en/#get-loan-interest-rate-and-quota-cross |
| requestMarginLoan | https://huobiapi.github.io/docs/spot/v1/en/#request-a-margin-loan-isolated https://huobiapi.github.io/docs/spot/v1/en/#request-a-margin-loan-cross |
| repayIsolatedMarginLoan | https://huobiapi.github.io/docs/spot/v1/en/#repay-margin-loan-isolated |
| repayCrossMarginLoan | https://huobiapi.github.io/docs/spot/v1/en/#repay-margin-loan-cross |
| searchMarginOrders | https://huobiapi.github.io/docs/spot/v1/en/#search-past-margin-orders-isolated https://huobiapi.github.io/docs/spot/v1/en/#search-past-margin-orders-cross |
| getMarginBalance | https://huobiapi.github.io/docs/spot/v1/en/#get-the-balance-of-the-margin-loan-account-isolated https://huobiapi.github.io/docs/spot/v1/en/#get-the-balance-of-the-margin-loan-account-cross |
| getRepaymentReference | https://huobiapi.github.io/docs/spot/v1/en/#repayment-record-reference |

### Stable Coin Exchange

|  API   | DESCRIPTION  |
|  :----  | :----  |
| getExchangeRate | https://huobiapi.github.io/docs/spot/v1/en/#stable-coin-exchange |
| exchangeCoin | https://huobiapi.github.io/docs/spot/v1/en/#exchange-stable-coin |

### Exchange Traded Products (ETP)

|  API   | DESCRIPTION  |
|  :----  | :----  |
| getETPData | https://huobiapi.github.io/docs/spot/v1/en/#get-reference-data-of-etp |
| placeETPOrder | https://huobiapi.github.io/docs/spot/v1/en/#etp-creation |
| redeemETP | https://huobiapi.github.io/docs/spot/v1/en/#etp-redemption |
| getETPHistory | https://huobiapi.github.io/docs/spot/v1/en/#get-etp-creation-amp-redemption-history |
| getETPTransaction | https://huobiapi.github.io/docs/spot/v1/en/#get-specific-etp-creation-or-redemption-record |
| getRebalanceHistory | https://huobiapi.github.io/docs/spot/v1/en/#get-position-rebalance-history |
| cancelETPOrder | https://huobiapi.github.io/docs/spot/v1/en/#submit-cancel-for-an-etp-order |
| cancelETPOrders | https://huobiapi.github.io/docs/spot/v1/en/#batch-cancellation-for-etp-orders |
| getETPHoldingLimit | https://huobiapi.github.io/docs/spot/v1/en/#get-holding-limit-of-leveraged-etp |

## __WEBSOCKET API__

```javascript
  const huobi=require('node-api-huobi');

  const auth = {
    apikey: 'MY_API_KEY',
    secret: 'MY_API_SECRET'
  };

  const marketAPI=new huobi.sockets.marketApi();
  const mbpAPI=new huobi.sockets.MBPApi();
  const tradingAPI=new huobi.sockets.tradingApi(auth);

  tradingAPI.setHandler('orders', (method,data) => { updateOrder(method,data); });
  const res=await tradingAPI.subscribeOrderUpdates();
```

### MARKET DATA

```javascript
  const marketAPI=new huobi.sockets.marketApi();
```

|  API   | DESCRIPTION  |
|  :----  | :----  |
| subscribeCandles unsubscribeCandles getCandle | https://huobiapi.github.io/docs/spot/v1/en/#market-candlestick |
| subscribeTickers | unsubscribeTickers | getTicker | https://huobiapi.github.io/docs/spot/v1/en/#market-ticker |
| subscribeMarketDepth unsubscribeMarketDepth getMarketDepth | https://huobiapi.github.io/docs/spot/v1/en/#market-depth |
| subscribeBests unsubscribeBests getBest | https://huobiapi.github.io/docs/spot/v1/en/#best-bid-offer |
| subscribeTrades unsubscribeTrades getTrades | https://huobiapi.github.io/docs/spot/v1/en/#trade-detail |
| subscribeStats unsubscribeStats getStats | https://huobiapi.github.io/docs/spot/v1/en/#market-details |
| subscribeETP unsubscribeETP getETP | https://huobiapi.github.io/docs/spot/v1/en/#subscribe-etp-real-time-nav |

### MARKET BY PRICE (MBP) DATA

```javascript
  const mbpAPI=new huobi.sockets.MBPApi();
```

|  API   | DESCRIPTION  |
|  :----  | :----  |
| subscribeMBPIncremetal unsubscribeMBPIncremetal getMBPIncremetal | https://huobiapi.github.io/docs/spot/v1/en/#market-by-price-incremental-update |
| subscribeMBPRefresh unsubscribeMBPRefresh getMBPRefresh | https://huobiapi.github.io/docs/spot/v1/en/#market-by-price-refresh-update |

### ACCOUNT AND ORDER

```javascript
  const tradingAPI=new huobi.sockets.tradingApi();
```

|  API   | DESCRIPTION  |
|  :----  | :----  |
| subscribeOrderUpdates unsubscribeOrderUpdates | https://huobiapi.github.io/docs/spot/v1/en/#subscribe-order-updates |
| subscribeTradeClearing unsubscribeTradeClearing | https://huobiapi.github.io/docs/spot/v1/en/#subscribe-trade-details-amp-order-cancellation-post-clearing |
| subscribeAccountChange unsubscribeAccountChange | https://huobiapi.github.io/docs/spot/v1/en/#subscribe-account-change |
