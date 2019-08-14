import React from "react";
import { Card, Text } from "rimble-ui";

class IconCard extends React.Component {
  render() {
    let display = (
      <span role="img" aria-label="Joker">
        🃏
      </span>
    );
    if ( this.props.value && Number(this.props.value) === 0) {
      display = (
        <span role="img" aria-label="Alien">
          👽
        </span>
      );
    } else if (Number(this.props.value) === 1) {
      display = (
        <span role="img" aria-label="Confounded face">
          😖
        </span>
      );
    } else if (Number(this.props.value) === 2) {
      display = (
        <span role="img" aria-label="Chocolate bar">
          🍫
        </span>
      );
    } else if (Number(this.props.value) === 3) {
      display = (
        <span role="img" aria-label="Trophy">
          🏆
        </span>
      );
    } else if (Number(this.props.value) === 4) {
      display = (
        <span role="img" aria-label="Rocket">
          🚀
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
