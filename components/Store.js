import React, { Component } from 'react';
const Global = React.createContext({});

export default class Store extends Component {
  static Consumer = Global.Consumer;
  state = {
    showSmile: true
  };
  changeHeader = (value) => {
    if (value == "smile" && !this.state.showSmile) {
        this.setState({ showSmile: true });
    }
    if (value == "frown" && this.state.showSmile) {
        this.setState({ showSmile: false });
    }
  };
  render() {
    const { showSmile } = this.state;
    const { changeHeader } = this;
    return (
      <Global.Provider value={{
        showSmile,
        changeHeader
      }}>
        {this.props.children}
      </Global.Provider>
    )
  }
}