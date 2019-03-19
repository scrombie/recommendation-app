/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import NoResultComponent from './NoResultComponent';
import DiagnosisComponent from './DiagnosisComponent';
import SymptomComponent from './SymptomComponent';
import SearchResultComponent from './SearchResultComponent';

export const VIEW = {
  investigationResult: 'investigationResult',
  searchResult: 'searchResult',
  viewSymptom: 'viewSymptom',
  viewDiagnosis: 'viewDiagnosis'
};

export const defaultViewData = {
  currentView: VIEW.investigationResult,
  diagnosis: null,
  path: [],
  search: null,
  id: { symptom: 0, diagnosis: 0 }
};

const ResultContainer = ({ view, data, onView }) => (
  <React.Fragment>
    {view === VIEW.investigationResult && (
      <NoResultComponent symptoms={data.path} onView={onView} />
    )}
    {view === VIEW.viewDiagnosis && (
      <DiagnosisComponent diagnosis={data.id.diagnosis} onView={onView} />
    )}
    {view === VIEW.viewSymptom && (<SymptomComponent symptom={data.id.symptom} onView={onView} />)}
    {view === VIEW.searchResult && (
      <SearchResultComponent
        query={data.search.query}
        results={data.search.results}
        onView={onView}
      />
    )}
  </React.Fragment>
);

ResultContainer.defaultProps = {
  view: 'investigationResult'
};

ResultContainer.propTypes = {
  view: PropTypes.string,
  data: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Object),
    PropTypes.instanceOf(Array)
  ]).isRequired,
  onView: PropTypes.instanceOf(Function)
};

export default ResultContainer;
