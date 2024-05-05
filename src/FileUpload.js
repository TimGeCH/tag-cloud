import React from 'react';

const FileUpload = ({ onFileUpload }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    onFileUpload(file);
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
    </div>
  );
};

export default FileUpload;