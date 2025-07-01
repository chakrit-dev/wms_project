import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import API from '@/api';

export default function ShippingForm({ onSuccess }) {
  const [form, setForm] = useState({
    shp_code: '',
    shp_customer_id: '',
    shp_vehicle_no: '',
    shp_driver_name: '',
    shp_status: 'pending',
  });

  const [details, setDetails] = useState([]);

  useEffect(() => {
    API.get('/api/shippings/generate-code').then(res => {
      console.log('✅ Generated Code:', res.data.shp_code); // debug
      setForm((prev) => ({ ...prev, shp_code: res.data.shp_code }));
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addDetail = () => {
    setDetails([...details, {
      shpd_prd_id: '',
      shpd_qty: '',
      shpd_unit_price: '',
      shpd_status: '',
      shpd_expiry_date: ''
    }]);
  };

  const updateDetail = (index, key, value) => {
    const updated = [...details];
    updated[index][key] = value;
    setDetails(updated);
  };

  const removeDetail = (index) => {
    const updated = [...details];
    updated.splice(index, 1);
    setDetails(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/api/shippings', { ...form, details });
    onSuccess();
  };

  return (
    <div className="text-white">
      <h2 className="text-xl font-bold mb-4">🚚 New Shipping</h2>

      {/* fallback แสดง code ด้านบน */}
      <p className="text-yellow-300 font-mono mb-2">Generated Code: {form.shp_code || '...'}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="shp_code"
            value={form.shp_code}
            readOnly
            disabled
            className="bg-white/10 text-yellow-300 font-bold"
          />
          <Input
            name="shp_customer_id"
            value={form.shp_customer_id}
            onChange={handleChange}
            placeholder="Customer ID"
            required
          />
          <Input
            name="shp_vehicle_no"
            value={form.shp_vehicle_no}
            onChange={handleChange}
            placeholder="Vehicle No."
            required
          />
          <Input
            name="shp_driver_name"
            value={form.shp_driver_name}
            onChange={handleChange}
            placeholder="Driver Name"
            required
          />
          <select
            name="shp_status"
            value={form.shp_status}
            onChange={handleChange}
            className="bg-black/30 text-white border border-white/20 rounded px-3 py-2"
          >
            <option value="pending">Pending</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="pt-6">
          <h3 className="text-lg font-semibold mb-2">📦 Shipping Items</h3>
          <Button type="button" onClick={addDetail} className="mb-2 bg-blue-500">
            + Add Item
          </Button>
          <div className="space-y-3">
            {details.map((item, i) => (
              <Card key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Product ID"
                    value={item.shpd_prd_id}
                    onChange={(e) => updateDetail(i, 'shpd_prd_id', e.target.value)}
                  />
                  <Input
                    placeholder="Quantity"
                    type="number"
                    value={item.shpd_qty}
                    onChange={(e) => updateDetail(i, 'shpd_qty', e.target.value)}
                  />
                  <Input
                    placeholder="Unit Price"
                    type="number"
                    value={item.shpd_unit_price}
                    onChange={(e) => updateDetail(i, 'shpd_unit_price', e.target.value)}
                  />
                  <Input
                    placeholder="Status"
                    value={item.shpd_status}
                    onChange={(e) => updateDetail(i, 'shpd_status', e.target.value)}
                  />
                  <Input
                    type="date"
                    value={item.shpd_expiry_date || ''}
                    onChange={(e) => updateDetail(i, 'shpd_expiry_date', e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => removeDetail(i)}
                  className="mt-2 bg-red-600"
                >
                  Remove
                </Button>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button type="submit" className="bg-green-600">Create Shipping</Button>
        </div>
      </form>
    </div>
  );
}
