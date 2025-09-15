import React, { useState, useEffect } from 'react';
import QRCodeAttendance from '../shared/QRCodeAttendance';
import { Users, CheckCircle, XCircle, Clock, TrendingUp, Download } from 'lucide-react';
import studentsData from '../../data/students.json';
import attendanceData from '../../data/attendance.json';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [attendanceSuccess, setAttendanceSuccess] = useState(false);

  const handleAttendanceMarked = () => {
    setAttendanceSuccess(true);
    setTimeout(() => setAttendanceSuccess(false), 3000);
  };

  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    averageAttendance: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const todayClasses = attendanceData.today.classes;
    const allStudents = studentsData;

    const presentStudents = new Set();
    const absentStudents = new Set();

    todayClasses.forEach(cls => {
      cls.students.forEach(student => {
        if (student.present) {
          presentStudents.add(student.id);
        } else {
          absentStudents.add(student.id);
        }
      });
    });

    const totalAttendance = allStudents.reduce((sum, student) => sum + student.attendance.percentage, 0);
    const averageAttendance = totalAttendance / allStudents.length;

    setAttendanceStats({
      totalStudents: allStudents.length,
      presentToday: presentStudents.size,
      absentToday: absentStudents.size,
      averageAttendance: Math.round(averageAttendance)
    });

    setTodayAttendance(todayClasses);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const exportAttendanceCSV = () => {
    const csvContent = [
      ['Student ID', 'Name', 'Email', 'Total Classes', 'Present', 'Absent', 'Percentage'],
      ...studentsData.map(student => [
        student.studentId,
        student.name,
        student.email,
        student.attendance.totalClasses,
        student.attendance.present,
        student.attendance.absent,
        student.attendance.percentage
      ])
    ];
    // TODO: Add logic for CSV export
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className={`card ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {getGreeting()}, {user?.name.split(' ')[0]}!
            </h1>
            <p className={`mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">
              {formatTime(currentTime)}
            </div>
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Current Time</div>
          </div>
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`card flex items-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-green-900' : 'bg-green-100'} rounded-lg flex items-center justify-center`}>
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{attendanceStats.presentToday}</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Present Today</p>
          </div>
        </div>

        <div className={`card flex items-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-red-900' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="ml-4">
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{attendanceStats.absentToday}</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Absent Today</p>
          </div>
        </div>

        <div className={`card flex items-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-100'} rounded-lg flex items-center justify-center`}>
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{attendanceStats.averageAttendance}%</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Avg Attendance</p>
          </div>
        </div>
      </div>

      {/* Today's Classes */}
      <div className={`card ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'} rounded-lg flex items-center justify-center`}>
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className={`text-lg font-semibold ml-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Today's Classes</h3>
          </div>
        </div>

        <div className="space-y-4">
          {todayAttendance.map((cls) => (
            <div key={cls.id} className={`p-6 rounded-xl border ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{cls.subject}</h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{cls.teacher}</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{cls.time} • {cls.room}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">
                    {cls.students.filter(s => s.present).length}/{cls.students.length}
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Present</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className={`font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Present Students</h5>
                  <div className="space-y-1">
                    {cls.students.filter(s => s.present).map((student) => (
                      <div key={student.id} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{student.name}</span>
                        <span className={`ml-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{student.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className={`font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Absent Students</h5>
                  <div className="space-y-1">
                    {cls.students.filter(s => !s.present).map((student) => (
                      <div key={student.id} className="flex items-center text-sm">
                        <XCircle className="w-4 h-4 text-red-500 mr-2" />
                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{student.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions + Attendance Trends */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full btn-secondary flex items-center justify-center">
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </button>
            <button className="w-full btn-secondary flex items-center justify-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Analytics
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trends</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">This Week</span>
              <span className="text-sm font-medium text-gray-900">87.5%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '87.5%' }}></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Week</span>
              <span className="text-sm font-medium text-gray-900">92.1%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92.1%' }}></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="text-sm font-medium text-gray-900">89.3%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '89.3%' }}></div>
            </div>
          </div>
        </div>
      </div> */}

      {/* FaceRecognition Modal - Removed to fix warnings */}
      {/* Legacy face recognition code removed as we now use QR attendance sessions */}
    </div>
  );
};

export default FacultyDashboard;
