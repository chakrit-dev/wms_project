import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import API from '@/api';
import Pagination from '@/components/Pagination';
import ShippingForm from './ShippingForm';
import ShippingDetail from './ShippingDetail';
import ShippingEdit from './ShippingEdit';

export default function ShippingList() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [field, setField] = useState('shp_code');
  const [selected, setSelected] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [permissions, setPermissions] = useState([]);

  const fetchData = async () => {
    const res = await API.get('/api/shippings', {
      params: { search_query: query, search_field: field }
    });
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
    const user = JSON.parse(localStorage.getItem('user'));
    setPermissions(user?.permissions || []);
  }, []);

  useEffect(() => {
    fetchData();
  }, [query, field]);

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent drop-shadow">
          🚚 Manage Shippings
        </h2>
        <div className="flex gap-2 items-center">
          <select
            className="h-10 px-4 pr-10 rounded-xl bg-gradient-to-r from-blue-500/30 to-cyan-400/20 border border-cyan-300 text-white text-sm font-medium shadow-inner backdrop-blur-sm hover:ring-2 hover:ring-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            value={field}
            onChange={(e) => setField(e.target.value)}
          >
            <option value="shp_code">Shipping Code</option>
            <option value="shp_customer_id">Customer ID</option>
            <option value="shp_vehicle_no">Vehicle</option>
            <option value="shp_driver_name">Driver</option>
            <option value="shp_status">Status</option>
          </select>

          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="bg-black/30 text-white border border-cyan-400 rounded-md px-4 py-2"
          />

          {permissions.includes('shipping_create') && (
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-400 text-white font-semibold">
                  <Plus className="w-4 h-4 mr-1" /> Add Shipping
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl" forceMount>
                <ShippingForm onSuccess={() => { setShowForm(false); fetchData(); }} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.length === 0 && (
          <p className="text-gray-400">No shipping records found.</p>
        )}
        {data.map((item) => (
          <Card key={item.shp_id} className="bg-gradient-to-tr from-blue-900/50 to-cyan-800/40 p-4 rounded-xl shadow-md border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-lg font-semibold text-cyan-300">{item.shp_code}</h3>
                <p className="text-sm text-gray-300">Driver: {item.shp_driver_name} | Vehicle: {item.shp_vehicle_no}</p>
              </div>
              <span className={`text-sm px-3 py-1 rounded-full font-medium shadow
                ${item.shp_status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                  item.shp_status === 'in_transit' ? 'bg-blue-500/20 text-blue-300' :
                  item.shp_status === 'delivered' ? 'bg-green-500/20 text-green-300' :
                  'bg-red-500/20 text-red-300'}`}>
                {item.shp_status}
              </span>
            </div>

            <div className="flex justify-end gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={() => { setSelected(item); setShowDetail(true); }}>
                <Eye className="w-4 h-4 mr-1" /> View
              </Button>
              {permissions.includes('shipping_edit') && (
                <Button size="sm" variant="outline" onClick={() => { setEditItem(item); setShowEdit(true); }}>
                  <Pencil className="w-4 h-4 mr-1" /> Edit
                </Button>
              )}
              {permissions.includes('shipping_delete') && (
                <Button size="sm" variant="destructive">
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Pagination page={page} setPage={setPage} />

      {selected && (
        <Dialog open={showDetail} onOpenChange={setShowDetail}>
          <DialogContent className="max-w-4xl">
            <ShippingDetail shipping={selected} />
          </DialogContent>
        </Dialog>
      )}

      {editItem && (
        <Dialog open={showEdit} onOpenChange={setShowEdit}>
          <DialogContent className="max-w-4xl">
            <ShippingEdit shipping={editItem} onSuccess={() => { setShowEdit(false); fetchData(); }} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
