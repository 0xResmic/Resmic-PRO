

import { connectWalletFn, getProvider, getSigner, switchNetwork } from "./ConnectMeta";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import {toast } from "react-toastify";
import { Chains, ERC20_ABI, TokenAddress, Tokens } from "../Constants/Constants";
import "react-toastify/dist/ReactToastify.css";
import { getCurrentTokenPrice } from "../Constants/LivePrice";
import { useToast } from "@/hooks/use-toast";
/**
 * * Main Function to handle all the EVM transaction.
 * @param {String} Blockchain // EVM Blockchain name
 * @param {String} Token // Token name
 * @param {String} Address_ // Wallet address to send funds.
 * @param {INT} Amount // Amount in USD
 * @param {INT} PaymentConfirmations // Wait for No. of blocks confirmations. Default 2
 * @returns {Bool} Payment Status
 */
export async function makeEVMPayment (Blockchain, Token, Address_, Amount, PaymentConfirmations=2) {
    
  // const { toast } = useToast();

    let Address = Address_.EVM;
    let paymentStatus = false;
    
    // Connect Metamask Wallet, Switching network if necessary.
    let connectWallet = await connectWalletFn();
    let connectdUserAddress = connectWallet?.account

    let connectedchainId = connectWallet?.chainId
    // console.log("connectedchainId", connectedchainId)
    let requiredChainID = Chains[Blockchain].id;
    if(connectedchainId !== requiredChainID) { // Switching the networ if the users is on another network on Metamask.
        await switchNetwork(requiredChainID)
    }
    /*
        3 types of transactions
        i. Native tokens
        ii. Stable tokens
        iii. Unstable tokens.
    */
    let tokenType = Tokens[Token]
    if(tokenType?.id === requiredChainID) { // Handling Native tokens
        let tokenSymbol = Tokens[Token]?.dname
        let nativePayment = await nativeTokenPayment(Amount, Address, tokenSymbol, PaymentConfirmations)
        paymentStatus = nativePayment?.paymentUpdate;
        let hash = nativePayment?.txHash;
        // console.log("nativePayment", nativePayment)
        // console.log("paymentStatus", paymentStatus)
        // console.log("hash", hash)
        return {paymentStatus, hash, fromWalletAddress: connectdUserAddress }
    }
    else if(tokenType?.type === "stable") { // Handling Stable tokens
        let tokenAddress = TokenAddress
        tokenAddress = tokenAddress[Blockchain][Token]
        let stableTx = await requestERC20Payment(Amount, tokenAddress, connectdUserAddress, Address, PaymentConfirmations )
        // paymentStatus = stableTx
        paymentStatus = stableTx?.paymentUpdate;
        let hash = stableTx?.txHash;
        return {paymentStatus, hash, fromWalletAddress: connectdUserAddress }
        return stableTx;
    }
    else if (tokenType?.type === "unstable") { // Handling UnStable tokens
        let tokenSymbol = Tokens[Token]?.dname;
        let tokenAddress = TokenAddress
        tokenAddress = tokenAddress[Blockchain][Token]
        // Calculate the amount here.
        let livePrice = await getCurrentTokenPrice(tokenSymbol);
        let amount = Amount / livePrice;
        amount = parseFloat(amount) 
        let ERC20tx = await requestERC20Payment(amount, tokenAddress, connectdUserAddress, Address, PaymentConfirmations )
        // paymentStatus = ERC20tx
        paymentStatus = ERC20tx?.paymentUpdate;
        let hash = ERC20tx?.txHash;
        return {paymentStatus, hash, fromWalletAddress: connectdUserAddress }
        return ERC20tx;
    }
    console.log("we are here..")
    return {paymentStatus, hash:"", fromWalletAddress: ""};
}

/**
   * Function for Native token transfers.
   * @returns {{Bool, String}} Payment Status
*/
const nativeTokenPayment = async (_amount, _address,_tokenSymbol, _paymentConfirmations) => {
    
  const signer = await getSigner();
    let amount = _amount;
    let liveTokenPrice = await getCurrentTokenPrice(_tokenSymbol)// Live token price
    let decimal = 18
    let tokenAmount = amount / liveTokenPrice
    tokenAmount = BigNumber(Math.floor((parseFloat(tokenAmount) * (10 ** decimal))))
    tokenAmount = tokenAmount.toFixed()
    try {
      // Transfer of funds to address
      const tx = await signer.sendTransaction({
        to: _address, // Funds will be received by the address
        value: tokenAmount,
        // gasLimit: '0x5028',
        // maxPriorityFeePerGas: '0x3b9aca00',
        // maxFeePerGas: '0x2540be400',
      });
      await tx.wait();
      let paymentUpdate = await checkBlockConformationsNative(tx.hash, tokenAmount, _paymentConfirmations, _tokenSymbol);
      let txHash = tx.hash;
      return { paymentUpdate, txHash };
    } catch (error) {
      toast.error('Something went wrong.', { position: 'top-center',theme: "dark"});
      // toast({
      //   title: "Something went wrong!",
      //   description: "Unable to transfer funds.",
      //   variant: "destructive",
      // });
      console.log(error);
      return false;
    }
};

