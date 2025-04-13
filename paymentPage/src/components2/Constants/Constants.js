export const SupportedBlockchains = [
    "Ethereum",'Polygon',"Starknet", "BNB-Chain", "Optimism", "Sepolia", "XDC-Network", "Base",
];
export const SupportedTokens = {
    // EVM Blockchains. 
    "Ethereum":["ETH", "USDT", "USDC", "MATIC","DOGE", "WBTC", ],
    "Polygon":[ "MATIC","USDT", "USDC", "ETH","DOGE", "WBTC", ],
    "BNB-Chain":["BNB","BUSD", "USDC", "ETH", "DOGE", ],
    "Binance-TestNet":["BNB","BUSD", "USDC", "ETH", "DOGE", ],
    "Optimism":["OP","USDT", "USDC", "ETH", "MATIC","DOGE", "WBTC", "PUSH", ],
    "Sepolia":["SETH","USDT", 'BNB', 'DAI'],
    
    "Base":["USDC", "DAI", "TRUMP", "WBTC", "USDe"],
    "XDC-Network":["XDC", "USDT" ],

    // Non-EVM Blockchains.
    "Starknet":["STARK","USDT", "USDC", "ETH", "GETH", "WBTC" ],
    "Solana":["SOL", "WETH", "USDT", "USDC",],
    
    "":[""], //@note Do not remove this line.
};

export const Chains = {

    // Update the FactoryContract address in the following.
    "Polygon" : {"name": "Polygon", "description": "", "id": "0x89", "img":"", "FactoryContract": "0x547144Aa7681b7190346dedcD00f8f33A1009941"},
    "Base" : {"name": "Base", "description": "", "id": "0x1", "img":"", "FactoryContract": "0x36e08F3A09fEf0e48261226dcA3084A1FBE20aFe"},
    "Sepolia" : {"name": "Sepolia", "description": "", "id": "0xaa36a7", "img":"", "FactoryContract": "0xd9a5D032323A2168A7a4C6F88a8fe89b25fE69D8"},
    
    
    // Ignore the following.
    "XDC-Network" : {"name": "XDC-Network", "description": "", "id": "0x32", "img":"", "FactoryContract": "0x78aFB6794619E1669302BE838fc331462e977c44"},
    "BNB-Chain" : {"name": "BNB-Chain", "description": "", "id": "0x38", "img":"", "FactoryContract": "0xc934221Ff9BaB1f70c9144967C78CB84B9B9d5Bb"},
    "Optimism" : {"name": "Optimism", "description": "", "id": "0xa", "img":"", "FactoryContract": ""},
    "Starknet" : {"name": "Starknet", "description": "", "id": "", "img":""},
    "Solana" : {"name": "Solana", "description": "", "id": "solana", "img":""},

};
export const Tokens = {
    // If Tokens is stable conin, id == chainId to identify is it native token. else -1
    USDT: {"name": "USDT", "dname":"USDT", "type": "stable", "id": "-1", "description": "", "decimal":6},
    BUSD: {"name": "BUSD", "dname":"BUSDT", "type": "stable", "id": "-1" , "decimal":18},
    USDC: {"name": "USDC", "dname":"USDC", "type": "stable", "id": "-1", "decimal":6},
    PUSH: {"name": "PUSH", "dname":"push", "type": "unstable", "id": "", "decimal":18},
    MATIC: {"name": "MATIC", "dname":"matic-network", "type": "unstable", "id": "0x89", "decimal":18},
    ETH: {"name": "ETH", "dname":"ethereum", "type": "unstable", "id": "0x1", "decimal":18},
    SETH: {"name": "SETH", "dname":"ethereum", "type": "unstable", "id": "0xaa36a7", "decimal":18}, // Sepolia ETH
    NIBI: {"name": "NIBI", "dname":"nibiru", "type": "unstable", "id": "", "decimal":18},
    DOGE: {"name": "DOGE", "dname":"doge", "type": "unstable", "id": "", "decimal":6},
    STARK: {"name": "STARK", "dname":"starknet", "type": "unstable", "id": "", "decimal":18},
    BNB: {"name": "BNB", "dname":"binancecoin", "type": "unstable", "id": "0x38", "decimal":18},
    TBNB: {"name": "TBNB", "dname":"binancecoin", "type": "unstable", "id": "0x61", "decimal":18},
    BTC: {"name": "BTC", "dname":"Bitcoin", "type": "unstable", "id": "", "decimal":18},
    DAI: {"name": "DAI", "dname":"DAI", "type": "stable", "id": "-1", "decimal":18},
    
    XDC: {"name": "XDC", "dname":"xdce-crowd-sale", "type": "unstable", "id": "0x32", "decimal":18},
    SOL: {"name": "SOL", "dname":"solana", "type": "unstable", "id": "solana", "decimal":9},
    
    USDe: {"name": "USDe", "dname":"USDe", "type": "stable", "id": "-1", "description": "", "decimal":18},
    WBTC: {"name": "WBTC", "dname":"Bitcoin", "type": "unstable", "id": "", "decimal":18},
    WETH: {"name": "WETH", "dname":"ethereum", "type": "unstable", "id": "", "decimal":18},
    PUSH: {"name": "PUSH", "dname":"ethereum-push-notification-service", "type": "unstable", "id": "", "decimal":18},
    TRUMP: {"name": "TRUMP", "dname":"official-trump", "type": "unstable", "id": "", "decimal":18},
};
/**
 * Supported {Verified } ERC 20 token address
 */
