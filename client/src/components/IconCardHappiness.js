import React from "react";
import { Card, Box, Heading, Text, Link, Flex, Button, Icon, Flash } from "rimble-ui";

class IconCard extends React.Component {
  render() {
    let display = (
      <span role="img" aria-label="Joker">
        🃏
      </span>
    );
    if ( this.props.value && Number(this.props.value) === 0) {
      display = (
        <span role="img" aria-label="Loudly crying face">
          😭
        </span>
      );
    } else if (Number(this.props.value) === 1) {
      display = (
        <span role="img" aria-label="Sad face">
          😔
        </span>
      );
    } else if (Number(this.props.value) === 2) {
      display = (
        <span role="img" aria-label="Smiling face">
          😊
        </span>
      );
    } else if (Number(this.props.value) === 3) {
      display = (
        <span role="img" aria-label="Face with starry eyes">
          🤩
        </span>
      );
    }

    return (
      <Card bg={"#f7f1e3"} width={"120px"} mx={"auto"} my={"auto"} p={0}>
        <Text fontSize={"5em"} textAlign={"center"}>
          {display}
        </Text>
      </Card>
    );
  }
}

export default IconCard;
