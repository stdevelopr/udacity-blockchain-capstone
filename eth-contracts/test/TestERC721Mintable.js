var ERC721MintableComplete = artifacts.require("STERC721Token");

contract("TestERC721Mintable", (accounts) => {
  console.log("Accounts", accounts);

  const account_one = accounts[0];
  const account_two = accounts[1];
  const total_supply_account_one = 5;
  const total_supply_account_two = 7;
  const total_supply = total_supply_account_one + total_supply_account_two;

  describe("match erc721 spec", function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new({ from: account_one });

      // TODO: mint multiple tokens
      for (var i = 0; i < total_supply_account_one; i++) {
        await this.contract.mint(account_one, i, { from: account_one });
      }

      for (var i = total_supply_account_one; i < total_supply; i++) {
        await this.contract.mint(account_two, i, { from: account_one });
      }
    });

    it("should return total supply", async function () {
      let result = await this.contract.totalSupply.call();
      assert.equal(total_supply, result);
    });

    it("should get token balance", async function () {
      let result = await this.contract.balanceOf(account_one);
      assert.equal(total_supply_account_one, result);

      result = await this.contract.balanceOf(account_two);
      assert.equal(total_supply_account_two, result);
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it("should return token uri", async function () {
      let result = await this.contract.tokenURI(1);
      assert.equal("https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", result);
    });

    it("should transfer token from one owner to another", async function () {
      await this.contract.transferFrom(account_one, account_two, 1, {from: account_one});
      let result = await this.contract.ownerOf(1);
      assert.equal(account_two, result);

      result = await this.contract.balanceOf(account_one);
      assert.equal(total_supply_account_one - 1, result, "account_one has to have 1 token less");

      result = await this.contract.balanceOf(account_two);
      assert.equal(total_supply_account_two + 1, result, "account_one has to have 1 token more");

      result = await this.contract.totalSupply.call();
      assert.equal(total_supply, result, "total supply stays");
    });
  });

  describe("have ownership properties", function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new({ from: account_one });
    });

    it("should fail when minting when address is not contract owner", async function () {
      try {
        await this.contract.mint(account_two, 1, {from: account_two});
      } catch(err) {
        assert.equal(err.reason, "Only owner are allowed to this.");
      }
    });

    it("should return contract owner", async function () {
      let result = await this.contract.owner();
      assert.equal(account_one, result);
    });
  });
});
