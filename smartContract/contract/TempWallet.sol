// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/proxy/Clones.sol";

/// @title TempWallet
/// @notice Temporary wallet contract used for individual payment sessions.
/// @dev This contract is intended to be deployed via Factory contract. It supports native & ERC20 token withdrawals.

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract TempWallet {
    /// @notice The client address, where funds will be withdrawn to this address.
    address public client;

    event TokenWithdrawn(address indexed to, address token, uint256 amount);
    event NativeWithdrawn(address to, uint256 amount);

    /** 
    * @dev Constructor to call when deploying the wallet contract.
    * @param _client Wallet address for client to withdraw the funds.
    */
    function initialize (address _client) external {
        client = _client;
    }

    receive() external payable {}

    
    /** 
    * @dev Withdraw ERC20 tokens from the contract back to the clinet to complete the payment session.
    * @param token ERC20 contract address to withdraw funds.
    */
    function withdrawToken(address token) external {
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(IERC20(token).transfer(client, balance), "Payment failed");
        emit TokenWithdrawn(client, token, balance);
    }

    /** 
    * @dev withdrawNative tokens from the contract back to the clinet to complete the payment session.
    */
    function withdrawNative() external {
        uint256 balance = address(this).balance;
        (bool success, ) = client.call{value: balance}("");
        require(success, "Payment Failed.");
        emit NativeWithdrawn(client, balance);
    }
}
