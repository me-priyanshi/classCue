// Utility functions to load data from public folder
export const loadStudentsData = async () => {
  try {
    const response = await fetch('/classCue/students.json');
    return await response.json();
  } catch (error) {
    console.error('Error loading students data:', error);
    return [];
  }
};

export const loadAttendanceData = async () => {
  try {
    const response = await fetch('/classCue/attendance.json');
    return await response.json();
  } catch (error) {
    console.error('Error loading attendance data:', error);
    return { today: { classes: [] }, weekly: { summary: {} } };
  }
};

export const loadTasksData = async () => {
  try {
    const response = await fetch('/classCue/tasks.json');
    return await response.json();
  } catch (error) {
    console.error('Error loading tasks data:', error);
    return { academic: [], personal: [] };
  }
};

export const loadTimetableData = async () => {
  try {
    const response = await fetch('/classCue/timetable.json');
    return await response.json();
  } catch (error) {
    console.error('Error loading timetable data:', error);
    return {};
  }
};
