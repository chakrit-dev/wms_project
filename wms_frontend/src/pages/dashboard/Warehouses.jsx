// 📄 src/pages/dashboard/Warehouses.jsx
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Edit, Trash2, Save, X, Plus } from 'lucide-react';
import API from '../../api';
import Pagination from '@/components/Pagination';

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [formWarehouse, setFormWarehouse] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const pageSize = 10;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
  }, []);

  const permissions = currentUser?.permissions || [];
  const canRead = permissions.includes('warehouse_read');
  const canCreate = permissions.includes('warehouse_create');
  const canUpdate = permissions.includes('warehouse_update');
  const canDelete = permissions.includes('warehouse_delete');

  const tableFields = [
    { label: 'ID', key: 'whs_id', readOnly: true },
    { label: 'Code', key: 'whs_code' },
    { label: 'Name', key: 'whs_name' },
    { label: 'Address', key: 'whs_addr' },
    { label: 'Capacity', key: 'whs_capacity' },
    { label: 'Phone', key: 'whs_phone' },
    { label: 'Created By', key: 'whs_created_by', readOnly: true },
    { label: 'Created At', key: 'whs_created_at', readOnly: true },
    { label: 'Updated At', key: 'whs_updated_at', readOnly: true }
  ];

  const searchFields = [
    { label: 'ID', key: 'whs_id' },
    { label: 'Code', key: 'whs_code' },
    { label: 'Name', key: 'whs_name' },
    { label: 'Address', key: 'whs_addr' },
    { label: 'Capacity', key: 'whs_capacity' },
    { label: 'Phone', key: 'whs_phone' },
    { label: 'Created By', key: 'whs_created_by' }
  ];

  const fetchWarehouses = async () => {
    const res = await API.get('/api/warehouses', {
      params: {
        query: searchQuery || undefined,
        field: searchField || 'all'
      }
    });
    setWarehouses(res.data);
    setCurrentPage(1);
  };

  useEffect(() => { fetchWarehouses(); }, [searchQuery, searchField]);

  const totalPages = Math.ceil(warehouses.length / pageSize);
  const paginatedWarehouses = warehouses.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormWarehouse(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (wh) => {
    if (!canUpdate) return;
    setEditingId(wh.whs_id);
    setIsAdding(false);
    setFormWarehouse({ ...wh });
  };

  const handleSave = async (id) => {
    await API.put(`/api/warehouses/${id}`, formWarehouse);
    setEditingId(null);
    fetchWarehouses();
  };

  const handleDelete = async (id) => {
    if (!canDelete) return;
    if (!window.confirm('ยืนยันการลบคลังสินค้านี้?')) return;
    await API.delete(`/api/warehouses/${id}`);
    fetchWarehouses();
  };

  const handleAdd = () => {
    if (!canCreate) return;
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const createdBy = user.usl_username || "unknown";
    setFormWarehouse({
      whs_code: '',
      whs_name: '',
      whs_addr: '',
      whs_capacity: '',
      whs_phone: '',
      whs_created_by: createdBy,
      whs_status: 'active'
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleAddSave = async () => {
    await API.post('/api/warehouses', formWarehouse);
    setIsAdding(false);
    fetchWarehouses();
  };

  const formatDate = (d) => d ? new Date(d).toLocaleString('th-TH') : '-';

  return (
    <div className="px-4 py-8 max-w-screen-2xl mx-auto text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow">
          🏢 Manage Warehouses
        </h2>
        <div className="flex gap-2 items-center">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="h-10 px-4 pr-10 rounded-xl bg-gradient-to-r from-orange-500/30 to-yellow-400/20 border border-orange-300 text-white text-sm font-medium shadow-inner backdrop-blur-sm hover:ring-2 hover:ring-orange-400/60 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-200 ease-in-out"
          >
            <option value="all">All Fields</option>
            {searchFields.map(f => (
              <option key={f.key} value={f.key}>{f.label}</option>
            ))}
          </select>
          <Input
            placeholder="Search warehouses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/30 text-white border border-orange-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          {!editingId && !isAdding && canCreate && (
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
              <th className="p-3">#</th>
              {tableFields.map(f => (
                <th key={f.key} className="p-3 whitespace-nowrap text-left font-semibold">{f.label}</th>
              ))}
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isAdding && (
              <tr className="bg-white/10 border-b border-white/10">
                <td className="p-3">#</td>
                {tableFields.map((f, i) => (
                  <td key={i} className="p-3">
                    {f.readOnly ? formWarehouse[f.key] || '-' : (
                      <Input
                        name={f.key}
                        value={formWarehouse[f.key] || ''}
                        onChange={handleChange}
                        className="bg-black/40 text-white border border-white/20"
                      />
                    )}
                  </td>
                ))}
                <td className="p-3 flex gap-2">
                  <Button size="sm" onClick={handleAddSave} className="bg-green-600 hover:bg-green-500 text-white"><Save className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)} className="text-red-400"><X className="w-4 h-4" /></Button>
                </td>
              </tr>
            )}

            {paginatedWarehouses.map((wh, i) => (
              <tr key={wh.whs_id} className="even:bg-white/5 odd:bg-white/10 hover:bg-orange-100/10 border-b border-white/10">
                <td className="p-3 whitespace-nowrap">{(currentPage - 1) * pageSize + i + 1}</td>
                {tableFields.map((f, idx) => (
                  <td key={idx} className="p-3 whitespace-nowrap">
                    {editingId === wh.whs_id && !f.readOnly ? (
                      <Input
                        name={f.key}
                        value={formWarehouse[f.key] || ''}
                        onChange={handleChange}
                        className="bg-black/40 text-white border border-white/20"
                      />
                    ) : (
                      ['whs_created_at', 'whs_updated_at'].includes(f.key)
                        ? formatDate(wh[f.key])
                        : wh[f.key] || '-'
                    )}
                  </td>
                ))}
                <td className="p-3 whitespace-nowrap">
                  <div className="flex gap-2">
                    {editingId === wh.whs_id ? (
                      <>
                        <Button size="sm" onClick={() => handleSave(wh.whs_id)} className="bg-green-600 hover:bg-green-500 text-white"><Save className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="text-red-400"><X className="w-4 h-4" /></Button>
                      </>
                    ) : (
                      <>
                        {canUpdate && (
                          <Button size="sm" onClick={() => handleEdit(wh)} className="bg-blue-500 hover:bg-blue-400 text-white"><Edit className="w-4 h-4" /></Button>
                        )}
                        {canDelete && (
                          <Button size="sm" onClick={() => handleDelete(wh.whs_id)} className="bg-red-500 hover:bg-red-400 text-white"><Trash2 className="w-4 h-4" /></Button>
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
