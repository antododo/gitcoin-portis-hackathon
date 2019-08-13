import React, { Component } from "react";
import FortuneTellerContract from "./contracts/FortuneTeller.json";
import getWeb3 from "./utils/getWeb3";
import { ThemeProvider, Box, Flex, Card, Text, Heading, Button } from "rimble-ui";
import Header from "./components/Header.js";

// TODO - Uncomment to use Portis
// import Portis from "@portis/web3";
// import Web3 from "web3";
// const portis = new Portis("fbfb6587-b2f3-4c96-8128-845e20a0d0c5", "ropsten", {gasRelay: true });
// const web3 = new Web3(portis.provider);

class App extends Component {
  state = {
    storageValue: 0,
    storageText: "Click to know your future",
    web3: null,
    accounts: null,
    FortuneTellerContract: null,
    timeToCheck: false
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3(); // TODO - Comment to use Portis

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts(); // TODO - Comment to use Portis
      // const accounts = await portis.provider.enable(); // TODO - Uncomment to use Portis

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = FortuneTellerContract.networks[networkId];
      console.log(deployedNetwork);
      console.log(deployedNetwork.address);
      const FortuneTellerInstance = new web3.eth.Contract(
        FortuneTellerContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState(
        {
          web3,
          accounts,
          FortuneTellerContract: FortuneTellerInstance,
        },
        this.getvalueTest
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

  getvalueTest = async () => {
    const { accounts, FortuneTellerContract } = this.state;
    // Get the value from the contract to prove it worked.
    const response = await FortuneTellerContract.methods.getValue().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  runTest = async () => {
    const { accounts, FortuneTellerContract } = this.state;
    console.log("accounts: ", accounts);

    // Stores a given value, 5 by default.
    console.log("contract address: ", FortuneTellerContract.address);
    await FortuneTellerContract.methods
      .setValue(Number(this.state.storageValue) + 1)
      .send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await FortuneTellerContract.methods.getValue().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  callPrediction = async () => {
    const { accounts, FortuneTellerContract } = this.state;
    console.log("accounts: ", accounts);
    // Stores a given value, 5 by default.
    console.log("contract address: ", FortuneTellerContract.address);
    // Get the value from the contract
    await FortuneTellerContract.methods
      .createPrediction()
      .send({ from: accounts[0] })
      .on("receipt", receipt => {
         console.log("receipt");
         console.log(receipt);
      });
    // Update state with the result.
    const response = await FortuneTellerContract.methods
      .getPrediction(accounts[0])
      .call();
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
              THIS BOX IS ONLY FOR TESTING A SIMPLE CONTRACT CALL
            </p>
            <div />
            <Button
              onClick={() => {
                this.runTest();
              }}
            >
              TEST - Increase value
            </Button>
            <div>The stored value is: {this.state.storageValue}</div>
          </Card>
          <Card maxWidth={"640px"} mx={"auto"} p={3} px={4}>
            <Button
              onClick={() => {
                this.callPrediction();
              }}
            >
              I want to know my future!
            </Button>
            <div>{this.state.storageText}</div>
          </Card>
        </Box>
      </ThemeProvider>
    );
  }
}

export default App;
