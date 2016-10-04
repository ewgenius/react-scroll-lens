import React, {Component, PropTypes} from 'react';

const reactScrollLensStyles = {
  border: '1px solid #eee',
  borderRadius: 3,
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  fontSize: 15,
  padding: '3px 10px',
};

const ReactScrollLens = ({ children, onClick, style = {} }) => (
  <div
    style={{ ...reactScrollLensStyles, ...style }}
    >
    scroll
  </div>
);

ReactScrollLens.propTypes = {
  children: PropTypes.array.isRequired,
  style: PropTypes.object
};

export default ReactScrollLens;
