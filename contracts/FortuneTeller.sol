pragma solidity ^0.4.24;

// import "tabookey-gasless/contracts/RelayRecipient.sol"; // TODO - Uncomment to use Portis

// contract FortuneTeller is RelayRecipient { // TODO - Uncomment to use Portis
//     constructor(address hub) public {      // TODO - Uncomment to use Portis
contract FortuneTeller  {
  constructor() public {
    // this is the only hub I trust to receive calls from
    // init_relay_hub(RelayHub(hub)); // TODO - Uncomment to use Portis
    Source1[3] = "You will be very rich";
    Source1[2] = "You will be rich";
    Source1[1] = "You will be poor";
    Source1[0] = "You will be very poor";

    Source2[3] = "very happy";
    Source2[2] = "happy";
    Source2[1] = "sad";
    Source2[0] = "very sad";

    Source3[3] = "have lots of friends!";
    Source3[2] = "have some friends.";
    Source3[1] = "have one friend.";
    Source3[0] = "have no friend.";
}

    // TODO - Uncomment to use Portis
    // function accept_relayed_call(address relay, address from, bytes memory encoded_function, uint gas_price, uint transaction_fee) public view returns(uint32) {
    //     return 0;
    // }

    // function post_relayed_call(address relay, address from, bytes memory encoded_function, bool success, uint used_gas, uint transaction_fee) public {
    // }

    string[4] Source1;
    string[4] Source2;
    string[4] Source3;

    struct Prediction{
      string text;
      address owner;
    }

    mapping(address => string) OwnerToPrediction;

    uint storedData;

    function setValue(uint _v) public {
      storedData = _v;
    }

    function getValue() public view returns(uint) {
      return storedData;
    }

    function createPrediction() public {
      uint random1 = uint(keccak256(abi.encodePacked(msg.sender)))%4;
      uint random2 = uint(keccak256(abi.encodePacked(msg.sender, 1)))%4; // +1 so result is different from random1
      uint random3 = uint(keccak256(abi.encodePacked(msg.sender, 2)))%4; // +2 so result is different from random1 & random2

      OwnerToPrediction[msg.sender] = strConcat(Source1[random1],", ",Source2[random2]," and ",Source3[random3]);
    }

    function payPrediction() public payable {
      require(msg.value >= 10000000000000000, "You need to pay at least 0.01ETH to change your future!");

      // default values
      uint random1 = uint(keccak256(abi.encodePacked(msg.sender)))%4;
      uint random2 = uint(keccak256(abi.encodePacked(msg.sender, 1)))%4; // +1 so result is different from random1
      uint random3 = uint(keccak256(abi.encodePacked(msg.sender, 2)))%4; // +2 so result is different from random1 & random2

      if(msg.value >= 1000000000000000000 ){ // value >= 1 ETH
        // Max for everything
        random1 = 3;
        random2 = 3;
        random3 = 3;
      } else if (msg.value >= 100000000000000000){ // value >= 0.1 ETH
        // either 2 or 3
        random1 = 3 - uint(keccak256(abi.encodePacked(msg.sender)))%2;
        random2 = 3 - uint(keccak256(abi.encodePacked(msg.sender, 1)))%2; // +1 so result is different from random1
        random3 = 3 - uint(keccak256(abi.encodePacked(msg.sender, 2)))%2; // +2 so result is different from random1 & random2
      } else if (msg.value >= 10000000000000000){ // value >= 0.01 ETH
        // either 0 or 1
        random1 = 1 - uint(keccak256(abi.encodePacked(msg.sender)))%2;
        random2 = 1 - uint(keccak256(abi.encodePacked(msg.sender, 1)))%2; // +1 so result is different from random1
        random3 = 1 - uint(keccak256(abi.encodePacked(msg.sender, 2)))%2; // +2 so result is different from random1 & random2
      }

      OwnerToPrediction[msg.sender] = strConcat(Source1[random1],", ",Source2[random2]," and ",Source3[random3]);
    }

    function getPrediction(address owner) public view returns(string) {
      return OwnerToPrediction[owner];
    }

    function strConcat(string _a, string _b, string _c, string _d, string _e) internal pure returns (string) {
      bytes memory _ba = bytes(_a);
      bytes memory _bb = bytes(_b);
      bytes memory _bc = bytes(_c);
      bytes memory _bd = bytes(_d);
      bytes memory _be = bytes(_e);
      string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
      bytes memory babcde = bytes(abcde);
      uint k = 0;
      for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
      for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
      for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
      for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
      for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
      return string(babcde);
    }
}