export const TokenAddress = {
    
    "Ethereum":{
        "USDT": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "USDC": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        "DAI": "0x6b175474e89094c44da98b954eedeac495271d0f",
        "BUSD": "0x4fabb145d64652a948d72533023f6e7a623c7c53",
        "WBTC": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        "MATIC": "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
        "BNB": "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
        
    },
  
    "Polygon":{
        "USDT": "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        "USDC": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        "DAI": "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        "BUSD": "0xdab529f40e671a1d4bf91361c21bf9f0c9712ab7",
        "WBTC": "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
        "BNB": "0x3BA4c387f786bFEE076A58914F5Bd38d668B42c3",
        "ETH": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      },
      
    "BNB-Chain":{
        "BUSD": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
        "DAI": "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
        // "BSC-USD": "0x55d398326f99059fF775485246999027B3197955",
        "USDT": "0x55d398326f99059fF775485246999027B3197955",// BSC-USD
        "USDC": "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
        "DOGE": "0xbA2aE424d960c26247Dd6c32edC70B295c744C43", // dogecoin 
        "MATIC": "0xCC42724C6683B7E57334c4E856f4c9965ED682bD",
        "ETH": "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
        // "WBTC": "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
    },
  
    "Optimism":{
        "USDT": "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
        "USDC": "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
        "WBTC": "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
        "DAI": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
        "Optimism": "0x4200000000000000000000000000000000000042",
  
    },
  
    "Goerli":{
        "USDC":"0x65aFADD39029741B3b8f0756952C74678c9cEC93",
        "DAI":"0x75Ab5AB1Eef154C0352Fc31D2428Cef80C7F8B33",        
    },

    "Sepolia":{
        "USDC":"0x65aFADD39029741B3b8f0756952C74678c9cEC93",
        // "USDT":"0x65aFADD39029741B3b8f0756952C74678c9cEC93",
        "DAI":"0x36e08F3A09fEf0e48261226dcA3084A1FBE20aFe",        
        "BNB":"0x75Ab5AB1Eef154C0352Fc31D2428Cef80C7F8B33",        
        "PUSH":"0x37c779a1564DCc0e3914aB130e0e787d93e21804",        
    },

    "Base":{
        "USDC":"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        "DAI":"0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
        "TRUMP":"0xc27468b12ffA6d714B1b5fBC87eF403F38b82AD4",
        "WBTC":"0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
        "USDe":"0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34"
        
    },

    "Starknet":{
        "STARK": "0x4718f5a0Fc34cC1AF16A1cdee98fFB20C31f5cD61D6Ab07201858f4287c938D",
        "ETH": "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7" , 
        "DAI"  : "0x0dA114221cb83fa859DBdb4C44bEeaa0BB37C7537ad5ae66Fe5e0efD20E6eB3", 
        "USDC" : "0x053C91253BC9682c04929cA02ED00b3E423f6710D2ee7e0D5EBB06F3eCF368A8", 
        "USDT" : "0x68F5c6a61780768455de69077E07e89787839bf8166dEcfBf92B645209c0fB8", 
        "WBTC" : "0x3Fe2b97C1Fd336E750087D68B9b867997Fd64a2661fF3ca5A7C771641e8e7AC",
    },

    "Solana":{
        "USDC": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", 
        // "USDC": "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr", // Test USDC on devnet
        "USDT": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
        "WETH": "2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk",
    },
    "XDC-Network":{
        // "WXDC": "0x951857744785e80e2de051c32ee7b25f9c458c42",
        "USDT": "0xd4b5f10d61916bd6e0860144a91ac658de8a1437",
        // "USDC": "0xd4b5f10d61916bd6e0860144a91ac658de8a1437",
    },
}

