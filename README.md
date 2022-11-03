# node-api-huobi

Non-official implementation of Huobi's API's. Developed for personal use.

For support on using the API's or development issues, please refer to the official API documentation.

## Public API

```javascript
  const huobi=require('node-api-huobi');

  const pupblicAPI=new huobi.publicApi();

```

### REFERENCE DATA

|  API   | DESCRIPTION  |
|  :----:  | ----  |
| getMarketStatus | https://huobiapi.github.io/docs/spot/v1/en/#get-market-status |
| getSymbols | https://huobiapi.github.io/docs/spot/v1/en/#get-all-supported-trading-symbol-v2 |
| getCurrencies | https://huobiapi.github.io/docs/spot/v1/en/#get-all-supported-currencies-v2 |
| getCurrencySettings | https://huobiapi.github.io/docs/spot/v1/en/#get-currencys-settings |
| getSymbolSettings | https://huobiapi.github.io/docs/spot/v1/en/#get-symbols-setting |
| getMarketSymbolSettings | https://huobiapi.github.io/docs/spot/v1/en/#get-market-symbols-setting |
| getChainsInfo | https://huobiapi.github.io/docs/spot/v1/en/#get-chains-information |
| getChainCurrencies | https://huobiapi.github.io/docs/spot/v1/en/#apiv2-currency-amp-chains |
| getMarketSymbolSettings | https://huobiapi.github.io/docs/spot/v1/en/#get-current-timestamp |

### MARKET DATA

TO DO

## Private API

```javascript
  const huobi=require('node-api-huobi');

  const auth = {
    apikey: 'MY_API_KEY',
    secret: 'MY_API_SECRET'
  };

  const privateAPI=new huobi.privateApi(auth);

```

### ACCOUNT

|  API   | DESCRIPTION  |
|  :----:  | ----  |
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

### WALLET

TO DO

### SUB-USER

TO DO

### TRADING

TO DO

### CONDITIONAL ORDER

TO DO

### MARGIN

TO DO

## WebSocket API

TO DO
