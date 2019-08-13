var FortuneTeller = artifacts.require("./FortuneTeller.sol");

module.exports = function(deployer) {
  // deployer.deploy(FortuneTeller, "0x1349584869A1C7b8dc8AE0e93D8c15F5BB3B4B87"); // ropsten gas relay hub
  deployer.deploy(FortuneTeller); // ganache
};
