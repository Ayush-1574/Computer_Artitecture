import React from 'react';

function OutputDisplay({ textOutput, dataOutput, activeTab }) {
  const downloadTextSegment = () => {
    if (textOutput.length === 0) {
      alert('No text segment to download!');
      return;
    }
    
    const content = textOutput.map(item => `${item.address} ${item.instruction}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text.mc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadDataSegment = () => {
    if (dataOutput.length === 0) {
      alert('No data segment to download!');
      return;
    }
    
    const content = dataOutput.map(item => `${item.address} ${item.value}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.mc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="editor-container">
      <div className="output-display">
        <div className="output-text">
          {activeTab === 'text' ? (
            textOutput.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '5px', borderBottom: '1px solid #ddd' }}>Address</th>
                    <th style={{ textAlign: 'left', padding: '5px', borderBottom: '1px solid #ddd' }}>Machine Code</th>
                    <th style={{ textAlign: 'left', padding: '5px', borderBottom: '1px solid #ddd' }}>Assembly</th>
                  </tr>
                </thead>
                <tbody>
                  {textOutput.map((item, index) => (
                    <tr key={index}>
                      <td style={{ padding: '5px', borderBottom: '1px solid #eee' }}>{item.address}</td>
                      <td style={{ padding: '5px', borderBottom: '1px solid #eee' }}>{item.instruction}</td>
                      <td style={{ padding: '5px', borderBottom: '1px solid #eee' }}>{item.assembly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', marginTop: '20px', color: '#888' }}>
                Text segment will appear here after assembly
              </div>
            )
          ) : (
            dataOutput.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '5px', borderBottom: '1px solid #ddd' }}>Address</th>
                    <th style={{ textAlign: 'left', padding: '5px', borderBottom: '1px solid #ddd' }}>Value</th>
                    <th style={{ textAlign: 'left', padding: '5px', borderBottom: '1px solid #ddd' }}>Directive</th>
                  </tr>
                </thead>
                <tbody>
                  {dataOutput.map((item, index) => (
                    <tr key={index}>
                      <td style={{ padding: '5px', borderBottom: '1px solid #eee' }}>{item.address}</td>
                      <td style={{ padding: '5px', borderBottom: '1px solid #eee' }}>{item.value}</td>
                      <td style={{ padding: '5px', borderBottom: '1px solid #eee' }}>{item.directive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', marginTop: '20px', color: '#888' }}>
                Data segment will appear here after assembly
              </div>
            )
          )}
        </div>
        <div className="button-group">
          <button onClick={downloadTextSegment}>Download Text Segment</button>
          <button onClick={downloadDataSegment}>Download Data Segment</button>
        </div>
      </div>
    </div>
  );
}

export default OutputDisplay;