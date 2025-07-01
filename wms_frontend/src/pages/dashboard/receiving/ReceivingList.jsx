// 📄 ReceivingList.jsx — แบบ X เต็มระบบ ACL
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import API from '@/api';
import Pagination from '@/components/Pagination';
import { useNavigate } from 'react-router-dom';
import ReceivingDetailDialog from './ReceivingDetail';
import { Dialog } from '@/components/ui/dialog';
import ReceivingForm from './ReceivingForm';

export default function ReceivingList() {
  const [receivings, setReceivings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [newDialogOpen, setNewDialogOpen] = useState(false);

  const [formReceiving, setFormReceiving] = useState(null);
  const [formItems, setFormItems] = useState([]);

  const pageSize = 10;
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('username') || 'admin';
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');

  const searchFields = [
    { label: 'Code', key: 'rcv_code' },
    { label: 'Status', key: 'rcv_status' },
    { label: 'Created by', key: 'rcv_created_by' },
  ];

  const fetchReceivings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/api/receivings', {
        params: { search_query: searchQuery, search_field: searchField },
      });
      setReceivings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivings();
  }, [searchQuery, searchField]);

  const handleDelete = async (id, status) => {
    if (!['draft', 'pending', 'cancelled'].includes(status)) return;
    if (!window.confirm('ยืนยันการลบรายการนี้?')) return;
    try {
      await API.delete(`/api/receivings/${id}`);
      fetchReceivings();
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  const statusBadge = (status) => {
    const colors = {
      draft: 'bg-gray-500',
      pending: 'bg-yellow-500',
      partially_received: 'bg-blue-500',
      received: 'bg-green-600',
      cancelled: 'bg-red-500',
      approved: 'bg-purple-600',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full text-white ${colors[status] || 'bg-gray-600'}`}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleString('th-TH', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const paginatedData = receivings.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(receivings.length / pageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleOpenNewDialog = async () => {
    try {
      const res = await API.get('/api/receivings/preview-code');
      setFormReceiving({
        rcv_code: res.data.rcv_code,
        rcv_whs_id: '',
        rcv_status: 'pending',
        rcv_created_by: currentUser,
      });
      setFormItems([]);
      setNewDialogOpen(true);
    } catch (err) {
      console.error('❌ Failed to load preview code:', err);
      alert('เกิดข้อผิดพลาดในการโหลดรหัส');
    }
  };

  return (
    <div className="px-4 py-8 max-w-screen-2xl mx-auto text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-lime-400 to-green-500 bg-clip-text text-transparent drop-shadow">📦 Receiving List</h2>
        <div className="flex gap-2 items-center">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="h-10 px-4 pr-10 rounded-xl bg-gradient-to-r from-green-500/30 to-lime-400/20 border border-lime-300 text-white text-sm font-medium shadow-inner backdrop-blur-sm hover:ring-2 hover:ring-lime-400/60 focus:outline-none focus:ring-2 focus:ring-lime-300"
          >
            <option value="all">All Fields</option>
            {searchFields.map((f) => (
              <option key={f.key} value={f.key}>{f.label}</option>
            ))}
          </select>
          <Input
            placeholder="Search receivings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/30 text-white border border-lime-400 rounded-md px-4 py-2"
          />
          {permissions.includes('receiving_create') && (
            <Button onClick={handleOpenNewDialog} className="bg-green-500 hover:bg-green-400 text-white font-semibold">
              <Plus className="w-4 h-4 mr-1" /> Add New
            </Button>
          )}
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div className="text-center text-white">Loading...</div>
      ) : (
        <Card className="bg-white/5 border border-white/10 rounded-2xl shadow-xl overflow-x-auto">
          <table className="w-full text-sm text-white border-collapse">
            <thead className="sticky top-0 bg-lime-600/90 text-white shadow backdrop-blur z-10">
              <tr>
                {['#', 'Code', 'Date', 'Status', 'Created by', 'Created', 'Updated', 'Actions'].map((head, i) => (
                  <th key={i} className="p-3 text-left whitespace-nowrap font-semibold tracking-wide">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((r, i) => (
                <tr key={r.rcv_id} className="even:bg-white/5 odd:bg-white/10 hover:bg-green-100/10 border-b border-white/10">
                  <td className="p-3 whitespace-nowrap">{(currentPage - 1) * pageSize + i + 1}</td>
                  <td className="p-3 whitespace-nowrap">{r.rcv_code}</td>
                  <td className="p-3 whitespace-nowrap">{formatDate(r.rcv_date)}</td>
                  <td className="p-3 whitespace-nowrap">{statusBadge(r.rcv_status)}</td>
                  <td className="p-3 whitespace-nowrap">{r.rcv_created_by}</td>
                  <td className="p-3 whitespace-nowrap">{formatDate(r.rcv_created_at)}</td>
                  <td className="p-3 whitespace-nowrap">{formatDate(r.rcv_updated_at)}</td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      {permissions.includes('receiving_view') && (
                        <Button size="sm" onClick={() => { setSelectedId(r.rcv_id); setDialogOpen(true); }} className="bg-sky-600 hover:bg-sky-500 text-white">
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      {permissions.includes('receiving_update') && ['draft', 'pending'].includes(r.rcv_status) && (
                        <Button size="sm" onClick={() => navigate(`/dashboard/receivings/${r.rcv_id}/edit`)} className="bg-yellow-500 hover:bg-yellow-400 text-white">
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {permissions.includes('receiving_delete') && ['draft', 'pending', 'cancelled'].includes(r.rcv_status) && (
                        <Button size="sm" onClick={() => handleDelete(r.rcv_id, r.rcv_status)} className="bg-red-500 hover:bg-red-400 text-white">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      {/* Dialog: View */}
      {selectedId && (
        <ReceivingDetailDialog
          open={dialogOpen}
          rcvId={selectedId}
          onClose={() => setDialogOpen(false)}
          onApproved={fetchReceivings}
          currentUserPermissions={permissions}
        />
      )}

      {/* Dialog: Add New */}
      <Dialog open={newDialogOpen} onOpenChange={(open) => {
        setNewDialogOpen(open);
        if (!open) {
          setFormReceiving(null);
          setFormItems([]);
        }
      }}>
        {formReceiving && (
          <ReceivingForm
            onSuccess={async () => {
              setNewDialogOpen(false);
              await fetchReceivings();
              try {
                const res = await API.get('/api/receivings/preview-code');
                setFormReceiving({
                  rcv_code: res.data.rcv_code,
                  rcv_whs_id: '',
                  rcv_status: 'pending',
                  rcv_created_by: currentUser
                });
                setFormItems([]);
              } catch (err) {
                console.error('❌ Failed to reload preview code:', err);
              }
            }}
            setOpen={setNewDialogOpen}
            currentUser={currentUser}
            receiving={formReceiving}
            setReceiving={setFormReceiving}
            items={formItems}
            setItems={setFormItems}
            currentUserPermissions={permissions}
          />
        )}
      </Dialog>
    </div>
  );
}
