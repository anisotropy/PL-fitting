import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import {Line} from 'react-chartjs-2';
import Button from './Button';
import {_merge, _wrap, _forIn, _mapO} from '../accessories/functions';

class Graph extends PureComponent {
	constructor(){
		super();
		this.mouse = {
			down: false,
			startPos: null
		};
		this.hMouse = _mapO(['down', 'up', 'move', 'leave'], (action) => [action, this.handleMouse.bind(this, action)]);
		this.hClick = _mapO(['resultBtn'], (which) => [which, this.handleClick.bind(this, which)]);
	}
	modifyParam(dX, dY){
		const {xData, expData} = this.props;
		this.props.onModify({
			method: 'modifyParam',
			dx: (xData[xData.length-1] - xData[0])*dX/this.refs.wrap.clientWidth,
			dy: (expData[expData.length-1] - expData[0])*dY/this.refs.wrap.clientHeight
		});
	}
	handleMouse(action, event){switch(action){
		case 'down':
			this.mouse.down = true; break;
		case 'move':
			if(this.mouse.down){
				this.mouse.startPos = [event.clientX, event.clientY];
				this.mouse.down = false;
			}
			else if(this.mouse.startPos){
				let dX = event.clientX - this.mouse.startPos[0];
				let dY = event.clientY - this.mouse.startPos[1];
				this.modifyParam(dX, dY);
				this.mouse.startPos = [event.clientX, event.clientY];
			}
			break;
		case 'up':
			if(this.mouse.startPos) this.mouse.startPos = null; break;
		case 'leave':
			this.mouse = {down: false, startPos: null}; break;
	}}
	handleClick(which){switch(which){
		case 'resultBtn':
			this.props.onModify({method: 'showResult'}); break;
	}}
	render(){ if(this.props.xData.length == 0) return null;
		const {xData, expData, partial, total} = this.props;
		const makeData = (data, label, borderColor) => ({
			data, label, borderColor, borderWidth: 1, fill: false, pointRadius: 0
		});
		const instData = (partial.length > 0 ? [
			makeData(total, 'total', '#B40404'),
			makeData(partial[0], 'I11', '#FFBF00'), makeData(partial[1], 'I12', '#F79F81'),
			makeData(partial[2], 'I21', '#8181F7'), makeData(partial[3], 'I22', '#01DF74')
		] : []);
		const chartData = {
			labels: xData,
			datasets: _merge([makeData(expData, 'exp', 'black')], instData)
		};
		const error = _wrap(() => {
			if(total.length == 0) return null;
			let err = 0, sum = 0;
			_forIn(expData, (v, i) => {
				err += Math.abs(v - total[i]);
				sum += v;
			});
			return {value: err.toFixed(2), percent: ((err/sum)*100).toFixed(2)};
		});
		return (
			<div className="graph">
				<div className="graph__wrap"
					ref="wrap"
					onMouseDown={this.hMouse.down}
					onMouseUp={this.hMouse.up}
					onMouseMove={this.hMouse.move}
					onMouseLeave={this.hMouse.leave}>
					<Line data={chartData} options={{animation: false}}/>
				</div>
				<div className="graph__footer">
					{total.length > 0 && <Button onClick={this.hClick.resultBtn}>Result</Button>}
					{error && <span>error: {error.value}({error.percent}%)</span>}
				</div>
			</div>
		);
	}
}
Graph.propTypes = {
	xData: PropTypes.array,
	expData: PropTypes.array,
	partial: PropTypes.array,
	total: PropTypes.array,
	onModify: PropTypes.func.isRequired
};

export default Graph;
