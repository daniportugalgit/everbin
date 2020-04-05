const version = "0.9.6";
const sections = ["sec_balances", "sec_supply", "sec_roles", "sec_blocklist", "sec_maintenance"];

var _mainnet = {};
_mainnet.proxy = "0x0000000000000000000000000000000000000000"; 
_mainnet.token = "0x0000000000000000000000000000000000000000"; 
_mainnet.store = "0x0000000000000000000000000000000000000000"; 
var _ropsten = {};
_ropsten.proxy = "0x6351a6162380e5d22f61d4828994983e85cEA673";
_ropsten.token = "0x9D38EF21f1C02BAcD303D00Bc9b44F0F1F943c4e";
_ropsten.store = "0x914E11cf67c43A8a0ED19dd6B186Bc0F4B8B5B18";
var _deployed = {};
_deployed.proxy = _ropsten.proxy;
_deployed.token = _ropsten.token;
_deployed.store = _ropsten.store;


var _deployBlockLocal = 1;
var _deployBlockRopsten = 7114853;
var _deployBlockMainnet = 9268463;
var _currentDeployBlock = _deployBlockLocal;

var _etherscanRopstenURL = "https://ropsten.etherscan.io/tx/";
var _etherscanMainnetURL = "https://etherscan.io/tx/";
var _currentEtherscanURL = _etherscanRopstenURL;

var _messages = {};
_messages.success = "(sucesso)";
_messages.pending = "(aguardando mineração...)";
_messages.calling = "";
_messages.waitingMetamask = "METAMASK: aguardando aprovação...";
_messages.coloredPending = "<span style='color:purple'>" + _messages.pending + "</span>";
_messages.coloredSuccess = "<span style='color:green'>" + _messages.success + "</span>";

function getPendingHashMessage(hash) {
	let url = _currentEtherscanURL + hash;
    return "<a target='_blank' href='" + url + "''>" + hash + "</a> " + _messages.coloredPending;
}

function getSuccessHashMessage(hash) {
	let url = _currentEtherscanURL + hash;
    return "<a target='_blank' href='" + url + "''>" + hash + "</a> " + _messages.coloredSuccess;
}

function getColoredErrorMessage(msg) {
	return "<span style='color:red'>" + msg + "</span>";
}

function getAwaitingMetamaskMessage() {
	return _messages.waitingMetamask;
}

//contractAlias can be "proxy", "token" or "store"
function currentAddress(contractAlias) {
	return _deployed[contractAlias];
}

function currentEtherscanURL() {
	return _currentEtherscanURL;
}

function setRopstenEnvironment() {
	_deployed.proxy = _ropsten.proxy;
	_deployed.token = _ropsten.token;
	_deployed.store = _ropsten.store;
	_currentEtherscanURL = _etherscanRopstenURL;
	_currentDeployBlock = _deployBlockRopsten;
}

function setMainnetEnvironment() {
	_deployed.proxy = _mainnet.proxy;
	_deployed.token = _mainnet.token;
	_deployed.store = _mainnet.store;
	_currentEtherscanURL = _etherscanMainnetURL;
	_currentDeployBlock = _deployBlockMainnet;
}

function setEnvironment(currentNetwork) {
	if(currentNetwork == 1) {
		setMainnetEnvironment();
	} else if(currentNetwork == 3) {
		setRopstenEnvironment();
	}
}

function deployBlock() {
	return _currentDeployBlock;
}

module.exports = {
	version,
	sections,
	getPendingHashMessage,
	getSuccessHashMessage,
	getColoredErrorMessage,
	getAwaitingMetamaskMessage,
	currentAddress,
	currentEtherscanURL,
	setRopstenEnvironment,
	setMainnetEnvironment,
	setEnvironment,
	deployBlock
}