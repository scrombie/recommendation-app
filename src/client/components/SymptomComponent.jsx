/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import { post } from '../utils/utils';
import LoadingScreen from './LoadingScreen';
import Label from './Label';
import { VIEW } from './ResultContainer';

class SymptomComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      possibleDiagnosis: []
    };
  }

  componentDidMount() {
    const { symptom } = this.props;

    post('/api/symptoms/search-by-diagnosis', [symptom.id])
      .then(results => this.setState({ possibleDiagnosis: results }));
  }

  render() {
    const { possibleDiagnosis } = this.state;
    const { symptom, onView } = this.props;
    return (
      <div className="output-wrapper">
        <h1>Symptom</h1>
        <hr />
        <h2>{symptom.name}</h2>
        <p>This is a description of this Symptom.</p>
        <div>
          <h3>Possible Diagnosis with this symptom:</h3>
          <div
            style={{
              display: 'block',
              position: 'relative',
              minHeight: '10rem'
            }}
          >
            {possibleDiagnosis.length === 0 ? (<LoadingScreen />) : (
              <div className="label-wrapper">
                {possibleDiagnosis.map(d => <Label key={d.id} id={d.id} text={d.name} color="orange" onClick={() => onView(d.id, VIEW.viewDiagnosis)} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

SymptomComponent.propTypes = {
  symptom: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }).isRequired,
  onView: PropTypes.instanceOf(Function)
};

export default SymptomComponent;
