import { Calendar, Check, Copy, Download, Share2, X } from "lucide-react";
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
      const [shareUrl, setShareUrl] = useState<string | null>(null);
      const [copied, setCopied] = useState(false);

      if(!isOpen)return null;

      const createshareUrl = async () => {
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

                  setShareUrl(data.shareLink.shareUrl);
            }catch(err: any){
                  alert(err.message || 'Failed to create the share link');
            }finally{
                  setLoading(false);
            }
      };

      const copyToClipboard = () => {
            if(shareUrl){
                  navigator.clipboard.writeText(shareUrl);
                  setCopied(true);
                  setTimeout(() => (setCopied(false), 2000));
            }
      };

      return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Share2 size={22} className="text-blue-500" />
            Share File
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm text-gray-400 mb-1">Sharing</p>
            <p className="font-medium text-white break-words">{fileName}</p>
          </div>

          {!shareUrl ? (
            <>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Link expires after</label>
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
                <label className="block text-sm text-gray-400 mb-2">Maximum downloads allowed</label>
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
                onClick={createshareUrl}
                disabled={loading}
                className="btn-primary w-full py-3.5 text-base font-semibold"
              >
                {loading ? 'Generating Secure Link...' : 'Generate Share Link'}
              </button>
            </>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-400 mb-2">Your secure share link</p>
                <div className="bg-gray-900 p-4 rounded-2xl border border-gray-700 font-mono text-sm break-all">
                  {shareUrl}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 py-3"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>

                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-2xl font-medium transition-colors"
                >
                  Done
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Anyone with this link can download the file (with your chosen limits)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
