import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {_forIn} from '../accessories/functions';

class Result extends PureComponent {
	constructor(){
		super();
		this.hClick = this.handleClick.bind(this);
	}
	handleClick(){
		this.props.onClose();
	}
	render(){
		return (
			<div className="result">
				<div className="result__close-btn" onClick={this.hClick}>
					<i className="fa fa-times" aria-hidden="true"></i>
				</div>
				<textarea className="result__textarea" readOnly value={this.props.result} />
			</div>
		);
	}
}
Result.propTypes = {
	result: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired
};

export default Result;
