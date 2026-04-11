import  { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {  FileText, LogOut, Settings, Share2, Upload } from "lucide-react";



import UploadZone from "../../components/file/UploadZone";
import FileList from "../../components/file/FileList";
import MyShareLinks from "../../components/file/MyShareLinks";
import { Link } from "react-router-dom";

type Tab = 'upload' | 'files' | 'shares';

const Dashboard = () => {
      const {user, logout} = useAuth();
      const [activeTab, setActiveTab] = useState<Tab>('upload');

      const tabs = [
        {id:'upload', label: 'Upload', icon:Upload},
        {id:'files', label:'My Files', icon: FileText},
        {id:'shares', label: 'My Share Links', icon: Share2},
      ] as const;

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

            {/* Change Password Link */}
            <Link 
              to="/change-password"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-2xl transition-all text-sm font-medium"
            >
              <Settings size={18} />
              Change Password
            </Link>

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

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-10">
          <h2 className="text-4xl font-semibold tracking-tight">Dashboard</h2>
          <p className="text-gray-400 mt-2">Manage your secure files and shares</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 mb-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 font-medium transition-all border-b-2 -mb-px whitespace-nowrap ${
                  isActive 
                    ? 'border-blue-500 text-white' 
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {activeTab === 'upload' && <UploadZone />}
          {activeTab === 'files' && <FileList />}
          {activeTab === 'shares' && <MyShareLinks />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
