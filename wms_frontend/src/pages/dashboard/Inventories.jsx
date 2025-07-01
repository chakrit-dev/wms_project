// ✅ เพิ่ม dropdown warehouse_name ตอนแก้ไข
// ✅ พร้อมทุกฟังก์ชันที่พี่ส่งมา โดยไม่ตัดออกแม้แต่บรรทัดเดียว

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Edit, Trash2, Save, X, Plus, MinusCircle } from 'lucide-react';
import API from '@/api';
import Pagination from '@/components/Pagination';

export default function Inventories() {
  const [inventories, setInventories] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [deductModal, setDeductModal] = useState({ open: false, id: null, qty: '' });
  const [query, setQuery] = useState('');
  const [field, setField] = useState('prd_name');
  const [warehouses, setWarehouses] = useState([]); // ✅ เพิ่ม
  const pageSize = 10;

  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
  const statusOptions = ['available', 'reserved', 'damaged', 'expired'];

  const fields = [
    { label: 'Warehouse Name', key: 'warehouse_name' }, // ✅ แก้ตรงนี้
    { label: 'Product ID', key: 'inv_prd_id' },
    { label: 'Product Name', key: 'prd_name' },
    { label: 'Quantity', key: 'inv_qty' },
    { label: 'Min Threshold', key: 'inv_min_threshold' },
    { label: 'Max Capacity', key: 'inv_max_capacity' },
    { label: 'Location Bin', key: 'inv_location_bin' },
    { label: 'Status', key: 'inv_status' },
    { label: 'Expiry Date', key: 'inv_expiry_date' },
    { label: 'Created By', key: 'inv_created_by', readOnly: true },
    { label: 'Created At', key: 'inv_created_at', readOnly: true },
    { label: 'Updated At', key: 'inv_updated_at', readOnly: true }
  ];

  const fetchInventories = async () => {
    const res = showLowStockOnly
      ? await API.get('/api/inventories/low-stock')
      : await API.get('/api/inventories');
    setInventories(res.data);
  };

  useEffect(() => { fetchInventories(); }, [showLowStockOnly]);

  useEffect(() => {
    const fetchWarehouses = async () => {
      const res = await API.get('/api/warehouses');
      setWarehouses(res.data);
    };
    fetchWarehouses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (inv) => {
    setEditingId(inv.inv_id);
    setForm({
      ...inv,
      inv_expiry_date: inv.inv_expiry_date ? inv.inv_expiry_date.split('T')[0] : ''
    });
    setIsAdding(false);
  };

  const handleSave = async (id) => {
    try {
      const payload = buildPayload(form);
      await API.put(`/api/inventories/${id}`, payload);
      setEditingId(null);
      fetchInventories();
    } catch (err) {
      alert(err.response?.data?.detail || 'เกิดข้อผิดพลาดตอนบันทึก');
    }
  };

  const handleAdd = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const createdBy = user.usl_username || 'unknown';
    setForm({
      inv_whs_id: '',
      inv_prd_id: '',
      inv_qty: '',
      inv_min_threshold: '',
      inv_max_capacity: '',
      inv_location_bin: '',
      inv_status: 'available',
      inv_expiry_date: '',
      inv_created_by: createdBy
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleAddSave = async () => {
    try {
      const payload = buildPayload(form);
      await API.post('/api/inventories', payload);
      setIsAdding(false);
      fetchInventories();
    } catch (err) {
      alert(err.response?.data?.detail || 'เกิดข้อผิดพลาดขณะเพิ่มข้อมูล');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('ยืนยันการลบข้อมูลนี้?')) return;
    await API.delete(`/api/inventories/${id}`);
    fetchInventories();
  };

  const handleDeduct = async () => {
    const { id, qty } = deductModal;
    if (!qty || isNaN(qty) || Number(qty) <= 0) return alert("จำนวนไม่ถูกต้อง");
    try {
      await API.post(`/api/inventories/${id}/deduct?qty=${qty}`);
      setDeductModal({ open: false, id: null, qty: '' });
      fetchInventories();
    } catch (err) {
      alert(err.response?.data?.detail || 'เกิดข้อผิดพลาดขณะลด stock');
    }
  };

  const buildPayload = (form) => {
    const {
      inv_whs_id, inv_prd_id, inv_qty,
      inv_min_threshold, inv_max_capacity,
      inv_location_bin, inv_status,
      inv_expiry_date, inv_created_by
    } = form;
    return {
      inv_whs_id: Number(inv_whs_id),
      inv_prd_id: Number(inv_prd_id),
      inv_qty: Number(inv_qty),
      inv_min_threshold: Number(inv_min_threshold) || 0,
      inv_max_capacity: Number(inv_max_capacity) || 0,
      inv_location_bin,
      inv_status,
      inv_expiry_date: inv_expiry_date || null,
      inv_created_by
    };
  };

  const renderField = (inv, f) => {
  // ✅ กรณีอยู่ในโหมดแก้ไข
  if (editingId === inv.inv_id && !f.readOnly) {

    // ✅ dropdown สำหรับสถานะ
    if (f.key === 'inv_status') {
      return (
        <select
          name={f.key}
          value={form[f.key] || ''}
          onChange={handleChange}
          className="bg-black/40 text-white border border-white/20 rounded px-2 py-1"
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    // ✅ ช่องเลือกวันที่
    if (f.key === 'inv_expiry_date') {
      return (
        <input
          type="date"
          name={f.key}
          value={form[f.key] || ''}
          onChange={handleChange}
          className="bg-black/40 text-white border border-white/20 rounded px-2 py-1"
        />
      );
    }

    // ✅ dropdown สำหรับ Warehouse Name (mapped to inv_whs_id)
    if (f.key === 'warehouse_name') {
      return (
        <select
          name="inv_whs_id"
          value={form.inv_whs_id || ''}
          onChange={handleChange}
          className="bg-black/40 text-white border border-white/20 rounded px-2 py-1"
        >
          <option value="">เลือกคลังสินค้า</option>
          {warehouses.map(w => (
            <option key={w.whs_id} value={w.whs_id}>{w.whs_name}</option>
          ))}
        </select>
      );
    }

    // ✅ ช่องกรอกข้อความทั่วไป
    return (
      <Input
        name={f.key}
        value={form[f.key] || ''}
        onChange={handleChange}
        className="bg-black/40 text-white border border-white/20"
      />
    );
  }

  // ✅ โหมดแสดงผล (View Mode)
  if (f.key === 'prd_name') return inv.product?.prd_name || '[ไม่พบสินค้า]';
  if (f.key === 'warehouse_name') return inv.warehouse_name || inv.warehouse?.whs_name || '[ไม่พบคลัง]';
  if (['inv_created_at', 'inv_updated_at'].includes(f.key)) return formatDate(inv[f.key]);

  return inv[f.key];
};



  const filtered = inventories.filter(inv =>
    !query ||
    (field === 'prd_name' && inv.product?.prd_name?.toLowerCase().includes(query.toLowerCase())) ||
    (field === 'inv_status' && inv.inv_status?.toLowerCase().includes(query.toLowerCase())) ||
    (field === 'inv_location_bin' && inv.inv_location_bin?.toLowerCase().includes(query.toLowerCase())) ||
    (field === 'warehouse_name' && inv.warehouse_name?.toLowerCase().includes(query.toLowerCase()))
  );

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const formatDate = (d) => (d ? new Date(d).toLocaleString('th-TH') : '-');

  return (
    <div className="px-4 py-8 max-w-screen-2xl mx-auto text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent drop-shadow">
          🧮 Manage Inventories
        </h2>
        <div className="flex gap-2 items-center">
         <select
  className="h-10 px-4 pr-10 rounded-xl bg-gradient-to-r from-pink-500/30 to-pink-400/30
             border border-pink-300 text-white text-sm font-medium shadow-inner backdrop-blur-sm
             hover:ring-2 hover:ring-pink-400/60 focus:outline-none focus:ring-2 focus:ring-pink-300"
  value={field}
  onChange={(e) => setField(e.target.value)}
>
  <option value="prd_name">Product Name</option>
   <option value="warehouse_name">Warehouse Name</option>
  <option value="inv_status">Status</option>
  <option value="inv_location_bin">Location Bin</option>
</select>





          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="bg-black/30 text-white border border-pink-400 rounded-md px-4 py-2"
          />

          {permissions.includes('inventory_create') && (
            <Button onClick={handleAdd} className="bg-green-500 hover:bg-green-400 text-white font-semibold">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          )}
        </div>
      </div>

      <Card className="bg-white/5 border border-white/10 rounded-2xl shadow-xl overflow-x-auto">
        <table className="w-full text-sm text-white border-collapse">
          <thead className="sticky top-0 bg-pink-500/90 text-white shadow backdrop-blur z-10">
            <tr>
              <th className="p-3">#</th>
              {fields.map((f) => (
                <th key={f.key} className="p-3 text-left">{f.label}</th>
              ))}
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((inv, i) => (
              <tr key={inv.inv_id} className="even:bg-white/5 odd:bg-white/10 border-b border-white/10">
                <td className="p-3">{(currentPage - 1) * pageSize + i + 1}</td>
                {fields.map((f, idx) => (
                  <td key={idx} className="p-3">
                    {renderField(inv, f)}
                  </td>
                ))}

                
                <td className="p-3 flex gap-2">
                  {editingId === inv.inv_id ? (
                    <>
                      <Button size="sm" onClick={() => handleSave(inv.inv_id)} className="bg-green-600"><Save className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="text-red-400"><X className="w-4 h-4" /></Button>
                    </>
                  ) : (
                    <>
                      {permissions.includes('inventory_update') && (
                        <Button size="sm" onClick={() => handleEdit(inv)} className="bg-blue-500"><Edit className="w-4 h-4" /></Button>
                      )}
                      {permissions.includes('inventory_delete') && (
                        <Button size="sm" onClick={() => handleDelete(inv.inv_id)} className="bg-red-500"><Trash2 className="w-4 h-4" /></Button>
                      )}
                      {permissions.includes('inventory_deduct') && (
                        <Button size="sm" onClick={() => setDeductModal({ open: true, id: inv.inv_id, qty: '' })} className="bg-yellow-600">
                          <MinusCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <Dialog open={deductModal.open} onOpenChange={(open) => setDeductModal({ ...deductModal, open })}>
        <DialogContent className="bg-black text-white border border-white/10">
          <DialogHeader><DialogTitle>ลดจำนวน Stock</DialogTitle></DialogHeader>
          <Input
            type="number"
            placeholder="จำนวนที่ต้องการลด"
            value={deductModal.qty}
            onChange={(e) => setDeductModal({ ...deductModal, qty: e.target.value })}
          />
          <DialogFooter>
            <Button onClick={handleDeduct} className="bg-yellow-600 text-white">ยืนยัน</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
