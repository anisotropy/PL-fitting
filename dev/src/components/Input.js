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
    this.hClick = this.handleClick.bind(this);
    this.uCheckBox = this.updateCheckBox.bind(this);
  }
  handleChange(event){
    //this.props.onUpdate({value: event.target.value.replace(/[^0-9e\.]/, '')});
    this.props.onUpdate({which: 'value', value: event.target.value.replace(/[^0-9e\.]/, '')});
  }
  handleClick(){
    //this.props.onUpdate({marked: true});
    this.props.onUpdate({which: 'marked', value: true});
  }
  updateCheckBox(checked){
    //this.props.onUpdate({checked});
    this.props.onUpdate({which: 'checked', value: checked});
  }
  render(){
    const {name, value, checked, marked} = this.props; console.log('input');
    return (
      <div className={_class('input', [{marked}])}>
        <CheckBox checked={checked} onUpdate={this.uCheckBox} />
        <span className="input__name">{name}</span>
        <input type="text" value={value} onChange={this.hChange} onClick={this.hClick} />
      </div>
    );
  }
}
Input.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  marked: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired
};

export default Input;
