import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import fetchClient from "../../lib/api";

const ChangePassword = () => {
      const {logout}  = useAuth();
      const [formData,setFormData] = useState({
            currentPassword:'',
            newPassword:'',
            confirmPassword:'',
      });
      const [error,setError] = useState('');
      const [success, setSuccess] = useState('');
      const [loading,setLoading] = useState(false);

      const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
            setFormData({...formData, [e.target.name]: e.target.value});
      }

      const handleSubmit = async (e:React.FormEvent) => {
            e.preventDefault();
            setError('');
            setSuccess('');

            if(formData.newPassword !== formData.confirmPassword){
                  setError('New Passwords does not match');
                  return;
            }

            if(formData.newPassword.length < 8){
                  setError('New Password must be atleast 8 characters');
                  return;
            }

            setLoading(true);

            try{
                  await fetchClient('/auth/change-password',{
                        method:'POST',
                        body:JSON.stringify({
                              currentPassword: formData.currentPassword,
                              newPassword: formData.newPassword,
                        }),
                  });

                  setSuccess('Password changed successfully! You will be logged out.');
                  setTimeout(() => {
                        logout();
                  }, 1500);
            }catch(err: any){
                  setError(err.message || 'Failed to change password');
            }finally{
                  setLoading(false);
            }
      };

      return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/dashboard" className="text-gray-400 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-2xl font-semibold">Change Password</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={formData.currentPassword}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;