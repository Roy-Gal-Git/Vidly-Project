import React, { Component } from "react";

class Like extends React.Component {
  render() {
    let classes = "fa fa-heart";
    if (!this.props.liked) classes += "-o";
    else classes = "fa fa-heart";

    return (
      <React.Fragment>
        <i
          onClick={this.props.onClick}
          className={classes}
          aria-hidden="true"
          style={{ cursor: "pointer" }}
        ></i>
      </React.Fragment>
    );
  }
}

export default Like;
