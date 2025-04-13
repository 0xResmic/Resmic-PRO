const { ethers, Contract, Wallet, getCreate2Address, keccak256,  solidityPacked, AbiCoder } = require('ethers');
const { FACTORY_Contract_ABI, TEMP_Wallet_Contract_ABI, providerURL, wssURL } = require('./constant');
const { updatePaymentService } = require('../services/makePaymentServices');
const { default: BigNumber } = require('bignumber.js');
const { Mutex } = require("async-mutex");
const { Alchemy }= require("alchemy-sdk");

const PK = process.env.WALLETPK;
const FactoryContractABI  = FACTORY_Contract_ABI;
const TempContractABI  = TEMP_Wallet_Contract_ABI;

async function deployContract(factoryContractAddress, salt, client, signer, blockchain) {
    let blockchain_ = blockchain.toUpperCase()
    let gasLimit;
    let gasPrice;
    try {
        const contractInstance = new Contract(factoryContractAddress, FactoryContractABI, signer );
        switch (blockchain_) {
            case "POLYGON":
                let estimatedGas = await contractInstance.deployWallet.estimateGas(salt, client);
                let  num = new BigNumber(estimatedGas)
                gasLimit = num.multipliedBy(250).dividedBy(100);
                gasLimit = parseInt(gasLimit).toString()
                break;
            case "SEPOLIA":
                gasLimit = 7_00_000
                break;
            case "BASE":
                gasLimit = 500000
                break;
            case "BNB_CHAIN":
                gasLimit = 500000
                break;
            case "XDC-NETWORK":
                gasLimit = 500000
                break;
            default:
                gasLimit = 7_00_002
                break;
        }
        let deployContract_ = await contractInstance.deployWallet(salt, client, {gasLimit:gasLimit, gasPrice:gasPrice});
        deployContract_?.wait()
        console.log("deployContract?.hash", deployContract_?.hash)
        return deployContract_?.hash
    } catch (error) {
        console.log("Unable to deploy contract", error)
        return false
    }   
}

async function withdrawERC20(_tempWalletAddress, _tempTokenAddress,signer, provider,blockchain) {
    try {
        const contractInstance = new Contract(_tempWalletAddress ,TempContractABI, signer);
        let gasLimit;
        let withdrawERC20
        let blockchain_ = blockchain.toUpperCase()
        switch (blockchain_) {
            case "POLYGON":
                gasLimit = 10_00_000
                withdrawERC20 = await contractInstance.withdrawToken(_tempTokenAddress, {gasLimit:gasLimit});
                break;
                case "SEPOLIA":
                  gasLimit = 7_00_000
                  withdrawERC20 = await contractInstance.withdrawToken(_tempTokenAddress, {gasLimit:gasLimit});
                break;
            case "BASE":
                gasLimit = 500000
                withdrawERC20 = await contractInstance.withdrawToken(_tempTokenAddress, {gasLimit:gasLimit});
                break;
            case "BNB_CHAIN":
                gasLimit = 500000
                withdrawERC20 = await contractInstance.withdrawToken(_tempTokenAddress, {gasLimit:gasLimit});
                break;
            case "XDC-NETWORK":
                gasLimit = 500000
                withdrawERC20 = await contractInstance.withdrawToken(_tempTokenAddress, {gasLimit:gasLimit});
                break;
            default:
                gasLimit = 7_00_002
                withdrawERC20 = await contractInstance.withdrawToken(_tempTokenAddress, {gasLimit:gasLimit});
                break;
        }
        // let withdrawERC20 = await contractInstance.withdrawToken(_tempTokenAddress, {gasLimit:gasLimit, gasPrice:gasPrice});
        let receipt = await withdrawERC20?.wait();
        if (receipt?.status === 1) {
            console.log("✅ ERC-20 withdrawal successful!", receipt?.hash);
            return receipt?.hash;
        } else {
            console.error("❌ ERC-20 withdrawal failed!", receipt?.hash);
            return false;
        }
    } catch (error) {
        console.log("Error:  ", error)
        return false;
    }
}
async function withdrawNativeFn(_tempWalletAddress, signer, blockchain) {
    try {

        const contractInstance = new Contract(_tempWalletAddress ,TempContractABI, signer);
        let gasLimit;
        let blockchain_ = blockchain.toUpperCase()
        let withdrawNative
        switch (blockchain_) {
            case "POLYGON":
                gasLimit = 10_00_000
                withdrawNative = await contractInstance.withdrawNative({gasLimit});
                break;
            case "SEPOLIA":
                gasLimit = 7_00_000
                withdrawNative = await contractInstance.withdrawNative({gasLimit});
                break;
                case "BASE":
                  gasLimit = 500000
                  break;
                case "BNB_CHAIN":
                    gasLimit = 500000
                    withdrawNative = await contractInstance.withdrawNative({gasLimit});
                    break;
                case "XDC-NETWORK":
                      gasLimit = 500000
                      withdrawNative = await contractInstance.withdrawNative({gasLimit});
                break;
                
            default:
                gasLimit = 7_00_002
                withdrawNative = await contractInstance.withdrawNative({gasLimit});
                break;
        }
        // let withdrawNative = await contractInstance.withdrawNative({gasLimit, gasPrice:gasPrice});
        let receipt = await withdrawNative?.wait();
        // console.log("receipt", receipt)
        if (receipt?.status === 1) {
            console.log("✅ Native withdrawal successful!", receipt?.hash);
            return receipt?.hash;
        } else {
            console.error("❌ Native withdrawal failed!", receipt?.hash);
            return false;
        }
        
    } catch (error) {
        console.log("Error, ", error);
        return false;
    }

}

