// This file will contain your RISC-V assembler logic converted from C++ to JavaScript

// Constants for instruction types
const INSTRUCTION_TYPES = {
    R_TYPE: 1,
    I_TYPE: 2,
    S_TYPE: 3,
    SB_TYPE: 4,
    U_TYPE: 5,
    UJ_TYPE: 6,
    SHIFT_IMM_TYPE: 7
  };
  
  // Object to store data type sizes
  const DATA_TYPE_SIZES = {
    '.word': 4,
    '.half': 2,
    '.byte': 1,
    '.asciiz': 1,
    '.string': 1
  };
  
  // Error types
  const ERROR_TYPES = {
    ERROR_NONE: 0,
    INVALID_INSTRUCTION: 1,
    INVALID_OPERAND: 2,
    INVALID_LABEL: 3,
    INVALID_DATA: 4
  };
  
  class Error {
    constructor(type = ERROR_TYPES.ERROR_NONE, message = "Code executed Successfully!!!") {
      this.type = type;
      this.message = message;
    }
    
    alterError(type, message) {
      this.type = type;
      this.message = message;
      return this;
    }
  }
  
  // RISC-V Instruction class
  class RISC_V_Instruction {
    constructor() {
      this.type = 0;
      this.opcode = '';
      this.rd = 0;
      this.rs1 = 0;
      this.rs2 = 0;
      this.func3 = '';
      this.func7 = '';
      this.imm = 0;
    }
  }
  
  // Helper functions
  function decToBinary(dec, length) {
    const binary = (dec >>> 0).toString(2); // Convert to unsigned binary
    return binary.padStart(length, '0');
  }
  
  function binaryToHex(binary, bitLength) {
    // Convert binary to decimal
    let decimal = 0;
    for (let i = 0; i < binary.length; i++) {
      decimal = decimal * 2 + parseInt(binary[i]);
    }
    
    // Calculate hex digits needed
    const hexDigits = Math.ceil(bitLength / 4);
    
    // Convert to hex with 0x prefix
    return '0x' + decimal.toString(16).toUpperCase().padStart(hexDigits, '0');
  }
  
  function trim(str) {
    return str.trim();
  }
  
  // Main assembler function
  function assembleCode(assemblyCode) {
    const outputError = new Error();
    const labels = {};
    const textDirectiveInst = [];
    const dataDirectiveInst = [];
    let pc = 0;
    
    // First pass: collect labels and separate text/data sections
    const lines = assemblyCode.split('\n');
    let isText = true;
    let isData = false;
    
    for (const line of lines) {
      const trimmedLine = trim(line);
      
      if (trimmedLine === '' || trimmedLine.startsWith('#')) {
        continue; // Skip empty lines and comments
      }
      
      if (trimmedLine === '.data') {
        isText = false;
        isData = true;
        continue;
      } else if (trimmedLine === '.text') {
        isText = true;
        isData = false;
        continue;
      }
      
      if (isData) {
        dataDirectiveInst.push(trimmedLine);
      } else if (isText) {
        // Check for labels
        const colonPos = trimmedLine.indexOf(':');
        if (colonPos !== -1) {
          const commentPos = trimmedLine.indexOf('#');
          const lineToParse = commentPos !== -1 ? 
            trimmedLine.substring(0, commentPos) : trimmedLine;
          
          const labelName = trim(lineToParse.substring(0, colonPos));
          labels[labelName] = pc;
          
          // If there's content after the label, add it to textDirectiveInst
          const afterLabel = trim(lineToParse.substring(colonPos + 1));
          if (afterLabel !== '') {
            textDirectiveInst.push(afterLabel);
            pc += 4;
          }
        } else {
          textDirectiveInst.push(trimmedLine);
          pc += 4;
        }
      }
    }
    
    // Second pass: process text and data directives
    const textOutput = processTextDirectives(textDirectiveInst, labels, outputError);
    const dataOutput = processDataDirectives(dataDirectiveInst, outputError);
    
    return {
      textOutput,
      dataOutput,
      labels: Object.entries(labels).map(([name, address]) => ({
        name,
        address,
        hexAddress: '0x' + address.toString(16).padStart(8, '0').toUpperCase()
      })),
      error: outputError
    };
  }
  
  // Function to process text segment directives
  function processTextDirectives(textDirectives, labels, outputError) {
    const textOutput = [];
    let pc = 0;
    
    for (const line of textDirectives) {
      // Here you would implement your instruction parsing logic
      // For now, we'll use placeholder code
      
      const hexPc = '0x' + pc.toString(16).padStart(8, '0').toUpperCase();
      const machineCode = '0x' + Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0').toUpperCase();
      
      textOutput.push({
        address: hexPc,
        instruction: machineCode,
        assembly: line
      });
      
      pc += 4;
    }
    
    return textOutput;
  }
  
  // Function to process data segment directives
  function processDataDirectives(dataDirectives, outputError) {
    const dataOutput = [];
    let memoryAddress = 0x10000000; // 268435456 in decimal
    
    for (const directive of dataDirectives) {
      // Here you would implement your data directive processing logic
      // For now, we'll use placeholder code
      
      const hexAddress = '0x' + memoryAddress.toString(16).padStart(8, '0').toUpperCase();
      const hexValue = '0x' + Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0').toUpperCase();
      
      dataOutput.push({
        address: hexAddress,
        value: hexValue,
        directive: directive
      });
      
      memoryAddress += 4;
    }
    
    return dataOutput;
  }
  
  export { assembleCode, ERROR_TYPES };