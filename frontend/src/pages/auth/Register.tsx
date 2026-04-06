import { useState } from "react";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Register = () => {
      const {register} = useAuth();
      const [formData, setFormData] = useState({
            name: '',
            email:'',
            password:'',
      });
      const [error, setError] = useState('');
      const [loading , setLoading] = useState(false);

      const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>  {
            setFormData({...formData, [e.target.name]: e.target.value});
      }

      const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setError('');
            setLoading(true);

            try{
                  await register(formData);
                  alert('Register Successful! Please Login.');
                  window.location.href = '/login';
            }catch(err: any){
                  setError(err.message || 'Registration failed');
            }finally{
                  setLoading(false);
            }
      };

      return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">SecureShare</h1>
          <p className="text-gray-400 mt-2">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-lg font-semibold"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
