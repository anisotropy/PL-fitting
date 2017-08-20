import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Editor from './Editor';
import Graph from './Graph';
import {Line} from 'react-chartjs-2';
import LMMethod from 'ml-levenberg-marquardt';
import update from 'immutability-helper';
import {_plData, _pl, _paramNames} from '../functions';
import {_wrap, _forIn, _mapO, _mapA, _extract} from '../accessories/functions';

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
		let params = _mapA(_paramNames, (name) => ({name, value: '0', checked: true, marked: false}));
		_forIn(params, (p) => {switch(p.name){
			case 'Eloc': case 'Te': case 'Th': case 'me': case 'mh':
				p.checked = false; break;
		}});
		this.setState({params});
	}
	componentDidUpdate(prevProps, prevState){
		if(prevState.params != this.state.params){
			this.renderGraph();
		}
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
			damping: 0.1,
			initialValues: initialValues,
			gradientDifference: 10e-5,
			maxIterations: 100,
			errorTolerance: 10e-5
		};
		this.setState({spinner: true});
		setTimeout(() => {
			let result = LMMethod(data, func, options);
			let newParams = _wrap(() => {
				let temp = _mapA(params, (p) => p);
				_forIn(result.parameterValues, (v, i) => {temp[checked[i]].value = ''+v;});
				return temp;
			});
			this.setState({params: newParams, spinner: false});
		}, 10);
	}
	renderGraph(){if(this.state.xData){
		const {params, localized} = this.state;
		let {partial, total} = _plData(_mapA(params, (p) => parseFloat(p.value)), localized, this.state.xData);
		this.setState({partial, total});
	}}
	changeLocalized(localized){
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
	modifyGraph(args){
		const {params} = this.state;
		let {name, index} = _extract(params, (p, i) => (p.marked ? {name: p.name, index: i} : undefined));
		switch(name){
			case 'A11': case 'A12': case 'A21': case 'A22': case 'G1': case 'G2':
				this.setState({params: update(params, {[index]: {value: {$apply: (v) => (''+(parseFloat(v)+args.dy))}}})}); break;
			case 'Eg1': case 'Eg2': case 'DEh2': case 'Ef': case 'Eloc': case 'Efh':
				this.setState({params: update(params, {[index]: {value: {$apply: (v) => (''+(parseFloat(v)+args.dx))}}})}); break;
		}
	}
	render(){
		const {params, localized, xData, expData, partial, total} = this.state;
		return (
			<div className="body">
				<Editor params={params} localized={localized} visible={xData.length > 0} onModify={this.mParams} />
				<Graph xData={xData} expData={expData} partial={partial} total={total} onModify={this.mGraph} />
				{this.state.spinner &&
					<div className="body__spinner"><i className="fa fa-circle-o-notch fa-spin fa-fw"></i></div>
				}
			</div>
		);
	}
}

export default Body;
