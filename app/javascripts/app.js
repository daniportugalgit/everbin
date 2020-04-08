// Import the page's CSS. Webpack will know what to do with it.
import "../styles/app.css"

// Import basic libraries:
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Gasmon from 'gasmon'

// Import contract artifacts and turn them into usable abstractions:
import contract_artifacts from '../../build/contracts/Everbin.json'
const Contract = TruffleContract(contract_artifacts)

// Import my custom tools:
const Flow = require('./flow.js')
const Vault = require('./vault.js')
const Metamon = require('./metamon.js')
const Bgmon = require('./bgmon.js')

let _everbin
let _localDev = false //set this to true (and disable metamask) to test with ganache

window.App = {
  start: async function() {
    var self = this

    Vault.setEnvironment(Metamon.currentNetwork())

    await App.initContracts()

    Metamon.init(App.onMetamaskError,
                 App.onMetamaskNeedLogin,
                 App.onMetamaskConnect,
                 App.onMetamaskDisconnect,
                 _localDev, false)

    Gasmon.init(App.onGasPricesReceived)

    App.setTotals()
  },

  initContracts: async function() {
    Contract.setProvider(web3.currentProvider)
    
    if (_localDev) {
      _everbin = await Contract.deployed()
    } else {
      try {
        _everbin = await Contract.at(Vault.currentAddress("everbin"))
      } catch(e) {
        console.error("ERROR: " + e.message)
      }
    }
  },
  /////////////////////////////
  setTotals: async function() {
    Flow.call(_everbin,
              "status",
              [],
              App.onTotalsResult,
              App.onTotalsError)
  },

  onTotalsResult: function(functionName, result, convertFromWei) {
    $("#totalBins").html(result[0].toString(10))
    $("#totalBytes").html(result[1].toString(10))
  },

  onTotalBinsError: function(functionName, error) {
    alert("ERROR: cannot fetch total number of bins and bytes.")
    console.log("totals error: " + error.message)
  },

  createNewBin: function() {
    let content = $("#createTextarea").val()

    App.showButtonLoader('create')
    
    //@SOL: function create(string memory content) public returns(uint, uint);
    Flow.execute(_everbin,
      "create",
      [content],
      {from:Metamon.currentUser(), gasPrice:Gasmon.idealGasPrice(1)},
      App.onHash,
      App.onExecutionSuccess,
      App.onError);
  },

  onHash: function(systemName, hash) {
    //$("#" + systemName + "_result").html(Vault.getPendingHashMessage(hash));
    console.log('*** onHash: ' + hash)
  },

  onError: function(systemName, message) {
    //$("#" + systemName + "_result").html(Vault.getColoredErrorMessage(message));
    App.hideButtonLoader(systemName)
    console.log('*** onError: ' + message)
  },

  onExecutionSuccess: async function(systemName, receipt) {
    //$("#" + systemName + "_result").html(Vault.getSuccessHashMessage(receipt.tx));

    App.hideButtonLoader(systemName)
    await App.setTotals()
    console.log(JSON.stringify(receipt))
  },

  readBin: async function() {
    let number = $("#binNumber").val()

    $("#readForm").hide();
	$("#readLoader").show();

    //@SOL: mapping(uint => string) public bins;
    Flow.call(_everbin,
      "bins",
      [number],
      App.onReadResult,
      App.onReadError)
  },

  onReadResult: function(functionName, result, convertFromWei) {
    $("#readForm").show();
    $("#readLoader").hide();

    $("#readingBinNumber").html($("#binNumber").val());
    $("#readTextarea").html(result);
    $("#readContainer").show();

    
    $("#readTextarea").height("1px");
    $("#readTextarea").height((10 + $("#readTextarea").prop("scrollHeight")) + "px");
    
    
    console.log(result)
  },

  onReadError: function(systemName, message) {
    //$("#" + systemName + "_result").html(Vault.getColoredErrorMessage(message));
    $("#readForm").show();
    $("#readLoader").hide();
    console.log('*** onError: ' + message)
  },

  showButtonLoader: function(buttonName) {
    $("#" + buttonName + "Button").hide();
	$("#" + buttonName + "Loader").show();
  },

  hideButtonLoader: function(buttonName) {
    $("#" + buttonName + "Button").show();
	$("#" + buttonName + "Loader").hide();
  },

  hideReadBin: function() {
    $("#readContainer").hide();
  },

  ////////////////////////////
  onMetamaskError: function(message) {
    console.log(message);
  },

  onMetamaskNeedLogin: function() {
    alert("Please log into Metamask.");
    //App.setConnectButtonVisibility(true);
    console.log("onMetamaskNeedLogin");
  },

  onMetamaskConnect: async function(accs) {
    //$("#user_address").html(Metamon.currentUser());
    //App.setConnectButtonVisibility(false);
    //await App.setUserBadges();
    Bgmon.activateBackground();
    //$("#speed_div").show();
    console.log("onMetamaskConnect");
  },

  onMetamaskDisconnect: function() {
    //App.setConnectButtonVisibility(true);
    Bgmon.deactivateBackground();
    //$("#speed_div").hide();
    console.log("onMetamaskDisconnect");
  },

  onResize: function() {
    if(Metamon.currentUser() != 'undefined')
      Bgmon.activateBackground();
  },

  copyUserToClipboard: function() {
    Metamon.copyUserToClipboard();
  },

  updateVersion: function() {
    $('#versionLabel').html("v " + Vault.version);
  },

  onGasPricesReceived: function(response) {
    $("#speed_info").html(Gasmon.idealGasPriceInGwei());
  },

  toggleSpeed: function() {
    Gasmon.nextSpeed();
    
    $("#speed_info").html(Gasmon.idealGasPriceInGwei());
    $("#speed1_icon").hide();
    $("#speed2_icon").hide();
    $("#speed3_icon").hide();
    $("#speed4_icon").hide();
    $("#speed" + Gasmon.currentSpeed() + "_icon").show();
  },
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof window.web3 !== 'undefined') {
    console.log("Using web3 detected from external source.")
    
    window.web3 = new Web3(web3.currentProvider);
    //window.web3 = window['ethereum'] || window.web3.currentProvider;
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545.");
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});