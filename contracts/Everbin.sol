pragma solidity 0.6.4;

import "./SafeMath.sol";
import "./Ownable.sol";

contract Everbin is Ownable {
    using SafeMath for uint;

    uint public binCount;
    mapping(uint => string) public bins;

    event BinCreated(address indexed by, uint id);
    event Donation(address indexed from, uint amount);

    function create(string memory content) public returns(uint) {
        binCount = binCount.add(1);
        bins[binCount] = content;

        emit BinCreated(msg.sender, binCount);

        return binCount;
    }

    function withdraw() public onlyOwner {
        require(address(this).balance > 0, "Insufficient funds");

        msg.sender.transfer(address(this).balance);
    }

    receive() payable external {
        emit Donation(msg.sender, msg.value);
    }
}