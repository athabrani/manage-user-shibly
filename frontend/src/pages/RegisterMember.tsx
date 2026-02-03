import { useState, useEffect } from 'react';
import api from '../api/axios'; // Pastikan path axios benar
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';

// Tipe Data Wilayah
interface Region {
  code: string;
  name: string;
}

export default function RegisterMember() {
  // State Form
  const [form, setForm] = useState({
    ktp: '',
    name: '',
    phone: '',
    provinceCode: '',
    regencyCode: '',
    districtCode: '',
    villageCode: ''
  });

  // State Wilayah (Dependent Dropdown)
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [regencies, setRegencies] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [villages, setVillages] = useState<Region[]>([]);

  // State UI
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  

  useEffect(() => {
    api.get('/regions').then(res => setProvinces(res.data)).catch(console.error);
  }, []);

  // 2. Load Kabupaten saat Provinsi berubah
  useEffect(() => {
    setForm(f => ({ ...f, regencyCode: '', districtCode: '', villageCode: '' })); // Reset anak
    setRegencies([]); setDistricts([]); setVillages([]);
    
    if (form.provinceCode) {
      api.get(`/regions?parentCode=${form.provinceCode}`).then(res => setRegencies(res.data));
    }
  }, [form.provinceCode]);

  // 3. Load Kecamatan saat Kabupaten berubah
  useEffect(() => {
    setForm(f => ({ ...f, districtCode: '', villageCode: '' }));
    setDistricts([]); setVillages([]);

    if (form.regencyCode) {
      api.get(`/regions?parentCode=${form.regencyCode}`).then(res => setDistricts(res.data));
    }
  }, [form.regencyCode]);

  // 4. Load Kelurahan saat Kecamatan berubah
  useEffect(() => {
    setForm(f => ({ ...f, villageCode: '' }));
    setVillages([]);

    if (form.districtCode) {
      api.get(`/regions?parentCode=${form.districtCode}`).then(res => setVillages(res.data));
    }
  }, [form.districtCode]);




  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'ktp' || name === 'phone') {
      const numericValue = value.replace(/\D/g, ''); // Hapus karakter non-angka
      setForm({ ...form, [name]: numericValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);


    if (form.ktp.length !== 16) {
      setErrorMsg('No. KTP harus tepat 16 digit.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/members/register', form); 
      setSuccessMsg('Anggota berhasil didaftarkan!');
      // Reset Form
      setForm({
        ktp: '', name: '', phone: '',
        provinceCode: '', regencyCode: '', districtCode: '', villageCode: ''
      });
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Form Pendaftaran Anggota Baru</h2>
          <p className="text-sm text-gray-500 mt-1">Lengkapi data diri dan domisili anggota.</p>
        </div>

        <div className="p-8">

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-3">
              <CheckCircle2 size={20} />
              <span className="text-sm font-medium">{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Data Diri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    No. KTP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ktp"
                    value={form.ktp}
                    onChange={handleChange}
                    maxLength={16}
                    placeholder="16 Digit Angka"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                  <p className="text-xs text-gray-400 text-right">{form.ktp.length}/16</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama sesuai KTP"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    No. Handphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Contoh: 08123456789"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>


            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2 mt-2">Domisili</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Provinsi */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Provinsi <span className="text-red-500">*</span></label>
                  <select
                    name="provinceCode"
                    value={form.provinceCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">Pilih Provinsi...</option>
                    {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                  </select>
                </div>

                {/* Kabupaten */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Kabupaten/Kota <span className="text-red-500">*</span></label>
                  <select
                    name="regencyCode"
                    value={form.regencyCode}
                    onChange={handleChange}
                    disabled={!form.provinceCode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-400"
                    required
                  >
                    <option value="">Pilih Kabupaten...</option>
                    {regencies.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Kecamatan <span className="text-red-500">*</span></label>
                  <select
                    name="districtCode"
                    value={form.districtCode}
                    onChange={handleChange}
                    disabled={!form.regencyCode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-400"
                    required
                  >
                    <option value="">Pilih Kecamatan...</option>
                    {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Kelurahan <span className="text-red-500">*</span></label>
                  <select
                    name="villageCode"
                    value={form.villageCode}
                    onChange={handleChange}
                    disabled={!form.districtCode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-400"
                    required
                  >
                    <option value="">Pilih Kelurahan...</option>
                    {villages.map(v => <option key={v.code} value={v.code}>{v.name}</option>)}
                  </select>
                </div>

              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-lg shadow-blue-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Memproses...</span>
                ) : (
                  <>
                    <Save size={18} /> Simpan Data
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}