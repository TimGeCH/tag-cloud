import React, { useState } from 'react';
import Papa from 'papaparse';
import TagCloud from './TagCloud';
import FileUpload from './FileUpload';
import LazyLoad from 'react-lazyload';
import './App.css';

function App() {
  const [csvData, setCsvData] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);

  const handleFileUpload = (file) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setCsvData(results.data);
      },
    });
  };

  const handleWordClick = (word, dimension) => {
    setSelectedWord({ word: word, dimension: dimension });
  };

  const getRelatedEmails = (word, dimension) => {
    return csvData.filter((email) => email[dimension] && email[dimension].includes(word));
  };

  const renderEmailContent = (content) => {
    const imgRegex = /<(https?:\/\/.*\.(?:png|jpg|jpeg|gif))>/gi;
    const parsedContent = content.replace(imgRegex, '<img src="$1" alt="email image" />');
    return <div dangerouslySetInnerHTML={{ __html: parsedContent }} />;
  };

  return (
    <div className="App">
      <h1>COMPX532 TASK 4 - Email Tag Cloud</h1>
      <FileUpload onFileUpload={handleFileUpload} />
      {csvData && <TagCloud data={csvData} onWordClick={handleWordClick} />}
      {selectedWord && (
        <div className="email-content">
          <h2>Emails related to "{selectedWord.word}":</h2>
          {getRelatedEmails(selectedWord.word, selectedWord.dimension).map((email, index) => (
            <LazyLoad key={index} height={200} offset={100}>
              <div>
                <h3>{email['主题']}</h3>
                {renderEmailContent(email['正文'])}
              </div>
            </LazyLoad>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;