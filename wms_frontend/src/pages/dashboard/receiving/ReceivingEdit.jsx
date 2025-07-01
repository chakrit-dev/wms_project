import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Save, X } from 'lucide-react';
import API from '@/api';
import ReceivingItemRow from '../../../components/receiving/ReceivingItemRow';
import { Label } from '@/components/ui/label';

export default function ReceivingEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receiving, setReceiving] = useState(null);
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = localStorage.getItem('username') || 'admin';
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          API.get(`/api/receivings/${id}`),
          API.get(`/api/warehouses`)
        ]);
        setReceiving(res1.data);
        setItems(res1.data.details);
        setWarehouses(res2.data);
      } catch (err) {
        console.error(err);
        setError('โหลดข้อมูลไม่สำเร็จ');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceiving(prev => ({
      ...prev,
      [name]: name === 'rcv_whs_id' ? parseInt(value, 10) : value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleSave = async () => {
    if (!receiving.rcv_sender || receiving.rcv_sender.trim() === '') {
      alert('กรุณากรอกชื่อผู้ส่ง (Sender)');
      return;
    }

    const payload = {
      rcv_code: receiving.rcv_code,
      rcv_whs_id: parseInt(receiving.rcv_whs_id),
      rcv_sender: receiving.rcv_sender.trim(),
      rcv_date: receiving.rcv_date?.split('T')[0],
      rcv_status: receiving.rcv_status,
      rcv_updated_by: username,
      details: items
    };

    try {
      await API.put(`/api/receivings/${id}`, payload);

      if (
        payload.rcv_status === 'approved' &&
        permissions.includes('receiving_approve')
      ) {
        await API.post(`/api/receivings/${id}/receive-to-inventory`);
      }

      alert("อัปเดตสำเร็จ");
      navigate("/dashboard/receivings");
    } catch (err) {
      console.error("❌ Error saving:", err);
      alert("เกิดข้อผิดพลาดในการอัปเดต");
    }
  };

  const getStatusOptions = () => {
    const baseOptions = [
      { value: 'draft', label: 'Draft' },
      { value: 'pending', label: 'Pending' },
      { value: 'cancelled', label: 'Cancelled' }
    ];

    // ✅ เพิ่ม Approved เมื่อมีสิทธิ์ และสถานะยังไม่ approved
    if (
      permissions.includes('receiving_approve') &&
      receiving?.rcv_status !== 'approved'
    ) {
      baseOptions.push({ value: 'approved', label: 'Approved' });
    }

    // ✅ Debug log
    console.log('permissions:', permissions);
    console.log('current status:', receiving?.rcv_status);
    console.log('status options:', baseOptions);

    return baseOptions;
  };

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 text-white space-y-6 max-w-screen-xl mx-auto">
      <Card className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-800 space-y-6 shadow-xl rounded-2xl border border-white/10">
        <h2 className="text-3xl font-bold text-lime-300 drop-shadow mb-4">📝 Edit Receiving</h2>

        <div className="grid md:grid-cols-5 gap-6">
          <div>
            <Label className="text-white/80 text-sm mb-1 block">Receiving Code</Label>
            <Input name="rcv_code" value={receiving.rcv_code} onChange={handleChange} />
          </div>

          <div>
            <Label className="text-white/80 text-sm mb-1 block">Sender</Label>
            <Input name="rcv_sender" value={receiving.rcv_sender} onChange={handleChange} />
          </div>

          <div>
            <Label className="text-white/80 text-sm mb-1 block">Receiving Date</Label>
            <Input name="rcv_date" type="date" value={receiving.rcv_date?.split('T')[0] || ''} onChange={handleChange} />
          </div>

          <div>
            <Label className="text-white/80 text-sm mb-1 block">Warehouse</Label>
            <select
              name="rcv_whs_id"
              value={receiving.rcv_whs_id}
              onChange={handleChange}
              className="bg-zinc-800 text-white border border-white/20 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-lime-400"
            >
              <option value="">Select Warehouse</option>
              {warehouses.map(w => (
                <option key={w.whs_id} value={w.whs_id}>{w.whs_name}</option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-white/80 text-sm mb-1 block">Receiving Status</Label>
            {receiving && (
              <select
                name="rcv_status"
                value={receiving.rcv_status}
                onChange={handleChange}
                disabled={receiving.rcv_status === 'approved'}
                className={`bg-zinc-800 text-white border border-white/20 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-lime-400 ${
                  receiving.rcv_status === 'approved' ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {getStatusOptions().map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-800 space-y-4 shadow-xl rounded-2xl border border-white/10">
        <h3 className="text-xl font-bold text-lime-300 mb-2">📦 Product Items</h3>
        <div className="space-y-4">
          {items.map((item, index) => (
            <ReceivingItemRow
              key={index}
              index={index}
              item={item}
              onChange={handleItemChange}
              fieldPrefix="rcvd_"
              disableRemove
            />
          ))}
        </div>
      </Card>

      <div className="flex flex-col md:flex-row gap-4">
        <Button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-lime-500 to-green-500 text-black font-bold py-5 text-lg rounded-xl shadow-xl hover:scale-[1.01] hover:brightness-110 transition"
        >
          <Save className="inline-block mr-2 w-5 h-5" /> Save Changes
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="w-full md:w-auto text-red-400 px-6 py-3 rounded-xl text-lg border border-red-400 hover:bg-red-900/20 transition"
        >
          <X className="inline-block mr-2 w-5 h-5" /> Cancel
        </Button>
      </div>
    </div>
  );
}
