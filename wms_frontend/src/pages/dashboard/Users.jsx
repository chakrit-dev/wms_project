import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Edit, Trash2, Save, X, Plus, ThumbsDown } from 'lucide-react';
import API from '@/api';
import Pagination from '@/components/Pagination';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editUser, setEditUser] = useState({});
  const [addUser, setAddUser] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [onlyPending, setOnlyPending] = useState(false);
  const pageSize = 10;

  const userSearchFields = [
    { label: 'ID', key: 'usl_id' },
    { label: 'Username', key: 'usl_username' },
    { label: 'Email', key: 'usl_email' },
    { label: 'Firstname', key: 'usl_firstname' },
    { label: 'Lastname', key: 'usl_lastname' },
    { label: 'Phone', key: 'usl_phone' },
    { label: 'Role', key: 'usl_role' }
  ];

  const fetchUsers = async () => {
    const res = await API.get('/api/users', {
      params: { search_query: searchQuery, search_field: searchField }
    });
    setUsers(res.data);
    setCurrentPage(1);
  };

  useEffect(() => { fetchUsers(); }, []);
  useEffect(() => { fetchUsers(); }, [searchQuery, searchField]);
  useEffect(() => {
    const filtered = onlyPending
      ? users.filter(u => !u.usl_role || u.usl_role === 'pending')
      : users;
    setFilteredUsers(filtered);
  }, [users, onlyPending]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddUser(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (u) => {
    setIsAdding(false);
    setEditingId(u.usl_id);
    setEditUser({
      username: u.usl_username,
      email: u.usl_email,
      role: u.usl_role,
      firstname: u.usl_firstname,
      lastname: u.usl_lastname,
      phone: u.usl_phone,
      password: 'default1234'
    });
  };

  const handleSave = async (id) => {
    await API.put(`/api/users/${id}`, editUser);
    setEditingId(null);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('ยืนยันการลบผู้ใช้นี้?')) return;
    await API.delete(`/api/users/${id}`);
    fetchUsers();
  };

  const handleAdd = () => {
    setEditingId(null);
    setAddUser({ username: '', email: '', firstname: '', lastname: '', phone: '', role: '', password: 'default1234' });
    setIsAdding(true);
  };

  const handleAddSave = async () => {
    const finalPayload = {
      username: addUser.username?.trim(),
      email: addUser.email?.trim(),
      firstname: addUser.firstname?.trim(),
      lastname: addUser.lastname?.trim(),
      phone: addUser.phone?.trim(),
      role: addUser.role,
      password: 'default1234'
    };
    try {
      await API.post('/api/users', finalPayload);
      setIsAdding(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.detail || 'เกิดข้อผิดพลาดในการเพิ่มผู้ใช้');
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('ยืนยันการอนุมัติผู้ใช้นี้?')) return;
    try {
      await API.put(`/api/users/approve/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.detail || 'เกิดข้อผิดพลาดในการอนุมัติ');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการ Reject ผู้ใช้นี้?')) return;
    try {
      await API.delete(`/api/users/reject/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.detail || 'เกิดข้อผิดพลาดในการ Reject');
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleString('th-TH') : '-';
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const handlePageChange = (page) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };

  return (
    <div className="px-4 py-8 max-w-screen-2xl mx-auto text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow">👤 Manage Users</h2>
        <div className="flex gap-2 items-center">
          <select value={searchField} onChange={(e) => setSearchField(e.target.value)} className="h-10 px-4 pr-10 rounded-xl bg-gradient-to-r from-orange-500/30 to-yellow-400/20 border border-orange-300 text-white text-sm font-medium shadow-inner backdrop-blur-sm">
            <option value="all">All Fields</option>
            {userSearchFields.map((f) => (
              <option key={f.key} value={f.key}>{f.label}</option>
            ))}
          </select>
          <Input placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-black/30 text-white border border-orange-400 rounded-md px-4 py-2" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={onlyPending} onChange={(e) => setOnlyPending(e.target.checked)} className="form-checkbox text-orange-400" />
            Only pending
          </label>
          <Button onClick={handleAdd} className="bg-green-500 hover:bg-green-400 text-white font-semibold">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      </div>

      <Card className="bg-white/5 border border-white/10 rounded-2xl shadow-xl overflow-x-auto">
        <table className="w-full text-sm text-white border-collapse">
          <thead className="sticky top-0 bg-orange-500/90 text-white shadow backdrop-blur z-10">
            <tr>
              {['#', 'ID', 'Username', 'Email', 'Firstname', 'Lastname', 'Phone', 'Role', 'Created', 'Updated', 'Actions'].map((head, i) => (
                <th key={i} className="p-3 text-left whitespace-nowrap font-semibold">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isAdding && (
              <tr className="bg-white/10 border-b border-white/10">
                <td className="p-3">#</td>
                <td className="p-3">-</td>
                <td className="p-3"><Input name="username" value={addUser.username || ''} onChange={handleAddChange} /></td>
                <td className="p-3"><Input name="email" value={addUser.email || ''} onChange={handleAddChange} /></td>
                <td className="p-3"><Input name="firstname" value={addUser.firstname || ''} onChange={handleAddChange} /></td>
                <td className="p-3"><Input name="lastname" value={addUser.lastname || ''} onChange={handleAddChange} /></td>
                <td className="p-3"><Input name="phone" value={addUser.phone || ''} onChange={handleAddChange} /></td>
                <td className="p-3">
                  <select name="role" value={addUser.role || ''} onChange={handleAddChange} className="bg-black/40 text-white border border-white/20 rounded-md px-2 py-1 w-full">
                    <option value="">-- select role --</option>
                    <option value="admin">admin</option>
                    <option value="warehouse">warehouse</option>
                    <option value="driver">driver</option>
                    <option value="delivery planning">delivery planning</option>
                  </select>
                </td>
                <td className="p-3">-</td>
                <td className="p-3">-</td>
                <td className="p-3 flex gap-2">
                  <Button size="sm" onClick={handleAddSave} className="bg-green-600 hover:bg-green-500 text-white" disabled={!addUser.username || !addUser.email || !addUser.role}><Save className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)} className="text-red-400"><X className="w-4 h-4" /></Button>
                </td>
              </tr>
            )}
            {paginatedUsers.map((u, i) => (
              <tr key={u.usl_id} className="even:bg-white/5 odd:bg-white/10 hover:bg-orange-100/10 border-b border-white/10">
                <td className="p-3">{(currentPage - 1) * pageSize + i + 1}</td>
                <td className="p-3">{u.usl_id}</td>
                {editingId === u.usl_id ? (
                  <>
                    <td className="p-3"><Input name="username" value={editUser.username} onChange={handleEditChange} /></td>
                    <td className="p-3"><Input name="email" value={editUser.email} onChange={handleEditChange} /></td>
                    <td className="p-3"><Input name="firstname" value={editUser.firstname} onChange={handleEditChange} /></td>
                    <td className="p-3"><Input name="lastname" value={editUser.lastname} onChange={handleEditChange} /></td>
                    <td className="p-3"><Input name="phone" value={editUser.phone} onChange={handleEditChange} /></td>
                    <td className="p-3">
                      <select name="role" value={editUser.role} onChange={handleEditChange} className="bg-black/40 text-white border border-white/20 px-2 py-1 rounded-md">
                        <option value="admin">admin</option>
                        <option value="warehouse">warehouse</option>
                        <option value="driver">driver</option>
                        <option value="delivery planning">delivery planning</option>
                      </select>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{u.usl_username}</td>
                    <td className="p-3">{u.usl_email}</td>
                    <td className="p-3">{u.usl_firstname}</td>
                    <td className="p-3">{u.usl_lastname}</td>
                    <td className="p-3">{u.usl_phone}</td>
                    <td className="p-3">
                      {u.usl_role
                        ? <span className="px-2 py-1 text-xs rounded bg-green-600/20 text-green-400">{u.usl_role}</span>
                        : <span className="px-2 py-1 text-xs rounded bg-yellow-400/20 text-yellow-500">⏳ Pending</span>}
                    </td>
                  </>
                )}
                <td className="p-3">{formatDate(u.usl_created_at)}</td>
                <td className="p-3">{formatDate(u.usl_updated_at)}</td>
                <td className="p-3">
                  <div className="flex gap-2 flex-wrap">
                    {!u.usl_role || u.usl_role === 'pending' ? (
                      <>
                        <Button size="sm" onClick={() => handleApprove(u.usl_id)} className="bg-green-600 hover:bg-green-500 text-white">
                          ✅ Approve ({u.usl_requested_role || '-'})
                        </Button>
                        <Button size="sm" onClick={() => handleReject(u.usl_id)} className="bg-yellow-600 hover:bg-yellow-500 text-white">
                          <ThumbsDown className="w-4 h-4" /> Reject
                        </Button>
                      </>
                    ) : editingId === u.usl_id ? (
                      <>
                        <Button size="sm" onClick={() => handleSave(u.usl_id)} className="bg-green-600 hover:bg-green-500 text-white"><Save className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="text-red-400"><X className="w-4 h-4" /></Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" onClick={() => handleEdit(u)} className="bg-blue-500 hover:bg-blue-400 text-white"><Edit className="w-4 h-4" /></Button>
                        <Button size="sm" onClick={() => handleDelete(u.usl_id)} className="bg-red-500 hover:bg-red-400 text-white"><Trash2 className="w-4 h-4" /></Button>
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