const activeUsers = new Map();
const mutex = new Mutex();

async function deployAndWithdraw(
  session_id,
  predictedAddress,
  salt_,
  client_,
  value_,
  factoryAddress,
  blockchain,
  token,
  erc20Address,
  coupon_code,
  blockconfirmations = 1,
  wsClients
) {
  const release = await mutex.acquire();
  try {
    if (activeUsers.has(predictedAddress)) {
      console.log(`Already tracking ${predictedAddress}`);
      return;
    }
    activeUsers.set(predictedAddress, {});
  } finally {
    release();
  }

  console.log(`🔍 Starting tracking for ${predictedAddress}...`);
  
  let providerUrl_ = providerURL[blockchain.toUpperCase()];
  let wssUrl_ = wssURL[blockchain.toUpperCase()];
  let provider = new ethers.JsonRpcProvider(providerUrl_);
  let signer = new ethers.Wallet(PK, provider);
  const wssProvider = new ethers.WebSocketProvider(wssUrl_);

  let stopped = false;
  let tokenContract;

  let sessionTimeout = setTimeout(() => {
    console.log(`🛑 Max session time reached for ${predictedAddress}. Stopping tracking.`);
    sendResponse({ success: false, status: "session_expired", message: "Tracking ended after 10 minutes." });
    stopTracking();
  }, 10 * 60 * 1000); // 10 minutes

  function clearSessionTimeout() {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      sessionTimeout = null;
      console.log(`⏳ Session timeout cleared for ${predictedAddress}. Tracking will continue until payment is confirmed.`);
    }
  }

  async function handlePayment(txHash, from, isERC20) {
    clearSessionTimeout();
    console.log(`✅ Payment detected! Deploying contract...`);
    
    let deployContract_ = await deployContract(factoryAddress, salt_, client_, signer, blockchain);
    if (!deployContract_) {
      sendResponse({ status: false, message: "Contract deployment failed." });
      return stopTracking();
    }
    console.log("🚀 Contract deployed!");

    console.log(`⏳ Waiting for ${txHash} confirmations...`);
    const receipt = await wssProvider.waitForTransaction(txHash, blockconfirmations);
    console.log(`🔄 Transfer Confirmed in block ${receipt.blockNumber}`);

    let withdrawTx;
    if (isERC20) {
      withdrawTx = await withdrawERC20(predictedAddress, erc20Address, signer, provider, blockchain);
    } else {
      withdrawTx = await withdrawNativeFn(predictedAddress, signer, provider, blockchain);
    }

    if (withdrawTx) {
      console.log("💰 Funds Withdrawn Successfully!");
      await updatePaymentService(session_id, "Completed", blockchain, token, txHash, from, coupon_code);
      sendResponse({ status: true, address: from, txHash, withdrawToClientHash: withdrawTx });
    } else {
      console.log("⚠️ Unable to withdraw funds.");
      await updatePaymentService(session_id, "Failed", blockchain, token, txHash, from, coupon_code);
      sendResponse({ status: false, message: "Withdrawal failed." });
    }
    stopTracking();
  }

  if (erc20Address) {
    console.log("We are tracking the ERC20 token payment.")
    tokenContract = new ethers.Contract(
      erc20Address,
      ["event Transfer(address indexed from, address indexed to, uint256 value)"],
      wssProvider
    );

    tokenContract.on("Transfer", async (from, to, value, event) => {
      if (to.toLowerCase() === predictedAddress.toLowerCase() && 
    //   BigNumber.from(value).gte(BigNumber.from(value_))
      BigNumber(value).gte(BigNumber(value_))  
    
    ) {
        await handlePayment(event?.log?.transactionHash, from, true);
      }
    });
  } else {
    console.log("We are tracking Native tokens here.")
    const pendingListener = async (txHash) => {
      try {
        const tx = await wssProvider.getTransaction(txHash);
        if (
          tx &&
          tx.to &&
          tx.to.toLowerCase() === predictedAddress.toLowerCase() &&
        //   BigNumber.from(tx.value).gte(BigNumber.from(tx.value))
          BigNumber(tx.value).gte(BigNumber(value_))  
        
        ) {
            console.log("Handling payments")
          await handlePayment(txHash, tx.from, false);
        }
      } catch (error) {
        console.error(`❌ Error processing transaction:`, error);
      }
    };

    wssProvider.on("pending", pendingListener);
    console.log("Here after wss")
    activeUsers.set(predictedAddress, { sessionTimeout, pendingListener });
  }

  function stopTracking() {
    if (stopped) return;
    stopped = true;
    console.log(`🛑 Stopping tracking for ${predictedAddress}`);

    if (tokenContract) {
      tokenContract.removeAllListeners("Transfer");
    }
    
    if (activeUsers.has(predictedAddress)) {
      let userData = activeUsers.get(predictedAddress);
      if (userData.pendingListener) {
        wssProvider.off("pending", userData.pendingListener);
      }
      clearTimeout(userData.sessionTimeout);
    }
    activeUsers.delete(predictedAddress);

    wsClients.forEach((ws) => {
      if (ws.readyState === ws.OPEN) {
        ws.close();
      }
    });
  }

  function sendResponse(data) {
    wsClients.forEach((ws) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(data));
      }
    });
  }
}

