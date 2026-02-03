import { useEffect, useState } from 'react';
import api from '../api/axios';
import {MapPin, Search, ChevronLeft, ChevronRight, Building2, Phone, Map, FileSpreadsheet } from 'lucide-react';

export default function Members() {
  // ... (State Recap - No Changes) ...
  const [recap, setRecap] = useState<any[]>([]);
  const [loadingRecap, setLoadingRecap] = useState(true);
  const [levelName, setLevelName] = useState('Wilayah');

  // --- MEMBER STATE ---
  const [members, setMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Search State
  const [search, setSearch] = useState('');       // Value in Input
  const [debouncedSearch, setDebouncedSearch] = useState(''); // Value sent to API

  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchRecap();
  }, []);

  // --- DEBOUNCE EFFECT ---
  // Wait 500ms after user stops typing before triggering API
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 when searching
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  // --- FETCH TRIGGER ---
  // Fetch when Page changes OR Search Query changes
  useEffect(() => {
    fetchMembers(page, debouncedSearch);
  }, [page, debouncedSearch]);


  const fetchRecap = () => {
    // ... (No Changes) ...
    api.get('/dashboard/recap')
      .then(res => {
        setRecap(res.data.data || []);
        if (res.data.levelName) setLevelName(res.data.levelName);
      })
      .catch(console.error)
      .finally(() => setLoadingRecap(false));
  };

  const fetchMembers = (pageNum: number, searchQuery: string) => {
    setLoadingMembers(true);
    // Send 'search' param to backend
    api.get(`/members`, {
      params: {
        page: pageNum,
        search: searchQuery // <--- Send Search Param
      }
    })
      .then(res => {
        setMembers(res.data.data);
        setTotalPages(res.data.totalPages);
        setTotalItems(res.data.total);
      })
      .catch(console.error)
      .finally(() => setLoadingMembers(false));
  };

  
  const downloadExcel = async (endpoint: string, filename: string) => {
    try {
      setDownloading(true);
      const response = await api.get(endpoint, {
        params: { export: 'true', search: debouncedSearch }, // Include search in export too!
        responseType: 'blob', 
      });
      // ... (rest of download logic) ...
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
       console.error(error);
       alert("Gagal download");
    } finally {
       setDownloading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* ... (Recap Section - No Changes) ... */}
      <div className="space-y-4">
        {/* ... Header Recap ... */}
        <div className="flex justify-between items-center">
             {/* ... */}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
             {/* ... Table Recap ... */}
             <table className="w-full text-left">
                {/* ... existing table code ... */}
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Kode</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Nama {levelName}</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Lokasi Administratif</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Total Anggota</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loadingRecap ? (
                    <tr><td colSpan={5} className="p-6 text-center text-gray-500">Loading data...</td></tr>
                  ) : recap.length === 0 ? (
                    <tr><td colSpan={5} className="p-6 text-center text-gray-500">Belum ada data rekapitulasi.</td></tr>
                  ) : recap.map((r, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm text-gray-600 bg-gray-50/30 w-32 border-r border-gray-50">{r.code}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                            {levelName === 'Provinsi' ? <Map size={18} /> : levelName.includes('Kabupaten') ? <Building2 size={18} /> : <MapPin size={18} />}
                          </div>
                          <span className="font-bold text-gray-700">{r.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-500 font-medium">
                            {r.hierarchy === 'Tingkat Provinsi' ? <span className="italic text-gray-400">Tingkat Provinsi</span> : 
                            <div className="flex flex-col gap-0.5"><span className="uppercase text-[10px] text-gray-400 tracking-wider">Induk Wilayah:</span><span className="text-gray-700">{r.hierarchy}</span></div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-blue-600 text-base">{r.total}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="w-24 ml-auto h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${Math.min(r.total, 100)}%` }}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* --- MEMBER LIST SECTION --- */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Daftar Seluruh Anggota</h2>
            <p className="text-gray-500 text-sm">Menampilkan {totalItems} anggota terdaftar.</p>
          </div>
          
          <div className="flex gap-2">
              <button 
                onClick={() => downloadExcel('/members', 'Data_Seluruh_Anggota.xlsx')}
                disabled={downloading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-wait"
              >
                {downloading ? 'Mengunduh...' : <><FileSpreadsheet size={16} /> Export Data</>}
              </button>

              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                   type="text" 
                   placeholder="Cari nama / KTP..." 
                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                 />
              </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold uppercase">Nama Lengkap</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase">Kontak</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase">Detail Wilayah</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase text-right">Tgl Daftar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loadingMembers ? (
                   <tr><td colSpan={4} className="p-8 text-center text-gray-500">Memuat daftar anggota...</td></tr>
                ) : members.length === 0 ? (
                   <tr>
                     <td colSpan={4} className="p-8 text-center text-gray-500">
                        {/* Pesan berbeda jika sedang search atau memang kosong */}
                        {search ? `Tidak ada anggota dengan nama/KTP "${search}"` : "Belum ada data anggota."}
                     </td>
                   </tr>
                ) : members.map((m) => (
                  <tr key={m.ktp} className="hover:bg-gray-50/50 transition-colors align-top">
                    {/* ... (Mapping Rows - No Changes) ... */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">{m.name.charAt(0).toUpperCase()}</div>
                        <div><p className="font-bold text-gray-800">{m.name}</p><p className="text-xs text-gray-500 font-mono mt-0.5">KTP: {m.ktp}</p></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600"><Phone size={14} className="text-gray-400" />{m.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-1.5">
                        <div className="flex items-center gap-2"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100 font-medium">{m.provinceName}</span><span className="text-gray-400">/</span><span className="font-medium text-gray-700">{m.regencyName}</span></div>
                        <div className="flex items-center gap-2 pl-1 border-l-2 border-gray-200"><span className="text-gray-500">Kec. {m.districtName}</span><span className="text-gray-300">•</span><span className="text-gray-500">Kel. {m.villageName}</span></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-500">{new Date(m.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
             <span className="text-sm text-gray-500">Halaman <span className="font-bold">{page}</span> dari {totalPages}</span>
             <div className="flex gap-2">
               <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft size={16} /></button>
               <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight size={16} /></button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}