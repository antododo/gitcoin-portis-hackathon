import React, { Component } from "react";
import FortuneTellerContract from "./contracts/FortuneTeller.json";
import { ThemeProvider, Box, Flex, Card, Text, Button, Input, Flash, Link} from "rimble-ui";
import Header from "./components/Header.js";
import Result from "./components/Result.js";
import Introduction from "./components/Introduction.js";
import Credit from "./components/Credit.js";

import Portis from "@portis/web3";
import Web3 from "web3";
const portis = new Portis("dae9a9af-6535-4523-9a54-ac231a2deb6e", "ropsten", {gasRelay: true });
const web3 = new Web3(portis.provider);

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
    waitingTransaction: false,
    predictionMade: false,
    inputValue: 0
  };

  componentDidMount = async () => {
    try {
      // Use Portis web3 to get the user's accounts.
      const accounts = await portis.provider.enable();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = FortuneTellerContract.networks[networkId];
      console.log(deployedNetwork);
      const FortuneTellerInstance = new web3.eth.Contract(
        FortuneTellerContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed to
      // check if a prediction was already made for this account
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
    this.setState({ waitingTransaction: false})
    if( response && response.text.length !== 0){
      this.setState({
        inputValue: 0.5,
        predictionMade: true,
        storageText: response.text,
        random1: response.random1,
        random2: response.random2,
        random3: response.random3,
      });
    }
  };

  callPrediction = async () => {
    const { accounts, FortuneTellerContract } = this.state;
    // Get the value from the contract
    await FortuneTellerContract.methods
      .createPrediction()
      .send({ from: accounts[0] })
      .on('transactionHash', (hash) => {
        this.setState({ waitingTransaction: true, hashLink: `https://ropsten.etherscan.io/tx/${hash}`});
      })
    // Update state with the result.
    this.getPrediction()
  };

  payPrediction = async () => {
    const { accounts, FortuneTellerContract } = this.state;

    // convert value in ETH to WEI
    let value = this.state.inputValue * 1000000000000000000

    // Get the value from the contract
    await FortuneTellerContract.methods
      .payPrediction()
      .send({ from: accounts[0], value: value })
      .on('transactionHash', (hash) => {
        this.setState({ waitingTransaction: true, hashLink: `https://ropsten.etherscan.io/tx/${hash}`});
      })
    // Update state with the result.
    this.getPrediction()
  };

  render() {
    if(!this.state.accounts){
      return(
        <ThemeProvider>
          <Box>
            <Header/>
            <Introduction/>
            <Card maxWidth={"640px"} mx={"auto"} p={3} px={4}>
              <Flash my={3}>
                <Text fontSize={"5em"} textAlign={"center"}>
                  <span role="img" aria-label="Eyes">
                    👀
                  </span>
                </Text>
                <Text>
                  Before everything, I need to know your Ethereum address.
                  Let me see if I can find it...
                  If I don't, could you log in to Portis so I can read your Ethereum address?
                </Text>
                <Button width={1} onClick={() => { portis.showPortis() }}> Log in to Portis</Button>
              </Flash>
            </Card>
            <Credit/>
          </Box>
        </ThemeProvider>
      )
    }

    return (
      <ThemeProvider>
        <Box>
          <Header />
          <Introduction/>

          {/* Displaying address */}
          {this.state.accounts &&
            <Card maxWidth={"640px"} mx={"auto"} p={3} px={4}>
              <Flash my={3}>
                I can see your Ethereum address! it's: {this.state.accounts[0]}
              </Flash>
            </Card>
          }

          {/* Prediction */}
          <Card maxWidth={"640px"} mx={"auto"} p={3} px={4}>
            <Button
              disabled={this.state.predictionMade}
              width={1}
              onClick={() => {
                this.callPrediction();
              }}
            >
              {this.state.predictionMade ? "I have read your future" : "Read your future 🔮"}
            </Button>
            <Result
              waitingTransaction = {this.state.waitingTransaction}
              hashLink = {this.state.hashLink}
              random1={this.state.random1}
              random2={this.state.random2}
              random3={this.state.random3}
              storageText={this.state.storageText}
              predictionMade={this.state.predictionMade}
            />
          </Card>

          {/* Pay to modify prediction */}
          {this.state.predictionMade &&
            <Card maxWidth={"640px"} mx={"auto"} p={3} px={4}>
            <Flex maxWidth={"640px"} mx={"auto"} p={3}>
              <Text>
                <Text fontWeight={'bold'}>Not happy with your future?</Text> I can change it, but my power depends on my gaiety, so if you send me enought ETH to make me happy, I migth be able to change your future for the best!
              </Text>
            </Flex>
            <Flex width={1}>
              <Flex width={0.5} textAlign={"center"}>
                <Input type="number" min={"0.01"} step={"0.1"}
                  m={"auto"}
                  value={this.state.inputValue}
                  onChange={(e) => {
                    this.setState({ inputValue: e.target.value })
                  }}
                />
              </Flex>
              <Button
                width={0.5}
                onClick={() => {
                  this.payPrediction();
                }}
              >
                <p>Send me {this.state.inputValue} ETH</p>
              </Button>
            </Flex>
            <Flash my={3} variant="info">
              Be sure to have some Ropsten ETH on your account to be able to pay.<br></br>
              You can have free Ropsten ETH <Link href="https://faucet.ropsten.be/" target="_blank" title="Ropsten faucet"> here</Link>.
            </Flash>
            </Card>
          }
          <Credit/>
        </Box>
      </ThemeProvider>
    );
  }
}

export default App;
