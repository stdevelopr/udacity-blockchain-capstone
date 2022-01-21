var SolnSquareVerifier = artifacts.require('./SolnSquareVerifier.sol');
var SquareVerifier = artifacts.require('SquareVerifier');
const proofJson = require("../../zokrates/code/square/proof.json");

contract("TestSolnSquareVerifier", accounts => {
  const account_one = accounts[0];
  const account_two = accounts[1];
  const token_id = 1;

  beforeEach(async() => {
    let squareVerifierContract = await SquareVerifier.new({from: account_one});
    this.contract = await SolnSquareVerifier.new(squareVerifierContract.address, {from: account_one});
  });

  // Test if a new solution can be added for contract - SolnSquareVerifier
  it("Test if a new solution can be added for contract ", async() => {
    let result = false;

    try {
      await this.contract.submitSolution(proofJson.proof.a, proofJson.proof.b, proofJson.proof.c, proofJson.inputs, account_two, token_id, { from: account_two });
      result = true;
    } 
    catch(e) {
      console.log(e);
      result = false;
    }
    assert.equal(result, true);
  });

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
  it("Test if an ERC721 token can be minted for contract ", async() => {
    let result = false;
    try {
      await this.contract.submitSolution(proofJson.proof.a, proofJson.proof.b, proofJson.proof.c, proofJson.inputs, account_two, token_id, { from: account_two });
      await this.contract.mint(account_two, token_id, { from: account_one });
      result = true
    } catch(e) {
      console.log(false);
      result = false;
    }
    assert.equal(result, true);
  });
});
