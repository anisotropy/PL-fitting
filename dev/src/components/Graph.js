import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import {Line} from 'react-chartjs-2';
import Button from './Button';
import {_merge, _wrap, _forIn} from '../accessories/functions';

class Graph extends PureComponent {
	constructor(){
		super();
		this.mouse = {
			down: false,
			startPos: null
		};
		this.hMouse = {
			down: this.handleMouse.bind(this, 'down'),
			up: this.handleMouse.bind(this, 'up'),
			move: this.handleMouse.bind(this, 'move')
		};
		this.hClick = {
			resultBtn: this.handleClick.bind(this, 'resultBtn')
		};
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
			if(this.mouse.startPos){
				this.mouse.startPos = null;
			} break;
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
			makeData(total, 'total', 'yellow'),
			makeData(partial[0], 'I11', 'red'), makeData(partial[1], 'I12', 'orange'),
			makeData(partial[2], 'I21', 'blue'), makeData(partial[3], 'I22', 'green')
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
					onMouseMove={this.hMouse.move}>
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
