import { Download, FileText, Share2, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import fetchClient from "../../lib/api";
import { type FileItem } from "../../types";

const FileList = () => {
      const [files, setFiles] = useState<FileItem[]>([]);
      const [loading, setLoading] = useState(true);

      const fetchFiles = async () => {
            try{
                  const data = await fetchClient('/files/my-files');
                  setFiles(data.files || []);
            }catch(err: any){
                  console.error('Failed to fetch files:', err);
            }finally{
                  setLoading(false);
            }

            
      }
      useEffect(() => {
                  fetchFiles()
            }, []);

      const formatFileSize = (bytes: number) => {
            if(bytes == 0)return '0 Bytes';

            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB','GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      }

      if(loading){
            return <div className="text-center py-12 text-gray-400">Loading your files...</div>
      }

      if(files.length === 0){
            return (
                  <div className="card p-12 text-center">
                        <FileText className="mx-auto mb-4 text-gray-500" size= {48}/>
                        <p className="text-gray-400">No files uploaded yet</p>
                  </div>
            );
      }

      return (
    <div className="card">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center">
        <h3 className="text-xl font-semibold">My Files ({files.length})</h3>
        <button 
          onClick={fetchFiles}
          className="text-sm text-blue-400 hover:text-blue-500"
        >
          Refresh
        </button>
      </div>

      <div className="divide-y divide-gray-800">
        {files.map((file) => (
          <div key={file.id} className="p-6 flex items-center justify-between hover:bg-gray-900/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                <FileText size={22} className="text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-white truncate max-w-md">{file.originalName}</p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Share2 size={20} className="text-gray-400 hover:text-white" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Download size={20} className="text-gray-400 hover:text-white" />
              </button>
              <button className="p-2 hover:bg-red-900/30 rounded-lg transition-colors">
                <Trash2 size={20} className="text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );


};

export default FileList;

