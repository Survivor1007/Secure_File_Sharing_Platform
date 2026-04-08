import { Calendar, Copy, Download, X } from "lucide-react";
import React, { useState } from "react";
import fetchClient from "../../lib/api";

interface ShareModalProps{
      fileId: string;
      fileName: string;
      isOpen: boolean;
      onClose: () => void;
}

const ShareModal = ({fileId, fileName, isOpen, onClose}: ShareModalProps) => {
      const [expiresIn, setExpiresIn] = useState('7'); // days
      const [maxDownloads, setMaxDownloads] = useState('10');
      const [loading,setLoading] = useState(false);
      const [shareLink, setShareLink] = useState<string | null>(null);
      const [copied, setCopied] = useState(false);

      if(!isOpen)return null;

      const createShareLink = async () => {
            setLoading(true);

            try{
                  const data = await fetchClient('/share/create', {
                        method: 'POST',
                        body: JSON.stringify({
                              fileId, 
                              expiresAt: new Date(Date.now() + parseInt(expiresIn) * 24 * 60 * 60 * 1000).toISOString(),
                              mexDownloads: parseInt(maxDownloads),
                        }),
                  });

                  setShareLink(data.shareLink.shareUrl);
            }catch(err: any){
                  alert(err.message || 'Failed to create the share link');
            }finally{
                  setLoading(false);
            }
      };

      const copyToClipboard = () => {
            if(shareLink){
                  navigator.clipboard.writeText(shareLink);
                  setCopied(true);
                  setTimeout(() => (setCopied(false), 2000));
            }
      };

      return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-lg">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold">Create Share Link</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm text-gray-400 mb-1">File</p>
            <p className="font-medium text-white">{fileName}</p>
          </div>

          {!shareLink ? (
            <>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Link expires in</label>
                <select
                  value={expiresIn}
                  onChange={(e) => setExpiresIn(e.target.value)}
                  className="input w-full"
                >
                  <option value="1">1 Day</option>
                  <option value="3">3 Days</option>
                  <option value="7">7 Days</option>
                  <option value="30">30 Days</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">Maximum downloads</label>
                <input
                  type="number"
                  value={maxDownloads}
                  onChange={(e) => setMaxDownloads(e.target.value)}
                  className="input w-full"
                  min="1"
                  max="100"
                />
              </div>

              <button
                onClick={createShareLink}
                disabled={loading}
                className="btn-primary w-full py-3 text-lg"
              >
                {loading ? 'Creating Link...' : 'Generate Secure Share Link'}
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-900 p-4 rounded-2xl border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Your share link</p>
                <p className="text-sm break-all font-mono text-blue-400">{shareLink}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 py-3"
                >
                  <Copy size={18} />
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-2xl font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
