import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Input from './Input';
import update from 'immutability-helper';
import {_mapA, _extract} from '../accessories/functions';

class Editor extends PureComponent {
  constructor(){
    super();
    this.hUpdate = (args) => this.handleUpdate.bind(this, args);
    this.uParams = this.updateParams.bind(this);
  }
  handleUpdate(args, etc){switch(args.which){
    case 'input':
      this.props.onUpdate({which: 'params', index: args.index, value: etc}); break;
  }}
  updateParams(args){
    let index = _extract(this.props.params, (p, i) => (p.name == args.name ? i : undefined));
    this.props.onUpdate({which: index, value: {[args.which]: args.value}});
  }
  test(){
    this.props.onUpdate({which: 'params', index: 2, value: {focused: true}});
  }
  render(){
    const {params} = this.props;
    const Inputs = _mapA(params, (p, i) => (
      <Input key={p.name} {...p} onUpdate={this.uParams} />
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
  onUpdate: PropTypes.func.isRequired
};

export default Editor;
