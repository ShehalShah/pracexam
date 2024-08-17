import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', { username, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      localStorage.setItem('token', res.data.token);
      if (role === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-gray-200 ">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 style={{ fontFamily: 'Arial, sans-serif', fontWeight: '600' }} className="text-3xl font-bold mb-6 text-gray-800 text-center font-serif">{role.charAt(0).toUpperCase() + role.slice(1)} Login</h2>
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 rounded-l-lg ${role === 'student' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => setRole('student')}
          >
            Student
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg ${role === 'teacher' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => setRole('teacher')}
          >
            Teacher
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
