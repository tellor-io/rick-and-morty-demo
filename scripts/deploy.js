require("hardhat-gas-reporter");
require('hardhat-contract-sizer');
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
const web3 = require('web3');

//npx hardhat run scripts/deploy.js --network mumbai

var tellorAddress = '0x8f55D884CAD66B79e1a131f6bCB0e66f4fD84d5B';//mumbai

async function deploy(_network, _pk, _nodeURL) {
    console.log("deploy ")
    await run("compile")

    var net = _network

    ///////////////Connect to the network
    let privateKey = _pk;
    var provider = new ethers.providers.JsonRpcProvider(_nodeURL)
    let wallet = new ethers.Wallet(privateKey, provider)

    ////////////// Deploy Rick and Morty

    //////////////// deploy
    console.log("Starting deployment ...")

    const rickandmorty = await ethers.getContractFactory("contracts/RickAndMorty.sol:RickAndMorty", wallet)
    const ram = await rickandmorty.deploy(tellorAddress, { gasPrice:50000000000 })
    console.log(" contract deployed to: ", ram.address)

    await ram.deployed()

    //////////////// Verify contracts

        // Wait for few confirmed transactions.
    // Otherwise the etherscan api doesn't find the deployed contract.
    console.log('waiting for tx confirmation...');
    await ram.deployTransaction.wait(7)

    console.log('submitting contract for verification...');
    await run("verify:verify",
        {
            address: ram.address,
            constructorArguments: [tellorAddress]
        },
    )
    console.log(" contract verified")
}


deploy("mumbai", process.env.TESTNET_PK, process.env.NODE_URL_MUMBAI)
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });