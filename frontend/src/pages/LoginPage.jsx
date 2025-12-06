import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { login } = useAuth();

  const handleSubmit = async () => {
    try {
      const result = isLogin
        ? await api.auth.login({ email: formData.email, password: formData.password })
        : await api.auth.register(formData);
      login(result.token, result);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <DollarSign className="text-indigo-600" size={40} />
          <h1 className="text-3xl font-bold text-gray-800 ml-2">ExpenseTracker</h1>
        </div>

        <div className="flex space-x-2 mb-6">
          <Button
            variant={isLogin ? 'primary' : 'ghost'}
            onClick={() => setIsLogin(true)}
            className="flex-1"
          >
            Login
          </Button>
          <Button
            variant={!isLogin ? 'primary' : 'ghost'}
            onClick={() => setIsLogin(false)}
            className="flex-1"
          >
            Register
          </Button>
        </div>

        <div className="space-y-4">
          {!isLogin && (
            <Input
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          )}
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Button onClick={handleSubmit} className="w-full" size="lg">
            {isLogin ? 'Login' : 'Register'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;