/* eslint-disable react/require-default-props */
/**
 * Created by the.last.mayaki on 20/10/2017.
 */
import React from 'react';
import PropTypes from 'prop-types';

const CenteredContentBlock = ({ children }) => (
  <div
    style={{
      margin: '0',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)'
    }}
  >
    {children}
  </div>
);

CenteredContentBlock.propTypes = {
  children: PropTypes.instanceOf(Array)
};

export default CenteredContentBlock;
