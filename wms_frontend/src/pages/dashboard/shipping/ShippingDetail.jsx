// 📄 ShippingDetail.jsx (ปรับให้เหมือน ReceivingDetail แบบเต็ม)

import React from 'react';
import { Card } from '@/components/ui/card';

export default function ShippingDetail({ data }) {
  const formatDate = (d) => (d ? new Date(d).toLocaleString('th-TH') : '-');

  const statusBadge = (status) => {
    const base = 'px-2 py-1 rounded text-xs font-semibold';
    switch (status) {
      case 'pending': return <span className={`${base} bg-yellow-400/20 text-yellow-400`}>Pending</span>;
      case 'in_transit': return <span className={`${base} bg-blue-400/20 text-blue-400`}>In Transit</span>;
      case 'delivered': return <span className={`${base} bg-green-400/20 text-green-400`}>Delivered</span>;
      case 'cancelled': return <span className={`${base} bg-red-400/20 text-red-400`}>Cancelled</span>;
      default: return <span className={base}>{status}</span>;
    }
  };

  if (!data) return <div className="text-white">No data</div>;

  return (
    <div className="text-white">
      <h2 className="text-xl font-bold mb-4">📦 Shipping Detail</h2>

      <Card className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><strong>Shipping Code:</strong> {data.shp_code}</div>
          <div><strong>Customer ID:</strong> {data.shp_customer_id}</div>
          <div><strong>Vehicle No.:</strong> {data.shp_vehicle_no}</div>
          <div><strong>Driver Name:</strong> {data.shp_driver_name}</div>
          <div><strong>Status:</strong> {statusBadge(data.shp_status)}</div>
          <div><strong>Created At:</strong> {formatDate(data.shp_created_at)}</div>
        </div>
      </Card>

      <Card className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <h3 className="text-lg font-semibold mb-2">📋 Shipping Items</h3>
        <table className="w-full text-sm border-collapse">
          <thead className="bg-cyan-700/80">
            <tr>
              <th className="p-2 text-left">Product ID</th>
              <th className="p-2 text-left">Qty</th>
              <th className="p-2 text-left">Unit Price</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Expiry</th>
            </tr>
          </thead>
          <tbody>
            {data.details?.map((item, idx) => (
              <tr key={idx} className="even:bg-white/5 odd:bg-white/10">
                <td className="p-2">{item.shpd_prd_id}</td>
                <td className="p-2">{item.shpd_qty}</td>
                <td className="p-2">{item.shpd_unit_price}</td>
                <td className="p-2">{item.shpd_status}</td>
                <td className="p-2">{item.shpd_expiry_date || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}