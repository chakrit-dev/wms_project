// 📄 ReceivingForm.jsx — แบบ X + ACL
import React, { useEffect, useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Save, X } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import API from '@/api';

export default function ReceivingForm({
  onSuccess, setOpen, currentUser,
  receiving, setReceiving,
  items, setItems
}) {
  const [warehouses, setWarehouses] = useState([]);
  const unitOptions = ['pcs', 'box', 'kg', 'set', 'dozen'];
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');

  useEffect(() => {
    API.get('/api/warehouses')
      .then(res => setWarehouses(res.data))
      .catch(err => console.error('Failed to load warehouses', err));
  }, []);

  if (!receiving) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([...items, {
      rcvd_prd_id: '',
      rcvd_qty: '',
      rcvd_unit_price: '',
      rcvd_expiry_date: '',
      rcvd_unit: 'pcs',
    }]);
  };

  const handleRemoveItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleSubmit = async () => {
    try {
      if (!receiving.rcv_whs_id || items.length === 0) {
        alert('กรุณากรอกข้อมูลให้ครบ');
        return;
      }

      const transformed = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const prdId = parseInt(item.rcvd_prd_id, 10);
        const qty = parseInt(item.rcvd_qty, 10);
        const price = parseFloat(item.rcvd_unit_price);

        if (isNaN(prdId) || isNaN(qty) || isNaN(price)) {
          alert(`❌ ข้อมูลไม่ถูกต้องในรายการที่ ${i + 1}`);
          return;
        }

        transformed.push({
          rcvd_prd_id: prdId,
          rcvd_qty: qty,
          rcvd_unit_price: price,
          rcvd_unit: item.rcvd_unit,
          rcvd_expiry_date: item.rcvd_expiry_date || null,
        });
      }

      const payload = {
        rcv_whs_id: receiving.rcv_whs_id,
        rcv_status: receiving.rcv_status,
        rcv_created_by: receiving.rcv_created_by,
        details: transformed,
      };

      const res = await API.post("/api/receivings", payload);

      if (
        res.data.rcv_status === "approved" &&
        permissions.includes("receiving_approve")
      ) {
        await API.post(`/api/receivings/${res.data.rcv_id}/receive-to-inventory`);
      }

      alert(`บันทึกสำเร็จ 🎉 \nรหัส: ${res.data.rcv_code}`);
      setReceiving(prev => ({ ...prev, rcv_code: res.data.rcv_code }));
      setTimeout(() => setOpen(false), 500);
      onSuccess?.();
    } catch (err) {
      console.error("🔥 Submit error:", err);
      alert(err.message || "เกิดข้อผิดพลาด");
    }
  };

  const renderStatusOptions = () => {
    const base = [
      { value: 'pending', label: 'Pending' },
      { value: 'cancelled', label: 'Cancelled' },
    ];
    if (permissions.includes('receiving_approve')) {
      base.unshift({ value: 'approved', label: '✅ Approved' });
    }
    return base;
  };

  return (
    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-zinc-900 to-zinc-800 text-white border border-white/10">
      <DialogHeader>
        <DialogTitle className="text-lime-300 text-2xl mb-2">📅 New Receiving</DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="rcv_code"
          placeholder="Receiving Code"
          value={receiving.rcv_code}
          readOnly
          className={`bg-zinc-800 border border-white/20 ${receiving.rcv_code ? 'text-white' : 'text-gray-400 italic'}`}
        />
        <Input
          name="rcv_created_by"
          placeholder="Created by"
          value={receiving.rcv_created_by}
          readOnly
          disabled
          className="bg-zinc-800 text-gray-400 border border-white/20"
        />
        <Select
          value={String(receiving.rcv_whs_id)}
          onValueChange={(value) => setReceiving({ ...receiving, rcv_whs_id: parseInt(value, 10) })}
        >
          <SelectTrigger className="bg-zinc-800 border border-white/20 text-white">
            <SelectValue placeholder="Select Warehouse" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 text-white border border-white/20">
            {warehouses.map((w) => (
              <SelectItem key={w.whs_id} value={String(w.whs_id)}>
                {w.whs_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={receiving.rcv_status}
          onValueChange={(value) => setReceiving({ ...receiving, rcv_status: value })}
        >
          <SelectTrigger className="bg-zinc-800 border border-white/20 text-white">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 text-white border border-white/20">
            {renderStatusOptions().map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold text-lime-300">📦 Product Items</h3>
          <Button onClick={handleAddItem} size="sm" className="bg-lime-500 hover:bg-lime-400 text-black">
            <Plus className="w-4 h-4 mr-1" /> Add Product
          </Button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-3 bg-zinc-900/50 p-4 rounded-xl border border-white/10 items-center">
              <Input
                placeholder="Product ID"
                value={item.rcvd_prd_id}
                onChange={(e) => handleItemChange(index, 'rcvd_prd_id', e.target.value)}
                className="bg-zinc-800 text-white border border-white/20"
              />
              <Input
                type="number"
                placeholder="Qty"
                value={item.rcvd_qty}
                onChange={(e) => handleItemChange(index, 'rcvd_qty', e.target.value)}
                className="bg-zinc-800 text-white border border-white/20"
              />
              <Select
                value={item.rcvd_unit}
                onValueChange={(value) => handleItemChange(index, 'rcvd_unit', value)}
              >
                <SelectTrigger className="bg-zinc-800 text-white border border-white/20">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 text-white border border-white/20">
                  {unitOptions.map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Unit Price"
                value={item.rcvd_unit_price}
                onChange={(e) => handleItemChange(index, 'rcvd_unit_price', e.target.value)}
                className="bg-zinc-800 text-white border border-white/20"
              />
              <Input
                type="date"
                value={item.rcvd_expiry_date}
                onChange={(e) => handleItemChange(index, 'rcvd_expiry_date', e.target.value)}
                className="bg-zinc-800 text-white border border-white/20"
              />
              <Button onClick={() => handleRemoveItem(index)} variant="destructive" className="text-white">
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-6 gap-3">
        <Button
          variant="outline"
          onClick={() => setOpen(false)}
          className="border-white/30 text-white"
        >
          <X className="w-4 h-4 mr-1" /> Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!receiving.rcv_whs_id || items.length === 0}
          className="bg-gradient-to-r from-lime-500 to-green-500 text-black font-bold hover:scale-[1.01] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4 mr-1" /> Save
        </Button>
      </div>
    </DialogContent>
  );
}
