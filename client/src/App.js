import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import FortuneTellerContract from "./contracts/FortuneTeller.json";
import getWeb3 from "./utils/getWeb3";
// import Portis from "@portis/web3";
// import Web3 from "web3";
import { ThemeProvider, Box, Flex, Card, Text, Heading, Button } from "rimble-ui";
import Header from "./components/Header.js";

// const portis = new Portis("fbfb6587-b2f3-4c96-8128-845e20a0d0c5", "ropsten", {gasRelay: true });
// const web3 = new Web3(portis.provider);

class App extends Component {
  state = {
    storageValue: 0,
    storageText: "?",
    web3: null,
    accounts: null,
    SimpleStorageContract: null,
    timeToCheck: false
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // const accounts = await portis.provider.enable();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      console.log(deployedNetwork);
      console.log(deployedNetwork.address);
      const SimpleStorageInstance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState(
        {
          web3,
          accounts,
          SimpleStorageContract: SimpleStorageInstance,
        },
        this.getvalue
      );
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.log(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }

    // Check web3 only after 1000 ms == 1s
    setTimeout(() => {
      this.setState({ timeToCheck: true });
    }, 1000);
  };

  getvalue = async () => {
    const { accounts, SimpleStorageContract } = this.state;
    // Get the value from the contract to prove it worked.
    const response = await SimpleStorageContract.methods.getValue().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  run = async () => {
    const { accounts, SimpleStorageContract } = this.state;
    console.log("accounts: ", accounts);

    // Stores a given value, 5 by default.
    console.log("contract address: ", SimpleStorageContract.address);
    await SimpleStorageContract.methods
      .setValue(66)
      .send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await SimpleStorageContract.methods.getValue().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  callPrediction = async () => {
    const { accounts, SimpleStorageContract } = this.state;
    console.log("accounts: ", accounts);
    // Stores a given value, 5 by default.
    console.log("contract address: ", SimpleStorageContract.address);
    // Get the value from the contract
    await SimpleStorageContract.methods
      .getPrediction()
      .send({ from: accounts[0] })
      .on("receipt", receipt => {
         console.log("receipt");
         console.log(receipt);
      });
    // Update state with the result.
    const response = await SimpleStorageContract.methods.getText().call();
    this.setState({ storageText: response });
  };

  render() {
    return (
      <ThemeProvider>
        <Box>
          <Header />
          <Flex maxWidth={"640px"} mx={"auto"} p={3}>
            <Heading.h2 mr={3}>
              <span role="img" aria-label="Waving hand">
                👋
              </span>
            </Heading.h2>

            <Text>Hi there, this is a dapp using Portis.</Text>
          </Flex>

          <Card maxWidth={"640px"} mx={"auto"} p={3} px={4}>
            Your account is: {this.state.accounts && this.state.accounts[0]}
          </Card>

          <Card maxWidth={"640px"} mx={"auto"} p={3} px={4}>
            <p>
              Try changing the value stored on <strong>line 40</strong> of
              App.js.
            </p>
            <div>The stored value is: {this.state.storageValue}</div>
            <div>The stored text is: {this.state.storageText}</div>
            <div />
            <Button
              onClick={() => {
                this.run();
              }}
            >
              Set new value
            </Button>
            <Button
              onClick={() => {
                this.callPrediction();
              }}
            >
              Fortune Teller
            </Button>
          </Card>
        </Box>
      </ThemeProvider>
    );
  }
}

export default App;
