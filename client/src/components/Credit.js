import React from "react";
import { Card, Flex, Text, Link } from "rimble-ui";

class Credit extends React.Component {
  render() {
    return (
      <Card maxWidth={"640px"} mx={"auto"} p={3} px={4}>
        <Text fontSize={"3em"} textAlign={"center"}>
          <span role="img" aria-label="Top hat">
            🎩
          </span>
        </Text>
        <Flex maxWidth={"640px"} mx={"auto"} p={3}>
          <Text italic textAlign="center">
            Made with magic by <Link href="https://github.com/antododo" target="_blank" title="Antododo Github">Antododo</Link> for the <Link href="https://hackathons.gitcoin.co/grow-ethereum/ " target="_blank" title="Gitcoin Grow Ethereum Hackaton">Gitcoin Grow Ethereum Hackaton.</Link> It's using <Link href="https://www.portis.io/" target="_blank" title="Portis">Portis</Link> to connect to the Ethereum blockchain.
          </Text>
        </Flex>
      </Card>
    );
  }
}

export default Credit;