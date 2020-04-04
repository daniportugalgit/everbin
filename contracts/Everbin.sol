pragma solidity 0.6.4;

import "./Ownable.sol";
import "./SafeMath.sol"; //simplified SafeMath, has only { add };

contract Everbin is Ownable {
    using SafeMath for uint;

    uint public binCount;
    mapping(uint => string) public bins;

    event BinCreated(address from, uint id);
    event Received(address from, uint amount);

    //Creates a new bin
    function create(string memory content) public returns(uint) {
        binCount = binCount.add(1);
        bins[binCount] = content;

        emit BinCreated(msg.sender, binCount);

        return binCount;
    }

    //Withdraws donated eth
    function withdraw() public onlyOwner {
        msg.sender.transfer(address(this).balance);
    }

    //Receives donations
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}