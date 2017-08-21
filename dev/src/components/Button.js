import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {_class} from '../accessories/functions';

class Button extends PureComponent {
	constructor(){
		super();
		this.hClick = this.handleClick.bind(this);
	}
	handleClick(){
		this.props.onClick();
	}
	render(){
		const {className, children} = this.props;
		return (
			<a className={_class('button', [className])} onClick={this.hClick}>
				{children}
			</a>
		);
	}
}
Button.PropTypes = {
	children: PropTypes.element,
	className: PropTypes.string,
	onClick: PropTypes.func.isRequired
};

export default Button;
