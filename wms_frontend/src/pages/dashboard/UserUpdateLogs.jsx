import React, { useEffect, useState } from 'react';
import API from '@/api';
import Pagination from '@/components/Pagination';

export default function UserUpdateLogs() {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await API.get('/api/users/user-update-logs');
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  };

  const totalPages = Math.ceil(logs.length / pageSize);
  const paginatedLogs = logs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="pt-16 px-4 py-6 max-w-screen-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4 text-orange-400">📋 User Update Logs</h1>

      <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-xl shadow">
        <table className="min-w-[900px] w-full text-sm border-collapse">
          <thead className="bg-orange-500/90 text-white sticky top-0 backdrop-blur z-10">
            <tr>
              <th className="p-3 text-left whitespace-nowrap">#</th>
              <th className="p-3 text-left whitespace-nowrap">User ID</th>
              <th className="p-3 text-left whitespace-nowrap">Username</th>
              <th className="p-3 text-left whitespace-nowrap">Updated By</th>
              <th className="p-3 text-left whitespace-nowrap">Note</th>
              <th className="p-3 text-left whitespace-nowrap">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-white/60">ไม่มีประวัติการเปลี่ยนแปลง</td>
              </tr>
            ) : (
              paginatedLogs.map((log, i) => (
                <tr key={log.ulog_id} className="even:bg-white/5 odd:bg-white/10 border-b border-white/10">
                  <td className="p-3">{(currentPage - 1) * pageSize + i + 1}</td>
                  <td className="p-3">{log.ulog_user_id}</td>
                  <td className="p-3">{log.ulog_usl_username}</td>
                  <td className="p-3">{log.ulog_updated_by}</td>
                  <td className="p-3">{log.ulog_note}</td>
                  <td className="p-3 whitespace-nowrap">{new Date(log.ulog_update_time).toLocaleString('th-TH')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
