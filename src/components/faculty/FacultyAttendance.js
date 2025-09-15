import React, { useState } from 'react';
import { Users, CheckCircle, XCircle, Clock, Calendar, Download, Filter } from 'lucide-react';
import attendanceData from '../../data/attendance.json';
import studentsData from '../../data/students.json';
import { useTheme } from '../../contexts/ThemeContext';
import QRAttendanceSession from './QRAttendanceSession';

const FacultyAttendance = () => {
  const { theme } = useTheme();
  const [selectedClass, setSelectedClass] = useState(0);
  const [selectedDate, setSelectedDate] = useState('today');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showQRSession, setShowQRSession] = useState(false);

  const todayClasses = attendanceData.today.classes;
  const currentClass = todayClasses[selectedClass];

  const getStudentInfo = (studentId) => {
    return studentsData.find(s => s.id === studentId);
  };

  const exportClassAttendanceCSV = () => {
    if (!currentClass) return;

    const csvContent = [
      ['Student ID', 'Name', 'Email', 'Status', 'Time'],
      ...currentClass.students.map(student => {
        const studentInfo = getStudentInfo(student.id);
        return [
          student.studentId || student.id,
          student.name,
          studentInfo?.email || '',
          student.present ? 'Present' : 'Absent',
          student.time || 'N/A'
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentClass.subject}_attendance_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const filteredStudents = currentClass?.students.filter(student => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'present') return student.present;
    if (filterStatus === 'absent') return !student.present;
    return true;
  }) || [];

  const handleStopQRSession = (sessionData) => {
    setShowQRSession(false);
    console.log('QR Session ended:', sessionData);
    alert(`QR Session ended!\nDuration: ${Math.floor(sessionData.duration / 60)}:${(sessionData.duration % 60).toString().padStart(2, '0')}\nStudents attended: ${sessionData.attendedCount}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`card ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-green-900' : 'bg-green-100'} rounded-lg flex items-center justify-center`}>
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Class Attendance</h1>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Monitor and manage student attendance in real-time</p>
            </div>
          </div>
          <button
            onClick={exportClassAttendanceCSV}
            className="btn-primary flex items-center"
            disabled={!currentClass}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`card ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            className={`p-4 border rounded-lg transition-colors duration-200 ${
              theme === 'dark' 
                ? 'bg-primary-900 border-primary-700 hover:bg-primary-800' 
                : 'bg-primary-50 border-primary-200 hover:bg-primary-100'
            }`}
            onClick={() => setShowQRSession(true)}
          >
            <div className="flex items-center">
              <Users className={`w-6 h-6 mr-3 ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`} />
              <div className="text-left">
                <h4 className={`font-medium ${theme === 'dark' ? 'text-primary-300' : 'text-primary-900'}`}>Start Attendance Session</h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-primary-400' : 'text-primary-700'}`}>Start QR code attendance session</p>
              </div>
            </div>
          </button>

          <button
            className={`p-4 border rounded-lg transition-colors duration-200 ${
              theme === 'dark' 
                ? 'bg-green-900 border-green-700 hover:bg-green-800' 
                : 'bg-green-50 border-green-200 hover:bg-green-100'
            }`}
            onClick={exportClassAttendanceCSV}
          >
            <div className="flex items-center">
              <Download className={`w-6 h-6 mr-3 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              <div className="text-left">
                <h4 className={`font-medium ${theme === 'dark' ? 'text-green-300' : 'text-green-900'}`}>Export Report</h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>Download attendance report</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Class Selector */}
      <div className={`card ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center mb-4">
          <Calendar className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mr-2`} />
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Select Class</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {todayClasses.map((cls, index) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(index)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedClass === index
                  ? theme === 'dark' 
                    ? 'border-primary-500 bg-primary-900'
                    : 'border-primary-500 bg-primary-50'
                  : theme === 'dark'
                    ? 'border-gray-700 bg-gray-900 hover:border-gray-600'
                    : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{cls.subject}</h4>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{cls.time}</span>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{cls.teacher}</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{cls.room}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-medium text-primary-200">
                  {cls.students.filter(s => s.present).length}/{cls.students.length} present
                </span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ 
                      width: `${(cls.students.filter(s => s.present).length / cls.students.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Class Details */}
      {currentClass && (
        <>
          <div className={`card ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{currentClass.subject}</h3>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{currentClass.teacher} • {currentClass.time} • {currentClass.room}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">
                  {currentClass.students.filter(s => s.present).length}/{currentClass.students.length}
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Students Present</p>
              </div>
            </div>

            {/* Attendance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                      {currentClass.students.filter(s => s.present).length}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>Present</p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center">
                  <XCircle className="w-8 h-8 text-red-600 mr-3" />
                  <div>
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                      {currentClass.students.filter(s => !s.present).length}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>Absent</p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                      {Math.round((currentClass.students.filter(s => s.present).length / currentClass.students.length) * 100)}%
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>Attendance Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student List */}
          <div className={`card ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Filter className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mr-2`} />
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Student List</h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    filterStatus === 'all'
                      ? theme === 'dark'
                        ? 'bg-primary-900 text-primary-100 border-2 border-primary-500'
                        : 'bg-primary-100 text-primary-800 border-2 border-primary-500'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All ({currentClass.students.length})
                </button>
                <button
                  onClick={() => setFilterStatus('present')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    filterStatus === 'present'
                      ? theme === 'dark'
                        ? 'bg-green-900 text-green-100 border-2 border-green-500'
                        : 'bg-green-100 text-green-800 border-2 border-green-500'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Present ({currentClass.students.filter(s => s.present).length})
                </button>
                <button
                  onClick={() => setFilterStatus('absent')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    filterStatus === 'absent'
                      ? theme === 'dark'
                        ? 'bg-red-900 text-red-100 border-2 border-red-500'
                        : 'bg-red-100 text-red-800 border-2 border-red-500'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Absent ({currentClass.students.filter(s => !s.present).length})
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredStudents.map((student) => {
                const studentInfo = getStudentInfo(student.id);
                return (
                  <div
                    key={student.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      student.present
                        ? theme === 'dark' 
                          ? 'border-green-600 bg-green-900' 
                          : 'border-green-200 bg-green-50'
                        : theme === 'dark'
                          ? 'border-red-600 bg-red-900'
                          : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                          student.present ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {student.present ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{student.name}</h4>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {studentInfo?.studentId || `ID: ${student.id}`}
                          </p>
                          {studentInfo?.email && (
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{studentInfo.email}</p>
                          )}
                      </div>
                      </div>
                      <div className="text-right">
                        <div className={`px-4 py-1 rounded-full text-sm font-medium flex items-center justify-center ${
                          student.present
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.present ? 'Present' : 'Absent'}
                        </div>
                        {student.time && (
                          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Arrived: {student.time}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
                <p className="text-gray-600">
                  Try adjusting your filter criteria.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* QR Attendance Session Modal */}
      {showQRSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto`}>
            <QRAttendanceSession onStopSession={handleStopQRSession} />
          </div>
        </div>
      )}

    </div>
  );
};

export default FacultyAttendance;
