// pragma solidity ^0.4.24;

// import "tabookey-gasless/contracts/RelayRecipient.sol";

// contract SimpleStorage is RelayRecipient {
//     constructor(address hub) public {
//         // this is the only hub I trust to receive calls from
//         init_relay_hub(RelayHub(hub));
//     }

//     uint storedData;

//     function setValue(uint _v) public {
//       storedData = _v;
//     }

//     function getValue() public view returns(uint) {
//       return storedData;
//     }

//     function accept_relayed_call(address relay, address from, bytes memory encoded_function, uint gas_price, uint transaction_fee) public view returns(uint32) {
//         return 0;
//     }

//     function post_relayed_call(address relay, address from, bytes memory encoded_function, bool success, uint used_gas, uint transaction_fee) public {
//     }
// }

pragma solidity ^0.4.24;


contract SimpleStorage  {
    constructor() public {
        // this is the only hub I trust to receive calls from
        Source1[0] = "Source1 0";
        Source1[1] = "Source1 1";
        Source1[2] = "Source1 2";
        Source1[3] = "Source1 3";

        Source2[0] = "Source2 0";
        Source2[1] = "Source2 1";
        Source2[2] = "Source2 2";
        Source2[3] = "Source2 3";

        Source3[0] = "Source3 0";
        Source3[1] = "Source3 1";
        Source3[2] = "Source3 2";
        Source3[3] = "Source3 3";
    }

    string[4] Source1;
    string[4] Source2;
    string[4] Source3;

    struct Prediction{
      string text;
      address owner;
    }

    Prediction[] predictions;

    uint storedData;
    uint randomness = 42;
    string storedText;

    function setValue(uint _v) public {
      storedData = _v;
    }

    function getValue() public view returns(uint) {
      return storedData;
    }

    function getPrediction() public returns(string memory){
      randomness++;
      uint random1 = randomness%3;
      uint random2 = uint(keccak256(abi.encodePacked(msg.sender, now+randomness+1)))%3;
      uint random3 = uint(keccak256(abi.encodePacked(msg.sender, now+randomness+2)))%3;

      string memory _prediction = strConcat(Source1[random1]," ",Source2[random2]," ",Source3[random3]);

      storedText = _prediction;
      predictions.push(Prediction(_prediction,msg.sender));

      return _prediction;
    }

    function getText() public view returns(string) {
      return storedText;
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
