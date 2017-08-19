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

class Input extends PureComponent {
  constructor(){
    super();
    this.hChange = this.handleChange.bind(this);
    this.hFocus = this.handleFocus.bind(this);
    this.hBlur = this.handleBlur.bind(this);
    this.uCheckBox = this.updateCheckBox.bind(this);
  }
  handleChange(event){
    this.props.onUpdate({name: this.props.name, which: 'value', value: event.target.value.replace(/[^0-9e\.]/, '')});
  }
  handleFocus(){
    this.props.onUpdate({name: this.props.name, which: 'focused', value: true});
  }
  handleBlur(){
    this.props.onUpdate({name: this.props.name, which: 'focused', value: false});
  }
  updateCheckBox(checked){
    this.props.onUpdate({name: this.props.name, which: 'checked', value: checked});
  }
  render(){
    const {name, value, checked, focused} = this.props;
    return (
      <div className={_class('input', [{focused}])}>
        <CheckBox checked={checked} onUpdate={this.uCheckBox} />
        <span className="input__name">{name}</span>
        <input type="text" value={value} onChange={this.hChange} onFocus={this.hFocus} onBlur={this.hBlur} />
      </div>
    );
  }
}
Input.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  focused: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired
};

export default Input;
