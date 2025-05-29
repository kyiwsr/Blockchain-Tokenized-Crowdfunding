// Smart Contract details
console.log("Ethers.js loaded:", typeof ethers !== "undefined"); 

const contractAddress = "";

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "initialMessage",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "message",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "newMessage",
				"type": "string"
			}
		],
		"name": "setMessageAndDate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

let provider, signer, contract;

async function connectMetaMask() {
	console.log("Connect Metamask button clicked");

	if (typeof window.ethereum !== "undefined") {
		try {

			//Request Metamask account
			const accounts = await window.ethereum.request ({
				method: "eth_requestAccounts",
			});

			//Update html attribute
			const account = accounts[0];
			console.log("Connected account", account);
			document.getElementById("accountDisplay").innerText = `Connected ${account}`;

			//Initialize ether.js objects
			provider = new ethers.providers.Web3provider(window.ethereum);
			signer = provider.signer;
			contract = new ethers.Contract(contractAddress, contractABI, signer);

			//Log initialize
			console.log("Provider initialize:", provider);
			console.log("Signer initialize:", signer);
			console.log("Contract initialize:", contract);

			await loadCrowdFundDetails();
			startCountDown();

		} catch (error) {
			console.log("MetaMask connection failed:", error);
		}
	}
}
