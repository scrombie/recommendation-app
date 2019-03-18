import React from 'react';
import PropTypes from 'prop-types';
import LoadingScreen from './LoadingScreen';
import Label from './Label';

class DiagnosisComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      symptoms: []
    };
  }

  componentDidMount() {
    const { diagnosis } = this.props;
    fetch(`/api/diagnosis/${diagnosis.id}`)
      .then(res => res.json())
      .then(r => this.setState({ symptoms: r[0].symptoms }));
  }

  render() {
    const { symptoms } = this.state;
    const { diagnosis } = this.props;
    return (
      <div className="output-wrapper">
        <h1>Match Found!</h1>
        <hr />
        <h2>{diagnosis.name}</h2>
        <p>This is a description of this diagnosis.</p>
        <div>
          <h3>Symptoms:</h3>
          <div
            style={{
              display: 'block',
              position: 'relative',
              minHeight: '10rem'
            }}
          >
            {symptoms.length === 0 ? (<LoadingScreen />) : (
              <div className="label-wrapper">
                {symptoms.map(s => <Label key={s.id} id={s.id} text={s.name} color="blue" />)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

DiagnosisComponent.propTypes = {
  diagnosis: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }).isRequired
};

export default DiagnosisComponent;
