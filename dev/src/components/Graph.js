import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import {Line} from 'react-chartjs-2';
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
  }
  modifyParam(dX, dY){
    const {xData, expData} = this.props;
    this.props.onModify({
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
      }
      break;
    case 'up':
      if(this.mouse.startPos){
        //let dX = event.clientX - this.mouse.startPos[0];
        //let dY = event.clientY - this.mouse.startPos[1];
        this.mouse.startPos = null;
        //this.modifyParam(dX, dY);
      } break;
  }}
  render(){ if(this.props.xData.length == 0) return null;
    const {xData, expData, partial, total} = this.props;
    const makeData = (data, label, borderColor) => ({
      data, label, borderColor, borderWidth: 1, fill: false, pointRadius: 0
    });
    const instData = (partial.length > 0 ? [
      makeData(partial[0], 'I11', 'red'), makeData(partial[1], 'I12', 'orange'),
      makeData(partial[2], 'I21', 'blue'), makeData(partial[3], 'I22', 'green'),
      makeData(total, 'total', 'yellow')
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
        <div>
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
