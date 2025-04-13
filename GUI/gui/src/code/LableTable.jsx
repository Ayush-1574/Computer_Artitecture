
import React from 'react';

function LabelTable({ labels }) {
  return (
    <div className="label-section">
      <h2>Labels</h2>
      {labels.length > 0 ? (
        <table className="label-table">
          <thead>
            <tr>
              <th>Label Name</th>
              <th>Address</th>
              <th>Hex Address</th>
            </tr>
          </thead>
          <tbody>
            {labels.map((label, index) => (
              <tr key={index}>
                <td>{label.name}</td>
                <td>{label.address}</td>
                <td>{label.hexAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '20px', color: '#888' }}>
          Labels will appear here after assembly
        </div>
      )}
    </div>
  );
}

export default LabelTable;