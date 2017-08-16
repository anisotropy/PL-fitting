import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Line} from 'react-chartjs-2';
import {_forIn} from '../accessories/functions';

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
			let data = fileReader.result.split(/\s+/);
			let x = [];
			let exp = [];
			_forIn(fileReader.result.split(/\s+/), (d, i) => {if(d){
				(i % 2 == 0 ? x.push(d) : exp.push(d))
			}});
			this.setState({xData: x, expData: exp});
		};
		fileReader.readAsText(file);
	}
	handleChange(args, etc){switch(args.which){
		case 'expData':
			this.setExpData(etc.target.files[0]); break;
	}}
	render(){
		const change = (args) => this.handleChange.bind(this, args);
		const ref = (name) => (instance) => {this.refs[name] = instance;};
		const chartData = {
			labels: this.state.xData,
			datasets: [{
				data: this.state.expData
			}]
		};
		return (
			<div className="body">
				<input type="file" onChange={change({which: 'expData'})} />
				<Line data={chartData}/>
			</div>
		);
	}
}
Body.propType = {

};

export default Body;
