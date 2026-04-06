import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Upload, FileText, Share2, LogOut } from "lucide-react";


const Dashboard = () => {
      const {user, logout} = useAuth();

      return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top Navigation */}
      
      <nav className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="font-bold text-white">S</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">SecureShare</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-400">
              {user?.email}
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-red-600/10 hover:text-red-400 rounded-xl transition-all text-sm font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-semibold">Welcome back</h2>
            <p className="text-gray-400 mt-2">Manage your secure files and shares</p>
          </div>
        </div>

        {/* Quick Stats / Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card p-6 hover:border-blue-500 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <Upload className="text-blue-500" size={28} />
              </div>
              <div>
                <p className="text-2xl font-semibold">Upload</p>
                <p className="text-gray-400 text-sm">Share new files securely</p>
              </div>
            </div>
          </div>

          <div className="card p-6 hover:border-blue-500 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                <FileText className="text-emerald-500" size={28} />
              </div>
              <div>
                <p className="text-2xl font-semibold">My Files</p>
                <p className="text-gray-400 text-sm">View all uploaded files</p>
              </div>
            </div>
          </div>

          <div className="card p-6 hover:border-blue-500 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                <Share2 className="text-purple-500" size={28} />
              </div>
              <div>
                <p className="text-2xl font-semibold">Share Links</p>
                <p className="text-gray-400 text-sm">Manage active shares</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="card p-8">
          <h3 className="text-xl font-semibold mb-6">Getting Started</h3>
          <p className="text-gray-400 leading-relaxed">
            Your secure file sharing platform is ready. 
            You can now upload files, generate secure share links with expiration and download limits, 
            and manage everything from this dashboard.
          </p>

          <div className="mt-8 p-6 bg-gray-900 rounded-2xl border border-gray-700">
            <p className="text-sm text-gray-400">
              Next steps we'll build:
            </p>
            <ul className="mt-4 space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                Drag &amp; drop file upload with progress
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                My Files list with search and filter
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                Generate and manage share links
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
