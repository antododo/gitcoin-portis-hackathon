import React from "react";
import { Card, Flex, Text } from "rimble-ui";

class Introduction extends React.Component {
  render() {
    return (
      <Card maxWidth={"640px"} mx={"auto"} p={3} px={4}>
        <Text fontSize={"5em"} textAlign={"center"}>
          <span role="img" aria-label="sorceress">
            🧙‍
          </span>
        </Text>
        <Flex maxWidth={"640px"} mx={"auto"} p={3}>
          <Text>Hi there, I'm Irma, and I can predict your future! I can read on the palm of your Ethereum address and tell what the future hold for you!</Text>
        </Flex>
      </Card>
    );
  }
}

export default Introduction;