import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Input extends Component {
  handleChange(args, etc){switch(args.which){
    case 'input':
      this.props.onUpdate({value: etc.target.value}); break;
  }}
  handleClick(args, etc){switch(args.which){
    case 'input':
      this.props.onUpdate({marked: true}); break;
    case 'checkbox':
      this.props.onUpdate({checked: !this.props.checked})
  }}
  render(){
    return (
      <div className="input">
        <span className="input__checkbox"
          onClick={this.handleClick.bind(this, {which: 'checkbox'})}>
          {this.props.checked && <i className="fa fa-check" aria-hidden="true"></i>}
        </span>
        <span className="input__name">{this.props.name}</span>
        <input type="text"
          value={this.props.value}
          onChange={this.handleChange.bind(this, {which: 'input'})}
          onClick={this.handleClick.bind(this, {which: 'input'})}
        />
      </div>
    );
  }
}
Input.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  checked: PropTypes.bool,
  marked: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired
};

export default Input;
