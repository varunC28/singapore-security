import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types';
import { Plus, Trash2, Edit2, X, Check, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

type CategoryWithCount = Category & { products: { count: number }[] };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*, products(count)')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });
      
    if (data && !error) {
      setCategories(data as unknown as CategoryWithCount[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    const slug = newName.toLowerCase().replace(/\s+/g, '-');
    const maxOrder = categories.length > 0 ? Math.max(...categories.map(c => c.sort_order || 0)) : 0;
    
    const { error } = await supabase.from('categories').insert([{ name: newName, slug, sort_order: maxOrder + 1 }]);
    
    if (!error) {
      setNewName('');
      setIsAdding(false);
      fetchCategories();
    } else {
      alert('Error adding category');
    }
  };

  const handleDelete = async (cat: CategoryWithCount) => {
    const count = cat.products?.[0]?.count || 0;
    if (count > 0) {
      alert(`This category has ${count} products. Remove or reassign them first.`);
      return;
    }
    
    if (window.confirm(`Delete category "${cat.name}"?`)) {
      await supabase.from('categories').delete().eq('id', cat.id);
      fetchCategories();
    }
  };

  const startEdit = (cat: CategoryWithCount) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim()) {
      setEditingId(null);
      return;
    }
    
    const slug = editName.toLowerCase().replace(/\s+/g, '-');
    await supabase.from('categories').update({ name: editName, slug }).eq('id', id);
    setEditingId(null);
    fetchCategories();
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Optimistic UI update
    const updatedItems = items.map((item, index) => ({
      ...item,
      sort_order: index
    }));
    setCategories(updatedItems);

    try {
      await Promise.all(
        updatedItems.map((item) =>
          supabase
            .from('categories')
            .update({ sort_order: item.sort_order })
            .eq('id', item.id)
        )
      );
    } catch (error) {
      console.error('Error updating order', error);
      fetchCategories(); // Revert on failure
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-[#3b82f6] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-3">
          <input
            autoFocus
            type="text"
            placeholder="Category Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#3b82f6] outline-none"
          />
          <button type="submit" className="bg-[#3b82f6] text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600">
            Save
          </button>
          <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700">
            Cancel
          </button>
        </form>
      )}

      {loading && categories.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">No categories yet.</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="categories-list">
            {(provided) => (
              <div 
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <ul className="divide-y divide-gray-100">
                  {categories.map((cat, index) => {
                    const count = cat.products?.[0]?.count || 0;
                    const isEditing = editingId === cat.id;

                    return (
                      <Draggable key={cat.id} draggableId={cat.id} index={index}>
                        {(provided, snapshot) => (
                          <li 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors bg-white ${snapshot.isDragging ? 'shadow-lg border border-blue-100 z-50' : ''}`}
                            style={provided.draggableProps.style}
                          >
                            <div className="flex items-center gap-3 flex-1 mr-4">
                              <div 
                                {...provided.dragHandleProps} 
                                className="text-gray-400 hover:text-gray-900 cursor-grab active:cursor-grabbing p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                              >
                                <GripVertical size={20} />
                              </div>
                              
                              {isEditing ? (
                                <div className="flex-1 flex items-center gap-3">
                                  <input
                                    autoFocus
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(cat.id)}
                                    className="flex-1 max-w-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#3b82f6] outline-none"
                                  />
                                  <button onClick={() => saveEdit(cat.id)} className="text-green-600 p-1.5 hover:bg-green-50 rounded-lg">
                                    <Check size={20} />
                                  </button>
                                  <button onClick={() => setEditingId(null)} className="text-gray-400 p-1.5 hover:bg-gray-100 rounded-lg">
                                    <X size={20} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex-1 flex items-center gap-4">
                                  <span className="font-medium text-gray-900">{cat.name}</span>
                                  <span className="text-sm text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                                    {count} {count === 1 ? 'product' : 'products'}
                                  </span>
                                </div>
                              )}
                            </div>

                            {!isEditing && (
                              <div className="flex items-center gap-2">
                                <button onClick={() => startEdit(cat)} className="p-2 text-gray-400 hover:text-[#3b82f6] rounded-lg hover:bg-blue-50">
                                  <Edit2 size={18} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(cat)}
                                  className={`p-2 rounded-lg ${count > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                                  title={count > 0 ? "Cannot delete category with products" : "Delete category"}
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            )}
                          </li>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </ul>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}
