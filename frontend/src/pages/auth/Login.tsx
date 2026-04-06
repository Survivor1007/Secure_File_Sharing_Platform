import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";


const Login = () => {
      const {login} = useAuth();
      const [email, setEmail] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
      const [password, setPassword] = useState('');

      const handleSubmit  = async (e: React.FormEvent) => {
            e.preventDefault(),
            setError(''),
            setLoading(true);

            try{
                  await login(email, password);
                  window.location.href = '/dashboard';
            }catch(err: any){
                  setError(err.message || 'Email or password is incorrect');
            }finally{
                  setLoading(false);
            }
      };

      
      return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">SecureShare</h1>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:text-blue-400 font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
