// Smart Contract details
console.log("Ethers.js loaded:", typeof ethers !== "undefined"); 

const contractAddress = "0xe110dc16529e2d192e121f5636c6e1cc1354506f";

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

function startCountDown() {
	setInterval (() => {
		if (!window.deadlineTimestamp) {
			return;
		}

		const now = Math.floor(Date.now() / 1000);
		const remaining = window.deadlineTimestamp - now;

		if (remaining < 0) {
			document.getElementById("timeLeft").innerText = "00:00:00";
			return;
		}

		const hours = String(Math.floor(remaining / 3600)).padStart(2, "0");
		const mins = String(Math.floor((remaining % 3600)) / 60 ).padStart(2, "0");
		const secs = String(remaining % 60).padStart(2, "0");

		document.getElementById("timeLeft").innerText = `${hours}:${mins}:${secs}`;

		}, 1000);
}

//Donate
async function donate() {
	const amount = document.getElementById("input").value;
	if (!amount || isNaN(amount)) {
		alert("Invalid amount");
		return;
	}

	try {

		const tx = await contract.contribute ({
			value: ethers.utils.parseEther(amount)
		});

		await tx.wait();

		alert("Contribution sucessful");
		loadCrowdFundDetails();

	} catch (error) {
		console.log("Donation failed", error);
		alert("Donation failed. Check the console");
	}
}

//Refund
async function refund() {
	try {

		const tx = await contract.refund();

		await tx.wait();

		alert("Refund succesful");
		loadCrowdFundDetails();

	} catch (error) {
		console.log("Refund failed:", error);
		alert("Refund failed");
	}
}

window.onload = () => {
	document.getElementById("connectButton").onclick = connectMetaMask;
	document.getElementById(".btn.donate").onclick = donate;
	document.getElementById(".btn.refund").onclick = refund;
};