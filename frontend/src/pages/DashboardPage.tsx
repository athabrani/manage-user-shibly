import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler 
} from 'chart.js';
import { Users, UserPlus, TrendingUp, MapPin, Calendar, Smartphone, CreditCard } from 'lucide-react';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Komponen Widget Kecil (Biarkan sama)
const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
    </div>
    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(res => setStats(res.data)).catch(console.error);
  }, []);

  if (!stats) return <div className="p-10 text-center text-gray-500">Memuat Dashboard...</div>;

  const chartData = {
    labels: stats.graph.map((d: any) => d.time),
    datasets: [{
      label: 'New Members',
      data: stats.graph.map((d: any) => d.count),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointRadius: 3,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Agar grafik menyesuaikan tinggi container
    plugins: { legend: { display: false } },
    scales: { 
      y: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { stepSize: 1 } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="space-y-6 pb-10">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Anggota" value={stats.total} icon={Users} color="bg-blue-500 shadow-blue-200" />
        <StatCard title="Pendaftaran Hari Ini" value={stats.today} icon={UserPlus} color="bg-emerald-500 shadow-emerald-200" />
        <StatCard title="Pertumbuhan (30m)" value={`+${stats.graph.reduce((a:any, b:any) => a + b.count, 0)}`} icon={TrendingUp} color="bg-purple-500 shadow-purple-200" />
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-80">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Aktivitas Pendaftaran Live</h3>
        </div>
        <div className="h-60 w-full">
          <Line options={chartOptions} data={chartData} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">5 Pendaftar Terakhir</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">Nama Anggota</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">Kontak</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">Domisili</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-right">Waktu Daftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.latestMembers?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-400 text-sm">Belum ada data pendaftaran terbaru.</td>
                </tr>
              ) : (
                stats.latestMembers?.map((m: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                          {m.name.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{m.name}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                             <CreditCard size={12} /> {m.ktp}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Smartphone size={16} className="text-gray-400" />
                        {m.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2 text-sm text-gray-600 max-w-xs">
                        <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                        <span className="line-clamp-2" title={m.fullAddress || '-'}>
                          {m.fullAddress || <span className="text-gray-400 italic">Alamat tidak lengkap</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-xs text-gray-500">
                        <Calendar size={14} />
                        {/* Format tanggal sederhana */}
                        {new Date(m.createdAt).toLocaleString('id-ID', { 
                          day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' 
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}