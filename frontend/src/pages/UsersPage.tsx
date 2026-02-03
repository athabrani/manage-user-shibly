import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Search, Plus, Trash2, Pencil, X, Save, AlertCircle } from 'lucide-react';
import { Badge } from '../components/ui/badge'; 
import { format } from 'date-fns';

// Interface Data Wilayah
interface Region { code: string; name: string; }

export default function Users() {
  const [users, setUsers] = useState<any[]>([]); // Pastikan tipe array
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // STATE BARU: PENCARIAN
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'ADMIN_PROVINSI',
    provinceCode: '',
    regencyCode: '',
    districtCode: '',
    villageCode: ''
  });

  // Wilayah State
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [regencies, setRegencies] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [villages, setVillages] = useState<Region[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchUsers(); }, []);

  // --- LOGIC SEARCH (FILTERING) ---
  // Kita filter users berdasarkan Username ATAU Role ATAU Region Code
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.username.toLowerCase().includes(query) ||
      user.role.toLowerCase().replace('_', ' ').includes(query) ||
      (user.regionCode && user.regionCode.includes(query))
    );
  });

  // --- WILAYAH EFFECTS ---
  useEffect(() => {
    if (showModal) {
        api.get('/regions').then(res => setProvinces(res.data));
    }
  }, [showModal]);

  useEffect(() => {
    if (form.provinceCode) api.get(`/regions?parentCode=${form.provinceCode}`).then(res => setRegencies(res.data));
    else setRegencies([]);
  }, [form.provinceCode]);

  useEffect(() => {
    if (form.regencyCode) api.get(`/regions?parentCode=${form.regencyCode}`).then(res => setDistricts(res.data));
    else setDistricts([]);
  }, [form.regencyCode]);

  useEffect(() => {
    if (form.districtCode) api.get(`/regions?parentCode=${form.districtCode}`).then(res => setVillages(res.data));
    else setVillages([]);
  }, [form.districtCode]);

  // --- HANDLERS ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalRegionCode = '';
    if (form.role === 'ADMIN_PROVINSI') finalRegionCode = form.provinceCode;
    else if (form.role === 'ADMIN_KABUPATEN') finalRegionCode = form.regencyCode;
    else if (form.role === 'ADMIN_KECAMATAN') finalRegionCode = form.districtCode;
    else if (form.role === 'ADMIN_KELURAHAN') finalRegionCode = form.villageCode;

    if (!finalRegionCode) {
        alert("Silahkan pilih wilayah kerja sesuai tingkatan!");
        return;
    }

    const payload = {
        username: form.username,
        password: form.password, 
        role: form.role,
        regionCode: finalRegionCode
    };

    try {
      if (isEditing && editId) {
        await api.put(`/users/${editId}`, payload);
      } else {
        await api.post('/users', payload);
      }
      closeModal();
      fetchUsers();
    } catch (error) { alert('Gagal menyimpan data user'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah anda yakin ingin menghapus akses user ini?')) return;
    try {
        await api.delete(`/users/${id}`);
        fetchUsers();
    } catch (error) { alert("Gagal menghapus user"); }
  };

  const openEditModal = (user: any) => {
    setIsEditing(true);
    setEditId(user.id);
    setForm({
        username: user.username,
        password: '',
        role: user.role,
        provinceCode: '', regencyCode: '', districtCode: '', villageCode: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditId(null);
    setForm({ username: '', password: '', role: 'ADMIN_PROVINSI', provinceCode: '', regencyCode: '', districtCode: '', villageCode: '' });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          {/* INPUT SEARCH YANG SUDAH DIHUBUNGKAN */}
          <input 
            type="text" 
            placeholder="Cari user / role..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-200">
            <Plus size={16} /> Tambah User
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User Info</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Wilayah Kerja</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Dibuat</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {/* TAMPILKAN PESAN JIKA HASIL PENCARIAN KOSONG */}
            {filteredUsers.length === 0 ? (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                            <AlertCircle size={24} className="text-gray-400"/>
                            <p>User tidak ditemukan.</p>
                        </div>
                    </td>
                </tr>
            ) : (
                /* GUNAKAN filteredUsers UNTUK MAPPING */
                filteredUsers.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                            {u.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{u.username}</p>
                            <p className="text-xs text-gray-500">ID: {u.id}</p>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4">
                    <Badge variant="primary">{u.role.replace('ADMIN_', '')}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                    {u.regionCode || 'PUSAT'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(u.createdAt), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(u)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(u.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                            <Trash2 size={16} />
                        </button>
                    </div>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM (TETAP SAMA) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">{isEditing ? 'Ubah Data User' : 'Tambah User Baru'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">Username</label>
                    <input required className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                           value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">Password {isEditing && '(Opsional)'}</label>
                    <input type="password" required={!isEditing}
                           className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                           placeholder={isEditing ? "Biarkan kosong jika tetap" : "Password"}
                           value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Tingkatan Pengguna (Role)</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500"
                  value={form.role} onChange={e => setForm({...form, role: e.target.value, provinceCode: '', regencyCode: '', districtCode: '', villageCode: ''})}>
                  <option value="ADMIN_PROVINSI">Admin Provinsi</option>
                  <option value="ADMIN_KABUPATEN">Admin Kabupaten/Kota</option>
                  <option value="ADMIN_KECAMATAN">Admin Kecamatan</option>
                  <option value="ADMIN_KELURAHAN">Admin Kelurahan</option>
                </select>
              </div>

              {/* REGION SELECTION (SAMA) */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-3 border border-gray-100">
                <p className="text-xs font-bold text-blue-600 uppercase mb-2">Pilih Wilayah Kerja</p>
                <div>
                   <select required className="w-full border rounded-lg px-3 py-2 text-sm"
                     value={form.provinceCode} onChange={e => setForm({...form, provinceCode: e.target.value, regencyCode: '', districtCode: '', villageCode: ''})}>
                     <option value="">Pilih Provinsi...</option>
                     {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                   </select>
                </div>

                {['ADMIN_KABUPATEN', 'ADMIN_KECAMATAN', 'ADMIN_KELURAHAN'].includes(form.role) && (
                    <select required className="w-full border rounded-lg px-3 py-2 text-sm"
                        value={form.regencyCode} onChange={e => setForm({...form, regencyCode: e.target.value, districtCode: '', villageCode: ''})}>
                        <option value="">Pilih Kabupaten/Kota...</option>
                        {regencies.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                    </select>
                )}

                {['ADMIN_KECAMATAN', 'ADMIN_KELURAHAN'].includes(form.role) && (
                    <select required className="w-full border rounded-lg px-3 py-2 text-sm"
                        value={form.districtCode} onChange={e => setForm({...form, districtCode: e.target.value, villageCode: ''})}>
                        <option value="">Pilih Kecamatan...</option>
                        {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                    </select>
                )}

                {form.role === 'ADMIN_KELURAHAN' && (
                    <select required className="w-full border rounded-lg px-3 py-2 text-sm"
                        value={form.villageCode} onChange={e => setForm({...form, villageCode: e.target.value})}>
                        <option value="">Pilih Kelurahan...</option>
                        {villages.map(v => <option key={v.code} value={v.code}>{v.name}</option>)}
                    </select>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
                <button type="submit" className="flex items-center gap-2 px-6 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-200">
                    <Save size={16} /> {isEditing ? 'Simpan Perubahan' : 'Buat User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}