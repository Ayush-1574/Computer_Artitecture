import React from 'react';

function StatusBar({ message, isSuccess, pc }) {
  const statusClass = isSuccess === true ? 'success-message' : 
                     isSuccess === false ? 'error-message' : '';
  
  const formattedPc = '0x' + pc.toString(16).padStart(8, '0').toUpperCase();
  
  return (
    <div className="status-bar">
      <span className={statusClass}>{message}</span>
      <span>PC: {formattedPc}</span>
    </div>
  );
}

export default StatusBar;