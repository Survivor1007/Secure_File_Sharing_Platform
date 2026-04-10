import { Calendar, Check, Copy, Download, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import fetchClient from "../../lib/api";
import { type ShareLink } from "../../types";

const MyShareLinks = () => {
      const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
      const [loading, setLoading] = useState(true);
      const [copiedId,setCopiedId] = useState<string | null>(null);

      const fetchShareLinks = async () => {
            try{
                  const data = await fetchClient('/share/my-links');
                  setShareLinks(data.shareLinks || []);
            }catch(err){
                  console.error('Failed to fetch share link:', err);
            }finally{
                  setLoading(false);
            }
      };


      useEffect(() => {
            fetchShareLinks();
      }, []);

      const copyLink = (url: string, id: string) => {
            navigator.clipboard.writeText(url);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
      };

      const formatDate = (dateString: string) =>{
            return new Date(dateString).toLocaleDateString('en-US',{
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
            });
      };

      if(loading){
            return <div className="text-center py-12 text-gray-400">Loading your share Links...</div>
      }

      if(shareLinks.length === 0){
            return (
                  <div className="card text-center p-12">
                        <Calendar className="mx-auto mb-4 text-gray-500" size = {48}/>
                        <p className="text-gray-400 text-lg">No Share Links yet...</p>
                        <p className="text-gray-500 mt-2">Share a file to see links here</p>
                  </div>
            );
      }

      return (
    <div className="card overflow-hidden">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center">
        <h3 className="text-xl font-semibold">My Share Links ({shareLinks.length})</h3>
        <button 
          onClick={fetchShareLinks}
          className="text-sm text-blue-400 hover:text-blue-500 font-medium"
        >
          Refresh
        </button>
      </div>

      <div className="divide-y divide-gray-800">
        {shareLinks.map((link) => (
          <div key={link.id} className="p-6 hover:bg-gray-900/50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-white">{link.fileName}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Created {formatDate(link.createdAt)} • {link.downloadCount}/{link.maxDownloads} downloads
                </p>
                {link.isExpired && (
                  <span className="inline-block mt-2 px-3 py-1 bg-red-900/50 text-red-400 text-xs rounded-full">
                    Expired
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => copyLink(link.shareUrl, link.id)}
                  className="p-3 hover:bg-gray-800 rounded-xl transition-colors"
                  title="Copy Link"
                >
                  {copiedId === link.id ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                </button>
                <button className="p-3 hover:bg-red-900/30 text-red-400 rounded-xl transition-colors" title="Delete Link">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="mt-4 bg-gray-900 p-3 rounded-2xl font-mono text-xs break-all text-blue-400">
              {link.shareUrl}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyShareLinks;

