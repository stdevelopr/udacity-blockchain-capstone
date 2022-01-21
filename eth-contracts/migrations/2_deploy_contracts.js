// migrating the appropriate contracts
var SquareVerifier = artifacts.require("./SquareVerifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
var STERC721Token = artifacts.require("./STERC721Token.sol");

module.exports = async function(deployer) {
  await deployer.deploy(STERC721Token);

  await deployer.deploy(SquareVerifier);
  const verifierContract = await SquareVerifier.deployed();

  await deployer.deploy(SolnSquareVerifier, verifierContract.address);
};
