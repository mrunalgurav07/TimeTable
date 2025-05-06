import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage/LoginPage';
import TimeTable from './TimeTable/TimeTable';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/timetable" element={<TimeTable/>} />
      </Routes>
    </Router>
  );
}

export default App;
