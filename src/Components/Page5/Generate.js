import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

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

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const TableIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="3" y1="9" x2="21" y2="9"></line>
    <line x1="3" y1="15" x2="21" y2="15"></line>
    <line x1="9" y1="3" x2="9" y2="21"></line>
    <line x1="15" y1="3" x2="15" y2="21"></line>
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
  
  // State for export functionality
  const [exporting, setExporting] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false); // State to hide buttons for PDF
  const timetableRef = useRef(null);

  // Time slots
  // Reordered time slots to match the image, including the blank slot
  const timeSlots = [
    '9:00 to 10:00',
    '10:00 to 11:00',
    '11:15 to 12:15',
    '12:15 to 1:15',
    '01.15 to 02.00', // This is the blank/lunch slot
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
  const [activeClass, setActiveClass] = useState('All'); // For class view, can be 'All' or a specific class
  const [showAllDays, setShowAllDays] = useState(false);

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

  // Filter data based on active view (kept as is for flexibility, though class view will handle its own structure)
  const filteredData = activeView === 'day' 
    ? (showAllDays 
        ? timetableData 
        : timetableData.filter(item => item.day === activeDay))
    : activeClass === 'All' 
      ? timetableData 
      : timetableData.filter(item => item.class === activeClass);

  // Toggle All Days view
  const toggleAllDays = () => {
    setShowAllDays(!showAllDays);
  };

  // Export functions for PDF and CSV
  const exportToPDF = async () => {
    if (!timetableRef.current) return;
    
    try {
      setExporting(true);
      setIsExportingPDF(true); // Set state to true to hide buttons
      
      // A small delay to ensure the DOM updates before capturing
      await new Promise(resolve => setTimeout(resolve, 50)); 

      const element = timetableRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Determine PDF orientation and size
      const orientation = 'landscape'; // Force landscape for "All Days" view
      const pdf = new jsPDF(orientation, 'mm', 'a4');
      
      const imgWidth = orientation === 'landscape' ? 277 : 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      
      // Generate filename based on current view
      let filename;
      if (activeView === 'day') {
        filename = showAllDays ? 'timetable-all-days.pdf' : `timetable-${activeDay}.pdf`;
      } else { // activeView === 'class'
        filename = activeClass === 'All' 
          ? 'complete-timetable-class-view.pdf' 
          : `timetable-${activeClass}.pdf`;
      }
          
      pdf.save(filename);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      alert('Failed to export PDF');
    } finally {
      setExporting(false);
      setIsExportingPDF(false); // Reset state after export
    }
  };

  const exportToCSV = async () => {
    try {
      setExporting(true);
      
      let csvContent = '';
      let filename = '';
      
      if (activeView === 'day' && !showAllDays) {
        csvContent = 'Time,Class,Subject,Room\r\n';
        timeSlots.forEach(time => {
          classes.forEach(cls => {
            const entry = timetableData.find(item => 
              item.day === activeDay && 
              item.class === cls && 
              item.time === time
            );
            if (entry) {
              csvContent += `"${time}","${cls}","${entry.subject}","${entry.room}"\r\n`;
            } else {
              csvContent += `"${time}","${cls}","",""\r\n`;
            }
          });
        });
        filename = `timetable-${activeDay}.csv`;
      } else if (activeView === 'class') {
        // For class view with classes on the left and time on top
        csvContent = 'Class\\Time,' + timeSlots.map(t => `"${t}"`).join(',') + '\r\n';
        
        const classesToDisplay = activeClass === 'All' ? classes : [activeClass];

        classesToDisplay.forEach(cls => {
            days.forEach(day => {
                let row = `"${cls} - ${day}"`; // e.g., "MCA I - Monday"
                timeSlots.forEach(time => {
                    const entry = timetableData.find(item => 
                        item.day === day && 
                        item.class === cls && 
                        item.time === time
                    );
                    row += `,"${entry ? `${entry.subject} (${entry.room})` : ''}"`;
                });
                csvContent += row + '\r\n';
            });
        });

        filename = activeClass === 'All' ? 'complete-timetable-class-view.csv' : `timetable-${activeClass}.csv`;
      } else { // activeView === 'day' && showAllDays (new structure)
        // CSV for the new "All Days" view: Day, Class, Time1, Time2, ...
        // This CSV format needs to adapt to the pivoted view
        let headerRow = ['Day', 'Class'];
        timeSlots.forEach(time => {
            headerRow.push(time);
        });
        csvContent += headerRow.map(h => `"${h}"`).join(',') + '\r\n';

        days.forEach(day => {
            classes.forEach(cls => {
                let row = [`"${day}"`, `"${cls}"`];
                timeSlots.forEach(time => {
                    const entry = timetableData.find(item => 
                        item.day === day && 
                        item.class === cls && 
                        item.time === time
                    );
                    row.push(`"${entry ? `${entry.subject} (${entry.room})` : ''}"`);
                });
                csvContent += row.join(',') + '\r\n';
            });
        });
        filename = 'timetable-all-days.csv';
      }
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, filename);
      
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert('Failed to export CSV');
    } finally {
      setExporting(false);
    }
  };

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

  // Function to render the day-wise view (MODIFIED for All Days to match image)
  const renderDayView = () => {
    if (showAllDays) {
      // Data structure to easily look up entries for a given day, class, and time
      const dataMap = new Map();
      timetableData.forEach(entry => {
        const key = `${entry.day}-${entry.class}-${entry.time}`;
        dataMap.set(key, entry);
      });

      return (
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 w-24" rowSpan="2">Day</th> {/* Merged Day header */}
              <th className="border p-2 w-24" rowSpan="2">Class</th> {/* Merged Class header */}
              {timeSlots.map(time => (
                <th key={time} className="border p-2 break-words" colSpan={1}>{time}</th> /* Time slots are now single columns */
              ))}
            </tr>
            {/* The image does not show class names under each time slot, but rather implies them as the data in the cells.
                If you still want them as explicit headers, uncomment the following block, but it won't match the image exactly.
            <tr className="bg-gray-100">
                {timeSlots.flatMap(() =>
                    classes.map(cls => (
                        <th key={cls} className="border p-1 text-xs">{cls}</th>
                    ))
                )}
            </tr>
            */}
          </thead>
          <tbody>
            {days.map((day, dayIndex) => {
              const dayRows = classes.flatMap((cls, classIndex) => {
                const classTimeSlots = timeSlots.map((time, timeIndex) => {
                  const entryKey = `${day}-${cls}-${time}`;
                  const entry = dataMap.get(entryKey);
                  const isBlankTimeSlot = time === '01.15 to 02.00'; // Special handling for the blank slot

                  return (
                    <td key={`${day}-${cls}-${time}`} 
                        className={`border p-2 align-top ${isBlankTimeSlot ? 'bg-gray-300' : (entry ? getBackgroundColor(cls) : 'bg-gray-50')}`}
                        // colSpan={isBlankTimeSlot ? classes.length : 1} // No colspan needed here as time slots are now individual columns
                        >
                      {isBlankTimeSlot ? (
                        // Render empty for the blank time slot
                        <div className="text-center text-gray-700 font-bold">
                          {/* You can put "LUNCH BREAK" or similar here if desired */}
                        </div>
                      ) : entry ? (
                        <div>
                          <div className="font-semibold">{entry.subject}</div>
                          <div className="text-xs">Room: {entry.room}</div>
                          {!isExportingPDF && (
                            <div className="mt-2 flex space-x-2 justify-center">
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
                          )}
                        </div>
                      ) : (
                        !isExportingPDF && (
                          <button 
                            className="p-1 bg-gray-200 rounded hover:bg-gray-300 w-full text-center"
                            onClick={() => {
                              setFormData({
                                day: day,
                                class: cls,
                                time: time,
                                subject: '',
                                room: ''
                              });
                              setIsEditing(false);
                              setShowModal(true);
                            }}
                          >
                            <PlusIcon /> Add
                          </button>
                        )
                      )}
                    </td>
                  );
                });

                return (
                  <tr key={`${day}-${cls}`}>
                    {/* Day cell spanning for all classes and time slots for that day */}
                    {classIndex === 0 && (
                      <td rowSpan={classes.length} className="border p-2 font-bold text-center align-middle bg-blue-100 text-lg">
                        {day}
                      </td>
                    )}
                    {/* Class cell spanning for all time slots for that class */}
                    <td className={`border p-2 font-semibold align-middle whitespace-nowrap ${getBackgroundColor(cls)}`}>
                        {cls}
                    </td>
                    {classTimeSlots}
                  </tr>
                );
              });
              return dayRows;
            })}
            {timetableData.length === 0 && (
              <tr>
                <td colSpan={2 + timeSlots.length} className="text-center py-4 border">
                  No timetable entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      );
    }
    
    // Original Single day view (time on left, class on top)
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
                        {!isExportingPDF && (
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
                        )}
                      </div>
                    ) : (
                      !isExportingPDF && (
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
                      )
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

  // Function to render the class-wise view (Original, not changed based on image)
  const renderClassView = () => {
    // Determine which classes to display
    const classesToDisplay = activeClass === 'All' ? classes : [activeClass];

    return (
      <table className="w-full border-collapse table-fixed"> {/* Added table-fixed for consistent column widths */}
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 w-40">Class/Day</th>
            {timeSlots.map(time => (
              <th key={time} className="border p-2 break-words">{time}</th> 
            ))}
          </tr>
        </thead>
        <tbody>
          {classesToDisplay.map(cls => (
            <React.Fragment key={cls}>
              {days.map(day => {
                // Collect all entries for the current class and day
                const entriesForClassAndDay = timetableData.filter(item => 
                  item.day === day && item.class === cls
                ).sort((a, b) => timeSlots.indexOf(a.time) - timeSlots.indexOf(b.time));

                // If there are no entries for this specific class and day, render a blank row
                if (entriesForClassAndDay.length === 0) {
                  return (
                    <tr key={`${cls}-${day}-empty`}>
                      <td className={`border p-2 font-semibold ${getBackgroundColor(cls)}`}>{cls} - {day}</td>
                      <td colSpan={timeSlots.length} className="border p-2 text-center text-gray-500">
                        No entries for this time period.
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={`${cls}-${day}`}>
                    <td className={`border p-2 font-semibold ${getBackgroundColor(cls)}`}>{cls} - {day}</td> {/* Class and Day in one cell */}
                    {timeSlots.map(time => {
                      const entry = entriesForClassAndDay.find(item => item.time === time);
                      
                      return (
                        <td key={`${cls}-${day}-${time}`} className={`border p-2 ${entry ? getBackgroundColor(cls) : 'bg-gray-50'}`}>
                          {entry ? (
                            <div>
                              <div className="font-semibold">{entry.subject}</div>
                              <div className="text-xs">Room: {entry.room}</div>
                              {!isExportingPDF && (
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
                              )}
                            </div>
                          ) : (
                            !isExportingPDF && (
                              <button 
                                className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => {
                                  setFormData({
                                    day: day,
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
                            )
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
          {classesToDisplay.length === 0 && (
            <tr>
              <td colSpan={timeSlots.length + 1} className="text-center py-4 border"> {/* Adjusted colspan */}
                No entries found for selected class(es)
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
                  onClick={() => {
                    setActiveView('day');
                    setShowAllDays(false); // Reset to single day view by default
                  }}
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
                  <button 
                    className={`p-2 ${showAllDays ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
                    onClick={toggleAllDays}
                  >
                    All Days
                  </button>
                  {!showAllDays && ( // Only show individual day buttons if 'All Days' is not active
                    days.map(day => (
                      <button 
                        key={day}
                        className={`p-2 ${activeDay === day && !showAllDays ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => {
                          setActiveDay(day);
                          setShowAllDays(false);
                        }}
                      >
                        {day}
                      </button>
                    ))
                  )}
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
            
            <div className="flex space-x-1">
              {/* Export buttons */}
              
              <button 
                onClick={exportToPDF}
                disabled={exporting}
                className="px-1 size-14 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
              >
                {exporting ? <LoadingSpinner /> : (
                  <>
                    <DownloadIcon /> <span className="ml-1">PDF</span>
                  </>
                )}
              </button>
              <button 
                onClick={exportToCSV}
                disabled={exporting}
                className="px-1 size-14 bg-blue-500 text-white rounded hover:bg-blue-700 flex items-center"
              >
                {exporting ? <LoadingSpinner /> : (
                  <>
                    <TableIcon /> <span className="ml-1">CSV</span>
                  </>
                )}
              </button>
              <button 
                className="px-1 size-14 bg-amber-500 text-white rounded flex items-center hover:bg-amber-600"
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
              >
                <PlusIcon /> <span className="ml-1">Add</span>
              </button>
            </div>
          </div>
          
          {/* Reference for export */}
          <div className="border rounded shadow" ref={timetableRef}>
            {activeView === 'day' ? renderDayView() : renderClassView()}
          </div>
          
          {renderModal()}
        </>
      )}
    </div>
  );
};

export default Generate;