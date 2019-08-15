pragma solidity ^0.4.24;

import "tabookey-gasless/contracts/RelayRecipient.sol";

contract FortuneTeller is RelayRecipient {
    constructor(address hub) public {
      init_relay_hub(RelayHub(hub));
      Source1[4] = "You will be richer than Jeff Bezos";
      Source1[3] = "You will win the lottery";
      Source1[2] = "Your intuition will be your key to financial wisdom";
      Source1[1] = "You will lose all your money playing Candy Crush";
      Source1[0] = "Captain Hook will kidnap you and steal all your money";

      Source2[4] = "you will be the first human to live on Mars";
      Source2[3] = "you will win a Nobel Peace Prize";
      Source2[2] = "you will become allergic to chocolate";
      Source2[1] = "you will have hiccup for the rest of your life";
      Source2[0] = "you will be captured by aliens who will dissect your brain...and find nothing";

      Source3[4] = "But don't forget, focus on what is truly important to you.";
      Source3[3] = "But don't forget, focus on the positives and face the negatives with confidence.";
      Source3[2] = "But don't forget, fou future may or may not depends on your past.";
      Source3[1] = "But don't forget, find the courage to trust what your feeling tells you.";
      Source3[0] = "But don't forget, life is a delicate balance of positivity and negativity.";
    }

    function accept_relayed_call(address relay, address from, bytes memory encoded_function, uint gas_price, uint transaction_fee) public view returns(uint32) {
        return 0;
    }

    function post_relayed_call(address relay, address from, bytes memory encoded_function, bool success, uint used_gas, uint transaction_fee) public {
    }

    string[5] Source1;
    string[5] Source2;
    string[5] Source3;

    struct Prediction{
      string text;
      uint8 random1;
      uint8 random2;
      uint8 random3;
    }

    mapping(address => Prediction) OwnerToPrediction;

    function createPrediction() public {
      // adding 1 & 2 to keccack so all results are different
      uint8 r1 = 1;
      uint8 r2 = 2;
      uint8 random1 = uint8(keccak256(abi.encodePacked(get_sender())))%5;
      uint8 random2 = uint8(keccak256(abi.encodePacked(get_sender(), r1)))%5;
      uint8 random3 = uint8(keccak256(abi.encodePacked(get_sender(), r2)))%5;

      string memory _text = strConcat(Source1[random1]," and ",Source2[random2],". ",Source3[random3]);

      OwnerToPrediction[get_sender()] = Prediction(_text,random1,random2,random3);
    }

    function payPrediction() public payable {
      require(msg.value >= 10000000000000000, "You need to pay at least 0.01ETH to change your future!");

      // adding 1 & 2 to keccack so all results are different
      uint8 r1 = 1;
      uint8 r2 = 2;

      // default values to minimum
      uint8 random1 = 0;
      uint8 random2 = 0;
      uint8 random3 = 0;

      if(msg.value >= 1200000000000000000 ){ // value >= 1.2 ETH
        // Max for everything
        random1 = 4;
        random2 = 4;
        random3 = 4;
      } else if (msg.value >= 300000000000000000){ // value >= 0.3 ETH
        // either 2 or 3
        random1 = 3 - uint8(keccak256(abi.encodePacked(get_sender(),now)))%2; // +now, so user can pay multiple time for different results
        random2 = 3 - uint8(keccak256(abi.encodePacked(get_sender(), now+r1)))%2;
        random3 = 3 - uint8(keccak256(abi.encodePacked(get_sender(), now+r2)))%2;
      } else if (msg.value >= 50000000000000000){ // value >= 0.05 ETH
        // either 0 or 1
        random1 = 1 - uint8(keccak256(abi.encodePacked(get_sender(),now)))%2;
        random2 = 1 - uint8(keccak256(abi.encodePacked(get_sender(), now+r1)))%2;
        random3 = 1 - uint8(keccak256(abi.encodePacked(get_sender(), now+r2)))%2;
      }

      string memory _text = strConcat(Source1[random1]," and ",Source2[random2],". ",Source3[random3]);

      OwnerToPrediction[get_sender()] = Prediction(_text,random1,random2,random3);
    }

    function getPrediction(address owner) public view returns(string memory text, uint random1, uint random2, uint random3) {
      Prediction memory _prediction = OwnerToPrediction[owner];
      text = _prediction.text;
      random1 = uint(_prediction.random1);
      random2 = uint(_prediction.random2);
      random3 = uint(_prediction.random3);
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
