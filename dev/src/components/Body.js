import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Line} from 'react-chartjs-2';
import LMMethod from 'ml-levenberg-marquardt';
import {_plData, _totalIntens} from '../functions';
import {_forIn, _mapO, _mapA} from '../accessories/functions';

class Body extends Component {
	constructor(){
		super();
		this.state = {
			xData: [],
			expData: [],
			partial: [],
			total: []
		};
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

			let options = {
				damping: 0.1,
				initialValues: params,
				gradientDifference: 10e-15,
				maxIterations: 1000,
				errorTolerance: 10e-15
			};
			let result = LMMethod({x: this.state.xData, y: this.state.expData}, _totalIntens, options);

			let {partial, total} = _plData(result.parameterValues, this.state.xData);
			this.setState({partial, total});

			console.log(result, params);
		};
		fileReader.readAsText(file);
	}
	handleChange(args, etc){switch(args.which){
		case 'expData':
			this.setExpData(etc.target.files[0]); break;
		case 'params':
			this.setFitData(etc.target.files[0]); break;
	}}
	render(){
		const {xData, expData, partial, total} = this.state;
		const change = (args) => this.handleChange.bind(this, args);
		const ref = (name) => (instance) => {this.refs[name] = instance;};
		const chartData = {
			labels: xData,
			datasets: [
				{
					data: expData,
					label: 'exp',
					borderColor: 'rgba(0, 0, 0, 0.5)',
					borderWidth: 1,
					fill: false,
					pointRadius: 0
				}
			]
		};
		if(partial.length > 0){
			chartData.datasets.push(
				{
					data: total,
					label: 'total',
					borderColor: 'rgba(75,192,192,1)',
					borderWidth: 1,
					fill: false,
					pointRadius: 0
				},
				{
					data: partial[0],
					label: 'I11',
					borderColor: 'red',
					borderWidth: 1,
					fill: false,
					pointRadius: 0
				},
				{
					data: partial[1],
					label: 'I12',
					borderColor: 'blue',
					borderWidth: 1,
					fill: false,
					pointRadius: 0
				},
				{
					data: partial[2],
					label: 'I21',
					borderColor: 'orange',
					borderWidth: 1,
					fill: false,
					pointRadius: 0
				},
				{
					data: partial[3],
					label: 'I22',
					borderColor: 'green',
					borderWidth: 1,
					fill: false,
					pointRadius: 0
				}
			)
		}
		return (
			<div className="body">
				<div className="body__head">
					<input type="file" onChange={change({which: 'expData'})} />
					{xData.length > 0 &&
						<input type="file" onChange={change({which: 'params'})} />
					}
				</div>
				{xData.length > 0 &&
					<div className="body__body">
						<Line data={chartData}/>
					</div>
				}
			</div>
		);
	}
}
Body.propType = {

};

export default Body;
