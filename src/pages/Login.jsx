import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../utils/token'; 
import axios from 'axios';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://sandbox.dibuiltadi.com/api/dashboard/common/v1/auth/login',
        { phone, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const { access_token } = response.data;
      setToken(access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed, please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form className="space-y-4" onSubmit={handleLogin}>
          <input className="w-full px-4 py-2 border rounded" type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <input className="w-full px-4 py-2 border rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
