import React, { Component } from "react";

class Like extends React.Component {
  render() {
    let classes = "clickable fa fa-heart";
    if (!this.props.liked) classes += "-o";
    else classes = "clickalbe fa fa-heart";

    return (
      <React.Fragment>
        <i
          onClick={this.props.onClick}
          className={classes}
          aria-hidden="true"
        ></i>
      </React.Fragment>
    );
  }
}

export default Like;
