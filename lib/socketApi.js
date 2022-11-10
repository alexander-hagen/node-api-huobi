const
  axios = require('axios'),
  crypto = require('crypto'),
  pako = require('pako'),
  WebSocket = require('ws');

const
  marketUrl = 'wss://api.huobi.pro/ws',
  MBPUrl = 'wss://api.huobi.pro/feed',
  tradeUrl = 'wss://api.huobi.pro/ws/v2';

const
  GZIP=true,
  NOZIP=false;

class SocketClient {

  constructor(url, keys, gzip, onConnected) {
    this._id = 1; // Request ID, incrementing
    this._onConnected = onConnected;
    this._createSocket(url);
    this._promises = new Map();
    this._handles = new Map();

    this.compressed=gzip;
    this.name=(keys==undefined?"market":keys.name);
  }

  _createSocket(url) {
    this._ws = new WebSocket(url);

    this._ws.onopen = async () => {
      console.log('ws connected', this.name);
//      this.pingTimeout = setTimeout(heartbeat, 41000, this, undefined); // wait max 41 secs for the first ping

      if(this._onConnected!==undefined) { this._onConnected(); };
    };

    this._ws.onclose = () => {
      console.log('ws closed', this.name);
      this._ws.emit('closed');
      this._promises.forEach((cb, id) => {
        this._promises.delete(id);
//        cb.reject(new Error('Disconnected'));
      });
//      setTimeout(() => this._createSocket(this._ws._url), 500);
    };

    this._ws.onerror = err => {
      console.log('ws error', this.name, err);
//      setTimeout(() => this._createSocket(this._ws._url), 500);
    };

    this._ws.onmessage = msg => {
//      try {
        var message;
        if(this.compressed) { message = JSON.parse(pako.inflate(msg.data,{to:'string'})); } else { message=JSON.parse(msg.data); };

        if(message.hasOwnProperty("ping")) { heartbeat(this, message.ping); return; };

        var request;
        switch(message.action) {

          case "ping":
            heartbeat(this,message.data.ts);
            break;

          case "req":
            switch(message.ch) {
              case "auth":
                if(message.code=="200") {
                  console.log('ws authenticated', this.name);
                  this._ws.emit('authenticated');
                } else {
                  console.log('ws authentication failed', this.name);
                };
                break;
              default:
                console.log(':req', this.name, message, this.compressed);
                break;
            };
            break;

          case "push":
//console.log("**PUSH",message);
            if (this._handles.has(message.ch.split("#")[0])) { // orders
              this._handles.get(message.ch.split("#")[0]).forEach(cb => { cb(message.ch.split("#")[0],message[Object.keys(message)[2]]); });
            } else {
              console.log('ws push no handler', this._handles, this.name, message, this._handles);
            };
            break;

          default: // Promise/reject response

            var key;
            if (message.id) { key=message.id; } else { key=message.ch; };

            if (this._promises.has(key)) {
              const cb = this._promises.get(key);
              this._promises.delete(key);
              if (message.code=="200") { cb.resolve({"code":message.code,"data":message.data}); }
              else { cb.reject({"code":message.code,"error":message}); };
            } else {
              console.log('Unprocessed response', this._promises, message)
            };

            switch(message.action) {
              case "sub":
//                console.log('>>Subscribed', this.name, message, this.compressed);
                break;
              default:
                console.log('>>Default', this.name, message, this.compressed);
                break;
            };
            break;
        };

//            if(message.hasOwnProperty("ch")) {
//              var data,method,symbol;
//              const parts=message.ch.split(".");
//
//              data=Object.keys(message).filter(key => { return key!=="ch" && key !=="ts"; })[0];
//              method=parts[0]+"_"+parts[2];
//              symbol=parts[1];
//
//              console.log('ws event', this.name, message, method, data, this.compressed);
//
//              if (this._handles.has(method)) {
//                this._handles.get(method).forEach(cb => { cb(method,message[data],symbol); });
//              } else {
//                console.log('ws no handler', this.name, message, method, data, this.compressed);
//              };
//
//            } else {
//              console.log('ws error', this.name, message, this.compressed);
//            };
//            break;
//        };
//
//        if (message.id) {
//          if (this._promises.has(message.id)) {
//            const cb = this._promises.get(message.id);
//            this._promises.delete(message.id);
//            if (message.result) {
//              cb.resolve(message.result);
//            } else if (message.error) {
//              cb.reject(message.error);
//            } else {
//              console.log('Unprocessed response', message)
//            }
//          } else { console.log('Promise already deleted', message.id) };
//        } else {
//          var key,data,method;
//          if (message.ch) { method=Object.keys(message)[1]; data=method; key=message.ch.split("/")[0]+"_"+method; };
//          if (message.method) { method=message.method; data=Object.keys(message)[2]; key=method; };
//
//          if(key) {
//            if (this._handles.has(key)) {
//              this._handles.get(key).forEach(cb => {
//                cb(method,message[data]);
//              });
//            } else {
//              console.log('Unprocessed method:'+key, message);
//            }
//          } else {
//            console.log('Unprocessed message', message);
//          }
//        }
//
//      } catch (e) {
//        console.log('Fail parse message', e);
//      }

    };

    this._ws.on('ping', heartbeat);
  }

