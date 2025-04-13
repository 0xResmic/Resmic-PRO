// import {  getCreate2Address, keccak256,  solidityPacked, AbiCoder } from('ethers');
import { AbiCoder, keccak256, solidityPack } from "ethers/lib/utils";
import { tempWalletByteCode, Chains, TokenAddress } from '../Constants/Constants';
import { crypto } from 'crypto-js';

export const getTempWalletAddress = async(Blockchain, Token, ClientWalletAddress) => {
    let factoryAddress = Chains[Blockchain]['FactoryContract'];
    let paymentToken = TokenAddress[Blockchain][Token]
    console.log("paymentToken", paymentToken)
    console.log("factoryAddress", factoryAddress);
    console.log("ClientWalletAddress", ClientWalletAddress);
    const salt = await generateRandomSalt();
    console.log("salt", salt)
    const getAddress = getDeployAddressJs(factoryAddress, salt,  ClientWalletAddress);
    return getAddress;


}

function generateRandomSalt() {
    // return "0x" + crypto.randomBytes(32).toString("hex");
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    let salt = Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
    return "0x"+ salt
}

function getDeployAddressJs(factoryAddress, salt, clientAddress) {
    const abiCoder = new AbiCoder();
    const constructorEncoded = abiCoder.encode(["address"], [clientAddress]);
    // Compute the CREATE2 hash
    const create2Hash = keccak256(
        solidityPack(
            ["bytes1", "address", "bytes32", "bytes32"],
            [
                "0xff", // Fixed prefix
                factoryAddress, // Address deploying the contract
                salt, // Salt used in deployment
                keccak256(tempWalletByteCode + constructorEncoded.slice(2)) // Hash of bytecode + encoded constructor args
            ]
        )
    );
    const predictedAddress = "0x" + create2Hash.slice(-40);
    return predictedAddress;
}

