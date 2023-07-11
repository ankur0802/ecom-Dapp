const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};

// Global constants for listing an item...
const ID = 1;
const NAME = "Shoes";
const CATEGORY = "Clothing";
const IMAGE =
  "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg";
const COST = tokens(1);
const RATING = 4;
const STOCK = 5;
 

describe("Edapp", () => {
  let edapp;
  let deployear, buyer;

  beforeEach(async () => {
    // setup Accounts

    [deployear, buyer] = await ethers.getSigners();

    // deploye contract
    const Edapp = await ethers.getContractFactory("Edapp");
    edapp = await Edapp.deploy();
  });

  describe("Deployment", () => {
    it("Sets the owner", async () => {
      expect(await edapp.owner()).to.equal(deployear.address);
    });
  });

  describe("Listing", () => {
    let transaction;

    beforeEach(async () => {
      transaction = await edapp
        .connect(deployear)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);

      await transaction.wait();
    });

    it("Returns item attributes ", async () => {
      const item = await edapp.items(ID);
      expect(item.id).to.equal(ID);
      expect(item.name).to.equal(NAME);
      expect(item.category).to.equal(CATEGORY);
      expect(item.image).to.equal(IMAGE);
    //   expect(item.cost).to.equal(COST);
      expect(item.rating).to.equal(RATING);
      expect(item.stock).to.equal(STOCK);
    });


    it('Emits List event ', ()=>{
        expect(transaction).to.emit(edapp, 'List')
    })

  });
});
