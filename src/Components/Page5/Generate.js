import React, { useState } from 'react';

// Simple Icon Components to replace lucide-react
const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Generate = () => {
  // Time slots
  const timeSlots = [
    '9:00 to 10:00',
    '10:00 to 11:00',
    '11:15 to 12:15',
    '12:15 to 1:15',
    '1:15 to 2:00',
    '2:00 to 3:00',
    '3:00 to 4:00'
  ];

  // Classes
  const classes = ['MCA I', 'MCA II', 'BCA I', 'BCA II'];
  
  // Days of the week
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Initial timetable data
  const [timetableData, setTimetableData] = useState([
    { id: 1, day: 'Monday', class: 'MCA I', time: '9:00 to 10:00', subject: 'OOM (NGM)', room: '110' },
    { id: 2, day: 'Monday', class: 'MCA II', time: '9:00 to 10:00', subject: 'DS (VIP)', room: '109' },
    { id: 3, day: 'Monday', class: 'BCA I', time: '9:00 to 10:00', subject: 'Lab DBMS (B1) - DK', room: '110' },
    { id: 4, day: 'Monday', class: 'BCA II', time: '9:00 to 10:00', subject: 'Training', room: '105' },
    { id: 5, day: 'Monday', class: 'MCA I', time: '10:00 to 11:00', subject: 'DWDM (SSS)', room: '110' },
    { id: 6, day: 'Monday', class: 'MCA II', time: '10:00 to 11:00', subject: 'DS (VIP)', room: '109' },
    { id: 7, day: 'Monday', class: 'BCA I', time: '10:00 to 11:00', subject: 'Lab DBMS (B2) - RMH', room: '110' },
    { id: 8, day: 'Monday', class: 'BCA II', time: '10:00 to 11:00', subject: 'OOM (NGM)', room: '105' },
    { id: 9, day: 'Tuesday', class: 'MCA I', time: '9:00 to 10:00', subject: 'Python (VIP)', room: '110' },
    { id: 10, day: 'Tuesday', class: 'MCA II', time: '9:00 to 10:00', subject: 'Dot net (RMH)', room: '110' },
    { id: 11, day: 'Wednesday', class: 'MCA I', time: '9:00 to 10:00', subject: 'OS (SSG)', room: '110' },
    { id: 12, day: 'Wednesday', class: 'MCA II', time: '9:00 to 10:00', subject: 'STQA (DSS)', room: '109' },
    { id: 13, day: 'Thursday', class: 'MCA I', time: '9:00 to 10:00', subject: 'CN (MP)', room: '110' },
    { id: 14, day: 'Thursday', class: 'MCA II', time: '9:00 to 10:00', subject: 'OT (SSG)', room: '109' },
    { id: 15, day: 'Friday', class: 'MCA I', time: '9:00 to 10:00', subject: 'Lab on Linux (B1 & B2) - MP', room: '110' },
    { id: 16, day: 'Friday', class: 'MCA II', time: '9:00 to 10:00', subject: 'STQA (DSS)', room: '109' }
  ]);

  // State for currently active view
  const [activeView, setActiveView] = useState('day'); // 'day' or 'class'
  const [activeDay, setActiveDay] = useState('Monday');
  const [activeClass, setActiveClass] = useState('All');

  // Function to handle editing an entry
  const handleEdit = (id) => {
    alert(`Editing entry with ID: ${id}`);
  };

  // Function to handle deleting an entry
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
    if (confirmDelete) {
      setTimetableData(timetableData.filter(item => item.id !== id));
    }
  };

  // Function to get background color based on class
  const getBackgroundColor = (classType) => {
    switch (classType) {
      case 'MCA I':
        return 'bg-orange-200';
      case 'MCA II':
        return 'bg-red-300';
      case 'BCA I':
        return 'bg-blue-200';
      case 'BCA II':
        return 'bg-blue-400';
      default:
        return 'bg-gray-100';
    }
  };

  // Filter data based on active view
  const filteredData = activeView === 'day' 
    ? timetableData.filter(item => item.day === activeDay)
    : activeClass === 'All' 
      ? timetableData 
      : timetableData.filter(item => item.class === activeClass);

  // Function to render the day-wise view
  const renderDayView = () => {
    return (
    
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 w-24">Time/Class</th>
            {classes.map(cls => (
              <th key={cls} className="border p-2">{cls}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(time => (
            <tr key={time}>
              <td className="border p-2 font-semibold bg-gray-50">{time}</td>
              {classes.map(cls => {
                const entry = timetableData.find(item => 
                  item.day === activeDay && 
                  item.class === cls && 
                  item.time === time
                );
                
                return (
                  <td key={`${cls}-${time}`} className={`border p-2 ${entry ? getBackgroundColor(cls) : 'bg-gray-50'}`}>
                    {entry ? (
                      <div>
                        <div className="font-semibold">{entry.subject}</div>
                        <div className="text-xs">Room: {entry.room}</div>
                        <div className="mt-2 flex space-x-2">
                          <button 
                            onClick={() => handleEdit(entry.id)}
                            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            <PencilIcon />
                          </button>
                          <button 
                            onClick={() => handleDelete(entry.id)}
                            className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button className="p-1 bg-gray-200 rounded hover:bg-gray-300">
                        <PlusIcon />
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Function to render the class-wise view
  const renderClassView = () => {
    return (
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Day</th>
            <th className="border p-2">Class</th>
            <th className="border p-2">Time</th>
            <th className="border p-2">Subject</th>
            <th className="border p-2">Room</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(item => (
            <tr key={item.id} className={getBackgroundColor(item.class)}>
              <td className="border p-2">{item.day}</td>
              <td className="border p-2">{item.class}</td>
              <td className="border p-2">{item.time}</td>
              <td className="border p-2">{item.subject}</td>
              <td className="border p-2">{item.room}</td>
              <td className="border p-2">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(item.id)}
                    className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <PencilIcon />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-4 max-w-full overflow-x-auto">
      <h2 className="text-xl font-bold text-center mb-4">
        TIME TABLE-DEPARTMENT OF COMPUTER APPLICATION
        <br />
        <span className="text-orange-500">(MCA-SEM-I, MCA-SEM-III, BCA-SEM-I, BCA-SEM-III)</span>
      </h2>
      
      <div className="mb-4 flex space-x-4">
        <div className="flex-1">
          <div className="flex mb-2">
            <button 
              className={`flex-1 p-2 ${activeView === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveView('day')}
            >
              Day View
            </button>
            <button 
              className={`flex-1 p-2 ${activeView === 'class' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveView('class')}
            >
              Class View
            </button>
          </div>
          
          {activeView === 'day' && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {days.map(day => (
                <button 
                  key={day}
                  className={`p-2 ${activeDay === day ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => setActiveDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          )}
          
          {activeView === 'class' && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <button 
                className={`p-2 ${activeClass === 'All' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveClass('All')}
              >
                All Classes
              </button>
              {classes.map(cls => (
                <button 
                  key={cls}
                  className={`p-2 ${activeClass === cls ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => setActiveClass(cls)}
                >
                  {cls}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button className="p-2 bg-green-500 text-white rounded flex items-center">
          <PlusIcon /> <span className="ml-1">Add New Entry</span>
        </button>
      </div>
      
      <div className="border rounded shadow">
        {activeView === 'day' ? renderDayView() : renderClassView()}
      </div>
    </div>
  );
};

export default Generate;