  async request(key, options) {

    if (this._ws.readyState === WebSocket.OPEN) {
      return new Promise((resolve, reject) => {
        this._promises.set(key, {resolve, reject});
        this._ws.send(JSON.stringify(options));
        setTimeout(() => {
          if (this._promises.has(key)) {
            this._promises.delete(key);
            reject({"code":"408","error":"Request Timeout"});
          }
        }, 10000);
      });

    } else { reject({"code":"503","error":"Service Unavailable"}); };

  }

  setHandler(key, callback) {
    if (!this._handles.has(key)) { this._handles.set(key, []); };
    this._handles.get(key).push(callback);
console.log("setHandler: keys",this._handles);
  }

}

function heartbeat(socket,pingid) {

  clearTimeout(socket.pingTimeout)
  socket.pingTimeout = setTimeout(terminateSocket, 20000 + 1000, socket);

  var request;
  if(socket.compressed) {
    request={ pong: pingid }
  } else {
    request={ action: "pong", data: { ts: pingid } };
  };

//  console.log('pong '+socket.name, JSON.stringify(request));
  socket._ws.send(JSON.stringify(request));

}

function terminateSocket(socket) {

  console.log("Terminate socket "+socket.name+": ReadyState: "+socket._ws.readyState);
  socket._ws.terminate();

};

var HuobiSocket = function(url, keys, gzip) {
  this.endPoint = "https://api.huobi.pro";
  this.baseURL = url;
  this.timeout = 5000;
  this.initialized = false;
  this.authenticated = false;

  this.socket = new SocketClient(url, keys, gzip, () => {
    this.initialized=true;
    if(keys!=undefined) { this.login(this.socket, keys); } else { this.socket._ws.emit('initialized'); };
  });
};

HuobiSocket.prototype.login = async function(socket, api) {

  common={
    accessKey: api.apikey,
    signatureMethod: "HmacSHA256",
    signatureVersion: "2.1",
    timestamp: new Date().toISOString().split(".")[0]
  };

  var query=Object.keys(common)
    .sort( (a,b)=> (a > b) ? 1 : -1 )
    .reduce(function (a, k) {
      a.push(k + '=' + encodeURIComponent(common[k]))
      return a;
    }, []).join('&');

  //console.log("Query %s",query);

  var source="GET"+'\n'+
             "api.huobi.pro"+'\n'+
             "/ws/v2"+'\n'+
             query;
//  console.log("Source\n%s",source);

  let sign = crypto.createHmac('sha256', api.secret).update(source).digest('base64');

  common["authType"]="api";
  common["signature"]=sign;

  const request={
    action: "req", 
    ch: "auth",
    params: common
  };

//  console.log("req",socket.name,JSON.stringify(request));
  socket._ws.send(JSON.stringify(request));

};

