import React from "react";
import { Card, Box, Heading, Text, Link, Flex, Button, Icon, Flash } from "rimble-ui";
import IconCardWealth from "./IconCardWealth"
import IconCardFriends from "./IconCardFriends"
import IconCardHappiness from "./IconCardHappiness"

class Result extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Flex maxWidth={"640px"} mx={"auto"} p={3}>
          <IconCardWealth value={this.props.random1} />
          <IconCardHappiness value={this.props.random2} />
          <IconCardFriends value={this.props.random3} />
        </Flex>
        <Card bg="black" size="300px">
          <Text color="white" textAlign={"center"}>
            {this.props.storageText}
          </Text>
        </Card>
      </React.Fragment>
    );
  }
}

export default Result;





