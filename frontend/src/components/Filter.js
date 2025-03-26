import React from 'react';

const Filter = ({ value, onChange }) => (
  <div>
    filter shown with: 
    <input 
      value={value}
      onChange={onChange}
      placeholder="Search names..."
    />
  </div>
);

export default Filter;