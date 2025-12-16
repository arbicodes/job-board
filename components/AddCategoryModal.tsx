import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, imageUrl: string) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imageUrl) return;
    onAdd(name, imageUrl);
    setName('');
    setImageUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300 transition-colors">
        <div className="p-8">
           <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">Add New Category</h2>
            <button onClick={onClose} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
              <X className="w-5 h-5 text-stone-500 dark:text-stone-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wide">Category Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 outline-none dark:text-white"
                placeholder="e.g. Design"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wide">Category Image</label>
              
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-stone-300 dark:border-stone-700 border-dashed rounded-2xl cursor-pointer bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700/50 transition-colors overflow-hidden relative">
                    {imageUrl ? (
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-stone-400" />
                            <p className="text-sm text-stone-500 dark:text-stone-400 font-bold">Click to upload watercolor cat</p>
                            <p className="text-xs text-stone-400 dark:text-stone-500">SVG, PNG, JPG</p>
                        </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={!name || !imageUrl}
              className="w-full py-3 rounded-xl bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 font-bold hover:bg-stone-700 dark:hover:bg-white/90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;