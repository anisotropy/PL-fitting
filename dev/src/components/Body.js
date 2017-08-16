import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Line} from 'react-chartjs-2';
import {_forIn, _mapO} from '../accessories/functions';

class Body extends Component {
	constructor(){
		super();
		this.state = {
			xData: [],
			expData: []
		};
	}
	setExpData(file){
		let fileReader = new FileReader();
		fileReader.onload = () => {
			let x = []; let exp = [];
			_forIn(fileReader.result.split(/\s+/), (d, i) => {if(d){
				(i % 2 == 0 ? x.push(d) : exp.push(d))
			}});
			this.setState({xData: x, expData: exp});
		};
		fileReader.readAsText(file);
	}
	setFitData(file){
		let fileReader = new FileReader();
		fileReader.onload = () => {
			let data = fileReader.result.split(/\s+/);
			let params = _mapO(data, (d, i) => (d && i % 2 == 0 ? [d, parseFloat(data[++i])] : undefined));
			console.log(params);
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
		const {xData, expData} = this.state;
		const change = (args) => this.handleChange.bind(this, args);
		const ref = (name) => (instance) => {this.refs[name] = instance;};
		const chartData = {
			labels: xData,
			datasets: [{
				label: '실험데이터',
				fill: false,
				data: expData
			}]
		};
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
