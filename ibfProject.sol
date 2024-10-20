// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ibfProject{
    struct gig{
        uint id;
        address ad;
        uint amount;
        bool a;
    }

    mapping(uint=>gig) gigs;

    mapping(address=>bool) registered;

    function register() public{
        registered[msg.sender] = true;
    }

    function upload(uint _id) public payable{
        require(msg.value>=0 && registered[msg.sender]==true);
        gigs[_id] = gig(_id,msg.sender,msg.value,false);
    }

    function complete(address _ad, uint _id) public {
        require(gigs[_id].ad == msg.sender && gigs[_id].a == false);
        payable(_ad).transfer(gigs[_id].amount);
        gigs[_id].a == true;
    }
}
