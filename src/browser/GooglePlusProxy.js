cordova.define("cordova-plugin-googleplus.GooglePlusProxy", function (require, exports, module) {

  var webviewPersistId = 'googleconnect.tuto.com';

  function _callWebview(url, callback) {
    var webview = document.createElement('webview');

    webview.setAttribute('id', 'google-login');
    webview.setAttribute('partition', 'persist:' + webviewPersistId);
    webview.setAttribute('minwidth', '576');
    webview.setAttribute('minheight', '580');
    webview.setAttribute('height', '580');
    webview.setAttribute('style', 'height:580px!important');
    webview.addEventListener('loadcommit', _loadcommit);
    webview.src = url;
    document.body.appendChild(webview);

    function _loadcommit(event) {
      var currUrl = document.createElement('a');
      currUrl.href = event.url;
      if (currUrl.hostname !== 'localhost') {
        callback(webview);
      }
      webview.removeEventListener('loadcommit', _loadcommit);
    }
  }

  var GooglePlus = {

    isAvailable: function (callback) {
      console.log('isAvailable');
    },

    login: function (successCallback, errorCallback, options) {
      var http = window.require('http');
      var param = 'scope=' + options[0].scopes;
      param += '&client_id=' + options[0].webClientId;
      param += '&redirect_uri=http://localhost:9004';
      param += '&response_type=code';
      var gUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + param;
      var modal;

      function _appendWebview(webview) {
        document.getElementById('background-loading-gplus').appendChild(webview);
      }

      function handleRequest(request, response) {
        var code = '';
        var splitedUrl = request.url.split('?');
        var paramsArr = splitedUrl[1].split('&');
        paramsArr.forEach(function (param) {
          var splitedParam = param.split('=');
          if (splitedParam[0] === 'code') {
            code = splitedParam[1];
            successCallback({code: code});
          }
        });
        response.end('Ok');
      }

      _callWebview(gUrl, _appendWebview);
      http.createServer(handleRequest).listen(9004);
    },

    trySilentLogin: function (options, successCallback, errorCallback) {
      successCallback('not supported by NW browser');
    },
    logout: function (successCallback, errorCallback) {
      successCallback('not supported by NW browser');
    },
    disconnect: function (successCallback, errorCallback) {
      var logoutUrl = 'https://accounts.google.com/Logout';
      _callWebview(logoutUrl, function () {
      });
      successCallback();
    },
    getSigningCertificateFingerprint: function (successCallback, errorCallback) {
      successCallback('not supported by NW browser');
    }
  };

  module.exports = GooglePlus;

  require("cordova/exec/proxy").add("GooglePlus", GooglePlus);

});
