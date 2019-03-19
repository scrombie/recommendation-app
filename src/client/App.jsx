import React, { Component } from 'react';
import memoize from 'memoize-one';
// import FilterableMultiSelect from './components/FilterableMultiSelect';
import {
  get, post, getKeys, listFilter
} from './utils/utils';
import './app.scss';
import FilterableSelect from './components/FilterableSelect';
import Label from './components/Label';
import LoadingScreen from './components/LoadingScreen';
import SearchBox from './components/SearchBox';
import ResultContainer, { VIEW, defaultViewData } from './components/ResultContainer';

const API = {
  getAllSymptoms: '/api/symptoms',
  getAssociatedSymptoms: '/api/symptoms/search-by-diagnosis',
  getDiagnosis: id => `/api/diagnosis/${id}`,
  getDiagnosisWithExactSymptoms: '/api/diagnosis/with-symptoms',
  getPossibleDiagnosisBySymptoms: '/api/diagnosis/search-by-symptoms',
  getSamples: '/api/samples'
};


export default class App extends Component {
  investigate = memoize(
    (symptomIds) => {
      if (!symptomIds || symptomIds.length === 0) {
        // select main symptom
        return null;
      }

      if (symptomIds.length === 1) {
        // get possible diagnosis
        return post(API.getPossibleDiagnosisBySymptoms, [symptomIds[0]]).then((dList) => {
          if (dList.length === 1) {
            // get all symptoms of diagnosis found
            return get(API.getDiagnosis(dList[0].id))
              .then(d => ({ symptoms: listFilter(d[0].symptoms, symptomIds, 'id'), diagnosis: null }));
          }
          // get all symptoms across all diagnosis found
          // && select another symptom from new symptom list
          return post(API.getAssociatedSymptoms, getKeys(dList, 'id'))
            .then(sList => ({ symptoms: listFilter(sList, symptomIds, 'id'), diagnosis: null }));
        });
      }

      // find exact match
      return post(API.getDiagnosisWithExactSymptoms, symptomIds).then((dList) => {
        // check if diagnosis exists and is one
        if (dList.length === 1) {
          // diagnosis found
          return { symptoms: [], diagnosis: dList[0] };
        }
        // find possible diagnosis with available symptoms
        return post(API.getAssociatedSymptoms, getKeys(dList, 'id'))
          .then(sList => ({ symptoms: listFilter(sList, symptomIds, 'id'), diagnosis: null }));
      });
    }
  )

  search = memoize(
    (query, filter) => get('/api/search', { s: query, type: filter === 'all' ? '' : filter })
      .then(r => r)
  );

  state = {
    isLoading: false,
    symptoms: [],
    path: [],
    samples: [],
    viewData: defaultViewData
  };

  componentDidMount() {
    this.initialize();
  }

  initialize = () => {
    // get all symptoms
    this.setLoading(true);
    get(API.getAllSymptoms)
      .then((symptoms) => {
        this.setLoading(false);
        this.setState({ symptoms, path: [], viewData: defaultViewData });
      });
  }

  getSamples = () => {
    get(API.getSamples)
      .then(samples => this.setState({ samples }));
  }

  setLoading = (isLoading) => {
    this.setState({
      isLoading
    });
  }

  addSymptomToPath = (sId) => {
    const { symptoms, path } = this.state;
    const symptom = symptoms.filter(s => s.id === sId)[0];
    if (symptom && path.indexOf(symptom) === -1) {
      path.push(symptom);
      this.setState({
        path
      }, () => this.performInvestigation());
    }
  };

  performInvestigation = () => {
    const { path } = this.state;
    this.setLoading(true);
    if (path.length > 0) {
      this.investigate(getKeys(path, 'id')).then(({ diagnosis, symptoms }) => {
        // render output container
        this.setState({
          isLoading: false,
          symptoms,
          viewData: {
            path,
            diagnosis,
            currentView: diagnosis ? VIEW.viewDiagnosis : VIEW.investigationResult,
            id: !diagnosis ? null : { diagnosis }
          }
        });
      });
    }
  }

