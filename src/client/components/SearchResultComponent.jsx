/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import Label from './Label';
import { VIEW } from './ResultContainer';

const getColor = type => (type.toLowerCase() === 'diagnosis' ? 'blue' : 'orange');
const open = (node, onClick) => (node.type[0].toLowerCase() === 'diagnosis' ? onClick(node, VIEW.viewDiagnosis) : onClick(node, VIEW.viewSymptom));

const SearchResultComponent = ({ results, query, onView }) => (
  <div className="output-wrapper">
    <div className="close"><i className="fas fas-times" /></div>
    <h1>Search Results</h1>
    <hr />
    <p>
      Search Results for: &nbsp;&nbsp;
      {query}
    </p>
    <div>
      <div
        style={{
          display: 'block',
          position: 'relative',
          minHeight: '10rem',
          marginTop: '1rem'
        }}
      >
        <React.Fragment>
          {results.length > 0 && (
            <div className="label-wrapper">
              {results.map(
                s => <Label key={s.id} id={s.id} text={s.name} color={getColor(s.type[0])} onClick={() => open(s, onView)} />
              )}
            </div>
          )}
          {results.length === 0 && (<p>No result found.</p>)}
        </React.Fragment>
      </div>
    </div>
  </div>
);

SearchResultComponent.propTypes = {
  query: PropTypes.string.isRequired,
  results: PropTypes.instanceOf(Array),
  onView: PropTypes.instanceOf(Function)
};

export default SearchResultComponent;