/**
   * Function ckecks the block conformation of the payment on the blockchain for ERC20 token only.
   * The user will wait until the the transaction is confirmed until specified blocks.
   * @param {String} tx // Transaction hash after the payment.
   * @param {INT} _amount
   * @param {INT} _noOfBlockConformation
   * @param {String} _tokenSymbol
   * @returns {Bool} returns the paymetn update.
*/
const checkBlockConformationsNative = async (tx, _amount, _noOfBlockConformation, _tokenSymbol) => {
    let provider = await getProvider();
    const confirmationsRequired = _noOfBlockConformation;
    const receipt = await provider.waitForTransaction(
      tx,
      confirmationsRequired
    );
    if (receipt.status === 1) {
      let actualTokenTransfer = await checkTokenTransfersNative(tx);// It retunes the actual tokens received at the blockchain.
      
      if (actualTokenTransfer !== 0) {
        if (actualTokenTransfer >= _amount) {
        //   setPaymentStatus(true);
        //   setIsPaymentCompleted(true);
          toast.success('Payment done successfully:)', { position: 'top-center',theme: "dark"});
          // toast({
          //   title: "Payment Completed",
          //   description: `Payment done successfully:)`,
          //   variant: "default",
          // });
          return true;
        } else {
          // alert("Something went wrong");
          toast.error('Something went wrong', { position: 'top-center',theme: "dark"});
          // toast({
          //   title: "Something went wrong!",
          //   description: "Unable to transfer funds.",
          //   variant: "destructive",
          // });
          return false;
        }
      } else {
        toast.error('Unable to process payment\n Please try again ', { position: 'top-center',theme: "dark"});
        // toast({
        //   title: "Payment failed!",
        //   description: "Unable to process payment\n Please try again",
        //   variant: "destructive",
        // });
        return false;
      }
    } else {
      toast.error('Transaction failed to be processed', { position: 'top-center',theme: "dark"});
      // toast({
      //   title: "Something went wrong!",
      //   description: "Transaction failed to be processed",
      //   variant: "destructive",
      // });
      return false;
    }
};

  /**
   * Verifies the amount to token actually transfereed. Native tokens
   * @param {String} tx
   * @returns {String} String '0' or 'Amount_Of_Tokens'
   */
const checkTokenTransfersNative = async (tx) => {
    let provider = await getProvider();
    try {
      // Get the transaction details
      const transaction = await provider.getTransaction(tx);
      if (transaction && transaction.confirmations > 0) {
        let amountInWei = transaction.value;
        amountInWei = BigNumber(amountInWei.toString())
        return amountInWei.toFixed();
      } else {
        // console.log("Transaction not found or not confirmed yet.");
        toast.error('Transaction not found', { position: 'top-center',theme: "dark"});
        // toast({
        //   title: "Something went wrong!",
        //   description: "Transaction not found",
        //   variant: "destructive",
        // });
        return "0";
      }
    } catch (error) {
        console.log("Err", error);
        toast.error('Unable to get transaction details', { position: 'top-center',theme: "dark"});
        // toast({
        //   title: "Something went wrong!",
        //   description: "Unable to get transaction details",
        //   variant: "destructive",
        // });
        return "0";
    }
};

/**
   * If user is selected with non-native token, function request the payment.
   * 
   */
const requestERC20Payment = async (_amount, _tokenAddress, _userAddress, _toAddress, _paymentConfirmations) => {
    // setIsLoading(true);
    const signer = await getSigner();
    try {
      /**
       * The ERC20 payment requires 2 transactions
       * 1. Approval of token
       * 2. Transafer of token
       */
      const contractInstance = new ethers.Contract(
        _tokenAddress,
        ERC20_ABI,
        signer
      );
        let decimals = await contractInstance.decimals();
        decimals = decimals.toString();
        let amount = _amount
        // amount = BigNumber((parseFloat(amount) * 10 ** decimals)) 
        // Updates in the amount.
        amount = BigNumber(Math.floor((parseFloat(amount) * (10 ** decimals))) )
        amount = amount.toFixed();

      const getApprove = await contractInstance.approve(
        _userAddress,
        amount
      );
      await getApprove.wait();
      toast.success('Token approved', { position: 'top-center',theme: "dark"});
      // toast({
      //   title: "Token Approved",
      //   description: `Token Approved successfully.`,
      //   variant: "default",
      // });
      let tx = await contractInstance.transferFrom(
        _userAddress,
        _toAddress,
        amount,
        { gasLimit: 100000 }
        );
        await tx.wait();
        
        let paymentUpdate = await checkBlockConformations(tx.hash, amount, _paymentConfirmations, _tokenAddress );
        let txHash = tx.hash;
        return {paymentUpdate, txHash}
        return tx2
    } catch (error) {
        toast.error('Something went wrong.', { position: 'top-center',theme: "dark"});
        // toast({
        //   title: "Something went wrong!",
        //   description: "Unable to get complete payment",
        //   variant: "destructive",
        // });
        console.log(error);
    }
};

