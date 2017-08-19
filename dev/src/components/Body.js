import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Editor from './Editor';
import Graph from './Graph';
import {Line} from 'react-chartjs-2';
import LMMethod from 'ml-levenberg-marquardt';
import update from 'immutability-helper';
import {_plData, _totalIntens, _paramNames} from '../functions';
import {_forIn, _mapO, _mapA} from '../accessories/functions';

class Body extends Component {
	constructor(){
		super();
		this.state = {
			params: _mapA(_paramNames, (name) => ({name, value: '0', checked: true, marked: false})),
			xData: [],
			expData: [],
			partial: [],
			total: []
		};
		this.mParams = this.modifyParams.bind(this);
	}
	setExpData(file){
		let fileReader = new FileReader();
		fileReader.onload = () => {
			let x = []; let exp = [];
			_forIn(fileReader.result.split(/\s+/), (d, i) => {if(d){
				(i % 2 == 0 ? x.push(parseFloat(d)) : exp.push(parseFloat(d)))
			}});
			this.setState({xData: x, expData: exp});
		};
		fileReader.readAsText(file);
	}
	setFitData(file){
		let fileReader = new FileReader();
		fileReader.onload = () => {
			let params = _mapA(fileReader.result.split(/\s+/), (d, i) => (d && i % 2 == 1 ? parseFloat(d) : undefined));
			/*
			let options = {
				damping: 0.1,
				initialValues: params,
				gradientDifference: 10e-15,
				maxIterations: 1000,
				errorTolerance: 10e-15
			};
			let result = LMMethod({x: this.state.xData, y: this.state.expData}, _totalIntens, options);

			let {partial, total} = _plData(result.parameterValues, this.state.xData);
			*/
			this.setState({partial, total});
		};
		fileReader.readAsText(file);
	}
	modifyParams(args){switch(args.method){
		case 'update':
			this.setState({params: update(this.state.params, {[args.index]: {$merge: args.value}})}); break;
		case 'mark':
			this.setState({params: update(this.state.params, {$apply:(params) =>
				_mapA(params, (p, i) => (i == args.index ? update(p, {marked: {$set: true}}) : update(p, {marked: {$set: false}})))
			})}); break;
	}}
	render(){
		const {xData, expData, partial, total} = this.state;
		const ref = (name) => (instance) => {this.refs[name] = instance;};
		return (
			<div className="body">
				{/*<div className="body__head">
					<input type="file" onChange={change({which: 'expData'})} />
					{xData.length > 0 &&
						<input type="file" onChange={change({which: 'params'})} />
					}
				</div>*/}
				<Editor {...this.state} onModify={this.mParams} />
				{/*<Graph {...this.state} onUpdate={hUpdate({which: 'graph'})} />*/}
			</div>
		);
	}
}
Body.propType = {

};

export default Body;