  performSearch = (query, filter) => {
    this.setLoading(true);
    this.search(query, filter)
      .then(({ results }) => this.setState({
        isLoading: false,
        viewData: Object.assign(
          {},
          defaultViewData,
          { currentView: VIEW.searchResult, search: { query, results } }
        )
      }));
  }

  removeSymptomFromPath = (sId) => {
    const { path } = this.state;
    this.setState({
      path: path.filter(p => p.id !== sId)
    }, () => this.performInvestigation());
  };

  onView = (node, type) => {
    this.setState({
      viewData: Object.assign({}, defaultViewData, {
        currentView: type === VIEW.viewDiagnosis ? type : VIEW.viewSymptom,
        id: {
          symptom: type === VIEW.viewSymptom ? node : null,
          diagnosis: type === VIEW.viewDiagnosis ? node : null
        }
      })
    });
  }

  render() {
    const {
      symptoms, path, isLoading, samples, viewData
    } = this.state;
    return (
      <div className="container">
        <section className="input">
          <SearchBox
            placeholder="Search here..."
            filters={['diagnosis', 'symptoms', 'all']}
            onSearch={this.performSearch}
          />
          <div className="title-wrapper">
            <h1 className="text-title">An App </h1>
            <h3 className="text-sub-title">An app that does stuff</h3>
          </div>
          <div className="form-wrapper">
            <div className="form-group">
              <p className="form-label">{path.length >= 1 ? 'Enter another Symptom' : 'Enter a Main Symptom'}</p>
              {/* <input type="text" className="text-input" id="input" /> */}
              {/* <FilterableMultiSelect
                items={items}
                filterBy={['name']}
                placeholder="Search here"
                input={{ value: [], onChange: console.log }}
              /> */}
              <FilterableSelect
                items={symptoms}
                filterBy={['name']}
                placeholder={path.length > 0 ? 'Enter another Symptom' : 'Enter a symptom'}
                input={{ value: '', onChange: this.addSymptomToPath }}
              />
            </div>
            {/* <button type="submit" className="btn">Submit</button> */}
          </div>
          {/* <hr style={{ width: '30%' }} /> */}
          <div className="current-path">
            {path.length > 0 && <p>Current Path:</p>}
            <div className="label-wrapper">
              {path.map(p => (
                <Label
                  key={p.id}
                  id={p.id}
                  text={p.name}
                  color="orange"
                  onRemove={this.removeSymptomFromPath}
                  onClick={() => this.onView(p, VIEW.viewSymptom)}
                />
              ))}
            </div>
            <br />
            {path.length > 0 && (
              <button className="btn btn-link reset-button" type="button" onClick={this.initialize}>
                Reset
              </button>
            )}
          </div>
          <div className="sample-wrapper">
            <p className="title">Samples: </p>
            {samples.length > 0 ? samples.map(s => (
              <p key={s.id}>
                <span className="diagnosis">{`${s.name}:`}</span>
                <span>{getKeys(s.symptoms, 'name').join(',')}</span>
              </p>
            )) : (
              <button className="btn btn-link" onClick={this.getSamples} type="button">
                Load Samples
              </button>
            )}
          </div>
        </section>
        <section className="output">
          {isLoading ? (<LoadingScreen />) : (
            <React.Fragment>
              <button className="btn btn-reset" type="button" onClick={this.initialize}>&times;</button>
              <ResultContainer
                view={viewData.currentView}
                data={viewData}
                onView={this.onView}
              />
            </React.Fragment>
            // <React.Fragment>
            //   {diagnosis ? (
            //     <DiagnosisComponent diagnosis={diagnosis} />
            //   ) : (
            //     <NoResultComponent symptoms={path.length > 0 ? path : []} />
            //   ) }
            // </React.Fragment>
          )}
        </section>
      </div>
    );
  }
}
