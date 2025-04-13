import React, { useState, useEffect } from 'react';
import './App.css';
import CodeEditor from './components/CodeEditor';
import OutputDisplay from './components/OutputDisplay';
import LabelTable from './components/LabelTable';
import StatusBar from './components/StatusBar';

function App() {
  const [assemblyCode, setAssemblyCode] = useState('');
  const [textOutput, setTextOutput] = useState([]);
  const [dataOutput, setDataOutput] = useState([]);
  const [labels, setLabels] = useState([]);
  const [pc, setPc] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Ready to assemble');
  const [isSuccess, setIsSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('text');
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAssemblyCode(e.target.result);
        setStatusMessage(`File loaded: ${file.name}`);
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    setAssemblyCode('');
    setTextOutput([]);
    setDataOutput([]);
    setLabels([]);
    setPc(0);
    setStatusMessage('Ready to assemble');
    setIsSuccess(null);
  };

  const handleAssemble = () => {
    if (assemblyCode.trim() === '') {
      setStatusMessage('Error: No assembly code provided');
      setIsSuccess(false);
      return;
    }

    // Here you would integrate your C++ assembler code
    // For now, we'll use placeholder code to simulate assembly

    try {
      // Parse labels from the assembly code
      const parsedLabels = parseLabels(assemblyCode);
      setLabels(parsedLabels);

      // Generate text and data segments
      const { textSegment, dataSegment } = assembleCode(assemblyCode, parsedLabels);
      setTextOutput(textSegment);
      setDataOutput(dataSegment);

      setStatusMessage('Assembly completed successfully');
      setIsSuccess(true);
    } catch (error) {
      setStatusMessage(`Error: ${error.message}`);
      setIsSuccess(false);
    }
  };

  // Placeholder functions - replace with your actual implementation
  const parseLabels = (code) => {
    // Simulate label parsing
    const labels = [];
    let currentAddress = 0;
    
    const lines = code.split('\n');
    let inTextSection = false;
    let inDataSection = false;

    for (let line of lines) {
      line = line.trim();
      
      if (line === '.text') {
        inTextSection = true;
        inDataSection = false;
        continue;
      } else if (line === '.data') {
        inTextSection = false;
        inDataSection = true;
        currentAddress = 0x10000000; // 268435456 in decimal
        continue;
      }
      
      if (line === '' || line.startsWith('#')) continue;
      
      const colonPos = line.indexOf(':');
      if (colonPos !== -1) {
        const labelName = line.substring(0, colonPos).trim();
        const hexAddress = '0x' + currentAddress.toString(16).padStart(8, '0').toUpperCase();
        
        labels.push({
          name: labelName,
          address: currentAddress,
          hexAddress: hexAddress
        });
        
        // If there's nothing after the colon, don't increment address
        if (line.length <= colonPos + 1) continue;
      }
      
      // Increment address based on section
      if (inTextSection) {
        currentAddress += 4; // Each instruction is 4 bytes
      } else if (inDataSection) {
        // Simple approximation - in real implementation, this would depend on data type
        currentAddress += 4;
      }
    }
    
    return labels;
  };

  const assembleCode = (code, labels) => {
    // Simulate code assembly
    const textSegment = [];
    const dataSegment = [];
    let pc = 0;
    let dataAddress = 0x10000000;
    
    const lines = code.split('\n');
    let inTextSection = false;
    let inDataSection = false;
    
    for (let line of lines) {
      line = line.trim();
      
      if (line === '.text') {
        inTextSection = true;
        inDataSection = false;
        continue;
      } else if (line === '.data') {
        inTextSection = false;
        inDataSection = true;
        continue;
      }
      
      if (line === '' || line.startsWith('#')) continue;
      
      // Skip label declarations
      if (line.includes(':')) {
        const parts = line.split(':');
        if (parts[1].trim() === '') continue;
        line = parts[1].trim();
      }
      
      if (inTextSection) {
        const hexPc = '0x' + pc.toString(16).padStart(8, '0').toUpperCase();
        // In real implementation, this would be the actual machine code
        const machineCode = '0x' + Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0').toUpperCase();
        textSegment.push({ address: hexPc, instruction: machineCode, assembly: line });
        pc += 4;
      } else if (inDataSection) {
        const hexAddress = '0x' + dataAddress.toString(16).padStart(8, '0').toUpperCase();
        
        if (line.includes('.word')) {
          const value = line.split('.word')[1].trim();
          const hexValue = '0x' + parseInt(value).toString(16).padStart(8, '0').toUpperCase();
          dataSegment.push({ address: hexAddress, value: hexValue, directive: line });
          dataAddress += 4;
        } else if (line.includes('.string') || line.includes('.asciiz')) {
          // Extract string from between quotes
          const match = line.match(/"([^"]*)"/);
          if (match && match[1]) {
            const str = match[1];
            for (let i = 0; i < str.length; i += 4) {
              const hexAddress = '0x' + dataAddress.toString(16).padStart(8, '0').toUpperCase();
              const chunk = str.substr(i, 4);
              let hexValue = '';
              for (let j = 0; j < chunk.length; j++) {
                hexValue += chunk.charCodeAt(j).toString(16).padStart(2, '0');
              }
              hexValue = '0x' + hexValue.padEnd(8, '0').toUpperCase();
              dataSegment.push({ address: hexAddress, value: hexValue, directive: `"${chunk}"` });
              dataAddress += 4;
            }
            // Add null terminator for .asciiz
            if (line.includes('.asciiz')) {
              const hexAddress = '0x' + dataAddress.toString(16).padStart(8, '0').toUpperCase();
              dataSegment.push({ address: hexAddress, value: '0x00000000', directive: 'null terminator' });
              dataAddress += 4;
            }
          }
        }
      }
    }
    
    return { textSegment, dataSegment };
  };

  return (
    <div className="container">
      <header>
        <h1>RISC-V Assembler</h1>
      </header>

      <div className="main-content">
        <CodeEditor 
          assemblyCode={assemblyCode}
          setAssemblyCode={setAssemblyCode}
          onAssemble={handleAssemble}
          onClear={handleClear}
          onFileUpload={handleFileUpload}
        />

        <div className="output-section">
          <h2>Machine Code Output</h2>
          <div className="tab-container">
            <button 
              className={`tab ${activeTab === 'text' ? 'active' : ''}`}
              onClick={() => setActiveTab('text')}
            >
              Text Segment
            </button>
            <button 
              className={`tab ${activeTab === 'data' ? 'active' : ''}`}
              onClick={() => setActiveTab('data')}
            >
              Data Segment
            </button>
          </div>
          <OutputDisplay 
            textOutput={textOutput}
            dataOutput={dataOutput}
            activeTab={activeTab}
          />
        </div>

        <LabelTable labels={labels} />

        <StatusBar 
          message={statusMessage}
          isSuccess={isSuccess}
          pc={pc}
        />
      </div>
    </div>
  );
}

export default App;