pragma solidity ^0.4.24;

import "tabookey-gasless/contracts/RelayRecipient.sol";

contract SimpleStorage is RelayRecipient {
    constructor(address hub) public {
        // this is the only hub I trust to receive calls from
        init_relay_hub(RelayHub(hub));
    }

    uint storedData;

    function setValue(uint _v) public {
      storedData = _v;
    }

    function getValue() public view returns(uint) {
      return storedData;
    }

    function accept_relayed_call(address relay, address from, bytes memory encoded_function, uint gas_price, uint transaction_fee) public view returns(uint32) {
        return 0;
    }

    function post_relayed_call(address relay, address from, bytes memory encoded_function, bool success, uint used_gas, uint transaction_fee) public {
    }
}
