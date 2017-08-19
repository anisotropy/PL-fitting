import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import {Line} from 'react-chartjs-2';

class Graph extends PureComponent {
  render(){
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
			datasets: [makeData(expData, 'exp', 'black')].push(instData)
    };
    return (
      <div className="graph">
        <Line data={chartData}/>
      </div>
    );
  }
}
Graph.propTypes = {
  xData: PropTypes.array.isRequired,
  expData: PropTypes.array.isRequired,
  partial: PropTypes.array,
  total: PropTypes.array
};

export default Graph;
