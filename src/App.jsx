import { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import './App.css';

function App() {
  const componentRef = useRef();

  const [subjects, setSubjects] = useState(() => {
    const savedData = localStorage.getItem('my-gwa-data');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return [
      { id: 1, name: 'Subject 1', units: 3, grade: 1.5 },
      { id: 2, name: 'Subject 2', units: 3, grade: 1.75 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('my-gwa-data', JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = () => {
    const newId = subjects.length > 0 ? subjects[subjects.length - 1].id + 1 : 1;
    setSubjects([...subjects, { id: newId, name: '', units: 1, grade: 1.0 }]);
  };

  const updateSubject = (id, field, value) => {
    setSubjects(subjects.map(sub => 
      sub.id === id ? { ...sub, [field]: value } : sub
    ));
  };

  const removeSubject = (id) => {
    setSubjects(subjects.filter(sub => sub.id !== id));
  };

  const calculateGWA = () => {
    let totalUnits = 0;
    let totalPoints = 0;

    subjects.forEach(sub => {
      const grade = parseFloat(sub.grade);
      const units = parseFloat(sub.units);
      
      if (grade > 0 && units > 0) {
        totalUnits += units;
        totalPoints += (grade * units);
      }
    });

    return totalUnits === 0 ? "0.00" : (totalPoints / totalUnits).toFixed(2);
  };

  const downloadPDF = () => {
    const element = componentRef.current;
    const options = {
      margin:       10,
      filename:     'My_GWA_Report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(options).from(element).save();
  };

  const inputStyle = {
    padding: '10px',
    background: 'var(--bg)',
    color: 'var(--text-h)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    fontFamily: 'var(--sans)',
    fontSize: '16px',
    outline: 'none'
  };

  return (
    <div className="app-container">
      
      <div ref={componentRef} className="report-card">
        <h1>GWA Calculator</h1>
        
        <div className="subject-list">
          {subjects.map((subject) => (
            /* Swapped inline style for className here */
            <div key={subject.id} className="subject-row">
              <input 
                type="text" 
                className="subject-name-input"
                placeholder="Subject Name" 
                value={subject.name}
                onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                style={inputStyle}
              />
              <input 
                type="number" 
                className="units-input"
                placeholder="Units" 
                step="1"
                min="1"
                value={subject.units}
                onChange={(e) => updateSubject(subject.id, 'units', Number(e.target.value))}
                style={inputStyle}
              />
              <input 
                type="number" 
                className="grade-input"
                step="0.25"
                min="1"
                max="5"
                placeholder="Grade" 
                value={subject.grade || ''}
                onChange={(e) => updateSubject(subject.id, 'grade', Number(e.target.value))}
                style={inputStyle}
              />
              <button 
                onClick={() => removeSubject(subject.id)} 
                className="remove-subject-btn"
              >
                X
              </button>
            </div>
          ))}
        </div>

        <div className="summary-card">
          <h2 style={{ margin: '0 0 8px 0' }}>
            Total Units: <span style={{ color: 'var(--accent)' }}>
              {subjects.reduce((sum, sub) => sub.grade > 0 ? sum + parseFloat(sub.units) : sum, 0)}
            </span>
          </h2>
          <h2 style={{ margin: 0 }}>
            Current GWA: <span style={{ color: 'var(--accent)' }}>
              {calculateGWA()}
            </span>
          </h2>
        </div>
      </div>

      {/* Swapped inline style for className here */}
      <div className="action-buttons">
        <button 
          onClick={addSubject} 
          className="primary-action-btn"
        >
          + Add Subject
        </button>

        <button 
          onClick={downloadPDF} 
          className="secondary-action-btn"
        >
          💾 Save as PDF
        </button>
      </div>

    </div>
  );
}

export default App;