// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdFund {

    // state variables
    address public owner;
    uint public goal;
    uint public deadline;
    uint public totalRaised;
    uint public contributorCount;
    bool fundsWithdrawn;

    mapping (address => uint) public contributions;

    // events
    event Contributed(address indexed contributor, uint amount);
    event Withdrawn(address indexed owner, uint amount);
    event Refunded(address indexed contributor, uint amount);

    //constructor
    constructor(uint _goal, uint _durationInSeconds) {

        owner = msg.sender;
        goal = _goal;
        deadline = block.timestamp + _durationInSeconds;

    }

    //modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier beforeDeadline() {
        require(block.timestamp < deadline, "Deadline already reached");
        _;
    }

   modifier afterDeadline() {
    require(block.timestamp >= deadline, "Deadline not yet reached");
    _;
   }

   //functions
   //1. Accepts contributions before deadline
   function contribute() public payable beforeDeadline {
    require(msg.value > 0, "Must send Ether");

    if (contributions[msg.sender] == 0) {
        contributorCount += 1;
    }

    contributions[msg.sender] += msg.value;
    totalRaised += msg.value;

    emit Contributed(msg.sender, msg.value);
   }

   //2. View the total funds raised
   function checkBalance() public view returns(uint){
    return totalRaised;
   }

   //3. Withdraw funds (only owner, only if goal met)
   function withdraw() public onlyOwner afterDeadline {
    require(totalRaised >= goal, "Funding goal not met");
    require(!fundsWithdrawn,"Funds already withdrawn");

    fundsWithdrawn = true;
    uint amount = address(this).balance;

    (bool sent, ) = payable(owner).call{value: amount}("");
    require(sent, "Failed to send Ether");

    emit Withdrawn(owner, amount);
   }

   //4. Refund (if goal not met after deadline)
   function refund() public afterDeadline {
    require(totalRaised < goal, "Funding goal already met");
    uint amount = contributions[msg.sender];
    require(amount > 0, "Cannot refund zero amount of funds");

    contributions[msg.sender] = 0;
    totalRaised -= amount;

    (bool sent, ) = payable (msg.sender).call{value: amount}("");
    require(sent, "Failed to refund");

    emit Refunded(msg.sender, amount);
   }

   //5. Return details
   function getDetails() public view returns (
    uint _goal,
    uint _deadline,
    uint _totalRaised,
    uint _contributorCount,
    bool _fundsWithdrawn
   ) {
    return( goal, deadline, totalRaised, contributorCount, fundsWithdrawn);
   }
}