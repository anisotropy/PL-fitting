import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Editor from './Editor';
import Graph from './Graph';
import {Line} from 'react-chartjs-2';
import LMMethod from 'ml-levenberg-marquardt';
import update from 'immutability-helper';
import {_plData, _pl, _paramNames} from '../functions';
import {_wrap, _forIn, _mapO, _mapA} from '../accessories/functions';

class Body extends Component {
	constructor(){
		super();
		this.state = {
			params: [],
			localized: false,
			xData: [],
			expData: [],
			partial: [],
			total: [],
			spinner: false
		};
		this.mParams = this.modifyParams.bind(this);
		this.mGraph = this.modifyGraph.bind(this);
	}
	componentWillMount(){
		this.setState({params: _mapA(_paramNames, (name) => (name == 'Eloc' ?
			{name, value: '0', checked: false, marked: false} : {name, value: '0', checked: true, marked: false}
		))});
	}
	loadExpData(file){
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
	loadParams(file){
		let fileReader = new FileReader();
		fileReader.onload = () => {
			let values = _mapA(fileReader.result.split(/\s+/), (d, i) => (d && i % 2 == 1 ? d : undefined));
			let params = update(this.state.params, {$apply: (params) =>
				_mapA(params, (p, i) => update(p, {$merge: {value: values[i]}}))
			});
			this.setState({params});
			this.renderGraph(params, this.state.localized);
		};
		fileReader.readAsText(file);
	}
	fit(){
		const {xData, expData, params, localized} = this.state;
		const checked = _mapA(params, (p, i) => (p.checked ? i : undefined));
		let values = _mapA(params, (p) => parseFloat(p.value));
		let initialValues = _mapA(params, (p) => (p.checked ? parseFloat(p.value) : undefined));
		const data = {x: xData, y: expData};
		const func = _pl(values, localized, checked);
		const options = {
			damping: 0.001,
			initialValues: initialValues,
			gradientDifference: 10e-15,
			maxIterations: 100,
			errorTolerance: 10e-5
		};
		this.setState({spinner: true});
		setTimeout(() => {
			let result = LMMethod(data, func, options);
			console.log(result);
			let newParams = _wrap(() => {
				let temp = _mapA(params, (p) => p);
				_forIn(result.parameterValues, (v, i) => {temp[checked[i]].value = ''+v;});
				return temp;
			});
			this.setState({params: newParams, spinner: false});
			this.renderGraph(newParams, localized);
		}, 10);
	}
	renderGraph(params, localized){if(this.state.xData){
		let {partial, total} = _plData(_mapA(params, (p) => parseFloat(p.value)), localized, this.state.xData);
		this.setState({partial, total});
	}}
	changeValue(index, value){
		let params = update(this.state.params, {[index]: {$merge: {value}}});
		this.setState({params});
		this.renderGraph(params, this.state.localized);
	}
	changeLocalized(localized){
		this.renderGraph(this.state.params, localized);
		if(localized){
			this.setState({localized,
				params: update(this.state.params, {$apply: (params) => _mapA(params, (p) =>
					(p.name == 'Efh' || p.name == 'Th' ? update(p, {$merge: {checked: false, marked: false}}) : (
						p.name == 'Eloc' ? update(p, {$merge: {checked: true}}) : p
					))
				)})
			});
		} else {
			this.setState({localized,
				params: update(this.state.params, {$apply: (params) => _mapA(params, (p) =>
					(p.name == 'Eloc' ? update(p, {$merge: {checked: false, marked: false}}) : (
						p.name == 'Efh' || p.name == 'Th' ? update(p, {$merge: {checked: true}}) : p
					))
				)})
			});
		}
	}
	modifyParams(args){switch(args.method){
		case 'update':
			this.setState({params: update(this.state.params, {[args.index]: {$merge: args.value}})}); break;
		case 'changeValue':
			this.changeValue(args.index, args.value); break;
		case 'mark':
			this.setState({params: update(this.state.params, {$apply:(params) =>
				_mapA(params, (p, i) => (i == args.index ? update(p, {marked: {$set: true}}) : update(p, {marked: {$set: false}})))
			})}); break;
		case 'loadExpData':
			this.loadExpData(args.file); break;
		case 'loadParams':
			this.loadParams(args.file); break;
		case 'changeLocalized':
			this.changeLocalized(args.value);
			break;
		case 'fit':
			this.fit(); break;
	}}
	modifyGraph(args){switch(args.method){

	}}
	render(){
		return (
			<div className="body">
				<Editor {...this.state} onModify={this.mParams} />
				<Graph {...this.state} onModify={this.mGraph} />
				{this.state.spinner &&
					<div className="body__spinner"><i className="fa fa-circle-o-notch fa-spin fa-fw"></i></div>
				}
			</div>
		);
	}
}

export default Body;
