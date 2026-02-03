import { useState } from 'react';
import api from '../api/axios';
import { useAuthStore } from '../store/auth';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await api.post('/auth/login', { 
      username: username, 
      password: password 
    });

    const { token, user } = response.data;

    setAuth(token, user);

  
    navigate('/dashboard');
    
  } catch (error: any) {
  
    alert(error.response?.data?.message || 'Login Gagal');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-[#e8e8e5] flex items-center justify-center p-4 font-sans">
      <div className="bg-[#fdfbf7] rounded-[2.5rem] shadow-2xl w-full max-w-6xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
        
   
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
          <div className="mt-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome </h1>
            <p className="text-gray-500 mb-8">Please enter your credentials to sign in.</p>

            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Username Input */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 ml-1">Username</label>
                <input 
                  type="text" 
                  className="w-full bg-[#f3f4f6] text-gray-700 rounded-xl px-5 py-3.5 border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder-gray-400"
                  placeholder="Enter username" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 ml-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-[#f3f4f6] text-gray-700 rounded-xl px-5 py-3.5 border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder-gray-400 pr-12"
                    placeholder="Enter password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>


              <button 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-gray-100 font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>


              <div className="grid grid-cols-2 gap-4 mt-6">
                <button type="button" className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-600">
                   <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-1.11 4.12-.91 2.05.2 3.49 1.13 4.28 2.37-3.9 1.95-3.35 6.47.88 8.08-.66 1.48-1.57 3.01-2.9 4.35-.91.95-1.8 1.83-3.11 1.83zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                   Apple
                </button>
                <button type="button" className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
              </div>

            </form>

            <p className="text-center text-sm text-gray-400 mt-8">
              Forgot your password? <span className="text-gray-800 font-semibold underline cursor-pointer hover:text-blue-600">Click Here</span>
            </p>
          </div>
        </div>


        <div className="hidden lg:block relative bg-gray-900 overflow-hidden">
           <img 
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80" 
            alt="Office Team" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
           />

           <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>


           <div className="absolute top-12 left-12 bg-[#FFD550] p-4 rounded-2xl shadow-xl w-48 transform -rotate-3 z-10">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-xs font-bold text-gray-900">Task Review</p>
                    <p className="text-[10px] text-gray-800 mt-1">09:30am - 10:00am</p>
                 </div>
                 <div className="h-2 w-2 bg-gray-900 rounded-full"></div>
              </div>
           </div>
           

           <div className="absolute top-20 left-36 bg-gray-800/90 backdrop-blur-md p-3 rounded-xl shadow-xl w-40 z-0">
             <p className="text-[10px] text-gray-300">09:30am - 10:00am</p>
           </div>

           <div className="absolute bottom-24 left-12 bg-white p-4 rounded-2xl shadow-2xl w-56 animate-fade-in-up">
              <div className="flex justify-between items-center mb-3">
                 <p className="text-sm font-bold text-gray-800">Daily Meeting</p>
                 <div className="h-2 w-2 bg-[#FFD550] rounded-full"></div>
              </div>
              <p className="text-xs text-gray-500 mb-3">12:00pm - 01:00pm</p>
              <div className="flex -space-x-2">
                 <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User" />
                 <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" />
                 <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/150?u=a04258114e29026302d" alt="User" />
                 <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-600 font-bold">+3</div>
              </div>
           </div>


           <div className="absolute bottom-40 -right-6 bg-white/20 backdrop-blur-lg border border-white/30 p-4 rounded-2xl w-64 text-white shadow-2xl transform rotate-3">
              <div className="flex justify-between text-xs font-semibold mb-2 opacity-80">
                 <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                 <span>22</span><span>23</span><span>24</span><span>25</span><span className="bg-white text-gray-900 px-1.5 rounded">26</span>
              </div>
              <div className="mt-3 h-1 w-full bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-2/3"></div>
              </div>
           </div>


           <div className="absolute top-1/2 right-12 transform -translate-y-1/2">
               <div className="relative">
                 <img className="w-14 h-14 rounded-full border-2 border-white absolute -top-8 -left-8 z-10" src="https://i.pravatar.cc/150?u=1" alt="U" />
                 <img className="w-16 h-16 rounded-full border-2 border-white relative z-20" src="https://i.pravatar.cc/150?u=5" alt="U" />
                 <img className="w-10 h-10 rounded-full border-2 border-white absolute -bottom-2 -left-6 z-30" src="https://i.pravatar.cc/150?u=8" alt="U" />
               </div>
           </div>

        </div>
      </div>
    </div>
  );
}