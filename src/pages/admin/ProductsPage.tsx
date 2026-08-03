import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/types';
import { Plus, Search, Edit2, Trash2, GripVertical } from 'lucide-react';
import ProductForm from './ProductForm';
import { formatPrice } from '@/lib/constants';
import CustomSelect from '@/components/ui/CustomSelect';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

type ProductWithCategory = Product & { category: Category | null };

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*, category:categories(id, name, slug)').order('sort_order', { ascending: true }).order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('sort_order', { ascending: true }).order('name')
      ]);

      if (productsRes.data) setProducts(productsRes.data as unknown as ProductWithCategory[]);
      if (categoriesRes.data) setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(products.filter(p => p.id !== id));
    } else {
      alert('Error deleting product');
    }
  };

  const handleAdd = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (product: ProductWithCategory) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const filteredProducts = [...products].filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? p.category_id === selectedCategory : true;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (a.sort_order !== b.sort_order) return (a.sort_order || 0) - (b.sort_order || 0);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    if (!selectedCategory) return; // Only allow drag and drop if a specific category is selected

    const items = Array.from(filteredProducts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Optimistic UI update
    const updatedItems = items.map((item, index) => ({
      ...item,
      sort_order: index
    }));
    
    // Update local state by merging back the filtered products
    setProducts(prev => {
      const newProducts = [...prev];
      updatedItems.forEach(updatedItem => {
        const index = newProducts.findIndex(p => p.id === updatedItem.id);
        if (index !== -1) newProducts[index] = updatedItem;
      });
      return newProducts;
    });

    try {
      await Promise.all(
        updatedItems.map((item) =>
          supabase
            .from('products')
            .update({ sort_order: item.sort_order })
            .eq('id', item.id)
        )
      );
    } catch (error) {
      console.error('Error updating order', error);
      fetchData(); // Revert on failure
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={handleAdd}
          className="bg-[#3b82f6] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] outline-none"
          />
        </div>
        <CustomSelect
          value={selectedCategory}
          onChange={setSelectedCategory}
          placeholder="All Categories"
          className="w-48 shrink-0"
          options={[
            { value: '', label: 'All Categories' },
            ...categories.map(c => ({ value: c.id, label: c.name }))
          ]}
        />
      </div>

      {selectedCategory === '' && search === '' && products.length > 0 && (
        <div className="text-sm text-gray-500 bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-center gap-2">
          <GripVertical size={16} className="text-blue-400" />
          Tip: Select a specific category above to enable drag-and-drop ordering.
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">No products found.</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="products-list" isDropDisabled={selectedCategory === ''}>
            {(provided) => (
              <div 
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <ul className="divide-y divide-gray-100">
                  {filteredProducts.map((product, index) => (
                    <Draggable 
                      key={product.id} 
                      draggableId={product.id} 
                      index={index}
                      isDragDisabled={selectedCategory === ''}
                    >
                      {(provided, snapshot) => (
                        <li 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50 transition-colors bg-white ${snapshot.isDragging ? 'shadow-lg border border-blue-100 z-50' : ''}`}
                          style={provided.draggableProps.style}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            {selectedCategory !== '' && (
                              <div 
                                {...provided.dragHandleProps} 
                                className="text-gray-400 hover:text-gray-900 cursor-grab active:cursor-grabbing p-1.5 hover:bg-gray-100 rounded-md transition-colors shrink-0"
                              >
                                <GripVertical size={20} />
                              </div>
                            )}
                            
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} className="w-16 h-16 sm:w-12 sm:h-12 object-cover rounded-md border border-gray-200 shrink-0" />
                            ) : (
                              <div className="w-16 h-16 sm:w-12 sm:h-12 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400 shrink-0">No Img</div>
                            )}

                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                              <div className="text-sm text-gray-500">{product.category?.name || '-'}</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
                            <div className="font-medium text-gray-900">{formatPrice(product.price)}</div>
                            
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shrink-0 ${
                              product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {product.in_stock ? 'In Stock' : 'Out of Stock'}
                            </span>

                            <div className="flex items-center gap-1 shrink-0">
                              <button onClick={() => handleEdit(product)} className="p-2 text-gray-400 hover:text-[#3b82f6] rounded-lg hover:bg-blue-50 transition-colors">
                                <Edit2 size={18} />
                              </button>
                              <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {isFormOpen && (
        <ProductForm 
          product={editingProduct} 
          categories={categories} 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          onSaved={() => {
            setIsFormOpen(false);
            fetchData();
          }} 
        />
      )}
    </div>
  );
}
