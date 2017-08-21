import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Input from './Input';
import {_mapA, _mapO} from '../accessories/functions';

class FitOptions extends PureComponent {
	constructor(){
		super();
		this.hUpdate = {};
	}
	componentWillMount(){
		this.hUpdate = _mapO(this.props.options, (value, name) => [name, this.handleUpdate.bind(this, name)]);
	}
	handleUpdate(name, args){
		if(args.which == 'value'){
		this.props.onModify({method: 'update', value: {[name]: args.value}});
	}}
	render(){
		const inputs = _mapA(this.props.options, (value, name) => (
			<Input key={name} name={name} value={value} checkable={false} onUpdate={this.hUpdate[name]} />
		));
		return (
			<div className="fitoptions">
				{inputs}
			</div>
		);
	}
}
FitOptions.propTypes = {
	options: PropTypes.object.isRequired,
	onModify: PropTypes.func.isRequired
};

export default FitOptions;
