import React from "react";
import { Card, Text, Flex } from "rimble-ui";
import IconCardWealth from "./IconCardWealth"
import IconCardFriends from "./IconCardFriends"
import IconCardHappiness from "./IconCardHappiness"

class Result extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.PredictionMade &&
          <Card bg="#f7f1e3" size="300px">
          <Text
            fontWeight={'bold'}
            textAlign={"center"}
            fontFamily={"fantasy"}>
              {this.props.storageText}
            </Text>
          </Card>
        }
        <Flex maxWidth={"640px"} mx={"auto"} p={3}>
          <IconCardWealth value={this.props.random1} />
          <IconCardHappiness value={this.props.random2} />
          <IconCardFriends value={this.props.random3} />
        </Flex>
      </React.Fragment>
    );
  }
}

export default Result;




