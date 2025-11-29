'use client';

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Users, Menu, X, MapPin, DollarSign, 
  Send, CheckCircle, Search, Building, ShieldCheck, 
  UserCircle, Briefcase as BriefcaseIcon, Lock, 
  AlertTriangle, Check, UserCog, LogOut, ArrowLeft
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { 
  collection, addDoc, onSnapshot, query, where, 
  doc, setDoc, updateDoc 
} from "firebase/firestore";
import { 
  signInAnonymously, onAuthStateChanged, signOut,
  signInWithEmailAndPassword, createUserWithEmailAndPassword
} from "firebase/auth";

// Import initialized instances
import { db, auth, appId } from '@/lib/firebase';

// --- STATIC DATA ---
const COURSES = [
  {
    id: 1,
    title: "Introduction to Web Development",
    category: "Tech",
    level: "Beginner",
    duration: "4 Weeks",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    description: "Learn HTML, CSS, and Basic JavaScript to build your first website."
  },
  {
    id: 2,
    title: "Digital Marketing Mastery",
    category: "Marketing",
    level: "Intermediate",
    duration: "6 Weeks",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=600&q=80",
    description: "Master social media strategies, SEO, and content marketing."
  },
  {
    id: 3,
    title: "Remote Work Soft Skills",
    category: "Personal Dev",
    level: "All Levels",
    duration: "2 Weeks",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
    description: "Communication, time management, and tools for remote success."
  },
  {
    id: 4,
    title: "Data Analysis with Python",
    category: "Data Science",
    level: "Advanced",
    duration: "8 Weeks",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    description: "Analyze data sets and create visualizations using Python libraries."
  }
];

// --- COMPONENTS ---

