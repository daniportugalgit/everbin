//Keeping this file because it has a hybrid implementation with two backens (on and off chain);
//And although it's terrible, I want to remember this. Judge me.

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

const backendUrl = "http://localhost:3333"

let _everbin
let _localDev = true //set this to true (and disable metamask) to test with ganache



window.App = {
  start: async function() {
    var self = this

    Vault.setEnvironment(Metamon.currentNetwork())

    await App.initContracts()

    Metamon.init(App.onMetamaskError,
                 App.onMetamaskNeedLogin,
                 App.onMetamaskConnect,
                 App.onMetamaskDisconnect,
                 _localDev, true)

    Gasmon.init(App.onGasPricesReceived)

    App.setTotalBins()
    App.setTotalBytes()
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
  setTotalBins: async function() {
    Flow.call(_everbin,
              "binCount",
              [],
              App.onTotalBinsResult,
              App.onTotalBinsError)
  },

  onTotalBinsResult: function(functionName, result, convertFromWei) {
    let finalResult = result.toString(10)
    $("#totalBins").html(finalResult)
  },

  onTotalBinsError: function(functionName, error) {
    alert("ERROR: cannot fetch total number of bins.")
    console.log("totalBins error: " + error.message)
  },

  ///////////////////////////////////

  setTotalBytes: async function() {
    fetch(backendUrl + "/bytes")
      .then(function(response){
        response.json().then(function(data){
          App.onTotalBytesReceived(data);
        });
      })
      .catch(function(e){ 
        console.error('Could not fetch total bytes from the off-chain backend: ', e.message);
      });
  },

  /*
  {
    "total_bytes": 204,
    "last_bin": 0
  }
  */
  onTotalBytesReceived: function(response) {
    $('#totalBytes').html(response.total_bytes);
  },

  //////////////////////////////////

  createNewBin: function() {
    let content = $("#createTextarea").val()
    
    //@SOL: function create(string memory content) public returns(uint);
    Flow.execute(_everbin,
      "create",
      [content],
      {from:Metamon.currentUser(), gasPrice:Gasmon.idealGasPrice(1)},
      App.onHash,
      App.onExecutionSuccess,
      App.onError);

      App.sendBytesToBackend()
  },

  //weird flow, just for studiyng the connection with an off-chain backend (should be removed later)
  sendBytesToBackend: function() {
    let content = $("#createTextarea").val()
    let bytes = (new TextEncoder().encode(content)).length
    fetch(backendUrl + "/bin/create",
    { 
      method: "POST",
      body: JSON.stringify({ bytes: bytes }), 
      headers: { "Content-type": "application/json; charset=UTF-8" }
    })
    .then(function(response){
      response.json().then(function(data){
        App.onTotalBytesReceived(data);
      });
    })
    .catch(function(e){ 
      console.error('Could not fetch total bytes from the off-chain backend: ', e.message);
    });
  },

  onHash: function(systemName, hash) {
    //$("#" + systemName + "_result").html(Vault.getPendingHashMessage(hash));
    console.log('*** onHash: ' + hash)
  },

  onError: function(systemName, message) {
    //$("#" + systemName + "_result").html(Vault.getColoredErrorMessage(message));
    //Ui.hideButtonLoader(systemName);
    console.log('*** onError: ' + hash)
  },

  onExecutionSuccess: async function(systemName, receipt) {
    //$("#" + systemName + "_result").html(Vault.getSuccessHashMessage(receipt.tx));
    //Ui.hideButtonLoader(systemName);

    await App.setTotalBins()
    console.log(JSON.stringify(receipt))
  },

  readBin: async function() {
    let number = $("#binNumber").val()

    //@SOL: mapping(uint => string) public bins;
    Flow.call(_everbin,
      "bins",
      [number],
      App.onReadResult,
      App.onError)
  },

  onReadResult: function(functionName, result, convertFromWei) {
    console.log(result)
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