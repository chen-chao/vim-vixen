import './BlacklistForm.scss';
import AddButton from '../ui/AddButton';
import DeleteButton from '../ui/DeleteButton';
import React from 'react';
import PropTypes from 'prop-types';

class BlacklistForm extends React.Component {

  render() {
    let value = this.props.value;
    if (!value) {
      value = [];
    }

    return <div className='form-blacklist-form'>
      {
        value.map((url, index) => {
          return <div key={index} className='form-blacklist-form-row'>
            <input data-index={index} type='text' name='url'
              className='column-url' value={url}
              onChange={this.bindValue.bind(this)} />
            <DeleteButton data-index={index} name='delete'
              onClick={this.bindValue.bind(this)} />
          </div>;
        })
      }
      <AddButton name='add' style={{ float: 'right' }}
        onClick={this.bindValue.bind(this)} />
    </div>;
  }

  bindValue(e) {
    if (!this.props.onChange) {
      return;
    }

    let name = e.target.name;
    let index = e.target.getAttribute('data-index');
    let next = this.props.value ? this.props.value.slice() : [];

    if (name === 'url') {
      next[index] = e.target.value;
    } else if (name === 'add') {
      next.push('');
    } else if (name === 'delete') {
      next.splice(index, 1);
    }

    this.props.onChange(next);
  }
}

BlacklistForm.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};

export default BlacklistForm;
