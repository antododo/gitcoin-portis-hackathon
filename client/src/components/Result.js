import React from "react";
import { Card, Text, Flex, Flash, Link } from "rimble-ui";
import IconCardWealth from "./IconCardWealth"
import IconCardWisdom from "./IconCardWisdom"
import IconCardLife from "./IconCardLife"

class Result extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.waitingTransaction &&
          <Flash my={3}>
            <Text fontSize={"5em"} textAlign={"center"}>
              <span role="img" aria-label="Crystall ball">
                🔮
              </span>
            </Text>
            <Text>
              I'm currently reading on the palm of your blockchain address. It can take some time...
              You can check my progress <Link href={this.props.hashLink} target="_blank" title="Check transaction"> here.
              </Link>
            </Text>
          </Flash>
        }

        {!this.props.waitingTransaction && this.props.predictionMade &&
          <Card bg="#f7f1e3" size="300px" my={3}>
          <Text
            fontWeight={'bold'}
            textAlign={"center"}
            fontFamily={"fantasy"}>
              {this.props.storageText}
            </Text>
          </Card>
        }
        {!this.props.waitingTransaction &&
          <Flex maxWidth={"640px"} mx={"auto"} p={3}>
            <IconCardWealth value={this.props.random1} />
            <IconCardLife value={this.props.random2} />
            <IconCardWisdom value={this.props.random3} />
          </Flex>
        }

      </React.Fragment>
    );
  }
}

export default Result;





