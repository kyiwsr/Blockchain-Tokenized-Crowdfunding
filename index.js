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
	} else {
		alert("MetaMask is not intalled");
	}
}

//Load goal, raised amount, deadline
async function loadCrowdFundDetails() {
	try {

		const [goal, deadline, raised, contributors] = await contract.getDetails();
		const goalEth = ether.utils.formatEther(goal);
		const raisedEth = ether.utils.formatEther(raised);

		//Update HTML elements for goal amount & raised amount
		document.getElementById("goal-amount").innerText = goalEth;
		document.getElementById("raised-amount").innerText = raisedEth;

		//Update HTML date element
		const dueDate = new Date(deadline.toNumber() * 1000);
		document.getElementById("dueDate").innerText = dueDate.toLocaleDateString();
		document.getElementById("dueDate").setAttribute("datetime", dueDate.toISOString());

		window.deadlineTimestamp = deadline.toNumber();

	} catch (error) {
		console.log("Error loading contract data:", error);
	}
}