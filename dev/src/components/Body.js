import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Editor from './Editor';
import Graph from './Graph';
import FitOptions from './FitOptions';
import LMMethod from 'ml-levenberg-marquardt';
import Button from './Button';
import Result from './Result';
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
			fitOptions: {},
			result: '',
			fitResult: null,
			spinner: false
		};
		this.oldParams = [];
		this.hMdParams = this.handleModifyParams.bind(this);
		this.hMdGraph = this.handleModifyGraph.bind(this);
		this.hMdFitOptions = this.handleModifyFitOptions.bind(this);
		this.hClick = {
			result: this.handleClick.bind(this, 'result'),
			fitResult: this.handleClick.bind(this, 'fitResult')
		};
	}
	componentWillMount(){
		let params = _mapA(_paramNames, (name) => ({name, value: '0', checked: true, marked: false}));
		_forIn(params, (p) => {switch(p.name){
			case 'Eloc': case 'Te': case 'Th': case 'me': case 'mh':
				p.checked = false; break;
		}});
		let fitOptions = {
			damping: '0.1',
			gradientDifference: '10e-5',
			maxIterations: '100',
			errorTolerance: '10e-5'
		}
		this.oldParams = _mapA(params, (p) => p.value);
		this.setState({params, fitOptions});
	}
	componentDidUpdate(prevProps, prevState){
		if(prevState.params != this.state.params || prevState.xData != this.state.xData){
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
		const {xData, expData, params, localized, fitOptions} = this.state;
		const checked = _mapA(params, (p, i) => (p.checked ? i : undefined));
		const data = {x: xData, y: expData};
		const func = _pl(_mapA(params, (p) => parseFloat(p.value)), localized, checked);
		const options = _mapO(fitOptions, (value, name) => [name, parseFloat(value)]);
		options.initialValues = _mapA(params, (p) => (p.checked ? parseFloat(p.value) : undefined));
		this.setState({spinner: true});
		setTimeout(() => {
			let result = LMMethod(data, func, options);
			let newParams = _wrap(() => {
				let temp = _mapA(params, (p) => p);
				_forIn(result.parameterValues, (v, i) => {temp[checked[i]].value = ''+v;});
				return temp;
			});
			let fitResult = {
				error: result.parameterError.toFixed(2),
				iterations: result.iterations
			};
			this.setState({params: newParams, fitResult, spinner: false});
		}, 300);
	}
	renderGraph(){if(this.state.xData.length > 0){
		const {params, localized, xData} = this.state;
		let {partial, total} = _plData(_mapA(params, (p) => (p.value ? parseFloat(p.value): 0)), localized, xData);
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
	modifyParamByMouse(dx, dy){
		const {params} = this.state;
		let marked = _extract(params, (p, i) => (p.marked ? {name: p.name, index: i} : undefined));
		if(!marked) return;
		let {name, index} = marked;
		switch(name){
			case 'A11': case 'A12': case 'A21': case 'A22':
				this.setState({params: update(params, {[index]: {value: {$apply: (v) => (''+(parseFloat(v)+dy))}}})}); break;
			case 'Eg1': case 'Eg2': case 'DEh2': case 'Ef': case 'Eloc': case 'Efh': case 'G1': case 'G2':
				this.setState({params: update(params, {[index]: {value: {$apply: (v) => (''+(parseFloat(v)+dx))}}})}); break;
		}
	}
	showResult(){
		const {xData, expData, partial, total} = this.state;
		let result = 'Energy\tExp\tTotal\tI11\tI12\tI21\tI22\n';
		_forIn(xData, (x, i) => {
			result += x+'\t'+expData[i]+'\t'+total[i]+'\t'+partial[0][i]+'\t'+partial[1][i]+'\t'+partial[2][i]+'\t'+partial[3][i]+'\n'
		});
		this.setState({result});
	}
	handleModifyParams(args){switch(args.method){
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
			this.changeLocalized(args.value); break;
		case 'fit':
			this.oldParams = _mapA(this.state.params, (p) => p.value);
			this.fit(); break;
		case 'undo':
			this.setState({params: _mapA(this.state.params, (p, i) => update(p, {value: {$set: this.oldParams[i]}}))}); break;
		case 'showParam':
			this.setState({result: _mapA(this.state.params, (p) => p.name+'\t'+(p.value ? p.value : '0')).join('\n')}); break;
	}}
	handleModifyGraph(args){switch(args.method){
		case 'modifyParam': this.modifyParamByMouse(args.dx, args.dy); break;
		case 'showResult': this.showResult(); break;
	}}
	handleModifyFitOptions(args){switch(args.method){
		case 'update':
			this.setState({fitOptions: update(this.state.fitOptions, {$merge: args.value})}); break;
	}}
	handleClick(which){switch(which){
		case 'result': this.setState({result: ''}); break;
		case 'fitResult': this.setState({fitResult: null}); break;
	}}
	render(){
		const {params, localized, xData, expData, partial, total, fitOptions, fitResult} = this.state;
		const renderedFitResult = fitResult && (
			<div className="body__fitresult">
				<div onClick={this.hClick.fitResult}>
					<p>error: {fitResult.error}</p>
					<p>iterations: {fitResult.iterations}</p>
				</div>
			</div>
		)
		return (
			<div className="body">
				<div className="body__side">
					<Editor params={params} localized={localized} visible={xData.length > 0} onModify={this.hMdParams} />
					<FitOptions options={fitOptions} onModify={this.hMdFitOptions} />
				</div>
				<Graph xData={xData} expData={expData} partial={partial} total={total} onModify={this.hMdGraph} />
				{this.state.result &&
					<Result result={this.state.result} onClose={this.hClick.result} />
				}
				{this.state.spinner &&
					<div className="body__spinner"><i className="fa fa-circle-o-notch fa-spin fa-fw"></i></div>
				}
				{renderedFitResult}
			</div>
		);
	}
}

export default Body;
