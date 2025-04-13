const contractBytecode = "0x6080604052348015600e575f80fd5b506107048061001c5f395ff3fe608060405260043610610042575f3560e01c8063109e94cf1461004d57806350431ce414610077578063894760691461008d578063c4d66de8146100b557610049565b3661004957005b5f80fd5b348015610058575f80fd5b506100616100dd565b60405161006e919061042e565b60405180910390f35b348015610082575f80fd5b5061008b610100565b005b348015610098575f80fd5b506100b360048036038101906100ae9190610475565b610207565b005b3480156100c0575f80fd5b506100db60048036038101906100d69190610475565b6103ad565b005b5f8054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b5f4790505f805f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1682604051610149906104cd565b5f6040518083038185875af1925050503d805f8114610183576040519150601f19603f3d011682016040523d82523d5f602084013e610188565b606091505b50509050806101cc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101c39061053b565b60405180910390fd5b7f9938f2f589885c9fe562d0c747cf40d24fe2402f63f4940c13c7a4d8ceeb5925826040516101fb9190610571565b60405180910390a15050565b5f8173ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401610241919061042e565b602060405180830381865afa15801561025c573d5f803e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061028091906105b4565b90508173ffffffffffffffffffffffffffffffffffffffff1663a9059cbb5f8054906101000a900473ffffffffffffffffffffffffffffffffffffffff16836040518363ffffffff1660e01b81526004016102dc9291906105df565b6020604051808303815f875af11580156102f8573d5f803e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061031c919061063b565b61035b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610352906106b0565b60405180910390fd5b8173ffffffffffffffffffffffffffffffffffffffff167fa2bd9fcfcdba69f52bcd9a520846ad4bd685b187483f53efc42d035b2ddebff0826040516103a19190610571565b60405180910390a25050565b805f806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610418826103ef565b9050919050565b6104288161040e565b82525050565b5f6020820190506104415f83018461041f565b92915050565b5f80fd5b6104548161040e565b811461045e575f80fd5b50565b5f8135905061046f8161044b565b92915050565b5f6020828403121561048a57610489610447565b5b5f61049784828501610461565b91505092915050565b5f81905092915050565b50565b5f6104b85f836104a0565b91506104c3826104aa565b5f82019050919050565b5f6104d7826104ad565b9150819050919050565b5f82825260208201905092915050565b7f5061796d656e74204661696c65642e00000000000000000000000000000000005f82015250565b5f610525600f836104e1565b9150610530826104f1565b602082019050919050565b5f6020820190508181035f83015261055281610519565b9050919050565b5f819050919050565b61056b81610559565b82525050565b5f6020820190506105845f830184610562565b92915050565b61059381610559565b811461059d575f80fd5b50565b5f815190506105ae8161058a565b92915050565b5f602082840312156105c9576105c8610447565b5b5f6105d6848285016105a0565b91505092915050565b5f6040820190506105f25f83018561041f565b6105ff6020830184610562565b9392505050565b5f8115159050919050565b61061a81610606565b8114610624575f80fd5b50565b5f8151905061063581610611565b92915050565b5f602082840312156106505761064f610447565b5b5f61065d84828501610627565b91505092915050565b7f5061796d656e74206661696c65640000000000000000000000000000000000005f82015250565b5f61069a600e836104e1565b91506106a582610666565b602082019050919050565b5f6020820190508181035f8301526106c78161068e565b905091905056fea26469706673582212207a012193b4aa61f5cc3e53bd9f37299a4aa2c07d156895c62a75763e27ed139764736f6c634300081a0033"

const FACTORY_Contract_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_implementation",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "FailedDeployment",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "InsufficientBalance",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "wallet",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "client",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "salt",
				"type": "bytes32"
			}
		],
		"name": "WalletDeployed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "salt",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "_client",
				"type": "address"
			}
		],
		"name": "deployWallet",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "salt",
				"type": "bytes32"
			}
		],
		"name": "getDeployAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "implementation",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
const TEMP_Wallet_Contract_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_client",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "PaymentReceived",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "withdrawNative",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			}
		],
		"name": "withdrawToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]

const providerURL = {
    ETHEREUM:process.env.PROVIDER_URL_ETHEREUM,
    "BNB-CHAIN":process.env.PROVIDER_URL_BNB_Chain,
    POLYGON:process.env.PROVIDER_URL_POLYGON,
    SEPOLIA: process.env.PROVIDER_URL_SEPOLIA,
    "XDC-NETWORK": process.env.PROVIDER_URL_XDC_NETWORK,
    BASE: process.env.PROVIDER_URL_BASE,
}

const wssURL = {
    ETHEREUM:process.env.WSS_URL_ETHEREUM,
    SEPOLIA:process.env.WSS_URL_SEPOLIA,
    POLYGON:process.env.WSS_URL_POLYGON,
	'BNB-CHAIN':process.env.WSS_URL_BNB_Chain,
	"XDC-NETWORK": process.env.WSS_URL_XDC_NETWORK,
    BASE:process.env.WSS_URL_BASE,
}

module.exports = { FACTORY_Contract_ABI, TEMP_Wallet_Contract_ABI, contractBytecode, providerURL, wssURL}