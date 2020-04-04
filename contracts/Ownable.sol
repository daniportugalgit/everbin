pragma solidity 0.6.4;

contract Ownable {
    address public owner;

    event OwnershipTransferred(address indexed from, address indexed to);

    constructor() internal {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    function transferOwnership(address payable newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");

        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}