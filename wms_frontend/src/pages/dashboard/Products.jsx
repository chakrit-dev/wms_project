import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Edit, Trash2, Save, X, Plus } from 'lucide-react';
import API from '@/api';
import Pagination from '@/components/Pagination';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [categorySearch, setCategorySearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formProduct, setFormProduct] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

  const productSearchFields = [
    { label: 'ID', key: 'prd_id' },
    { label: 'SKU', key: 'prd_sku' },
    { label: 'Name', key: 'prd_name' },
    { label: 'Category', key: 'prd_category' },
    { label: 'Price', key: 'prd_unit_price' },
    { label: 'Weight', key: 'prd_weight' },
    { label: 'Qty', key: 'prd_qty' },
    { label: 'Unit', key: 'prd_unit' },
    { label: 'Created By', key: 'prd_created_by' }
  ];

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const fetchProducts = async () => {
    const res = await API.get('/api/products');
    setProducts(res.data);
    setFilteredProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await API.get('/api/categories');
    setCategories(res.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const lower = searchQuery.toLowerCase();
    const filtered = products.filter(p => {
      if (searchField === 'all') {
        return Object.values(p).some(val => val?.toString().toLowerCase().includes(lower));
      }
      const field = p[searchField];
      return field?.toString().toLowerCase().includes(lower);
    });
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchQuery, searchField, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (p) => {
    setEditingId(p.prd_id);
    setIsAdding(false);
    setFormProduct({
      prd_sku: p.prd_sku || '',
      prd_name: p.prd_name || '',
      prd_category: p.prd_category || '',
      prd_unit_price: p.prd_unit_price ?? 0,
      prd_weight: p.prd_weight ?? 0,
      prd_qty: p.prd_qty ?? 0,
      prd_unit: p.prd_unit || '',
      prd_created_by: p.prd_created_by || 'unknown'
    });
  };

  const handleSave = async (id) => {
    await API.put(`/api/products/${id}`, formProduct);
    setEditingId(null);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('ยืนยันการลบสินค้านี้?')) return;
    await API.delete(`/api/products/${id}`);
    fetchProducts();
  };

  const handleAdd = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const createdBy = user.usl_username || "unknown";
    setFormProduct({
      prd_sku: '',
      prd_name: '',
      prd_category: '',
      prd_unit_price: '',
      prd_weight: '',
      prd_qty: '',
      prd_unit: '',
      prd_created_by: createdBy
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleAddSave = async () => {
    await API.post('/api/products', formProduct);
    setIsAdding(false);
    fetchProducts();
  };

  const formatDate = (d) => d ? new Date(d).toLocaleString('th-TH') : '-';

  const getCategoryDisplay = (product) => {
    return product.category
      ? `${product.category.cat_code} - ${product.category.cat_name}`
      : `[ไม่พบหมวด: ${product.prd_category}]`;
  };

  return (
    <div className="px-4 py-8 max-w-screen-2xl mx-auto text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow">
          📦 Manage Products
        </h2>
        <div className="flex gap-2 items-center">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="h-10 px-4 pr-10 rounded-xl bg-gradient-to-r from-orange-500/30 to-yellow-400/20 border border-orange-300 text-white text-sm font-medium shadow-inner backdrop-blur-sm hover:ring-2 hover:ring-orange-400/60 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-200 ease-in-out"
          >
            <option value="all">All Fields</option>
            {productSearchFields.map((f) => (
              <option key={f.key} value={f.key}>{f.label}</option>
            ))}
          </select>
          {searchField === 'prd_category' ? (
            <select
              value={categorySearch}
              onChange={(e) => {
                setCategorySearch(e.target.value);
                setSearchQuery(e.target.value);
              }}
              className="h-10 px-4 pr-10 rounded-xl bg-black/30 border border-orange-400 text-white"
            >
              <option value="">-- เลือกหมวดหมู่ --</option>
              {categories.map((cat) => (
                <option key={cat.cat_code} value={cat.cat_code}>
                  {cat.cat_code} - {cat.cat_name}
                </option>
              ))}
            </select>
          ) : (
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/30 text-white border border-orange-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          )}
          {!editingId && !isAdding && permissions.includes("product_create") && (
            <Button onClick={handleAdd} className="bg-green-500 hover:bg-green-400 text-white font-semibold">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          )}
        </div>
      </div>

      <Card className="bg-white/5 border border-white/10 rounded-2xl shadow-xl overflow-x-auto">
        <table className="w-full text-sm text-white border-collapse">
          <thead className="sticky top-0 bg-orange-500/90 text-white shadow-md backdrop-blur z-10 border-b border-white/20">
            <tr>
              {["No.", "ID", "SKU", "Name", "Category", "Price", "Weight", "Qty", "Unit", "Created By", "Created At", "Updated At", "Actions"].map((head, i) => (
                <th key={i} className="p-3 text-left whitespace-nowrap font-semibold tracking-wide">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isAdding && (
              <tr className="bg-white/10 border-b border-white/10">
                <td className="p-3">#</td>
                <td className="p-3">-</td>
                <td className="p-3"><Input name="prd_sku" value={formProduct.prd_sku} onChange={handleChange} className="bg-black/40 text-white border border-white/20" /></td>
                <td className="p-3"><Input name="prd_name" value={formProduct.prd_name} onChange={handleChange} className="bg-black/40 text-white border border-white/20" /></td>
                <td className="p-3">
                  <select name="prd_category" value={formProduct.prd_category} onChange={handleChange} className="bg-black/40 text-white border border-white/20 w-full h-10 px-2">
                    <option value="">Select</option>
                    {categories.map(c => <option key={c.cat_code} value={c.cat_code}>{c.cat_code} - {c.cat_name}</option>)}
                  </select>
                </td>
                <td className="p-3"><Input name="prd_unit_price" value={formProduct.prd_unit_price} onChange={handleChange} className="bg-black/40 text-white border border-white/20" /></td>
                <td className="p-3"><Input name="prd_weight" value={formProduct.prd_weight} onChange={handleChange} className="bg-black/40 text-white border border-white/20" /></td>
                <td className="p-3"><Input name="prd_qty" value={formProduct.prd_qty} onChange={handleChange} className="bg-black/40 text-white border border-white/20" /></td>
                <td className="p-3"><Input name="prd_unit" value={formProduct.prd_unit} onChange={handleChange} className="bg-black/40 text-white border border-white/20" /></td>
                <td className="p-3 whitespace-nowrap">{formProduct.prd_created_by}</td>
                <td className="p-3">-</td>
                <td className="p-3">-</td>
                <td className="p-3 flex gap-2">
                  <Button size="sm" onClick={handleAddSave} className="bg-green-600 hover:bg-green-500 text-white"><Save className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)} className="text-red-400"><X className="w-4 h-4" /></Button>
                </td>
              </tr>
            )}
            {paginatedProducts.map((p, i) => (
              <tr key={p.prd_id} className="even:bg-white/5 odd:bg-white/10 hover:bg-orange-100/10 border-b border-white/10">
                <td className="p-3 whitespace-nowrap">{(currentPage - 1) * pageSize + i + 1}</td>
                <td className="p-3 whitespace-nowrap">{p.prd_id}</td>
                {editingId === p.prd_id ? (
                  <>
                    <td className="p-3"><Input name="prd_sku" value={formProduct.prd_sku} onChange={handleChange} className="bg-black/40 text-white border border-white/20" /></td>
                    <td className="p-3"><Input name="prd_name" value={formProduct.prd_name} onChange={handleChange} className="bg-black/40 text-white border border-white/20" /></td>
                    <td className="p-3">
                      <select name="prd_category" value={formProduct.prd_category} onChange={handleChange} className="bg-black/40 text-white border border-white/20 w-full h-10 px-2">
                        <option value="">Select</option>
                        {categories.map(c => <option key={c.cat_code} value={c.cat_code}>{c.cat_code} - {c.cat_name}</option>)}
                      </select>
                    </td>
                    <td className="p-3"><Input name="prd_unit_price" value={formProduct.prd_unit_price} onChange={handleChange} className="bg-black/40 text-white border border-white/20" /></td>
                    <td className="p-3"><Input name="prd_weight" value={formProduct.prd_weight} onChange={handleChange} className="bg-black/40 text-white border border-white/20" /></td>
                    <td className="p-3"><Input name="prd_qty" value={formProduct.prd_qty} onChange={handleChange} className="bg-black/40 text-white border border-white/20" /></td>
                    <td className="p-3"><Input name="prd_unit" value={formProduct.prd_unit} onChange={handleChange} className="bg-black/40 text-white border border-white/20" /></td>
                  </>
                ) : (
                  <>
                    <td className="p-3 whitespace-nowrap">{p.prd_sku}</td>
                    <td className="p-3 whitespace-nowrap">{p.prd_name}</td>
                    <td className="p-3 whitespace-nowrap">{getCategoryDisplay(p)}</td>
                    <td className="p-3 whitespace-nowrap">{p.prd_unit_price}</td>
                    <td className="p-3 whitespace-nowrap">{p.prd_weight}</td>
                    <td className="p-3 whitespace-nowrap">{p.prd_qty}</td>
                    <td className="p-3 whitespace-nowrap">{p.prd_unit}</td>
                  </>
                )}
                <td className="p-3 whitespace-nowrap">{p.prd_created_by}</td>
                <td className="p-3 whitespace-nowrap">{formatDate(p.prd_created_at)}</td>
                <td className="p-3 whitespace-nowrap">{formatDate(p.prd_updated_at)}</td>
                <td className="p-3 whitespace-nowrap">
                  <div className="flex gap-2">
                    {editingId === p.prd_id ? (
                      <>
                        <Button size="sm" onClick={() => handleSave(p.prd_id)} className="bg-green-600 hover:bg-green-500 text-white"><Save className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="text-red-400"><X className="w-4 h-4" /></Button>
                      </>
                    ) : (
                      <>
                        {permissions.includes("product_update") && (
                          <Button size="sm" onClick={() => handleEdit(p)} className="bg-blue-500 hover:bg-blue-400 text-white"><Edit className="w-4 h-4" /></Button>
                        )}
                        {permissions.includes("product_delete") && (
                          <Button size="sm" onClick={() => handleDelete(p.prd_id)} className="bg-red-500 hover:bg-red-400 text-white"><Trash2 className="w-4 h-4" /></Button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
