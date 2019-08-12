var SimpleStorage = artifacts.require("./SimpleStorage.sol");

module.exports = function(deployer) {
  // deployer.deploy(SimpleStorage, "0x1349584869A1C7b8dc8AE0e93D8c15F5BB3B4B87"); // ropsten gas relay hub
  deployer.deploy(SimpleStorage); // ganache
};
