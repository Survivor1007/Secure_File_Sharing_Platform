import { Upload, X } from "lucide-react";
import React, { useCallback, useState } from "react";
import fetchClient from "../../lib/api";

const UploadZone = () => {
      const [isDragging, setIsDragging] = useState(false);
      const [uploading, setUploading] = useState(false);
      const [uploadProgress, setUploadProgress] = useState(0);
      const [message,setMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);

      const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);
      }, []);

      const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);
      }, []);

      const handleDrop = useCallback( async (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);

            const file = e.dataTransfer.files[0];
            if(!file)return;

            await uploadFile(file);

      }, []);

      const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if(!file)return ;

            await uploadFile(file);
      };

      const uploadFile = async (file: File) => {
            if(file.size > 50 * 1024 * 1024){
                  setMessage({type: 'error', text:'File size must be less than 50MB'});
                  return ;
            }

            setUploading(true);
            setMessage(null);
            setUploadProgress(0);

            const formData = new FormData();
            formData.append('file', file);

            try{
                  const response = await fetchClient('/files/upload', {
                        method: 'POST',
                        body:formData,
                        credentials:'include',
                  });
                  
                  setMessage({type: 'success', text: `${file.name} uploaded successfully`});
                  setUploadProgress(100);

                  setTimeout(() => setMessage(null), 3000);
            }catch(err: any){
                  setMessage({type: 'error', text: err.message || 'Failed to upload file'});
            }finally{
                  setUploading(false);
            }
      };

      return (
    <div className="card p-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold mb-2">Upload Files</h3>
        <p className="text-gray-400">Securely upload files up to 50MB</p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200
          ${isDragging 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-gray-700 hover:border-gray-600'
          }`}
      >
        <Upload className="mx-auto mb-4 text-gray-400" size={48} />
        
        <p className="text-lg font-medium mb-2">
          Drag & drop your file here
        </p>
        <p className="text-gray-500 mb-6">or</p>

        <label className="btn-primary cursor-pointer inline-flex items-center gap-2 px-8 py-3">
          <Upload size={20} />
          Choose File
          <input
            type="file"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>

        <p className="text-xs text-gray-500 mt-6">
          Supported: Images, PDF, Documents, ZIP (max 50MB)
        </p>
      </div>

      {uploading && (
        <div className="mt-6">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-400 mt-2">Uploading...</p>
        </div>
      )}

      {message && (
        <div className={`mt-6 p-4 rounded-2xl text-sm ${
          message.type === 'success' 
          ? 'bg-green-900/50 text-green-400 border border-green-700' 
          : 'bg-red-900/50 text-red-400 border border-red-700'
        }`}>
          {message.type === 'success' ? '✅' : '⚠️'}{message.text}
        </div>
      )}
    </div>
  );
};

export default UploadZone;
