import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import {
  Loader2, MapPin, Truck, Users, Boxes,
  ClipboardList, Building2, PackageSearch
} from 'lucide-react';
import API from '@/api';

export default function Summary() {
  const [summary, setSummary] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, movRes] = await Promise.all([
          API.get('/api/dashboard/summary'),
          API.get('/api/dashboard/movements')
        ]);
        setSummary(sumRes.data);
        setMovements(movRes.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-yellow-400">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTitle>เกิดข้อผิดพลาดในการโหลดข้อมูล</AlertTitle>
        ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่ภายหลัง
      </Alert>
    );
  }

  const summaryCards = [
    { icon: <Boxes className="text-green-400" />, label: 'Total Products', value: summary.totalProducts, to: '/dashboard/products', permission: 'view_product' },
    { icon: <Users className="text-blue-400" />, label: 'Users', value: summary.totalUsers, to: '/dashboard/users', permission: 'view_user' },
    { icon: <Truck className="text-yellow-400" />, label: 'Deliveries Today', value: summary.deliveriesToday, permission: 'view_delivery' },
    { icon: <PackageSearch className="text-red-400" />, label: 'Pending Deliveries', value: summary.pendingDeliveries, permission: 'view_delivery' },
    { icon: <Building2 className="text-indigo-400" />, label: 'Total Customers', value: summary.totalCustomers, permission: 'view_customer' },
    { icon: <ClipboardList className="text-pink-400" />, label: 'Total Orders', value: summary.totalOrders, permission: 'view_order' }
  ];

  return (
    <div className="animate-fadeIn p-6 max-w-screen-xl mx-auto space-y-10 text-white">
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out both;
        }
      `}</style>

      {/* 🟡 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaryCards
          .filter(item => permissions.includes(item.permission))
          .map((item, idx) => (
            <Card
              key={idx}
              onClick={() => item.to && navigate(item.to)}
              className="bg-white/5 hover:bg-white/10 backdrop-blur-sm ring-1 ring-white/10 px-4 py-3 flex items-center gap-4 cursor-pointer transition-all duration-300 hover:scale-105 rounded-lg shadow-sm"
            >
              <div className="text-2xl">{item.icon}</div>
              <div className="space-y-1">
                <div className="text-sm text-slate-400 font-medium">{item.label}</div>
                <div className="text-lg font-bold text-white">{item.value}</div>
              </div>
            </Card>
        ))}
      </div>

      {/* 🟡 Movement History Table (เฉพาะคนมีสิทธิ์ view_inventory หรือ view_product) */}
      {(permissions.includes("inventory_view") || permissions.includes("product_view")) && (
        <div className="space-y-3">
          <h2 className="text-yellow-400 text-lg font-semibold flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            การเคลื่อนไหวสินค้า
          </h2>
          <Card className="bg-slate-800/80 backdrop-blur border border-slate-700 p-0 overflow-x-auto rounded-lg">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-700/80 backdrop-blur text-yellow-300 shadow z-10">
                <tr>
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">สินค้า</th>
                  <th className="p-2 text-left">คลัง</th>
                  <th className="p-2 text-left">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {movements.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-300">
                      ไม่มีการเคลื่อนไหวในวันนี้
                    </td>
                  </tr>
                ) : (
                  movements.map((m, i) => (
                    <tr
                      key={i}
                      className={`border-t border-slate-700 ${
                        i % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-800/40'
                      } hover:bg-yellow-100/10 transition`}
                    >
                      <td className="p-2">{i + 1}</td>
                      <td className="p-2">{m.product}</td>
                      <td className="p-2">{m.warehouse}</td>
                      <td className="p-2">{m.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* 🟡 Map Section (เฉพาะคนที่มีสิทธิ์ view_delivery หรือ view_route) */}
      {(permissions.includes("delivery_view") || permissions.includes("route_view")) && (
        <div className="space-y-3">
          <h2 className="text-yellow-400 text-lg font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            แผนที่จัดส่งวันนี้
          </h2>
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-400/10 h-72 flex items-center justify-center text-slate-400 rounded-xl shadow-inner">
            [Google Map หรือ NetworkX Map]
          </Card>
        </div>
      )}
    </div>
  );
}
