import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Input from './Input';
import update from 'immutability-helper';
import {_mapA, _extract} from '../accessories/functions';

class Editor extends PureComponent {
  constructor(){
    super();
    this.uParams = [];
  }
  componentWillMount(){
    this.uParams = _mapA(this.props.params, (p, i) => this.updateParams.bind(this, i));
  }
  updateParams(index, args){switch(args.which){
    case 'value': case 'checked':
      this.props.onModify({method: 'update', index, value: {[args.which]: args.value}}); break;
    case 'marked':
      this.props.onModify({method: 'mark', index}); break;
  }}
  render(){
    const {params} = this.props;
    const Inputs = _mapA(params, (p, i) => (
      <Input key={p.name} {...p} onUpdate={this.uParams[i]} />
    ));
    return (
      <div className="editor">
        {Inputs}
      </div>
    );
  }
}
Editor.propTypes = {
  params: PropTypes.array.isRequired,
  onModify: PropTypes.func.isRequired
};

export default Editor;
