const { ethers, getCreate2Address, keccak256,  solidityPacked, AbiCoder } = require('ethers');
const { contractBytecode, FACTORY_Contract_ABI, providerURL } = require('./constant');
const crypto = require("crypto");
const { Contract } = require('ethers');

function generateRandomSalt() {
    return "0x" + crypto.randomBytes(32).toString("hex");
}

function generateWalletAddressOLD(factoryAddress, clientAddress) {
    try {
        const salt = generateRandomSalt();
        const abiCoder = new AbiCoder();
        const constructorEncoded = abiCoder.encode(["address"], [clientAddress]);
        // Compute the CREATE2 hash
        const create2Hash = keccak256(
            solidityPacked(
                ["bytes1", "address", "bytes32", "bytes32"],
                [
                    "0xff", // Fixed prefix
                    factoryAddress, // Address deploying the contract
                    salt, // Salt used in deployment
                    keccak256(contractBytecode + constructorEncoded.slice(2)) // Hash of bytecode + encoded constructor args
                ]
            )
        );
        const predictedAddress = "0x" + create2Hash.slice(-40);
        console.log("predictedAddress", predictedAddress)
        return {predictedAddress, salt};
        
    } catch (error) {
        return false
    }
}

async function generateWalletAddress(blockchain, factoryAddress, clientAddress) {
    try {
        let providerUrl = providerURL[blockchain.toUpperCase()];
        const salt = generateRandomSalt();
        const provider = new ethers.JsonRpcProvider(providerUrl);
        const contractInstance = new Contract(factoryAddress, FACTORY_Contract_ABI, provider);
        const predictedAddress = await contractInstance.getDeployAddress(salt);
        return {predictedAddress, salt};
        
    } catch (error) {
        console.log("error", error)
        return false
    }
}


module.exports = {generateWalletAddress}