const LoginSelection = ({ onLogin }) => {
  const [view, setView] = useState('selection'); // 'selection', 'admin', 'company-auth', 'woman-auth'
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auth Form State
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Helper to reset form when switching views
  const switchView = (newView) => {
    setView(newView);
    setError('');
    setEmail('');
    setPassword('');
    setAuthMode('login');
  };

  // Woman / Job Seeker Auth
  const handleWomanAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (authMode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin('woman');
    } catch (err) {
      console.error(err);
      handleAuthError(err);
    }
    setIsLoading(false);
  };

  // Company Login/Register
  const handleCompanyAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (authMode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin('company');
    } catch (err) {
      console.error(err);
      handleAuthError(err);
    }
    setIsLoading(false);
  };

  const handleAuthError = (err) => {
    if (err.code === 'auth/operation-not-allowed') {
      setError("Email/Password auth not enabled in Firebase Console.");
    } else if (err.code === 'auth/invalid-credential') {
      setError("Invalid email or password.");
    } else if (err.code === 'auth/email-already-in-use') {
      setError("Email already in use. Try logging in.");
    } else if (err.code === 'auth/weak-password') {
      setError("Password should be at least 6 characters.");
    } else {
      setError(err.message);
    }
  };

  // Admin Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (adminCode === 'admin123') {
      setIsLoading(true);
      await onLogin('admin');
      setIsLoading(false);
    } else {
      setError('Invalid Access Code');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fadeIn relative min-h-[500px]">
        
        {/* Left Side: Branding */}
        <div className="md:w-1/2 bg-purple-700 p-12 text-white flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold mb-4">Empow<span className="text-teal-400">Her</span></h1>
          <p className="text-purple-100 text-lg mb-8">Bridging the gap for women in tech and remote work.</p>
          <div className="w-32 h-1 bg-teal-400 rounded-full"></div>
        </div>

        {/* Right Side: Dynamic Forms */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center">
          
          {/* VIEW: ROLE SELECTION */}
          {view === 'selection' && (
            <div className="animate-fadeIn">
              <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Welcome</h2>
              <p className="text-center text-gray-500 mb-8 text-sm">Select your role to continue</p>
              
              <div className="space-y-4">
                <button 
                  onClick={() => switchView('woman-auth')}
                  className="w-full group p-6 border-2 border-purple-100 rounded-2xl hover:border-purple-600 hover:bg-purple-50 transition-all duration-300 flex items-center gap-4 text-left"
                >
                  <div className="bg-purple-100 p-4 rounded-full group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <UserCircle size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">Woman / Job Seeker</h3>
                    <p className="text-sm text-gray-500">Find jobs, upskill, and grow.</p>
                  </div>
                </button>

                <button 
                  onClick={() => switchView('company-auth')}
                  className="w-full group p-6 border-2 border-teal-100 rounded-2xl hover:border-teal-600 hover:bg-teal-50 transition-all duration-300 flex items-center gap-4 text-left"
                >
                  <div className="bg-teal-100 p-4 rounded-full group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <Building size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">Company / Employer</h3>
                    <p className="text-sm text-gray-500">Post jobs and find talent.</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => switchView('admin')}
                  className="w-full mt-4 text-center text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1"
                >
                  <UserCog size={12} /> Admin Login
                </button>
              </div>
            </div>
          )}

          {/* VIEW: WOMAN AUTH (Login/Register) */}
          {view === 'woman-auth' && (
            <div className="animate-fadeIn w-full">
              <button onClick={() => switchView('selection')} className="text-sm text-gray-500 mb-4 hover:underline flex items-center gap-1">
                 <ArrowLeft size={14} /> Back to Roles
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Seeker Portal</h2>
              <p className="text-sm text-gray-500 mb-6">
                {authMode === 'login' ? 'Welcome back! Log in to apply.' : 'Create a profile to find jobs.'}
              </p>
              
              <form onSubmit={handleWomanAuth} className="space-y-4">
                <div>
                  <label className="label text-gray-700">  Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field text-gray-900 bg-white" 
                    placeholder="  jane@example.com"
                  />
                </div>
                <div>
                  <label className="label text-gray-700">Password  </label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field text-gray-900 bg-white" 
                    placeholder="  ••••••••"
                  />
                </div>

                {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded">{error}</p>}
                
                <button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg disabled:opacity-50">
                  {isLoading ? 'Processing...' : (authMode === 'login' ? 'Login' : 'Create Account')}
                </button>
              </form>

              <div className="mt-6 text-center text-sm">
                {authMode === 'login' ? (
                  <p className="text-gray-600">
                    New here? <button onClick={() => { setAuthMode('register'); setError(''); }} className="text-purple-600 font-bold hover:underline">Create an account</button>
                  </p>
                ) : (
                  <p className="text-gray-600">
                    Already have an account? <button onClick={() => { setAuthMode('login'); setError(''); }} className="text-purple-600 font-bold hover:underline">Log in</button>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* VIEW: COMPANY AUTH (Login/Register) */}
          {view === 'company-auth' && (
            <div className="animate-fadeIn w-full">
              <button onClick={() => switchView('selection')} className="text-sm text-gray-500 mb-4 hover:underline flex items-center gap-1">
                 <ArrowLeft size={14} /> Back to Roles
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Portal</h2>
              <p className="text-sm text-gray-500 mb-6">
                {authMode === 'login' ? 'Log in to manage your jobs.' : 'Register to verify your company.'}
              </p>
              
              <form onSubmit={handleCompanyAuth} className="space-y-4">
                <div>
                  <label className="label text-gray-700">Email Address  </label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field text-gray-900 bg-white" 
                    placeholder="  hr@company.com"
                  />
                </div>
                <div>
                  <label className="label text-gray-700">Password  </label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field text-gray-900 bg-white" 
                    placeholder="  ••••••••"
                  />
                </div>

                {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded">{error}</p>}
                
                <button type="submit" disabled={isLoading} className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg disabled:opacity-50">
                  {isLoading ? 'Processing...' : (authMode === 'login' ? 'Login' : 'Create Account')}
                </button>
              </form>

              <div className="mt-6 text-center text-sm">
                {authMode === 'login' ? (
                  <p className="text-gray-600">
                    New here? <button onClick={() => { setAuthMode('register'); setError(''); }} className="text-teal-600 font-bold hover:underline">Create an account</button>
                  </p>
                ) : (
                  <p className="text-gray-600">
                    Already have an account? <button onClick={() => { setAuthMode('login'); setError(''); }} className="text-teal-600 font-bold hover:underline">Log in</button>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* VIEW: ADMIN LOGIN */}
          {view === 'admin' && (
            <div className="animate-fadeIn w-full">
              <button onClick={() => switchView('selection')} className="text-sm text-gray-500 mb-4 hover:underline flex items-center gap-1">
                 <ArrowLeft size={14} /> Back to Roles
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h2>
              <p className="text-sm text-gray-500 mb-6">Enter the verification code (admin123)</p>
              
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="label text-gray-700">Access Code  </label>
                  <input 
                    type="password" 
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    className="input-field text-gray-900 bg-white" 
                    placeholder="  Enter code"
                    autoFocus
                    autoComplete="off"
                  />
                </div>
                {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded">{error}</p>}
                <button type="submit" disabled={isLoading} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition shadow-lg disabled:opacity-50">
                  {isLoading ? 'Verifying...' : 'Enter Dashboard'}
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const Navbar = ({ setPage, currentPage, userRole, companyStatus, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  let navItems = [];
  if (userRole === 'woman') {
    navItems = [
      { name: 'Home', value: 'home' },
      { name: 'Find Jobs', value: 'jobs' },
      { name: 'Upskill Courses', value: 'courses' },
      { name: 'Contact Us', value: 'contact' },
    ];
  } else if (userRole === 'company') {
    navItems = [
      { name: 'Home', value: 'home' },
      { name: 'Post a Job', value: 'post-job' },
      { name: 'Verify Company', value: 'verify' },
      { name: 'Contact Us', value: 'contact' },
    ];
  } else if (userRole === 'admin') {
    navItems = [
      { name: 'Dashboard', value: 'home' },
    ];
  }

  const getRoleLabel = () => {
    if (userRole === 'woman') return 'Seeker';
    if (userRole === 'company') return 'Employer';
    return 'Admin';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setPage('home')}>
            <span className="text-2xl font-bold text-purple-700">Empow<span className="text-teal-500">Her</span></span>
            <div className="ml-3 flex items-center gap-2">
              <span className={`px-3 py-1 bg-gray-100 text-xs rounded-full font-bold uppercase tracking-wide ${userRole === 'admin' ? 'text-red-600 bg-red-50' : 'text-gray-600'}`}>
                {getRoleLabel()}
              </span>
              {userRole === 'company' && companyStatus === 'verified' && (
                 <span className="flex items-center text-teal-600 text-xs font-bold" title="Verified Account">
                   <ShieldCheck size={16} /> <span className="hidden md:inline ml-1">Verified</span>
                 </span>
              )}
            </div>
          </div>
          
          <div className="hidden md:flex space-x-6 items-center">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => setPage(item.value)}
                className={`${currentPage === item.value ? 'text-purple-700 font-bold' : 'text-gray-500 hover:text-purple-600'} px-3 py-2 text-sm transition-colors`}
              >
                {item.name}
              </button>
            ))}
            <button onClick={onLogout} className="text-red-500 hover:text-red-700 text-sm font-medium ml-4 flex items-center gap-1">
              <LogOut size={16}/> Sign Out
            </button>
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-purple-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-2">
          {navItems.map((item) => (
            <button 
              key={item.value} 
              onClick={() => { setPage(item.value); setIsOpen(false); }} 
              className="block w-full text-left px-4 py-3 rounded-lg hover:bg-purple-50 text-gray-700 font-medium"
            >
              {item.name}
            </button>
          ))}
          <button onClick={onLogout} className="block w-full text-left px-4 py-3 text-red-600 font-medium">Sign Out</button>
        </div>
      )}
    </nav>
  );
};

const ContactForm = () => {
  const [formStatus, setFormStatus] = useState('idle');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    const formData = new FormData(e.target);
    formData.append("access_key", "195725f0-3a18-4f09-a0dc-d6921f302cd3"); 

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST", body: formData
      });
      const result = await response.json();
      if (result.success) setFormStatus('success');
      else setFormStatus('idle');
    } catch (error) {
      console.error("Error:", error);
      setFormStatus('idle');
    }
  };

  if (formStatus === 'success') {
    return (
      <div className="text-center py-10 bg-green-50 rounded-xl">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800">Message Sent!</h3>
        <button onClick={() => setFormStatus('idle')} className="mt-4 text-purple-600 font-medium">Send another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleContactSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input required name="name" type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input required name="email" type="email" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea required name="message" rows="4" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"></textarea>
      </div>
      <button type="submit" disabled={formStatus === 'submitting'} className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg flex justify-center items-center">
        {formStatus === 'submitting' ? 'Sending...' : <><Send size={18} className="mr-2" /> Send Message</>}
      </button>
    </form>
  );
};

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to all pending companies
    const q = query(
      collection(db, 'artifacts', appId, 'public', 'data', 'companies'),
      where('status', '==', 'pending')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCompanies(list);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  const handleVerify = async (companyId) => {
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'companies', companyId), {
        status: 'verified'
      });
    } catch (error) {
      console.error("Verification failed", error);
      alert("Verification failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-bold">
          {companies.length} Pending Request(s)
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading requests...</div>
      ) : companies.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-20 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">All Caught Up!</h2>
          <p className="text-gray-500 mt-2">No pending verification requests.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {companies.map((company) => (
            <div key={company.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{company.website}</h3>
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-bold uppercase">Pending</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
                  <p><span className="font-semibold">Reg ID:</span> {company.regNumber}</p>
                  <p><span className="font-semibold">Website:</span> <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{company.website}</a></p>
                  <p><span className="font-semibold">LinkedIn:</span> {company.linkedin || 'N/A'}</p>
                  <p><span className="font-semibold">Applied:</span> {new Date(company.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={() => handleVerify(company.id)}
                  className="flex-1 md:flex-none bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <Check size={18} /> Verify
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const HomePage = ({ userRole, setPage }) => (
  <div className="animate-fadeIn">
    <div className="bg-gradient-to-r from-purple-50 to-teal-50 py-20 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <span className="text-teal-600 font-bold tracking-wider uppercase text-sm mb-2 block">
            {userRole === 'woman' ? 'For Job Seekers' : 'For Employers'}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            {userRole === 'woman' 
              ? <span>Shape Your Future with <span className="text-purple-600">Flexible Work</span></span>
              : <span>Find Diverse Talent & <span className="text-purple-600">Boost Growth</span></span>
            }
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            {userRole === 'woman'
              ? "Join thousands of women finding financial independence through verified remote jobs and skill development."
              : "Connect with skilled, motivated women ready to contribute to your company's success remotely."
            }
          </p>
          <button 
            onClick={() => setPage(userRole === 'woman' ? 'jobs' : 'post-job')} 
            className="bg-purple-600 text-white px-8 py-4 rounded-full font-bold hover:bg-purple-700 shadow-xl transition transform hover:-translate-y-1"
          >
            {userRole === 'woman' ? 'Browse Jobs' : 'Post a Job Now'}
          </button>
        </div>
        <div className="md:w-1/2 flex justify-center relative">
          <div className="absolute inset-0 bg-purple-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          <img 
            src={userRole === 'woman' 
              ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
              : "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80"
            } 
            alt="Hero" 
            className="rounded-3xl shadow-2xl w-full max-w-md object-cover h-96 relative z-10" 
          />
        </div>
      </div>
    </div>

    {/* Stats / Features */}
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition bg-purple-50">
          <BriefcaseIcon className="w-10 h-10 text-purple-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">1,200+ Jobs</h3>
          <p className="text-gray-600">Active listings from verified inclusive employers.</p>
        </div>
        <div className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition bg-teal-50">
          <Users className="w-10 h-10 text-teal-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">5,000+ Members</h3>
          <p className="text-gray-600">A growing community of professional women.</p>
        </div>
        <div className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition bg-pink-50">
          <ShieldCheck className="w-10 h-10 text-pink-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">Verified Companies</h3>
          <p className="text-gray-600">We vet every employer to ensure safety and quality.</p>
        </div>
      </div>
    </div>
  </div>
);

const EmployerPostJob = ({ setPage, user, companyStatus }) => {
  const [formData, setFormData] = useState({
    title: '', company: '', location: 'Remote', type: 'Full-time', salary: '', skills: '', description: ''
  });
  const [status, setStatus] = useState('idle');

  // Guard Clause for Verification
  if (companyStatus !== 'verified') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden text-center p-12 border border-gray-200">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Verification Required</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            To ensure the safety of our candidates, only verified companies can post job listings.
          </p>
          <div className="flex justify-center gap-4 flex-col md:flex-row">
             <button 
              onClick={() => setPage('verify')} 
              className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition flex items-center justify-center gap-2"
            >
              <ShieldCheck size={20} /> Go to Verification Page
            </button>
            {companyStatus === 'pending' && (
               <div className="flex items-center text-yellow-600 bg-yellow-50 px-6 py-3 rounded-xl font-medium">
                  <AlertTriangle size={20} className="mr-2"/> Verification Pending...
               </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setStatus('loading');
    
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'jobs'), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      setStatus('success');
      setFormData({ title: '', company: '', location: 'Remote', type: 'Full-time', salary: '', skills: '', description: '' });
      setTimeout(() => { setStatus('idle'); setPage('home'); }, 2000);
    } catch (error) {
      console.error(error);
      setStatus('idle');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-purple-900 p-8 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2"><BriefcaseIcon size={24}/> Post a New Role</h2>
          <p className="text-purple-200 mt-2">Reach thousands of qualified candidates.</p>
        </div>
        
        {status === 'success' ? (
          <div className="p-16 text-center">
             <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6 animate-bounce" />
             <h3 className="text-2xl font-bold text-gray-800">Job Posted!</h3>
             <p className="text-gray-500">Redirecting...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Job Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" className="input-field" placeholder="e.g. Senior Frontend Dev" />
              </div>
              <div>
                <label className="label">Company Name</label>
                <input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} type="text" className="input-field" placeholder="e.g. TechCorp" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="input-field">
                  <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Freelance</option>
                </select>
              </div>
              <div>
                <label className="label">Location</label>
                <select value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="input-field">
                  <option>Remote</option><option>Hybrid</option><option>On-Site</option>
                </select>
              </div>
              <div>
                <label className="label">Salary</label>
                <input value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} type="text" className="input-field" placeholder="$60k - $80k" />
              </div>
            </div>

            <div>
              <label className="label">Required Skills</label>
              <input required value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} type="text" className="input-field" placeholder="e.g. React, Node.js, Design" />
            </div>

            <div>
              <label className="label">Description</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="5" className="input-field"></textarea>
            </div>

            <button type="submit" disabled={status === 'loading'} className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition">
              {status === 'loading' ? 'Posting...' : 'Publish Job'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const EmployerVerification = ({ companyStatus, user }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    regNumber: '', website: '', linkedin: ''
  });

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      // Save verification request to Firestore using user ID as doc ID
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'companies', user.uid), {
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setLoading(false);
    } catch (error) {
      console.error("Error submitting verification:", error);
      alert("Submission failed.");
      setLoading(false);
    }
  };

  if (companyStatus === 'verified') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden text-center p-12">
          <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-12 h-12 text-teal-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">You are Verified!</h2>
          <p className="text-gray-600 mb-8">Your documents have been approved. You can now post jobs.</p>
          <button className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg opacity-50 cursor-not-allowed">
            Verification Complete
          </button>
        </div>
      </div>
    );
  }

  if (companyStatus === 'pending') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden text-center p-12 border border-yellow-200">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <AlertTriangle className="w-10 h-10 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Verification Pending</h3>
          <p className="text-gray-600 mt-2">Our admin team is reviewing your documents.</p>
          <p className="text-sm text-gray-500 mt-4">You will be automatically approved here once verified.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-teal-600 p-8 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2"><ShieldCheck size={28}/> Company Verification</h2>
          <p className="text-teal-100 mt-2">Verified badges increase applicant trust by 80%.</p>
        </div>

        {loading ? (
          <div className="p-16 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-gray-800">Submitting Documents...</h3>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="p-8 space-y-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    You must complete this verification before you can post any jobs.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="label">Company Registration Number (EIN/CIN)</label>
              <input required value={formData.regNumber} onChange={e => setFormData({...formData, regNumber: e.target.value})} type="text" className="input-field" placeholder="XX-XXXXXXX" />
            </div>
            <div>
              <label className="label">Official Website</label>
              <input required value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} type="url" className="input-field" placeholder="https://company.com" />
            </div>
            <div>
              <label className="label">LinkedIn Company Page</label>
              <input value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} type="url" className="input-field" placeholder="https://linkedin.com/company/..." />
            </div>
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl text-center hover:bg-gray-50 transition cursor-pointer">
              <p className="text-gray-500 font-medium">Upload Business License or Certificate of Incorporation</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG or PNG (Max 5MB)</p>
            </div>
            <button type="submit" className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition">
              Submit for Verification
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const JobBoard = ({ jobs, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [applyingJob, setApplyingJob] = useState(null);

  const filtered = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Explore Opportunities</h2>
        <p className="text-gray-500 mt-2">Find a role that fits your life.</p>
        <div className="max-w-xl mx-auto mt-6 relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input type="text" placeholder="Search by job title or company..." className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>
      ) : (
        <div className="grid gap-6">
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <BriefcaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No jobs found matching your search.</p>
            </div>
          ) : (
            filtered.map(job => (
              <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{job.title}</h3>
                  <p className="text-gray-600 font-medium">{job.company}</p>
                  <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
                    <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full"><MapPin size={14} className="mr-1"/> {job.location}</span>
                    <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full"><BriefcaseIcon size={14} className="mr-1"/> {job.type}</span>
                    <span className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full"><DollarSign size={14} className="mr-1"/> {job.salary}</span>
                  </div>
                </div>
                <button onClick={() => setApplyingJob(job)} className="bg-teal-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-teal-600 transition shadow-sm whitespace-nowrap">
                  Apply Now
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {applyingJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 relative shadow-2xl">
            <button onClick={() => setApplyingJob(null)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
            <h3 className="font-bold text-2xl mb-1">Apply to {applyingJob.company}</h3>
            <p className="text-purple-600 font-medium mb-6">{applyingJob.title}</p>
            
            <div className="bg-gray-50 p-4 rounded-xl mb-6 text-sm text-gray-600">
              <h4 className="font-bold text-gray-800 mb-2">Job Description</h4>
              <p>{applyingJob.description}</p>
            </div>

            <p className="text-gray-600 mb-6 text-center">To apply, please send your resume and portfolio to:</p>
            <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl text-center font-mono text-purple-700 font-bold mb-6 select-all">
              careers@{applyingJob.company.replace(/\s+/g, '').toLowerCase()}.com
            </div>
            
            <button onClick={() => setApplyingJob(null)} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const Courses = () => (
  <div className="max-w-7xl mx-auto px-4 py-16 animate-fadeIn">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900">Upskill & Grow</h2>
      <p className="text-gray-500 mt-2">Courses designed to get you hired.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {COURSES.map(course => (
        <div key={course.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition group cursor-pointer flex flex-col h-full">
          <div className="h-48 overflow-hidden">
            <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
          </div>
          <div className="p-6 flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">{course.category}</span>
              <span className="text-xs text-gray-500 font-medium">{course.duration}</span>
            </div>
            <h3 className="text-lg font-bold mb-2 group-hover:text-purple-600 transition-colors">{course.title}</h3>
            <p className="text-sm text-gray-600 mb-4 flex-grow">{course.description}</p>
            <button className="w-full mt-auto border-2 border-purple-100 text-purple-700 font-bold py-2 rounded-xl hover:bg-purple-600 hover:text-white transition-colors">
              Enroll Now
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ContactPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-16 animate-fadeIn">
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
      <div className="md:w-1/3 bg-purple-900 p-8 text-white flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-4">Let's Talk</h2>
        <p className="text-purple-200 mb-8">Have questions about posting a job or finding one? We're here to help.</p>
        <div className="space-y-4">
          <div className="flex items-center gap-3"><MapPin className="text-teal-400"/> 123 Tech Avenue, NY</div>
          <div className="flex items-center gap-3"><Send className="text-teal-400"/> support@empowher.com</div>
        </div>
      </div>
      <div className="md:w-2/3 p-8 md:p-12">
        <ContactForm />
      </div>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---

export default function Home() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'woman' | 'company' | 'admin'
  const [companyStatus, setCompanyStatus] = useState('unverified'); 
  const [currentPage, setCurrentPage] = useState('home');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- AUTH & DATA ---
  useEffect(() => {
    // Check LocalStorage on Mount
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      setUserRole(savedRole);
      // NOTE: We do NOT strictly sign in anonymously here anymore
      // because companies use real auth.
      // If a role is saved but auth is missing, we let onAuthStateChanged handle it
      // or redirect to login if necessary.
    }
    
    // Listen for Auth State
    return onAuthStateChanged(auth, setUser);
  }, []);

  // Listen for Jobs
  useEffect(() => {
    if (!user) return;
    const q = collection(db, 'artifacts', appId, 'public', 'data', 'jobs');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      jobList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setJobs(jobList);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  // Listen for My Company Status (If I am a company)
  useEffect(() => {
    if (!user || userRole !== 'company') return;

    // Listen to my specific company document to see if Admin verified me
    const unsub = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'companies', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCompanyStatus(data.status); // 'pending' or 'verified'
      } else {
        setCompanyStatus('unverified');
      }
    });

    return unsub;
  }, [user, userRole]);


  const handleLogin = async (role) => {
    // Note: Login logic is handled inside LoginSelection components now
    // This just sets state
    setUserRole(role);
    localStorage.setItem('userRole', role); // Save to LocalStorage
    setCurrentPage('home');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Clear Firebase Session
    } catch (error) {
      console.error("Logout failed", error);
    }
    setUserRole(null);
    localStorage.removeItem('userRole'); // Clear from LocalStorage
    setCurrentPage('home');
    setCompanyStatus('unverified');
  };

  // If no role selected, show Login Screen
  if (!userRole) {
    return <LoginSelection onLogin={handleLogin} />;
  }

  // --- ROUTING LOGIC ---
  const renderPage = () => {
    switch(currentPage) {
      case 'home': 
        if (userRole === 'admin') return <AdminDashboard />;
        return <HomePage userRole={userRole} setPage={setCurrentPage} />;
      
      // Woman Pages
      case 'jobs': return userRole === 'woman' ? <JobBoard jobs={jobs} loading={loading} /> : <HomePage userRole={userRole} setPage={setCurrentPage} />;
      case 'courses': return userRole === 'woman' ? <Courses /> : <HomePage userRole={userRole} setPage={setCurrentPage} />;
      
      // Company Pages
      case 'post-job': return userRole === 'company' ? <EmployerPostJob setPage={setCurrentPage} user={user} companyStatus={companyStatus} /> : <HomePage userRole={userRole} setPage={setCurrentPage} />;
      case 'verify': return userRole === 'company' ? <EmployerVerification companyStatus={companyStatus} user={user} /> : <HomePage userRole={userRole} setPage={setCurrentPage} />;
      
      // Shared
      case 'contact': return <ContactPage />;
      
      default: return <HomePage userRole={userRole} setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
      <Navbar setPage={setCurrentPage} currentPage={currentPage} userRole={userRole} companyStatus={companyStatus} onLogout={handleLogout} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-2xl font-bold mb-4 block text-purple-900">Empow<span className="text-teal-500">Her</span></span>
          <p className="text-gray-400">© 2025 EmpowHer. All rights reserved.</p>
        </div>
      </footer>

      {/* Global Styles for "Next.js-like" feel */}
      <style jsx global>{`
        .input-field {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          transition: all 0.2s;
        }
        .input-field:focus {
          outline: none;
          border-color: #9333ea;
          box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
        }
        .label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
}