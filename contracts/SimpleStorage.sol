pragma solidity ^0.4.24;

import "tabookey-gasless/contracts/RelayRecipient.sol";

contract SimpleStorage is RelayRecipient {
  uint storedData;
  address private hubAddress;

  constructor() public {
    hubAddress = 0x1349584869A1C7b8dc8AE0e93D8c15F5BB3B4B87;
    init_relay_hub(RelayHub(hubAddress));
  }

  function set(uint x) public {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }

    function accept_relayed_call(address relay, address from, bytes memory encoded_function, uint gas_price, uint transaction_fee) public view returns(uint32) {
        return 0;
    }

    function post_relayed_call(address relay, address from, bytes memory encoded_function, bool success, uint used_gas, uint transaction_fee) public {
    }

}


