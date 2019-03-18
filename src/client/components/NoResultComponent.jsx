import React from 'react';
import PropTypes from 'prop-types';
import { getKeys } from '../utils/utils';
import Label from './Label';

class NoResultComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      possibleDiagnosis: [],
      showPossibleDiagnosis: false
    };
  }

  componentDidMount() {
    const { symptoms } = this.props;
    if (symptoms.length > 0) {
      fetch('/api/diagnosis/with-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getKeys(symptoms, 'id'))
      })
        .then(res => res.json())
        .then(diagnosis => this.setState({ possibleDiagnosis: diagnosis }));
    }
  }

  togglePossibleDiagnosis = () => {
    const { showPossibleDiagnosis } = this.state;
    this.setState({
      showPossibleDiagnosis: !showPossibleDiagnosis
    });
  };

  render() {
    const { symptoms } = this.props;
    const { showPossibleDiagnosis, possibleDiagnosis } = this.state;
    return (
      <div className="output-wrapper">
        <h2>{symptoms.length > 0 ? 'No Match Found' : 'Holla!' }</h2>
        <p>{symptoms.length > 0 ? 'Try adding more symptoms' : 'Start by searching for a symptom' }</p>

        <div>
          {symptoms.length > 0 && (
            <React.Fragment>
              <hr />
              <button className="btn btn-link" type="button" onClick={this.togglePossibleDiagnosis}>
                {`${showPossibleDiagnosis ? 'Hide' : 'View'} Possible Diagnosis`}
                {`(${possibleDiagnosis.length})`}
              </button>
            </React.Fragment>
          )}
          {showPossibleDiagnosis
            && (
              <div className="label-wrapper">
                  {possibleDiagnosis.map(d => <Label key={d.id} id={d.id} text={d.name} color="blue" />)}
              </div>
            )
          }

        </div>

      </div>
    );
  }
}

NoResultComponent.propTypes = {
  symptoms: PropTypes.instanceOf(Array).isRequired
};

export default NoResultComponent;
