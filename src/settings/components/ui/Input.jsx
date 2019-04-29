import React from 'react';
import PropTypes from 'prop-types';
import './Input.scss';

class Input extends React.Component {

  renderText(props) {
    let inputClassName = props.error ? 'input-error' : '';
    return <div className='settings-ui-input'>
      <label htmlFor={props.id}>{ props.label }</label>
      <input type='text' className={inputClassName} {...props} />
    </div>;
  }

  renderRadio(props) {
    let inputClassName = props.error ? 'input-error' : '';
    return <div className='settings-ui-input'>
      <label>
        <input type='radio' className={inputClassName} {...props} />
        { props.label }
      </label>
    </div>;
  }

  renderTextArea(props) {
    let inputClassName = props.error ? 'input-error' : '';
    return <div className='settings-ui-input'>
      <label
        htmlFor={props.id}
      >{ props.label }</label>
      <textarea className={inputClassName} {...props} />
      <p className='settings-ui-input-error'>{ this.props.error }</p>
    </div>;
  }

  render() {
    let { type } = this.props;

    switch (this.props.type) {
    case 'text':
      return this.renderText(this.props);
    case 'radio':
      return this.renderRadio(this.props);
    case 'textarea':
      return this.renderTextArea(this.props);
    default:
      console.warn(`Unsupported input type ${type}`);
    }
    return null;
  }
}

Input.propTypes = {
  type: PropTypes.string,
  error: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
};

export default Input;
