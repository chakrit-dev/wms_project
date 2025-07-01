import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Edit, Trash2, Save, X, Plus } from 'lucide-react';
import API from '@/api';
import Pagination from '@/components/Pagination';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newCategory, setNewCategory] = useState({ cat_name: '', cat_description: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (id) => {
    setEditingId(id);
    const selected = categories.find((cat) => cat.cat_id === id);
    setEditData({ cat_name: selected.cat_name, cat_description: selected.cat_description });
  };

  const handleSave = async (id) => {
    try {
      await API.put(`/categories/${id}`, editData);
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await API.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleAdd = async () => {
    try {
      await API.post('/categories', newCategory);
      setIsAdding(false);
      setNewCategory({ cat_name: '', cat_description: '' });
      fetchCategories();
    } catch (err) {
      console.error('Add failed:', err);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-500 drop-shadow">
          หมวดหมู่สินค้า (Product Categories)
        </h2>
        <Button onClick={() => setIsAdding(!isAdding)} className="bg-gradient-to-r from-yellow-600 to-orange-500 text-white hover:brightness-110">
          <Plus className="mr-2" /> เพิ่มหมวดหมู่
        </Button>
      </div>

      {isAdding && (
        <Card className="p-4 mb-6 bg-gradient-to-br from-orange-700 to-yellow-500 border border-yellow-600 rounded-2xl text-white">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="ชื่อหมวดหมู่"
              value={newCategory.cat_name}
              onChange={(e) => setNewCategory({ ...newCategory, cat_name: e.target.value })}
              className="text-black"
            />
            <Input
              placeholder="คำอธิบาย"
              value={newCategory.cat_description}
              onChange={(e) => setNewCategory({ ...newCategory, cat_description: e.target.value })}
              className="text-black"
            />
            <div className="col-span-2 flex gap-2">
              <Button onClick={handleAdd} className="bg-lime-600 hover:bg-lime-700">บันทึก</Button>
              <Button variant="secondary" onClick={() => setIsAdding(false)}>ยกเลิก</Button>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4 bg-gradient-to-br from-yellow-600 to-orange-500 rounded-2xl shadow-lg">
        <table className="w-full text-sm text-white">
          <thead>
            <tr className="text-left border-b border-white/30">
              <th className="py-2">#</th>
              <th>รหัส</th>
              <th>ชื่อหมวด</th>
              <th>คำอธิบาย</th>
              <th className="text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat.cat_id} className="border-b border-white/10 hover:bg-white/10">
                <td className="py-2">{index + 1}</td>
                <td>{cat.cat_code}</td>
                <td>
                  {editingId === cat.cat_id ? (
                    <Input
                      value={editData.cat_name}
                      onChange={(e) => setEditData({ ...editData, cat_name: e.target.value })}
                      className="text-black"
                    />
                  ) : (
                    cat.cat_name
                  )}
                </td>
                <td>
                  {editingId === cat.cat_id ? (
                    <Input
                      value={editData.cat_description}
                      onChange={(e) => setEditData({ ...editData, cat_description: e.target.value })}
                      className="text-black"
                    />
                  ) : (
                    cat.cat_description
                  )}
                </td>
                <td className="text-right space-x-2">
                  {editingId === cat.cat_id ? (
                    <>
                      <Button size="sm" onClick={() => handleSave(cat.cat_id)} className="bg-green-600"><Save /></Button>
                      <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}><X /></Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" onClick={() => handleEdit(cat.cat_id)} className="bg-blue-600"><Edit /></Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(cat.cat_id)}><Trash2 /></Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalItems={categories.length}
          itemsPerPage={10}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
