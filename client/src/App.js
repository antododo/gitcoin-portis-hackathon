import React, { Component } from "react";
import FortuneTellerContract from "./contracts/FortuneTeller.json";
import getWeb3 from "./utils/getWeb3";
import { ThemeProvider, Box, Flex, Card, Text, Button, Slider} from "rimble-ui";
import Header from "./components/Header.js";
import Result from "./components/Result.js";
import Introduction from "./components/Introduction.js";

// TODO - Uncomment to use Portis
// import Portis from "@portis/web3";
// import Web3 from "web3";
// const portis = new Portis("fbfb6587-b2f3-4c96-8128-845e20a0d0c5", "ropsten", {gasRelay: true });
// const web3 = new Web3(portis.provider);

class App extends Component {
  state = {
    storageValue: 0,
    storageText: "Click to know your future",
    random1: null,
    random2: null,
    random3: null,
    web3: null,
    accounts: null,
    FortuneTellerContract: null,
    timeToCheck: false,
    PredictionMade: false
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
          FortuneTellerContract: FortuneTellerInstance
        },
        this.getPrediction
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

  getPrediction = async () => {
    const { accounts, FortuneTellerContract } = this.state;
    // Get the value from the contract to prove it worked.
    const response = await FortuneTellerContract.methods
      .getPrediction(accounts[0])
      .call();
    console.log(response);
    if( response && response.text.length !== 0){
      this.setState({
        sliderValue: 10,
        displayValue: 0.1,
        PredictionMade: true,
        storageText: response.text,
        random1: response.random1,
        random2: response.random2,
        random3: response.random3,
      });
    }
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
    // Get the value from the contract
    await FortuneTellerContract.methods
      .createPrediction()
      .send({ from: accounts[0] })
      .on("receipt", receipt => {
        // console.log("receipt");
        // console.log(receipt);
      });
    // Update state with the result.
    this.getPrediction()
  };

  payPrediction = async () => {
    const { accounts, FortuneTellerContract } = this.state;

    // convert value in ETH to WEI
    let value = this.state.displayValue * 1000000000000000000

    // Get the value from the contract
    await FortuneTellerContract.methods
      .payPrediction()
      .send({ from: accounts[0], value: value })
      .on("receipt", receipt => {
        // console.log("receipt");
        // console.log(receipt);
      });
    // Update state with the result.
    this.getPrediction()
  };

  render() {
    return (
      <ThemeProvider>
        <Box>
          <Header />
          <Introduction/>

          {/* Prediction */}
          <Card maxWidth={"640px"} mx={"auto"} p={3} px={4}>
            <Button
              disabled={this.state.PredictionMade}
              width={1}
              onClick={() => {
                this.callPrediction();
              }}
            >
              {this.state.PredictionMade ? "I have read your future" : "Read your future 🔮"}
            </Button>
            <Result
              random1={this.state.random1}
              random2={this.state.random2}
              random3={this.state.random3}
              storageText={this.state.storageText}
              PredictionMade={this.state.PredictionMade}
            />
          </Card>

          {/* Pay to modify prediction */}
          {this.state.PredictionMade &&
            <Card maxWidth={"640px"} mx={"auto"} p={3} px={4}>
            <Flex maxWidth={"640px"} mx={"auto"} p={3}>
              <Text>
                I love money, so if you give me some ETH, I might use my power to change the future! Be generous, as my power depends on my gaiety.
              </Text>
            </Flex>
            <Flex width={1}>
              <Slider width={1} min={"1"} max={"200"} step={"1"} value={this.state.sliderValue}
                onInput={(e) => {
                  console.log(e.target.value)
                  this.setState({ sliderValue: e.target.value, displayValue: e.target.value / 100 })
                }}
              />
            </Flex>
            <Button
              width={1}
              onClick={() => {
                this.payPrediction();
              }}
            >
              <p>Send me <span style={{ textDecoration: "line-through", color: "#ddd" }}>some love</span> {this.state.displayValue} ETH to change your future!</p>
          </Button>
            </Card>
          }

          {/* Displaying address */}
          <Card maxWidth={"640px"} mx={"auto"} p={3} px={4}>
            Your account is: {this.state.accounts && this.state.accounts[0]}
          </Card>

          {/* //TODO! - ONLY FOR TEST - REMOVE FOR PROD */}
          <Card maxWidth={"640px"} mx={"auto"} p={3} px={4}>
            <p>THIS BOX IS ONLY FOR TESTING A SIMPLE CONTRACT CALL</p>
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

        </Box>
      </ThemeProvider>
    );
  }
}

export default App;
