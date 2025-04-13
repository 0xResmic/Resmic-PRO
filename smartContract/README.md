# Resmic Smart Contract

## Overview

This smart contract is part of the **Resmic** decentralised crypto payment infrastructure. It is responsible for **generating non-custodial, on-chain wallet sessions** for individual payment links/pages, enabling instant and secure crypto payments across multiple blockchains.

## 🎯 Purpose

- Deploys temporary or session-based wallet contracts using a **Factory**
- Handles **token transfers** (deposis and withdraw)
- Built for **multi-chain support** with compatibility for EVM chains.

---

## 🧱 Architecture

### 🔹 Factory Contract (`Factory.sol`)
- Deploys TempWallet contracts using `Clones`.

### 🔹 Payment Wallet (`TempWallet.sol`)

- Receives native or ERC20 tokens
- Can be withdrawn by anyone, but only to the `client`.

---

## Key Features

- ✅ Non-custodial: Funds go directly to the wallet the merchant controls
- ✅ No intermediaries or approvals required
- ✅ Multi-token support (via ERC20 interface)
- ✅ Gas-efficient design with low deployment costs

---

## Security Considerations

- Contract does not hold any privileged access
- No reentrancy vectors as all logic is single-call

---



