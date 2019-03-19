/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';

class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      filters: props.filters || ['all', 'diagnosis', 'symptoms'],
      selectedFilter: ''
    };
  }

  componentDidMount() {
    const { filters } = this.state;
    this.setState({
      selectedFilter: filters[0]
    });
  }

  onChangeFilter = (e) => {
    this.setState({
      selectedFilter: e.target.value
    });
  }

  handleInput = (e) => {
    this.setState({
      query: e.target.value
    });
  };

  onSubmit = () => {
    const { onSearch } = this.props;
    const { query, selectedFilter } = this.state;
    if (onSearch) {
      onSearch(query, selectedFilter);
      this.setState({
        query: ''
      });
    }
  };

  render() {
    const { filters } = this.state;
    const { placeholder } = this.props;
    return (
      <div className="input-group left right">
        <div className="extra">
          <select name="filter" id="filter" onChange={this.onChangeFilter}>
            {filters.map(f => (<option value={f}>{f}</option>))}
          </select>
        </div>
        <div className="input">
          <input
            type="text"
            placeholder={placeholder || 'Search Here'}
            onInput={this.handleInput}
          />
        </div>
        <div className="extra">
          <button type="button">
            <i className="fa fa search" />
          </button>
        </div>
      </div>
    );
  }
}

SearchBox.propTypes = {
  placeholder: PropTypes.string,
  filters: PropTypes.arrayOf(String),
  onSearch: PropTypes.instanceOf(Function)
};

export default SearchBox;
