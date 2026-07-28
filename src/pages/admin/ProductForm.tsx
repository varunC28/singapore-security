import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, Category, ProductSpec, ProductSpecGroup } from '@/types';
import { X, Plus, Upload } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProductForm({ product, categories, isOpen, onClose, onSaved }: ProductFormProps) {
  const [name, setName] = useState(product?.name || '');
  const [categoryId, setCategoryId] = useState(product?.category_id || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [mrp, setMrp] = useState(product?.mrp?.toString() || '');
  const [description, setDescription] = useState(product?.description || '');
  const [inStock, setInStock] = useState(product?.in_stock ?? true);
  const [specs, setSpecs] = useState<ProductSpecGroup[]>(
    product?.specs?.length ? product.specs : [{ group: 'General', items: [] }]
  );
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(product?.image_url || '');
  
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [smartPasteGroupId, setSmartPasteGroupId] = useState<number | null>(null);
  const [smartPasteText, setSmartPasteText] = useState('');
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryId === 'ADD_NEW') {
      setIsAddingCategory(true);
      setCategoryId('');
    }
  }, [categoryId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const addGroup = () => setSpecs([...specs, { group: 'New Group', items: [] }]);
  const updateGroup = (gIndex: number, newName: string) => {
    const newSpecs = [...specs];
    newSpecs[gIndex].group = newName;
    setSpecs(newSpecs);
  };
  const removeGroup = (gIndex: number) => setSpecs(specs.filter((_, i) => i !== gIndex));

  const addSpec = (gIndex: number) => {
    const newSpecs = [...specs];
    newSpecs[gIndex].items.push({ label: '', value: '' });
    setSpecs(newSpecs);
  };
  const removeSpec = (gIndex: number, sIndex: number) => {
    const newSpecs = [...specs];
    newSpecs[gIndex].items = newSpecs[gIndex].items.filter((_, i) => i !== sIndex);
    setSpecs(newSpecs);
  };
  const updateSpec = (gIndex: number, sIndex: number, field: keyof ProductSpec, val: string) => {
    const newSpecs = [...specs];
    newSpecs[gIndex].items[sIndex][field] = val;
    setSpecs(newSpecs);
  };

  const handleSmartPaste = () => {
    if (!smartPasteText.trim() || smartPasteGroupId === null) return;

    const lines = smartPasteText.split('\n');
    const parsedSpecs: ProductSpec[] = [];

    for (const line of lines) {
      const cleanLine = line.trim().replace(/^[-•*]\s*/, '');
      if (!cleanLine) continue;

      let label = '';
      let value = '';

      if (cleanLine.includes('\t')) {
        const parts = cleanLine.split('\t').filter(p => p.trim());
        if (parts.length >= 2) {
          label = parts[0].trim();
          value = parts.slice(1).join(' ').trim();
        }
      } else if (cleanLine.includes(':')) {
        const idx = cleanLine.indexOf(':');
        label = cleanLine.substring(0, idx).trim();
        value = cleanLine.substring(idx + 1).trim();
      } else if (cleanLine.includes('-')) {
        const idx = cleanLine.indexOf('-');
        label = cleanLine.substring(0, idx).trim();
        value = cleanLine.substring(idx + 1).trim();
      }

      if (label && value) {
        label = label.replace(/:$/, '').trim();
        parsedSpecs.push({ label, value });
      }
    }

    if (parsedSpecs.length > 0) {
      const newSpecs = [...specs];
      newSpecs[smartPasteGroupId].items.push(...parsedSpecs);
      setSpecs(newSpecs);
    }
    
    setSmartPasteText('');
    setSmartPasteGroupId(null);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setLoading(true);
    const slug = newCategoryName.toLowerCase().replace(/\s+/g, '-');
    const { data, error } = await supabase.from('categories').insert([{ name: newCategoryName, slug }]).select().single();
    if (!error && data) {
      categories.push(data); // optimistic update for this modal instance
      setCategoryId(data.id);
      setIsAddingCategory(false);
      setNewCategoryName('');
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = product?.image_url || null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);
          
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }

      const productData = {
        name,
        category_id: categoryId || null,
        price: parseFloat(price),
        mrp: mrp ? parseFloat(mrp) : null,
        description,
        in_stock: inStock,
        image_url: imageUrl,
        specs: specs
          .filter(g => g.group.trim() !== '')
          .map(g => ({
            group: g.group,
            items: g.items.filter(s => s.label.trim() && s.value.trim())
          }))
          .filter(g => g.items.length > 0)
      };

      if (product?.id) {
        const { error } = await supabase.from('products').update(productData).eq('id', product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
      }

      onSaved();
    } catch (error) {
      console.error("Error saving product:", error);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#3b82f6] outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input required type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#3b82f6] outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">M.R.P. (Optional)</label>
              <input type="number" min="0" step="0.01" value={mrp} onChange={e => setMrp(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#3b82f6] outline-none" placeholder="Original price" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            {!isAddingCategory ? (
              <CustomSelect 
                value={categoryId} 
                onChange={setCategoryId} 
                placeholder="Select a category"
                options={[
                  ...categories.map(c => ({ value: c.id, label: c.name })),
                  { value: 'ADD_NEW', label: '+ Add New Category', className: 'font-semibold text-[#3b82f6] border-t border-gray-50 mt-1' }
                ]}
              />
            ) : (
              <div className="flex gap-2">
                <input type="text" placeholder="New category name" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#3b82f6] outline-none" />
                <button type="button" onClick={handleCreateCategory} disabled={loading} className="bg-gray-900 text-white px-4 rounded-lg">Save</button>
                <button type="button" onClick={() => setIsAddingCategory(false)} className="px-3 text-gray-500">Cancel</button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#3b82f6] outline-none resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden relative shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="text-gray-400" size={24} />
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
              <div className="text-sm text-gray-500">
                <p>Click the square to upload an image.</p>
                <p className="mt-1">Recommended: 1:1 square aspect ratio.</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">Specifications (Grouped)</label>
              <button type="button" onClick={addGroup} className="text-sm text-[#3b82f6] font-medium flex items-center gap-1 hover:underline">
                <Plus size={16} /> Add Group
              </button>
            </div>
            
            <div className="space-y-6">
              {specs.map((group, gIndex) => (
                <div key={gIndex} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                  <div className="flex items-center gap-3 mb-4">
                    <input 
                      type="text" 
                      value={group.group} 
                      onChange={(e) => updateGroup(gIndex, e.target.value)}
                      placeholder="e.g. Video Quality"
                      className="font-bold text-gray-900 bg-transparent border-b border-gray-300 focus:border-[#3b82f6] outline-none px-1 py-1 flex-1"
                    />
                    <button type="button" onClick={() => setSmartPasteGroupId(smartPasteGroupId === gIndex ? null : gIndex)} className={`text-sm font-medium flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${smartPasteGroupId === gIndex ? 'bg-purple-100 text-purple-700' : 'text-purple-600 hover:bg-purple-50'}`}>
                      <span className="font-mono bg-purple-200 px-1 rounded text-[10px] leading-tight py-0.5 mr-1">AI</span> 
                      {smartPasteGroupId === gIndex ? 'Close Smart Paste' : 'Smart Paste'}
                    </button>
                    <button type="button" onClick={() => removeGroup(gIndex)} className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50">
                      <X size={20} />
                    </button>
                  </div>

                  {smartPasteGroupId === gIndex && (
                    <div className="mb-4 bg-purple-50 p-4 rounded-xl border border-purple-100 shadow-inner">
                      <label className="block text-xs font-semibold text-purple-800 uppercase tracking-wider mb-2">
                        Paste raw text for "{group.group}"
                      </label>
                      <textarea
                        rows={4}
                        value={smartPasteText}
                        onChange={(e) => setSmartPasteText(e.target.value)}
                        placeholder="Resolution: 1080p&#10;Night Vision: Yes"
                        className="w-full border border-purple-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-400 outline-none resize-none bg-white mb-3 shadow-sm"
                      />
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setSmartPasteGroupId(null)} className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-200 rounded-md transition-colors">Cancel</button>
                        <button type="button" onClick={handleSmartPaste} className="px-3 py-1.5 text-sm bg-purple-600 text-white font-medium hover:bg-purple-700 rounded-md shadow-sm transition-colors">Parse & Add</button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {group.items.map((spec, sIndex) => (
                      <div key={sIndex} className="flex gap-3">
                        <input type="text" placeholder="e.g. Resolution" value={spec.label} onChange={e => updateSpec(gIndex, sIndex, 'label', e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#3b82f6] shadow-sm" />
                        <input type="text" placeholder="e.g. 1080p" value={spec.value} onChange={e => updateSpec(gIndex, sIndex, 'value', e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#3b82f6] shadow-sm" />
                        <button type="button" onClick={() => removeSpec(gIndex, sIndex)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50">
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                    <div className="pt-2">
                      <button type="button" onClick={() => addSpec(gIndex)} className="text-sm text-[#3b82f6] font-medium flex items-center gap-1 hover:underline">
                        <Plus size={16} /> Add Spec to {group.group || 'Group'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {specs.length === 0 && <p className="text-sm text-gray-500 italic text-center py-4">No specification groups added.</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <button
              type="button"
              onClick={() => setInStock(!inStock)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${inStock ? 'bg-[#3b82f6]' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${inStock ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm font-medium text-gray-700">In Stock</span>
          </div>

        </form>
        
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit} disabled={loading} className="px-5 py-2.5 bg-[#3b82f6] text-white font-medium hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
