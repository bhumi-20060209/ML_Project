import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Heart, Lock, Mail, User, AlertCircle, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

export const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('sarah.jenkins@cardio.ai');
  const [password, setPassword] = useState('cardio123');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      
      {/* Background Motifs */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#0B5CAD]/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-4xl bg-white border border-[#E2E8F0] rounded-[16px] overflow-hidden shadow-sm relative z-10 grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Medical Branding Banner */}
        <div className="bg-gradient-to-br from-[#0B5CAD] to-[#08488A] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center">
                <Heart className="w-5 h-5 fill-white text-white animate-pulse-subtle" />
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-white">
                Cardio<span className="text-[#60A5FA]">AI</span>
              </h2>
            </div>

            <div className="space-y-2 pt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span>Cardiovascular Intelligence</span>
              </span>
              <h3 className="text-2xl font-bold leading-snug text-white">
                Clinical Heart Risk Assessment Platform
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed pt-1">
                Machine learning predictive modeling trained on 70,000 cardiology clinical records with SQLite database persistence.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/15 flex items-center justify-between text-xs text-blue-100">
            <span className="flex items-center gap-1.5 font-semibold text-white">
              <ShieldCheck className="w-4 h-4 text-[#60A5FA]" /> HIPAA / Clinical Standard
            </span>
            <span>v1.0.4</span>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="space-y-1 mb-6">
            <h2 className="text-xl font-bold text-[#172B4D]">
              {isRegister ? 'Register Clinician Account' : 'Sign In to CardioAI'}
            </h2>
            <p className="text-xs text-[#64748B]">
              {isRegister ? 'Enter your credentials to register' : 'Enter your credentials to access the clinical portal'}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-[#FDF2F4] border border-[#FAD4DA] text-[#E63950] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#E63950]" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Sarah Jenkins"
                    className="w-full bg-[#F5F8FC] border border-[#E2E8F0] rounded-lg pl-9 pr-3 py-2 text-xs text-[#172B4D] focus:border-[#0B5CAD] focus:bg-white transition-all placeholder:text-[#94A3B8]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="clinician@cardio.ai"
                  className="w-full bg-[#F5F8FC] border border-[#E2E8F0] rounded-lg pl-9 pr-3 py-2 text-xs text-[#172B4D] focus:border-[#0B5CAD] focus:bg-white transition-all placeholder:text-[#94A3B8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#F5F8FC] border border-[#E2E8F0] rounded-lg pl-9 pr-3 py-2 text-xs text-[#172B4D] focus:border-[#0B5CAD] focus:bg-white transition-all placeholder:text-[#94A3B8]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0B5CAD] hover:bg-[#08488A] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 shadow-xs"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{isRegister ? 'Register Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Form */}
          <div className="mt-5 text-center pt-3 border-t border-[#E2E8F0]">
            <p className="text-xs text-[#64748B]">
              {isRegister ? 'Already registered?' : "Need clinician access?"}{' '}
              <button
                onClick={() => { setIsRegister(!isRegister); setError(null); }}
                className="text-[#0B5CAD] font-bold hover:underline ml-1"
              >
                {isRegister ? 'Sign In' : 'Register Here'}
              </button>
            </p>
          </div>

          <div className="mt-3 p-2.5 rounded-lg bg-[#F5F8FC] border border-[#E2E8F0] text-[11px] text-[#64748B] text-center">
            💡 Demo Credentials Pre-filled: <span className="text-[#172B4D] font-mono">sarah.jenkins@cardio.ai / cardio123</span>
          </div>

        </div>

      </div>
    </div>
  );
};
