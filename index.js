// Smart Contract details
console.log("Ethers.js loaded:", typeof ethers !== "undefined"); 

const contractAddress = "0x22a0a67ED3986508b52031b08770234F75be36d1";

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_goal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_durationInSeconds",
				"type": "uint256"
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
				"name": "contributor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Contributed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "contributor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Refunded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdrawn",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "checkBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contribute",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "contributions",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contributorCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deadline",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "fundsWithdrawn",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getDetails",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "_goal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_deadline",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_totalRaised",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_contributorCount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_fundsWithdrwan",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "goal",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
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
		"name": "refund",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalRaised",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]

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
			provider = new ethers.providers.Web3Provider(window.ethereum);
			signer = provider.getSigner();
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

		const [goal, deadline, raised, contributors, fundsWithdrawn] = await contract.getDetails();

		const currentAccount = await signer.getAddress();
		const ownerAddress = await contract.owner();

		const goalEth = ethers.utils.formatEther(goal);
		const raisedEth = ethers.utils.formatEther(raised);

		//Update HTML elements for goal amount & raised amount
		document.getElementById("goal-amount").innerText = goalEth;
		document.getElementById("raised-amount").innerText = raisedEth;

		//Update HTML date element
		const dueDate = new Date(deadline.toNumber() * 1000);
		document.getElementById("dueDate").innerText = dueDate.toLocaleDateString();
		document.getElementById("dueDate").setAttribute("datetime", dueDate.toISOString());

		window.deadlineTimestamp = deadline.toNumber();

		const isOwner = ownerAddress.toLowerCase() == currentAccount.toLowerCase();
		if (isOwner) {
			document.querySelector(".btn.withdraw").removeAttribute("hidden");
		} else {
			document.querySelector(".btn.withdraw").setAttribute("hidden","");
		}

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
		const mins = String(Math.floor((remaining % 3600) / 60 )).padStart(2, "0");
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

//Withdraw
async function withdraw() {
	try {
		const tx = await contract.withdraw();
		await tx.wait();
		alert("Withdrawal successful");
		loadCrowdFundDetails();
	} catch (error) {
		console.log("Withdraw failed:", error);
		alert("Withdraw failed");
	}

	if (error.message.includes("Funding goal not met")) {
      message = "Funding goal not reached yet";
    } else if (error.message.includes("Deadline not yet reached")) {
      message = "Deadline hasn't passed yet";
    } else if (error.message.includes("Funds already withdrawn")) {
        message = "Funds already withdrawn";
    }

	alert(messgae);
}

window.onload = () => {
	document.getElementById("connectButton").onclick = connectMetaMask;
	document.querySelector(".btn.donate").onclick = donate;
	document.querySelector(".btn.refund").onclick = refund;
	document.querySelector(".btn.withdraw").onclick = withdraw;
};