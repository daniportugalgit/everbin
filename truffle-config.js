// Allows us to use ES6 in our migrations and tests.
require("babel-register");

module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*", // Match any network id
            gas: 6721975
        },
        hom: {
	      network_id: 3, // Ropsten
	    },
	    live: {
	      network_id: 1, // MainNet
	    }
    },

    compilers: {
    solc: {
      version: "0.6.4"
    },
  }
};
