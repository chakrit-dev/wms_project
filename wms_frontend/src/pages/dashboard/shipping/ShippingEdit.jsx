// 📄 ShippingEdit.jsx (ปรับให้เหมือน ReceivingEdit แบบเต็ม)

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '@/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ShippingEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [details, setDetails] = useState([]);

  useEffect(() => {
    API.get(`/api/shippings/${id}`).then((res) => {
      setForm({ ...res.data });
      setDetails(res.data.details || []);
    });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateDetail = (index, key, value) => {
    const updated = [...details];
    updated[index][key] = value;
    setDetails(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.put(`/api/shippings/${id}`, { ...form, details });
    navigate('/dashboard/shipping');
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 text-white">
      <h2 className="text-xl font-bold mb-4">✏️ Edit Shipping - {form.shp_code}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="shp_customer_id" value={form.shp_customer_id || ''} onChange={handleChange} placeholder="Customer ID" required />
          <Input name="shp_vehicle_no" value={form.shp_vehicle_no || ''} onChange={handleChange} placeholder="Vehicle No." required />
          <Input name="shp_driver_name" value={form.shp_driver_name || ''} onChange={handleChange} placeholder="Driver Name" required />
          <select
            name="shp_status"
            value={form.shp_status || 'pending'}
            onChange={handleChange}
            className="bg-black/30 text-white border border-white/20 rounded px-3 py-2"
          >
            <option value="pending">Pending</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">📋 Shipping Items</h3>
          {details.map((item, i) => (
            <Card key={i} className="bg-white/5 border border-white/10 p-4 mb-3 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="Product ID"
                  value={item.shpd_prd_id}
                  onChange={(e) => updateDetail(i, 'shpd_prd_id', e.target.value)}
                />
                <Input
                  placeholder="Quantity"
                  value={item.shpd_qty}
                  type="number"
                  onChange={(e) => updateDetail(i, 'shpd_qty', e.target.value)}
                />
                <Input
                  placeholder="Unit Price"
                  value={item.shpd_unit_price}
                  type="number"
                  onChange={(e) => updateDetail(i, 'shpd_unit_price', e.target.value)}
                />
                <Input
                  placeholder="Status"
                  value={item.shpd_status}
                  onChange={(e) => updateDetail(i, 'shpd_status', e.target.value)}
                />
                <Input
                  placeholder="Expiry Date"
                  type="date"
                  value={item.shpd_expiry_date || ''}
                  onChange={(e) => updateDetail(i, 'shpd_expiry_date', e.target.value)}
                />
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-blue-600">Update Shipping</Button>
        </div>
      </form>
    </div>
  );
}
