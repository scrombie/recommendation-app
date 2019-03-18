import React from 'react';
import PropTypes from 'prop-types';
import FilterableMultiSelect from './FilterableMultiSelect';


class InputForm extends React.component {
  constructor(props) {
    super(props);
    this.state = {
      label: props.label || 'Please select symptom(s)',
      values: []
    };
  }

  setValues = (values) => {
    this.setState({
      values
    });
  }

  submitForm = () => {
    const { onSubmit } = this.props;
    const { values } = this.state;
    if (onSubmit) {
      onSubmit(values);
      this.setState({
        values: []
      });
    }
  };

  render() {
    const { label, values } = this.state;
    const { options } = this.props;
    return (
      <div className="form-wrapper">
        <div className="form-group">
          <p className="form-label">{label}</p>
          {/* <input type="text" className="text-input" id="input" /> */}
          <FilterableMultiSelect
            items={options}
            filterBy={['name']}
            placeholder="Search here"
            input={{ value: values, onChange: this.setValues }}
          />
        </div>
        <button type="submit" className="btn">Submit</button>
      </div>
    );
  }
}

InputForm.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })),
  onSubmit: PropTypes.instanceOf(Function)
};

export default InputForm;
