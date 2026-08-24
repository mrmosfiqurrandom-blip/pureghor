import React, { useState } from 'react';
import { Upload, Copy, Trash2, Check, Image as ImageIcon } from 'lucide-react';
import { uploadImageFile, getMediaFiles, deleteMediaFile } from '../../services/storage';

export const AdminMediaLibrary: React.FC = () => {
  const [files, setFiles] = useState(() => getMediaFiles());
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < fileList.length; i++) {
        await uploadImageFile(fileList[i], 'general');
      }
      setFiles(getMediaFiles());
    } catch (err: any) {
      alert(err.message || 'আপলোড ব্যর্থ হয়েছে');
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (!confirm('ফাইলটি মুছে ফেলতে চান?')) return;
    deleteMediaFile(id);
    setFiles(getMediaFiles());
  };

  return (
    <div className="space-y-6 font-['Hind_Siliguri']">
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#E5E0D5] flex items-center justify-between shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-[#123B2A]">মিডিয়া ও ফাইল লাইব্রেরি</h2>
          <p className="text-xs text-gray-500">লোগো, ব্যানার এবং পণ্যের ছবির ক্লাউড স্টোরেজ গ্যালারি</p>
        </div>

        <label className="bg-[#1F6B45] hover:bg-[#123B2A] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-xs">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'আপলোড হচ্ছে...' : 'ছবি আপলোড করুন'}</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map((f) => (
          <div
            key={f.id}
            className="bg-white rounded-2xl border border-[#E5E0D5] overflow-hidden shadow-2xs group flex flex-col justify-between"
          >
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              <img src={f.url} alt={f.fileName} className="w-full h-full object-cover" />
            </div>

            <div className="p-3">
              <span className="text-xs font-bold text-[#123B2A] block truncate">{f.fileName}</span>
              <span className="text-[10px] text-gray-400 block">{Math.round(f.size / 1024)} KB</span>

              <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#E5E0D5]">
                <button
                  onClick={() => handleCopy(f.url, f.id)}
                  className="text-xs font-bold text-[#1F6B45] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === f.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === f.id ? 'কপি হয়েছে' : 'লিংক কপি'}</span>
                </button>

                <button
                  onClick={() => handleDelete(f.id)}
                  className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
