import React, { Component } from "react";

export default class ErrorBoundary extends Component {
  state = {
    error: null,
    errorInfo: null
  };

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    // If there are no errors render
    // the child components
    if (!this.state.errorInfo) {
      return this.props.children;
    }

    // Display custom UI if there are errors
    // in our application
    return (
      <div>Something went wrong</div>
    );
  }
}