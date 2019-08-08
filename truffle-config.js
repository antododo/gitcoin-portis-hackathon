const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");
require("dotenv").config();
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  compilers: {
    solc: {
      version: "0.4.24"
    }
  },
  networks: {
    ganache: {
      host: "localhost",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(
        process.env.MNEMONIC,
        "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY
      ),
      network_id: 3,
      // gas: 4500000,
      gasPrice: 10000000000
    },
    rinkeby: {
      provider: new HDWalletProvider(
        process.env.MNEMONIC,
        "https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY
      ),
      network_id: 4,
      // gas: 4500000,
      gasPrice: 10000000000
    }
  }
};
