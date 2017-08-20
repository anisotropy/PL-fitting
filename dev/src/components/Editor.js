import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Input from './Input';
import CheckBox from './CheckBox';
import Button from './Button';
import update from 'immutability-helper';
import {_mapA, _extract} from '../accessories/functions';

class Editor extends PureComponent {
  constructor(){
    super();
    this.hUdParams = [];
    this.hChExpFile = this.handleChangeExpFile.bind(this);
    this.hChParamFile = this.handleChangeParamFile.bind(this);
    this.hClickFitBtn = this.handleClickFitBtn.bind(this);
    this.hUdLocalized = this.handleUpdateLocalized.bind(this);
  }
  componentWillMount(){
    this.hUdParams = _mapA(this.props.params, (p, i) => this.handleUpdateParams.bind(this, i));
  }
  handleUpdateParams(index, args){switch(args.which){
    case 'checked':
      this.props.onModify({method: 'update', index, value: {checked: args.value}}); break;
    case 'value':
      this.props.onModify({method: 'changeValue', index, value: args.value}); break;
    case 'marked':
      this.props.onModify({method: 'mark', index}); break;
  }}
  handleChangeExpFile(event){
    this.props.onModify({method: 'loadExpData', file: event.target.files[0]});
  }
  handleChangeParamFile(event){
    this.props.onModify({method: 'loadParams', file: event.target.files[0]});
  }
  handleClickFitBtn(){
    this.props.onModify({method: 'fit'});
  }
  handleUpdateLocalized(){
    this.props.onModify({method: 'changeLocalized', value: !this.props.localized});
  }
  render(){
    const Inputs = _mapA(this.props.params, (p, i) => {
      let disabled = (
        (p.name == 'Eloc' && !this.props.localized) ||
        ((p.name == 'Efh' || p.name == 'Th') && this.props.localized)
      );
      return <Input key={p.name} {...p} disabled={disabled} onUpdate={this.hUdParams[i]} />;
    });
    const visible = (this.props.xData.length > 0);
    return (
      <div className="editor">
        <div className="editor__expfile">
          <span>실험데이터</span>
          <input type="file" onChange={this.hChExpFile} />
        </div>
        {visible &&
          <div className="editor__paramfile">
            <span>매개변수</span>
            <input type="file" onChange={this.hChParamFile} />
          </div>
        }
        {visible &&
          <div className="editor__params">
            {Inputs}
          </div>
        }
        {visible &&
          <div className="editor__localized">
            <CheckBox checked={this.props.localized} onUpdate={this.hUdLocalized} />
            <span>Localized</span>
          </div>
        }
        {visible &&
          <div className="editor__fit-btn">
            <Button onClick={this.hClickFitBtn}>Fitting</Button>
          </div>
        }
      </div>
    );
  }
}
Editor.propTypes = {
  params: PropTypes.array.isRequired,
  localized: PropTypes.bool,
  xData: PropTypes.array,
  onModify: PropTypes.func.isRequired
};

export default Editor;
