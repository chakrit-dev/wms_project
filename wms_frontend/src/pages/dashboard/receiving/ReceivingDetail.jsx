import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Loader2 } from 'lucide-react';
import API from '@/api';

export default function ReceivingDetail({ open, onClose, rcvId, onApproved, currentUserPermissions = [] }) {
  const [receiving, setReceiving] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (rcvId && open) {
      setLoading(true);
      API.get(`/api/receivings/${rcvId}`)
        .then(res => setReceiving(res.data))
        .catch(() => setError('❌ Failed to load data'))
        .finally(() => setLoading(false));
    }
  }, [rcvId, open]);

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleString('th-TH', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      : '-';

  const statusBadge = (status) => {
    const colors = {
      draft: 'bg-gray-600',
      pending: 'bg-yellow-500',
      approved: 'bg-purple-600',
      received: 'bg-green-600',
      partially_received: 'bg-blue-500',
      cancelled: 'bg-red-500',
    };
    return (
      <span className={`text-xs px-3 py-1 rounded-full text-white ${colors[status] || 'bg-gray-500'}`}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  const handleApprove = async () => {
    if (!rcvId) return;
    setApproving(true);
    try {
      await API.post(`/api/receivings/${rcvId}/receive-to-inventory`);
      onApproved?.();
      onClose();
    } catch (err) {
      alert(err.response?.data?.detail || '❌ Error approving receiving');
    } finally {
      setApproving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-gradient-to-br from-zinc-900 to-zinc-800 border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-lime-400 text-2xl font-bold">📦 Receiving Detail</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-10">
            <Loader2 className="animate-spin w-6 h-6 mx-auto mb-2" />
            Loading...
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <>
            <Card className="p-4 bg-zinc-800 border border-white/10 rounded-xl shadow">
              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div><b>Code:</b> {receiving.rcv_code}</div>
                <div><b>Date:</b> {formatDate(receiving.rcv_date)}</div>
                <div><b>Status:</b> {statusBadge(receiving.rcv_status)}</div>
                <div><b>Created by:</b> {receiving.rcv_created_by}</div>
                <div><b>Created at:</b> {formatDate(receiving.rcv_created_at)}</div>
              </div>
            </Card>

            <div className="overflow-x-auto mt-6">
              <table className="w-full text-sm border border-white/10 rounded">
                <thead className="bg-lime-700/80 text-white uppercase text-xs">
                  <tr>
                    <th className="py-2 px-4 text-left">#</th>
                    <th className="py-2 px-4 text-left">Product</th>
                    <th className="py-2 px-4 text-left">Qty</th>
                    <th className="py-2 px-4 text-left">Unit</th>
                    <th className="py-2 px-4 text-left">Price</th>
                    <th className="py-2 px-4 text-left">Expiry</th>
                  </tr>
                </thead>
                <tbody>
                  {receiving.details.map((item, i) => (
                    <tr key={i} className="border-t border-white/10 hover:bg-white/5">
                      <td className="py-2 px-4">{i + 1}</td>
                      <td className="py-2 px-4">{item.product?.prd_name}</td>
                      <td className="py-2 px-4">{item.rcvd_qty}</td>
                      <td className="py-2 px-4">{item.rcvd_unit}</td>
                      <td className="py-2 px-4">{item.rcvd_unit_price}</td>
                      <td className="py-2 px-4">{formatDate(item.rcvd_expiry_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {currentUserPermissions.includes('receiving_approve') && receiving.rcv_status === 'approved' && (
              <div className="text-right mt-6">
                <Button
                  onClick={handleApprove}
                  disabled={approving}
                  className="bg-green-600 hover:bg-green-500 text-white font-semibold"
                >
                  {approving ? 'Processing...' : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Approve & Update Inventory
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
