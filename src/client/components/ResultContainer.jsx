import React from 'react';

class ResultContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewPossibleDiagnosis: false
    };
  }

  render() {
    const { diagnosis, symptoms } = this.props;
    return (
      <div className="output-wrapper">
        <h2>{diagnosis ? 'Match Found' : symptoms.length > 0 ? '' : '' }</h2>
      </div>
    );
  }

}

export default ResultContainer;
