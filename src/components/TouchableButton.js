/* @flow */

import React, { PropTypes, Component } from 'react';
import {
  TouchableOpacity,
} from 'react-native';

type Props = {
  onPress: Function;
  children?: any;
}

export default class TouchableButton extends Component<void, Props, void> {

  static propTypes = {
    onPress: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
  };

  componentWillUnmount() {
    this._cleanUp();
  }

  _interval: any;
  _timeout: any;
  _handled: boolean = false;

  _cleanUp = () => {
    if (this._interval) {
      clearInterval(this._interval);
    }
    if (this._timeout) {
      clearInterval(this._timeout);
    }
    this._handled = false;
  }

  _handlePressIn = (e: any) => {
    this._timeout = setTimeout(() => {
      this._interval = setInterval(() => {
        this._handled = true;
        this.props.onPress(e);
      }, 50);
    }, 3000);
  };

  _handlePressOut = () => {
    this._cleanUp();
  };

  _handlePress = (e: any) => {
    if (this._handled) {
      return;
    }
    this.props.onPress(e);
  };

  render() {
    return (
      <TouchableOpacity
        {...this.props}
        onPress={this._handlePress}
        onPressIn={this._handlePressIn}
        onPressOut={this._handlePressOut}
      >
        {this.props.children}
      </TouchableOpacity>
    );
  }
}
