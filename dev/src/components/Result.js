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
		const {xData, expData, partial, total} = this.props;
		let result = 'Energy\tExp\tTotal\tI11\tI12\tI21\tI22\n';
		_forIn(xData, (x, i) => {
			result += x+'\t'+expData[i]+'\t'+total[i]+'\t'+partial[0][i]+'\t'+partial[1][i]+'\t'+partial[2][i]+'\t'+partial[3][i]+'\n'
		});
		return (
			<div className="result">
				<div className="result__close-btn" onClick={this.hClick}>
					<i className="fa fa-times" aria-hidden="true"></i>
				</div>
				<textarea className="result__textarea" readOnly value={result} />
			</div>
		);
	}
}
Result.propTypes = {
	xData: PropTypes.array.isRequired,
	expData: PropTypes.array.isRequired,
	partial: PropTypes.array.isRequired,
	total: PropTypes.array.isRequired,
	onClose: PropTypes.func.isRequired
};

export default Result;