module.exports = {
  marketApi: function(keys) { return new HuobiSocket(marketUrl, keys, GZIP); },
  MBPApi: function(keys) { return new HuobiSocket(MBPUrl, keys, GZIP); },
  tradingApi: function(keys) { return new HuobiSocket(tradeUrl, keys, NOZIP); }
};

HuobiSocket.prototype.setHandler = function(method, callback) {
  this.socket.setHandler(method, callback);
};

//
// MARKET DATA
//

HuobiSocket.prototype.subscribeCandles = async function(symbol,period) { // async
  const key="market."+symbol+".kline."+period;
  const reqID="id"+(++this._id);
  const options={sub:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

HuobiSocket.prototype.unsubscribeCandles = async function(symbol,period) { // async
  const key="market."+symbol+".kline."+period;
  const reqID="id"+(++this._id);
  const options={unsub:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

HuobiSocket.prototype.getCandle = async function(symbol,period) { // async
  const key="market."+symbol+".kline."+period;
  const reqID="id"+(++this._id);
  const options={req:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

// ------------------------------------------------------------

HuobiSocket.prototype.subscribeTickers = async function(symbol) { // async
  const key="market."+symbol+".ticker";
  const reqID="id"+(++this._id);
  const options={sub:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

HuobiSocket.prototype.unsubscribeTickers = async function(symbol) { // async
  const key="market."+symbol+".ticker";
  const reqID="id"+(++this._id);
  const options={unsub:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

HuobiSocket.prototype.getTicker = async function(symbol) { // async
  const key="market."+symbol+".ticker";
  const reqID="id"+(++this._id);
  const options={req:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

// ------------------------------------------------------------

HuobiSocket.prototype.subscribeMarketDepth = async function(symbol,type="step0") { // async
  const key="market."+symbol+".depth."+type;
  const reqID="id"+(++this._id);
  const options={sub:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

HuobiSocket.prototype.unsubscribeMarketDepth = async function(symbol,type="step0") { // async
  const key="market."+symbol+".depth."+type;
  const reqID="id"+(++this._id);
  const options={unsub:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

HuobiSocket.prototype.getMarketDepth = async function(symbol,type="step0") { // async
  const key="market."+symbol+".depth."+type;
  const reqID="id"+(++this._id);
  const options={req:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

//
// MARKET BY PRICE (MBP) DATA
//

HuobiSocket.prototype.subscribeMBPIncremetal = async function(symbol,levels) { // async
  const key="market."+symbol+".mbp."+levels;
  const reqID="id"+(++this._id);
  const options={sub:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

HuobiSocket.prototype.unsubscribeMBPIncremetal = async function(symbol,levels) { // async
  const key="market."+symbol+".mbp."+levels;
  const reqID="id"+(++this._id);
  const options={unsub:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

HuobiSocket.prototype.getMBPIncremetal = async function(symbol,levels) { // async
  const key="market."+symbol+".mbp."+levels;
  const reqID="id"+(++this._id);
  const options={req:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

// ------------------------------------------------------------

HuobiSocket.prototype.subscribeMBPRefresh = async function(symbol,levels) { // async
  const key="market."+symbol+".mbp.refresh"+levels;
  const reqID="id"+(++this._id);
  const options={sub:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

HuobiSocket.prototype.unsubscribeMBPRefresh = async function(symbol,levels) { // async
  const key="market."+symbol+".mbp.refresh"+levels;
  const reqID="id"+(++this._id);
  const options={unsub:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

HuobiSocket.prototype.getMBPRefresh = async function(symbol,levels) { // async
  const key="market."+symbol+".mbp.refresh"+levels;
  const reqID="id"+(++this._id);
  const options={req:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

// ------------------------------------------------------------

HuobiSocket.prototype.subscribeBests = async function(symbol) { // async
  const key="market."+symbol+".bbo";
  const reqID="id"+(++this._id);
  const options={sub:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

HuobiSocket.prototype.unsubscribeBests = async function(symbol) { // async
  const key="market."+symbol+".bbo";
  const reqID="id"+(++this._id);
  const options={unsub:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

HuobiSocket.prototype.getBest = async function(symbol) { // async
  const key="market."+symbol+".bbo";
  const reqID="id"+(++this._id);
  const options={unsub:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

// ------------------------------------------------------------

HuobiSocket.prototype.subscribeTrades = async function(symbol) { // async
  const key="market."+symbol+".trade.detail";
  const reqID="id"+(++this._id);
  const options={sub:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

HuobiSocket.prototype.unsubscribeTrades = async function(symbol) { // async
  const key="market."+symbol+".trade.detail";
  const reqID="id"+(++this._id);
  const options={unsub:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

HuobiSocket.prototype.getTrades = async function(symbol) { // async
  const key="market."+symbol+".trade.detail";
  const reqID="id"+(++this._id);
  const options={unsub:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

// ------------------------------------------------------------

HuobiSocket.prototype.subscribeStats = async function(symbol) { // async
  const key="market."+symbol+".detail";
  const reqID="id"+(++this._id);
  const options={sub:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

HuobiSocket.prototype.unsubscribeStats = async function(symbol) { // async
  const key="market."+symbol+".detail";
  const reqID="id"+(++this._id);
  const options={unsub:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

HuobiSocket.prototype.getStats = async function(symbol) { // async
  const key="market."+symbol+".detail";
  const reqID="id"+(++this._id);
  const options={unsub:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

// ------------------------------------------------------------

HuobiSocket.prototype.subscribeETP = async function(symbol) { // async
  const key="market."+symbol+".etp";
  const reqID="id"+(++this._id);
  const options={sub:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

HuobiSocket.prototype.unsubscribeETP = async function(symbol) { // async
  const key="market."+symbol+".etp";
  const reqID="id"+(++this._id);
  const options={unsub:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

HuobiSocket.prototype.getETP = async function(symbol) { // async
  const key="market."+symbol+".etp";
  const reqID="id"+(++this._id);
  const options={unsub:key,id:reqID};
  const result = await this.socket.request(reqID,options);
  return result;
};

//
// ACCOUNT AND ORDER
//

HuobiSocket.prototype.subscribeOrderUpdates = async function(symbol="*") { // async
  const key="orders#"+symbol;
  const options={action:"sub",ch:key};
  const result = await this.socket.request(key,options);
  return result;
};

HuobiSocket.prototype.unsubscribeOrderUpdates = async function(symbol="*") { // async
  const key="orders#"+symbol;
  const options={action:"unsub",ch:key};
  const result = await this.socket.request(key,options);
  return result;
};

// ------------------------------------------------------------

HuobiSocket.prototype.subscribeTradeClearing = async function(symbol="*", mode="0") { // async
  const key="trade.clearing#"+symbol+"#"+mode;
  const options={action:"sub","ch":key};
  const result = await this.socket.request(key,options);
  return result;
};

HuobiSocket.prototype.unsubscribeTradeClearing = async function(symbol="*", mode="0") { // async
  const key="trade.clearing#"+symbol+"#"+mode;
  const options={action:"unsub","ch":key};
  const result = await this.socket.request(key,options);
  return result;
};

// ------------------------------------------------------------

HuobiSocket.prototype.subscribeAccountChange = async function(symbol="*", mode="0") { // async
  const key="accounts.update#"+mode;
  const options={action:"sub",ch:key};
  const result = await this.socket.request(key,options);
  return result;
};

HuobiSocket.prototype.unsubscribeAccountChange = async function(symbol="*", mode="0") { // async
  const key="accounts.update#"+mode;
  const options={action:"unsub",ch:key};
  const result = await this.socket.request(key,options);
  return result;
};
