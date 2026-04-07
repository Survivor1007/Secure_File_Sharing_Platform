import React from "react";
import { useAuth } from "../../context/AuthContext";

import {  LogOut } from "lucide-react";
import UploadZone from "../../components/file/UploadZone";
import FileList from "../../components/file/FileList";


const Dashboard = () => {
      const {user, logout} = useAuth();

      return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
              <span className="font-bold text-lg">S</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tighter">SecureShare</h1>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-400">{user?.email}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-red-600/10 hover:text-red-400 rounded-2xl transition-all text-sm font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h2 className="text-4xl font-semibold tracking-tight">Dashboard</h2>
          <p className="text-gray-400 mt-2">Securely upload and share your files</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <UploadZone />
          </div>

          {/* My Files Section */}
          <div className="lg:col-span-3">
            <FileList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
