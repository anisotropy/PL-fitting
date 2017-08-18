import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Input from './Input';
import {_mapA} from '../accessories/functions';

class Editor extends Component {
  handleUpdate(args, etc){switch(args.which){
    case 'input':
  }}
  render(){
    const {params} = this.props;
    const hUpdate = (args) => this.handleUpdate.bind(this, args);
    const Inputs = _mapA(params, (p, i) => (
      <Input key={i} {...p} onUpdate={hUpdate({which: 'input', index: i})} />
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
