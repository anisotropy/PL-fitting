import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import CheckBox from './CheckBox';
import {_class} from '../accessories/functions';

class Input extends PureComponent {
	constructor(){
		super();
		this.hChange = this.handleChange.bind(this);
		this.hClick = this.handleClick.bind(this);
		this.uCheckBox = this.updateCheckBox.bind(this);
	}
	handleChange(event){if(!this.props.disabled){
		this.props.onUpdate({which: 'value', value: event.target.value.replace(/[^0-9e\.-]/, '')});
	}}
	handleClick(){if(!this.props.disabled){
		this.props.onUpdate({which: 'marked', value: true});
	}}
	updateCheckBox(checked){if(!this.props.disabled){
		this.props.onUpdate({which: 'checked', value: checked});
	}}
	render(){
		const {name, value, checked, marked, disabled, checkable} = this.props;
		return (
			<div className={_class('input', [{marked, disabled}])}>
				{checkable && <CheckBox checked={checked} onUpdate={this.uCheckBox} />}
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
	disabled: PropTypes.bool,
	checkable: PropTypes.bool,
	onUpdate: PropTypes.func.isRequired
};
Input.defaultProps = {
	checkable: true
};

export default Input;
