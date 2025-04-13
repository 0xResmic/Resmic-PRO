// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./TempWallet.sol";
/**
 * @title Factory
 * @dev Factory Smart Contract to deploy the TempWallet
 */
contract Factory {
    /// TempWallet Contract address implementation.
    address public implementation;

    event WalletDeployed(address wallet, address client, bytes32 salt);

    /** 
    * @dev Constructor to deploy the Factory contract.
    * @param _implementation address TempWallet Contract address implementation.
    */
    constructor(address _implementation) {
        implementation = _implementation;
    }

    /** 
    * @dev deployWAllet deploys the TempWallet contract using the implementation contract address
    * @param salt bytes32 salt to predict the TempWallet contract address before deploying the contract.
    * @param _client address client address to withdraw the funds back to wallet.
    * @return address deployed TempWallet contract address
    */
    function deployWallet(bytes32 salt, address _client) external returns (address) {
        address clone = Clones.cloneDeterministic(implementation, salt);
        TempWallet(payable(clone)).initialize(payable(_client));
        return clone;
    }


    /** 
    * @dev getDeployAddress predict the TempWallet contract address before deploying the contract
    * @param salt bytes32 salt.
    * @return address predicted TempWallet contract address
    */
    function getDeployAddress(bytes32 salt) external view returns (address) {
        return Clones.predictDeterministicAddress(implementation, salt, address(this));
    }
}
