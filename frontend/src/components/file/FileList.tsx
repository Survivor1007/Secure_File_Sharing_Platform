import { Download, FileText, Share2, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import fetchClient, { downloadFile } from "../../lib/api";
import { type FileItem } from "../../types";
import ShareModal from "./ShareModal";


const FileList = () => {
      const [files, setFiles] = useState<FileItem[]>([]);
      const [loading, setLoading] = useState(true);
      const [selectedFileForShare, setSelectedFileForShare ] = useState<{
        id: string,
        name: string
      } | null>(null);
      const [downloadingId, setDownloadingId] = useState<string | null>(null);

      const fetchFiles = async () => {
            try{
                  const data = await fetchClient('/files/my-files');
                  setFiles(data.files || []);
            }catch(err: any){
                  console.error('Failed to fetch files:', err);
            }finally{
                  setLoading(false);
            }      
      };

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

      const handleShare= (fileId: string, fileName: string) =>{
        setSelectedFileForShare({id: fileId, name: fileName});
      }

      const handleDownload = async (fileId: string, originalName: string) => {
        setDownloadingId(fileId);
        try{
            const blob = await downloadFile(`/files/download/${fileId}`);

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = originalName;

            document.body.appendChild(a);
            a.click();
            
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }catch(err :any){
          throw new Error('Failed to download file. Please try again.');
        }finally{
          setDownloadingId(null);
        }
      };

      

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
    <>
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-semibold">My Files ({files.length})</h3>
          <button 
            onClick={fetchFiles}
            className="text-sm text-blue-400 hover:text-blue-500 font-medium"
          >
            Refresh
          </button>
        </div>

        <div className="divide-y divide-gray-800">
          {files.map((file) => (
            <div 
              key={file.id} 
              className="p-6 flex items-center justify-between hover:bg-gray-900/50 group transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-11 h-11 bg-gray-800 rounded-2xl flex-shrink-0 flex items-center justify-center">
                  <FileText size={24} className="text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white truncate">{file.originalName}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleShare(file.id, file.originalName)}
                  className="p-3 hover:bg-gray-800 rounded-xl transition-colors"
                  title="Share"
                >
                  <Share2 size={20} />
                </button>

                <button 
                  onClick={() => handleDownload(file.id, file.originalName)}
                  disabled={downloadingId === file.id}
                  className="p-3 hover:bg-gray-800 rounded-xl transition-colors disabled:opacity-50"
                  title="Download"
                >
                  <Download size={20} className={downloadingId === file.id ? "animate-pulse" : ""} />
                </button>

                <button className="p-3 hover:bg-red-900/30 text-red-400 rounded-xl transition-colors" title="Delete">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {selectedFileForShare && (
        <ShareModal
          fileId={selectedFileForShare.id}
          fileName={selectedFileForShare.name}
          isOpen={true}
          onClose={() => setSelectedFileForShare(null)}
        />
      )}
    </>
  );

};

export default FileList;