export const tempWalletByteCode = "0x60a060405234801561000f575f80fd5b5060405161077e38038061077e833981810160405281019061003191906100c9565b8073ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff1681525050506100f4565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6100988261006f565b9050919050565b6100a88161008e565b81146100b2575f80fd5b50565b5f815190506100c38161009f565b92915050565b5f602082840312156100de576100dd61006b565b5b5f6100eb848285016100b5565b91505092915050565b60805161066c6101125f395f818160930152610245015261066c5ff3fe60806040526004361061002c575f3560e01c806350431ce414610037578063894760691461004d57610033565b3661003357005b5f80fd5b348015610042575f80fd5b5061004b610075565b005b348015610058575f80fd5b50610073600480360381019061006e91906103b5565b6101aa565b005b5f3073ffffffffffffffffffffffffffffffffffffffff163190505f7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16826040516100d59061040d565b5f6040518083038185875af1925050503d805f811461010f576040519150601f19603f3d011682016040523d82523d5f602084013e610114565b606091505b5050905080610158576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161014f9061047b565b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff167f6ef95f06320e7a25a04a175ca677b7052bdd97131872c2192525a629f51be7708360405161019e91906104b1565b60405180910390a25050565b5f8173ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b81526004016101e491906104d9565b6020604051808303815f875af1158015610200573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610224919061051c565b90505f8273ffffffffffffffffffffffffffffffffffffffff1663a9059cbb7f0000000000000000000000000000000000000000000000000000000000000000846040518363ffffffff1660e01b8152600401610282929190610547565b6020604051808303815f875af115801561029e573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906102c291906105a3565b905080610304576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102fb90610618565b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff167f6ef95f06320e7a25a04a175ca677b7052bdd97131872c2192525a629f51be7708360405161034a91906104b1565b60405180910390a2505050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6103848261035b565b9050919050565b6103948161037a565b811461039e575f80fd5b50565b5f813590506103af8161038b565b92915050565b5f602082840312156103ca576103c9610357565b5b5f6103d7848285016103a1565b91505092915050565b5f81905092915050565b50565b5f6103f85f836103e0565b9150610403826103ea565b5f82019050919050565b5f610417826103ed565b9150819050919050565b5f82825260208201905092915050565b7f5061796d656e74204661696c65642e00000000000000000000000000000000005f82015250565b5f610465600f83610421565b915061047082610431565b602082019050919050565b5f6020820190508181035f83015261049281610459565b9050919050565b5f819050919050565b6104ab81610499565b82525050565b5f6020820190506104c45f8301846104a2565b92915050565b6104d38161037a565b82525050565b5f6020820190506104ec5f8301846104ca565b92915050565b6104fb81610499565b8114610505575f80fd5b50565b5f81519050610516816104f2565b92915050565b5f6020828403121561053157610530610357565b5b5f61053e84828501610508565b91505092915050565b5f60408201905061055a5f8301856104ca565b61056760208301846104a2565b9392505050565b5f8115159050919050565b6105828161056e565b811461058c575f80fd5b50565b5f8151905061059d81610579565b92915050565b5f602082840312156105b8576105b7610357565b5b5f6105c58482850161058f565b91505092915050565b7f5061796d656e74206661696c65640000000000000000000000000000000000005f82015250565b5f610602600e83610421565b915061060d826105ce565b602082019050919050565b5f6020820190508181035f83015261062f816105f6565b905091905056fea2646970667358221220afe7a596bc4d3e38ed38b9338bc6fb8e0c07ff434f35f440296597c2fcee73cc64736f6c634300081a0033"
/**
* ERC20 Smart Contract ABI for EVM blockchains.
*/
export const ERC20_ABI  = [
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [{ name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "_spender", type: "address" },
        { name: "_value", type: "uint256" },
      ],
      name: "approve",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "_from", type: "address" },
        { name: "_to", type: "address" },
        { name: "_value", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { name: "", type: "address" },
        { name: "", type: "address" },
      ],
      name: "allowed",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [{ name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "_to", type: "address" },
        { name: "_value", type: "uint256" },
      ],
      name: "transfer",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { name: "_owner", type: "address" },
        { name: "_spender", type: "address" },
      ],
      name: "allowance",
      outputs: [{ name: "remaining", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "owner", type: "address" },
        { indexed: true, name: "spender", type: "address" },
        { indexed: false, name: "value", type: "uint256" },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "from", type: "address" },
        { indexed: true, name: "to", type: "address" },
        { indexed: false, name: "value", type: "uint256" },
      ],
      name: "Transfer",
      type: "event",
    },
    { anonymous: false, inputs: [], name: "Pause", type: "event" },
    { anonymous: false, inputs: [], name: "Unpause", type: "event" },
];
/**
* ERC20 Smart Contract ABI for Starknet Blockchain.
*/
export const STARKNET_ERC20_ABI = [
  {
      "members": [
          {
              "name": "low",
              "offset": 0,
              "type": "felt"
          },
          {
              "name": "high",
              "offset": 1,
              "type": "felt"
          }
      ],
      "name": "Uint256",
      "size": 2,
      "type": "struct"
  },
  {
      "data": [
          {
              "name": "from_",
              "type": "felt"
          },
          {
              "name": "to",
              "type": "felt"
          },
          {
              "name": "value",
              "type": "Uint256"
          }
      ],
      "keys": [],
      "name": "Transfer",
      "type": "event"
  },
  {
      "data": [
          {
              "name": "owner",
              "type": "felt"
          },
          {
              "name": "spender",
              "type": "felt"
          },
          {
              "name": "value",
              "type": "Uint256"
          }
      ],
      "keys": [],
      "name": "Approval",
      "type": "event"
  },
  {
      "inputs": [
          {
              "name": "name",
              "type": "felt"
          },
          {
              "name": "symbol",
              "type": "felt"
          },
          {
              "name": "decimals",
              "type": "felt"
          },
          {
              "name": "initial_supply",
              "type": "Uint256"
          },
          {
              "name": "recipient",
              "type": "felt"
          }
      ],
      "name": "constructor",
      "outputs": [],
      "type": "constructor"
  },
  {
      "inputs": [],
      "name": "name",
      "outputs": [
          {
              "name": "name",
              "type": "felt"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "symbol",
      "outputs": [
          {
              "name": "symbol",
              "type": "felt"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
          {
              "name": "totalSupply",
              "type": "Uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "decimals",
      "outputs": [
          {
              "name": "decimals",
              "type": "felt"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "name": "account",
              "type": "felt"
          }
      ],
      "name": "balanceOf",
      "outputs": [
          {
              "name": "balance",
              "type": "Uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "name": "owner",
              "type": "felt"
          },
          {
              "name": "spender",
              "type": "felt"
          }
      ],
      "name": "allowance",
      "outputs": [
          {
              "name": "remaining",
              "type": "Uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "name": "recipient",
              "type": "felt"
          },
          {
              "name": "amount",
              "type": "Uint256"
          }
      ],
      "name": "transfer",
      "outputs": [
          {
              "name": "success",
              "type": "felt"
          }
      ],
      "type": "function"
  },
  {
      "inputs": [
          {
              "name": "sender",
              "type": "felt"
          },
          {
              "name": "recipient",
              "type": "felt"
          },
          {
              "name": "amount",
              "type": "Uint256"
          }
      ],
      "name": "transferFrom",
      "outputs": [
          {
              "name": "success",
              "type": "felt"
          }
      ],
      "type": "function"
  },
  {
      "inputs": [
          {
              "name": "spender",
              "type": "felt"
          },
          {
              "name": "amount",
              "type": "Uint256"
          }
      ],
      "name": "approve",
      "outputs": [
          {
              "name": "success",
              "type": "felt"
          }
      ],
      "type": "function"
  },
  {
      "inputs": [
          {
              "name": "spender",
              "type": "felt"
          },
          {
              "name": "added_value",
              "type": "Uint256"
          }
      ],
      "name": "increaseAllowance",
      "outputs": [
          {
              "name": "success",
              "type": "felt"
          }
      ],
      "type": "function"
  },
  {
      "inputs": [
          {
              "name": "spender",
              "type": "felt"
          },
          {
              "name": "subtracted_value",
              "type": "Uint256"
          }
      ],
      "name": "decreaseAllowance",
      "outputs": [
          {
              "name": "success",
              "type": "felt"
          }
      ],
      "type": "function"
  }
]
  