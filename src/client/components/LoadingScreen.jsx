import React from 'react';
import { SyncLoader } from 'react-spinners';

const LoadingScreen = () => (
  <div style={{
    margin: '0', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)'
  }}
  >
    <SyncLoader color="#107BC0" />
  </div>
);

export default LoadingScreen;
