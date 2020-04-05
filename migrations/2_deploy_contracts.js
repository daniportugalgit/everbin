let ContractABI = artifacts.require("Everbin");

module.exports = async function(deployer, network, accounts) {
	await deployer.deploy(ContractABI);
	let contractInstance = await ContractABI.deployed();
};