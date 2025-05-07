import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Simple Icon Components
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

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

const Generate = () => {
  // API base URL - change to your backend URL
  const API_URL = 'http://localhost:5000';
  
  // State for timetable data
  const [timetableData, setTimetableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for form data when adding or editing entries
  const [formData, setFormData] = useState({
    day: 'Monday',
    class: 'MCA I',
    time: '9:00 to 10:00',
    subject: '',
    room: '',
  });
  
  // State for managing modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEntryId, setCurrentEntryId] = useState(null);

  // Time slots
  const timeSlots = [
    '9:00 to 10:00',
    '10:00 to 11:00',
    '11:15 to 12:15',
    '12:15 to 1:15',
    '2:00 to 3:00',
    '3:00 to 4:00'
  ];

  // Classes
  const classes = ['MCA I', 'MCA II', 'BCA I', 'BCA II'];
  
  // Days of the week
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // State for currently active view
  const [activeView, setActiveView] = useState('day');
  const [activeDay, setActiveDay] = useState('Monday');
  const [activeClass, setActiveClass] = useState('All');

  // Fetch timetable data from the server
  useEffect(() => {
    fetchTimetableData();
  }, []);

  const fetchTimetableData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/timetable-entries`);
      if (response.data.success) {
        setTimetableData(response.data.data);
      } else {
        setError('Failed to load timetable data');
      }
    } catch (err) {
      console.error('Error fetching timetable data:', err);
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new entry
  const handleAddEntry = async () => {
    try {
      const response = await axios.post(`${API_URL}/timetable-entries`, formData);
      if (response.data.success) {
        setTimetableData([...timetableData, response.data.data]);
        setShowModal(false);
        resetForm();
      } else {
        alert('Failed to add entry');
      }
    } catch (err) {
      console.error('Error adding entry:', err);
      alert('Error adding entry');
    }
  };

  // Handle editing an entry
  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/timetable-entries/${currentEntryId}`, 
        formData
      );
      if (response.data.success) {
        setTimetableData(
          timetableData.map(item => 
            item._id === currentEntryId ? response.data.data : item
          )
        );
        setShowModal(false);
        resetForm();
      } else {
        alert('Failed to update entry');
      }
    } catch (err) {
      console.error('Error updating entry:', err);
      alert('Error updating entry');
    }
  };

  // Initialize editing an entry
  const handleEdit = (id) => {
    const entry = timetableData.find(item => item._id === id);
    if (entry) {
      setFormData({
        day: entry.day,
        class: entry.class,
        time: entry.time,
        subject: entry.subject,
        room: entry.room
      });
      setCurrentEntryId(id);
      setIsEditing(true);
      setShowModal(true);
    }
  };

  // Handle deleting an entry
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`${API_URL}/timetable-entries/${id}`);
        if (response.data.success) {
          setTimetableData(timetableData.filter(item => item._id !== id));
        } else {
          alert('Failed to delete entry');
        }
      } catch (err) {
        console.error('Error deleting entry:', err);
        alert('Error deleting entry');
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      day: 'Monday',
      class: 'MCA I',
      time: '9:00 to 10:00',
      subject: '',
      room: '',
    });
    setIsEditing(false);
    setCurrentEntryId(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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

  // Function to render the entry form modal
  const renderModal = () => {
    return (
      showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Timetable Entry' : 'Add New Timetable Entry'}
            </h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Day</label>
              <select 
                name="day"
                value={formData.day}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Class</label>
              <select 
                name="class"
                value={formData.class}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Time Slot</label>
              <select 
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Subject</label>
              <input 
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Subject with teacher code"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Room</label>
              <input 
                type="text"
                name="room"
                value={formData.room}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Room number"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button 
                onClick={isEditing ? handleEditSubmit : handleAddEntry}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {isEditing ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )
    );
  };

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
                            onClick={() => handleEdit(entry._id)}
                            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            <PencilIcon />
                          </button>
                          <button 
                            onClick={() => handleDelete(entry._id)}
                            className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => {
                          setFormData({
                            day: activeDay,
                            class: cls,
                            time: time,
                            subject: '',
                            room: ''
                          });
                          setIsEditing(false);
                          setShowModal(true);
                        }}
                      >
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
          {filteredData.length > 0 ? (
            filteredData.map(item => (
              <tr key={item._id} className={getBackgroundColor(item.class)}>
                <td className="border p-2">{item.day}</td>
                <td className="border p-2">{item.class}</td>
                <td className="border p-2">{item.time}</td>
                <td className="border p-2">{item.subject}</td>
                <td className="border p-2">{item.room}</td>
                <td className="border p-2">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(item._id)}
                      className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <PencilIcon />
                    </button>
                    <button 
                      onClick={() => handleDelete(item._id)}
                      className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4 border">
                No entries found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  // Main render method
  return (
    <div className="p-4 max-w-full overflow-x-auto">
      <h2 className="text-xl font-bold text-center mb-4">
        TIME TABLE - GENERATOR
        <br />
        <span className="text-orange-500">(MCA, BCA)</span>
      </h2>
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={fetchTimetableData}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
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
            
            <button 
              className="p-2 bg-green-500 text-white rounded flex items-center"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              <PlusIcon /> <span className="ml-1">Add New Entry</span>
            </button>
          </div>
          
          <div className="border rounded shadow">
            {activeView === 'day' ? renderDayView() : renderClassView()}
          </div>
          
          {renderModal()}
        </>
      )}
    </div>
  );
};

export default Generate;