/**
   * Function ckecks the block conformation of the payment on the blockchain for ERC20 token only.
   * The user will wait until the the transaction is confirmed until specified blocks.
   * @param {String} tx // Transaction hash after the payment.
   * @param {INT} _amount
   * @param {INT} _noOfBlockConformation
   * @param {String} _tokenAddress
   * @returns {Bool} returns the paymetn update.
   */
const checkBlockConformations = async (tx, _amount, _noOfBlockConformation, _tokenAddress) => {
    let provider = await getProvider();
    const confirmationsRequired = _noOfBlockConformation;
    const receipt = await provider.waitForTransaction(
      tx,
      confirmationsRequired
    );
    // Checks the status of the transaction
    if (receipt.status === 1) {
      let actualTokenTransfer = await checkTokenTransfers(tx, _tokenAddress);

      if (actualTokenTransfer !== "0") {
        if (_amount >= actualTokenTransfer) {
        //   setPaymentStatus(true);
          toast.success('Payment done successfully.', { position: 'top-center',theme: "dark"});
          // toast({
          //   title: "Payment Completed",
          //   description: `Payment received successfully.`,
          //   variant: "default",
          // });
          //   console.log("Payment done successfully")
          return true;
        } else {
          toast.error('Something went wrong.', { position: 'top-center',theme: "dark"});
          // toast({
          //   title: "Something went wrong!",
          //   description: "Error while making payment!",
          //   variant: "destructive",
          // });
          console.log("Not sufficient amount transferred: ");
          return false;
        }
      } else {
        toast.error('Unable to process payment\n Please try again', { position: 'top-center',theme: "dark"});
        // toast({
        //   title: "Something went wrong!",
        //   description: "Unable to process payment\n Please try again!",
        //   variant: "destructive",
        // });
        return false;
      }
    } else {
      toast.error('Transaction failed to be processed', { position: 'top-center',theme: "dark"});
      // toast({
      //   title: "Something went wrong!",
      //   description: "Transaction failed to be processed",
      //   variant: "destructive",
      // });
      return false;
    }
};

/**
   * Verifies the amount to token actually transfereed. ERC20 tokens
   * @param {String} transactionHash
   * @param {String} _tokenAddress
   * @returns {String} String '0' or 'Amount_Of_Tokens'
   */
const checkTokenTransfers = async (transactionHash, _tokenAddress) => {
    let provider = await getProvider();
    try {
      const transactionReceipt = await provider.getTransactionReceipt(
        transactionHash
      );
      if (transactionReceipt && transactionReceipt.status === 1) {
        const tokenContract = new ethers.Contract(
          _tokenAddress,
          ERC20_ABI,
          provider
        );
        const filter = tokenContract.filters.Transfer(null, null, null);
        const events = await tokenContract.queryFilter(
          filter,
          transactionReceipt.blockNumber,
          transactionReceipt.blockNumber
        );
        const event = events.find(
          (event) => event.transactionHash === transactionHash
        );

        if (event) {
          const amount = event.args.value.toString();
          return amount;
        } else {
          // toast.error('No token transfer event found for the tx.', { position: 'top-center',theme: "dark"});
          toast({
            title: "Something went wrong!",
            description: "No token transfer event found for the tx.",
            variant: "destructive",
          });
          return "0";
        }
      } else {
        // toast.error('Transaction not found or not successful.', { position: 'top-center',theme: "dark"});
        toast({
          title: "Something went wrong!",
          description: "Transaction not found or not successful!",
          variant: "destructive",
        });
        return "0";
      }
    } catch (error) {
      console.error("Error reading transaction details:", error);
      // toast.error('No transaction found!', { position: 'top-center',theme: "dark"});
      toast({
        title: "Something went wrong!",
        description: "No transaction found",
        variant: "destructive",
      });
      return "0";
    }
};
