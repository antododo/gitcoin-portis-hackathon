import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
// import getWeb3 from "./utils/getWeb3";
import Portis from "@portis/web3";
import Web3 from "web3";

import "./App.css";

const portis = new Portis("fbfb6587-b2f3-4c96-8128-845e20a0d0c5", "rinkeby");
const web3 = new Web3(portis.provider);

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    timeToCheck: false
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      // const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.run);
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.log(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }

    // Check web3 only after 1000 ms == 1s
    setTimeout(()=>{
      this.setState({timeToCheck: true})
    },1000)

  };

  run = async () => {
    web3.eth.getAccounts((error, accounts) => {
      console.log(accounts);
    });

    // const { accounts, contract } = this.state;

    // // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // // Update state with the result.
    // this.setState({ storageValue: response });
  };

  render() {
    return (
      <div className="App">
        { (this.state.timeToCheck && !this.state.web3) && <div className="alert alert-danger show" role="alert">
          <h4 className="alert-heading">Oops! No web3 detected <span role="img" aria-label="Slightly Frowning Face">🙁</span></h4>
          <p>In order to use this dapp, you need an web3 provider. You should consider trying <a href="https://metamask.io/" className="alert-link" rel="noopener noreferrer" target="_blank">Metamask</a>.</p>
          <hr/>
          <p className="mb-0">
            <i>You don't know what is web3 or Metamask? Check this <a href="https://www.youtube.com/watch?v=6Gf_kRE4MJU" className="alert-link" rel="noopener noreferrer" target="_blank">video</a> for more info.</i>
          </p>
          <hr/>
        </div>}



        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>

        <div>Your account is: {this.state.accounts && this.state.accounts[0]}</div>
      </div>
    );
  }
}

export default App;
