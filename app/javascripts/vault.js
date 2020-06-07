const version = "0.9.6";
const sections = ["sec_balances", "sec_supply", "sec_roles", "sec_blocklist", "sec_maintenance"];

var _mainnet = {};
_mainnet.everbin = "0x235c807707f453befc5b077de3295e278d223bdf";
var _ropsten = {};
_ropsten.everbin = "0xdC71087e70ec5B6Fe24a108aF364aAc0df257AD9";
var _deployed = {};
_deployed.everbin = _ropsten.everbin;

var _deployBlockLocal = 1;
var _deployBlockRopsten = 7114853;
var _deployBlockMainnet = 9268463;
var _currentDeployBlock = _deployBlockLocal;

var _etherscanRopstenURL = "https://ropsten.etherscan.io/tx/";
var _etherscanMainnetURL = "https://etherscan.io/tx/";
var _currentEtherscanURL = _etherscanRopstenURL;

var _messages = {};
_messages.success = "(success)";
_messages.pending = "(mining transaction...)";
_messages.calling = "";
_messages.waitingMetamask = "METAMASK: awaiting user approval...";
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
	_deployed.everbin = _ropsten.everbin;
	_currentEtherscanURL = _etherscanRopstenURL;
	_currentDeployBlock = _deployBlockRopsten;
}

function setMainnetEnvironment() {
	_deployed.everbin = _mainnet.everbin;
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