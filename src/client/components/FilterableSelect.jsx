/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/require-default-props */
import React from 'react';
import memoize from 'memoize-one';
import * as _ from 'lodash';
import PropTypes from 'prop-types';

class FilterableSelect extends React.Component {
  filterList = memoize(
    (query, items, filterBy) => items.filter(item => filterBy.some(key => (
      _.get(item, key, '')
        .toLowerCase()
        .indexOf(query.toLowerCase()) > -1
    )))
    // if (query.length === 0) {
    //   this.setState({
    //     filteredItems: items,
    //     query
    //   });
    // } else {
    //   const l = items.filter(item => filterBy.some(key => (
    //     _.get(item, key, '')
    //       .toLowerCase()
    //       .indexOf(query.toLowerCase()) > -1
    //   )));
    //   if (l.length === 0) l.push({ id: -1, name: 'no result' });
    //   this.setState({
    //     filteredItems: l,
    //     query
    //   });
    // }
  );

  constructor(props) {
    super(props);
    this.state = {
      // ],
      query: '',
      showDropDown: false,
      selectedItem: null
    };
  }

  componentDidMount() {
    const { items, input: { value } } = this.props;
    const preSelected = items.filter(
      item => item.id === value
    )[0];

    this.setState({
      selectedItem: preSelected || null,
      query: preSelected ? preSelected.name : ''
    });
  }

  handleChange = (query) => {
    this.setState({
      query
    });
  }

  toggleDropDown = (show) => {
    this.setState({
      showDropDown: show
    });
  };

  setValue = (selectedItem) => {
    const {
      input: { onChange }
    } = this.props;
    this.setState({
      selectedItem,
      query: '',
      showDropDown: false
    });
    if (onChange) {
      onChange(selectedItem.id);
    } else {
      console.log('ON CHANGE IS NULL');
    }
  };

  render() {
    const {
      showDropDown, query, selectedItem
    } = this.state;
    const {
      input: { name },
      placeholder,
      extraKey,
      items,
      filterBy
    } = this.props;

    const filteredItems = this.filterList(query, items, filterBy);

    return (
      <div className="select">
        <div className="input-wrapper">
          <input
            className="input"
            type="text"
            placeholder={placeholder}
            onInput={e => this.handleChange(e.target.value)}
            onChange={e => this.handleChange(e.target.value)}
            onFocus={() => this.toggleDropDown(true)}
            onBlur={() => this.toggleDropDown(false)}
            value={query}
          />
        </div>
        <input
          type="hidden"
          value={selectedItem ? selectedItem.id : -1}
          name={name}
        />
        {showDropDown && (
          <ul className="dropdown">
            {filteredItems.map(item => (
              <li key={item.id} className="item" onMouseDown={() => this.setValue(item)}>
                <p className="text-main">{item.name}</p>
                {extraKey && (
                  <p className="text-sub">
                    {item[extraKey]}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

FilterableSelect.propTypes = {
  items: PropTypes.instanceOf(Array).isRequired,
  filterBy: PropTypes.instanceOf(Array).isRequired,
  placeholder: PropTypes.string,
  extraKey: PropTypes.string,
  input: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.instanceOf(Function)
  })
};

export default FilterableSelect;
