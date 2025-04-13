import React, { useState } from 'react';

function CodeEditor({ 
  assemblyCode, 
  setAssemblyCode, 
  onAssemble, 
  onClear, 
  onFileUpload 
}) {
  const [activeTab, setActiveTab] = useState('editor');

  const handleDownloadAssembly = () => {
    if (assemblyCode.trim() === '') {
      alert('No assembly code to download!');
      return;
    }
    
    const blob = new Blob([assemblyCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assembly_code.asm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="input-section">
      <h2>Assembly Code</h2>
      <div className="tab-container">
        <button 
          className={`tab ${activeTab === 'editor' ? 'active' : ''}`}
          onClick={() => setActiveTab('editor')}
        >
          Editor
        </button>
        <button 
          className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload File
        </button>
      </div>
      
      <textarea 
        id="assembly-code" 
        value={assemblyCode}
        onChange={(e) => setAssemblyCode(e.target.value)}
        placeholder={`.text
main:
    addi x5, x0, 10
    addi x6, x0, 20
    add x7, x5, x6
.data
value: .word 42
message: .string "Hello RISC-V!"`}
      />
      
      <input 
        type="file" 
        id="file-upload" 
        className="file-input"
        onChange={onFileUpload}
        accept=".asm,.s,.txt"
      />
      
      <div className="button-group">
        <button onClick={onAssemble}>Assemble</button>
        <button className="clear" onClick={onClear}>Clear</button>
        <button onClick={() => document.getElementById('file-upload').click()}>
          Upload File
        </button>
        <button onClick={handleDownloadAssembly}>Download Assembly</button>
      </div>
    </div>
  );
}

export default CodeEditor;