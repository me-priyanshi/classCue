import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import { useAuth } from '../../contexts/AuthContext.jsx';

const StudentProfilePrompt = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();

  const interestsData = useMemo(() => [
    { text: 'Programming', value: 'programming' },
    { text: 'Web Development', value: 'web-dev' },
    { text: 'Artificial Intelligence', value: 'ai' },
    { text: 'Machine Learning', value: 'ml' },
    { text: 'Data Science', value: 'data-science' },
    { text: 'Cybersecurity', value: 'cybersecurity' },
    { text: 'Mobile Development', value: 'mobile-dev' },
    { text: 'Cloud Computing', value: 'cloud' },
    { text: 'DevOps', value: 'devops' }
  ], []);

  const skillsData = useMemo(() => [
    { text: 'Python', value: 'python' },
    { text: 'JavaScript', value: 'javascript' },
    { text: 'Java', value: 'java' },
    { text: 'C++', value: 'cpp' },
    { text: 'React', value: 'react' },
    { text: 'Node.js', value: 'nodejs' },
    { text: 'SQL', value: 'sql' },
    { text: 'Git', value: 'git' },
    { text: 'Docker', value: 'docker' }
  ], []);

  const goalsData = useMemo(() => [
    { text: 'Learn New Technologies', value: 'learn-tech' },
    { text: 'Build Projects', value: 'build-projects' },
    { text: 'Get Internship', value: 'internship' },
    { text: 'Improve Problem Solving', value: 'problem-solving' },
    { text: 'Master Programming Language', value: 'master-lang' },
    { text: 'Contribute to Open Source', value: 'open-source' },
    { text: 'Network with Peers', value: 'networking' },
    { text: 'Research Opportunities', value: 'research' }
  ], []);

  const [interests, setInterests] = useState(user?.interests || []);
  const [skills, setSkills] = useState(user?.skills || []);
  const [goals, setGoals] = useState(user?.goals || []);

  const isValid = interests.length > 0 && skills.length > 0 && goals.length > 0;

  const selectStyles = {
    control: (base) => ({
      ...base,
      minHeight: '40px',
      boxShadow: 'none',
      borderColor: '#d1d5db'
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#e0e7ff'
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#4f46e5'
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#4f46e5'
    })
  };

  const handleSave = () => {
    if (!isValid) return;
    updateUser({ interests, skills, goals });
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Tell us about you</h2>
        <p className="text-sm text-gray-600 mb-6">Select your interests, skills, and goals to personalize your experience.</p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
            <Select
              isMulti
              options={interestsData.map(i => ({ value: i.value, label: i.text }))}
              value={interests.map(value => ({ value, label: interestsData.find(i => i.value === value)?.text }))}
              onChange={selected => setInterests(selected ? selected.map(s => s.value) : [])}
              styles={selectStyles}
              classNamePrefix="dropdown"
              placeholder="Select your interests"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
            <Select
              isMulti
              options={skillsData.map(i => ({ value: i.value, label: i.text }))}
              value={skills.map(value => ({ value, label: skillsData.find(i => i.value === value)?.text }))}
              onChange={selected => setSkills(selected ? selected.map(s => s.value) : [])}
              styles={selectStyles}
              classNamePrefix="dropdown"
              placeholder="Select your skills"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Goals</label>
            <Select
              isMulti
              options={goalsData.map(i => ({ value: i.value, label: i.text }))}
              value={goals.map(value => ({ value, label: goalsData.find(i => i.value === value)?.text }))}
              onChange={selected => setGoals(selected ? selected.map(s => s.value) : [])}
              styles={selectStyles}
              classNamePrefix="dropdown"
              placeholder="Select your goals"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button className="px-4 py-2 rounded-md border border-gray-300 text-gray-700" onClick={onClose}>Later</button>
          <button className={`btn-primary px-4 py-2 ${!isValid ? 'opacity-60 cursor-not-allowed' : ''}`} disabled={!isValid} onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePrompt;


