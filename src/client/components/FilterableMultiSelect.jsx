/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/require-default-props */
import React from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';

class FilterableMultiSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // ],
      items: props.items,
      filteredItems: [],
      filterBy: props.filterBy,
      query: '',
      showDropDown: false,
      selectedItems: []
    };
  }

  // backspace keyCode is 8, key = Backspace

  componentDidMount() {
    const { input: { value } } = this.props;
    const { items } = this.state;
    const preSelected = items.filter(
      item => value.indexOf(item.id) > -1
    );

    this.setState({
      filteredItems: items,
      selectedItems: preSelected || []
    });
  }

  filterList = (query) => {
    const { items, filterBy } = this.state;
    if (query.length === 0) {
      this.setState({
        filteredItems: items,
        query
      });
    } else {
      // return item[key] && item[key].toLowerCase().indexOf(query.toLowerCase()) > -1;
      const l = items.filter(item => filterBy.some(key => (
        _.get(item, key, '')
          .toLowerCase()
          .indexOf(query.toLowerCase()) > -1
      )));
      if (l.length === 0) l.push({ id: -1, name: 'no result' });
      this.setState({
        filteredItems: l,
        query
      });
    }
  };

  toggleDropDown = (show) => {
    this.setState({
      showDropDown: show
    });
  };

  onChange = () => {
    const {
      input: { onChange }
    } = this.props;
    const { items } = this.state;
    if (onChange) {
      onChange(this.getValues());
      this.setState({
        filteredItems: items
      });
    } else {
      console.log('ON CHANGE IS NULL');
    }
  }

  getValues = () => {
    const { selectedItems } = this.state;
    return selectedItems.reduce((a, c) => {
      a.push(c.id); return a;
    }, []);
  }

  setValue = (selectedItem) => {
    if (selectedItem.id === -1) return;

    const { selectedItems, items } = this.state;
    selectedItems.push(selectedItem);
    this.setState({
      selectedItems,
      items: items.filter(item => item.id !== selectedItem.id),
      query: '',
      // showDropDown: false
    }, () => this.onChange());
  };

  removeItem = (item) => {
    const { selectedItems, items } = this.state;
    selectedItems.splice(selectedItems.indexOf(item), 1);
    items.push(item);
    this.setState({
      selectedItems,
      items,
      query: '',
      // showDropDown: false
    }, () => this.onChange());
  }

  onBackSpace = (e) => {
    const { query, selectedItems } = this.state;
    if (query.length === 0 && selectedItems.length >= 1 && e.keyCode === 8) {
      this.removeItem(selectedItems[selectedItems.length - 1]);
    }
  }

  render() {
    const {
      filteredItems, showDropDown, query, selectedItems
    } = this.state;
    const {
      input: { name },
      placeholder,
      extraKey
    } = this.props;

    return (
      <div className="select">
        <div className="input-wrapper">
          {selectedItems.map(item => (
            <div className="item" key={item.id}>
              {item.name}
              <span className="remove" onClick={() => this.removeItem(item)}>&nbsp;&times;&nbsp;</span>
            </div>
          ))}
          <input
            className="input"
            type="text"
            placeholder={placeholder}
            onInput={e => this.filterList(e.target.value)}
            onChange={e => this.filterList(e.target.value)}
            onFocus={() => this.toggleDropDown(true)}
            onBlur={() => this.toggleDropDown(false)}
            onKeyDown={this.onBackSpace}
            value={query}
          />
        </div>
        <input
          type="hidden"
          value={this.getValues()}
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

FilterableMultiSelect.propTypes = {
  items: PropTypes.instanceOf(Array).isRequired,
  filterBy: PropTypes.instanceOf(Array).isRequired,
  placeholder: PropTypes.string,
  extraKey: PropTypes.string,
  input: PropTypes.shape({
    value: PropTypes.arrayOf(String),
    onChange: PropTypes.instanceOf(Function)
  })
};

export default FilterableMultiSelect;
