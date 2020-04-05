/**
 * @author Daniel Portugal daniportugal@gmail.com
 * 
 * Metamon manages web3 accounts for login/logout/metamask
 * This is a WIP
**/

const messageMainnet = "Ambiente de produção (Mainnet)";
const messageRopsten = "Ambiente de testes (Ropsten)";
const messageLocal = "Ambiente de desenvolvimento (Local)";
const messageOther = "Para continuar, selecione a rede Ropsten no Metamask";

var _showEnvironmentWarning;
var _localDev;
var _accounts;
var _currentUser;
var _monitorInterval;
var _onLogin;
var _onLogout;

function init(onError, onNeedLogin, onUserLogin, onUserLogout, localDev, showEnvironmentWarning) {
  _localDev = localDev;
  
  if(showEnvironmentWarning) {
    addNetworkWarningDiv();  
    setEnvironmentWarning();
  }

  if(!_localDev)
    _monitorInterval = setInterval(userPolling, 500);

  _onLogin = onUserLogin;
  _onLogout = onUserLogout;

  web3.eth.getAccounts(function(error, accs) {
    if (error != null) {
      console.log("Metamon :: Metamask ERROR: " + error.message);
      onError(error.message);
      return;
    }

    if (accs.length == 0) {
      console.log("Metamon :: Metamask: please login.");
      onNeedLogin();
    } else {
      _onLogin_internal(accs);
    }
  });

  console.log("Metamon :: initializing...");
}

function addNetworkWarningDiv() {
  $('body').prepend("<div id=\"network_div\" style=\"display: none;\"></div>");
}

function setEnvironmentWarning() {
  if(_localDev) {
    $("#network_div").html(messageLocal);
    $("#network_div").css("backgroundColor", "darkblue");
    $("#network_div").show();
    console.log("Metamon :: Connected to local network.");
    return;
  }

  if(currentNetwork() == 1) {
    $("#network_div").html(messageMainnet);
    $("#network_div").css("backgroundColor", "darkred");
    $("#network_div").show();
    console.log("Metamon :: Connected to MAINNET.");
  } else if(currentNetwork() != 3) {
    $("#network_div").html(messageOther);
    $("#network_div").css("backgroundColor", "chocolate");
    $("#network_div").show();
    console.log("Metamon :: Stopped: network must be either Local, or Ropsten, or Mainnet.");
  } else {
    $("#network_div").html(messageRopsten);
    $("#network_div").css("backgroundColor", "darkgreen");
    $("#network_div").show();
    console.log("Metamon :: Connected to Ropsten network.");
  }
}

function userPolling() {
  web3.eth.getAccounts(function(error, accs) {
    if (accs.length != 0) {
      if(_currentUser == 'undefined') {
        _onLogin_internal(accs);
      } else {
        if(accs[0] != _currentUser) {
          _onLogin_internal(accs);
        }
      }
    } else {
      if(_currentUser != 'undefined') {
        _onLogout_internal();
      }
    }
  });
}

function _onLogin_internal(accs) {
  _accounts = accs;
  _currentUser = _accounts[0];
  console.log("Metamon :: User login: " + _currentUser);
  _onLogin(accs);
}

function _onLogout_internal() {
  _currentUser = 'undefined';
  console.warn("Metamon :: Metamask disconnected.");
  _onLogout();
}

function accounts() {
  return _accounts;
}

function currentUser() {
  return _currentUser;
}

function connectToMetamask() {
  web3.currentProvider.enable();
}

function currentNetwork() {
  return web3.currentProvider.networkVersion;
}

function copyUserToClipboard() {
  let textToCopy = _currentUser;
  
  $("body")
    .append($('<input type="text" name="fname" class="textToCopyInput"/>' )
    .val(textToCopy))
    .find(".textToCopyInput")
    .select();
  try {
    document.execCommand('copy');
    $("#user_address").html("USER ADDRESS COPIED TO THE CLIPBOARD");
    setTimeout(function(){ $("#user_address").html(_currentUser); }, 3000);
  } catch (err) {
    //do nothing;
  }
  $(".textToCopyInput").remove();
}

module.exports = {
  accounts,
  currentUser,
  init,
  connectToMetamask,
  currentNetwork,
  copyUserToClipboard
};


/*
MetaMask: MetaMask will soon stop reloading pages on network change.
If you rely upon this behavior, add a 'networkChanged' event handler to trigger the reload manually: https://metamask.github.io/metamask-docs/API_Reference/Ethereum_Provider#ethereum.on(eventname%2C-callback)
Set 'ethereum.autoRefreshOnNetworkChange' to 'false' to silence this warning: https://metamask.github.io/metamask-docs/API_Reference/Ethereum_Provider#ethereum.autorefreshonnetworkchange'
 */
    