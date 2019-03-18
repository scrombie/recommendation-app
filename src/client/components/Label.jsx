/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';

const handleClick = (id, cb) => {
  if (id && cb) {
    cb(id);
  }
};

const Label = ({
  id, text, color, onRemove, onClick
}) => (
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
  <div className={`label ${color}`} onClick={() => handleClick(id, onClick)}>
    {text}
    {onRemove && <span className="remove" onClick={() => handleClick(id, onRemove)}>&times;</span>}
  </div>
);

Label.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  onRemove: PropTypes.instanceOf(Function),
  onClick: PropTypes.instanceOf(Function)
};

export default Label;
