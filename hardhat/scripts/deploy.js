const hre = require("hardhat");

async function main() {
  const ExchangePoint = await hre.ethers.getContractFactory("ExchangePoint");
  const exchangePoint = await ExchangePoint.deploy();

  await exchangePoint.deployed();

  console.log("ExchangePoint deployed to:", exchangePoint.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
