import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {_class} from '../accessories/functions';

class CheckBox extends PureComponent {
  constructor(){
    super();
    this.hClick = this.handleClick.bind(this);
  }
  handleClick(){
    this.props.onUpdate(!this.props.checked);
  }
  render(){
    const {checked} = this.props;
    return (
      <span className={_class('checkbox', [{checked}])} onClick={this.hClick}>
        <i className="fa fa-check" aria-hidden="true"></i>
      </span>
    );
  }
}
CheckBox.propTypes = {
  checked: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired
};

export default CheckBox;