async function deployAndWithdrawALCHEMY(
  session_id,
  predictedAddress,
  salt_,
  client_,
  value_,
  factoryAddress,
  blockchain,
  token,
  erc20Address,
  coupon_code,
  blockconfirmations = 1,
  wsClients
) {
  // Prevent duplicate tracking
  const release = await mutex.acquire();
  try {
    if (activeUsers.has(predictedAddress)) {
      console.log(`Already tracking ${predictedAddress}`);
      return;
    }
    activeUsers.set(predictedAddress, {});
  } finally {
    release();
  }

  console.log(`🔍 Starting tracking for ${predictedAddress}...`);

  // Standard provider for sending transactions & waiting for confirmations
  const providerUrl_ = providerURL[blockchain.toUpperCase()];
  const provider = new ethers.JsonRpcProvider(providerUrl_);
  const signer = new ethers.Wallet(PK, provider);

  // Configure the Alchemy SDK for WebSocket subscriptions.
  // (Adjust the network mapping as needed.)
  const alchemySettings = {
    apiKey: process.env.ALCHEMY_API_KEY, // make sure this is set in your env
    network:
      blockchain.toUpperCase() === "BASE"
        ? Network.BASE_MAINNET
        : Network.ETH_GOERLI, // Example: adjust for your use-case
  };
  const alchemy = new Alchemy(alchemySettings);

  let stopped = false;

  // Set a max session timeout of 10 minutes
  let sessionTimeout = setTimeout(() => {
    console.log(
      `🛑 Max session time reached for ${predictedAddress}. Stopping tracking.`
    );
    sendResponse({
      success: false,
      status: "session_expired",
      message: "Tracking ended after 10 minutes.",
    });
    stopTracking();
  }, 10 * 60 * 1000); // 10 minutes

  function clearSessionTimeout() {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      sessionTimeout = null;
      console.log(
        `⏳ Session timeout cleared for ${predictedAddress}. Tracking will continue until payment is confirmed.`
      );
    }
  }

  async function handlePayment(txHash, from, isERC20) {
    clearSessionTimeout();
    console.log(`✅ Payment detected! Deploying contract...`);

    let deployContract_ = await deployContract(
      factoryAddress,
      salt_,
      client_,
      signer,
      blockchain
    );
    if (!deployContract_) {
      sendResponse({
        status: false,
        message: "Contract deployment failed.",
      });
      return stopTracking();
    }
    console.log("🚀 Contract deployed!");

    console.log(`⏳ Waiting for ${txHash} confirmations...`);
    // Use the JSON-RPC provider to wait for confirmations
    const receipt = await provider.waitForTransaction(
      txHash,
      blockconfirmations
    );
    console.log(`🔄 Transfer confirmed in block ${receipt.blockNumber}`);

    let withdrawTx;
    if (isERC20) {
      withdrawTx = await withdrawERC20(predictedAddress, erc20Address, signer, blockchain);
    } else {
      withdrawTx = await withdrawNativeFn(predictedAddress, signer, blockchain);
    }

    if (withdrawTx) {
      console.log("💰 Funds withdrawn successfully!");
      await updatePaymentService(
        session_id,
        "Completed",
        blockchain,
        token,
        txHash,
        from,
        coupon_code
      );
      sendResponse({
        status: true,
        address: from,
        txHash,
        withdrawToClientHash: withdrawTx,
      });
    } else {
      console.log("⚠️ Unable to withdraw funds.");
      await updatePaymentService(
        session_id,
        "Failed",
        blockchain,
        token,
        txHash,
        from,
        coupon_code
      );
      sendResponse({ status: false, message: "Withdrawal failed." });
    }
    stopTracking();
  }

  // Use Alchemy’s WS subscription for tracking payments
  if (erc20Address) {
    console.log("Tracking ERC20 token payments via Alchemy WS.");
    // Set up a filter for the Transfer event on the ERC20 contract.
    const transferTopic = ethers.id("Transfer(address,address,uint256)");
    const transferFilter = {
      address: erc20Address,
      topics: [transferTopic],
    };

    const tokenTransferListener = async (log) => {
      try {
        // Decode the log using an ethers Interface
        const iface = new ethers.Interface([
          "event Transfer(address indexed from, address indexed to, uint256 value)",
        ]);
        const parsedLog = iface.parseLog(log);
        const { from, to, value } = parsedLog.args;
        if (
          to.toLowerCase() === predictedAddress.toLowerCase() &&
          BigNumber.from(value).gte(BigNumber.from(value_))
        ) {
          await handlePayment(log.transactionHash, from, true);
        } else {
          console.log("Waiting for a valid ERC20 Transfer event...");
        }
      } catch (error) {
        console.error("Error processing ERC20 Transfer log:", error);
      }
    };

    // Subscribe to ERC20 Transfer logs
    alchemy.ws.on(transferFilter, tokenTransferListener);
    activeUsers.set(predictedAddress, {
      sessionTimeout,
      tokenTransferListener,
    });
  } else {
    console.log("Tracking native token payments via Alchemy WS.");
    // For native payments, subscribe to pending transactions with Alchemy’s custom event.
    const pendingListener = async (tx) => {
      try {
        // 'tx' is a full transaction object from Alchemy
        if (
          tx &&
          tx.to &&
          tx.to.toLowerCase() === predictedAddress.toLowerCase() &&
          BigNumber.from(tx.value).gte(BigNumber.from(value_))
        ) {
          console.log(
            "Handling native payment detected via pending transaction:",
            tx.hash
          );
          await handlePayment(tx.hash, tx.from, false);
        }
      } catch (error) {
        console.error("❌ Error processing pending transaction:", error);
      }
    };

    // Subscribe to pending transactions using the Alchemy-specific method
    alchemy.ws.on({ method: "alchemy_pendingTransactions" }, pendingListener);
    console.log("Subscribed to native pending transactions via Alchemy WS.");
    activeUsers.set(predictedAddress, { sessionTimeout, pendingListener });
  }

  function stopTracking() {
    if (stopped) return;
    stopped = true;
    console.log(`🛑 Stopping tracking for ${predictedAddress}`);

    const userData = activeUsers.get(predictedAddress);
    if (erc20Address) {
      if (userData && userData.tokenTransferListener) {
        alchemy.ws.off(
          {
            address: erc20Address,
            topics: [ethers.id("Transfer(address,address,uint256)")],
          },
          userData.tokenTransferListener
        );
      }
    } else {
      if (userData && userData.pendingListener) {
        alchemy.ws.off({ method: "alchemy_pendingTransactions" }, userData.pendingListener);
      }
    }
    if (userData && userData.sessionTimeout) {
      clearTimeout(userData.sessionTimeout);
    }
    activeUsers.delete(predictedAddress);

    wsClients.forEach((ws) => {
      if (ws.readyState === ws.OPEN) {
        ws.close();
      }
    });
  }

  function sendResponse(data) {
    wsClients.forEach((ws) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(data));
      }
    });
  }
}

module.exports = {deployAndWithdraw}