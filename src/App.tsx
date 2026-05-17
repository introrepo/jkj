/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  Search, 
  History, 
  Calendar, 
  PlusCircle, 
  LogOut, 
  LogIn, 
  Menu, 
  X,
  Stethoscope,
  Phone,
  User,
  CreditCard,
  Hash,
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import type { Patient, Visit } from './types';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

// --- Mock Initial Data ---
const INITIAL_PATIENTS: Patient[] = [
  {
    id: '1',
    nationalId: '1023456789',
    name: 'أحمد محمد علي',
    phone: '0501234567',
    age: 34,
    createdAt: new Date(2024, 0, 15),
    nextAppointment: new Date(2024, 4, 20, 10, 30)
  },
  {
    id: '2',
    nationalId: '1034567890',
    name: 'سارة خالد الخطيب',
    phone: '0559876543',
    age: 28,
    createdAt: new Date(2024, 1, 10),
    nextAppointment: new Date(2024, 4, 18, 14, 0)
  }
];

const INITIAL_VISITS: Visit[] = [
  {
    id: 'v1',
    patientId: '1',
    date: new Date(2024, 0, 15),
    treatment: 'تنظيف وتلميع الأسنان',
    medication: 'غسول فم مطهر',
    notes: 'التهاب بسيط في اللثة',
  }
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    id={`sidebar-item-${label.replace(/\s+/g, '-').toLowerCase()}`}
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-sky-50 text-sky-700 shadow-sm' 
        : 'text-slate-600 hover:bg-slate-50'
    }`}
  >
    <Icon size={18} />
    <span className="font-medium text-sm">{label}</span>
  </button>
);

const Card = ({ children, className = "", id }: { children: React.ReactNode, className?: string, id?: string, key?: any }) => (
  <div id={id} className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

// --- Main App ---

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ displayName: string, email: string, photoURL: string } | null>({
    displayName: 'د. عمار السن',
    email: 'dr.amar@dental.com',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DrAmar'
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Local State for Demo
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [visits, setVisits] = useState<Visit[]>(INITIAL_VISITS);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleSignOut = () => {
    setCurrentUser(null);
  };

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setCurrentUser({
        displayName: 'د. عمار السن',
        email: 'dr.amar@dental.com',
        photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DrAmar'
      });
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 rtl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center"
        >
          <div className="bg-sky-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Stethoscope size={40} className="text-sky-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">مركز السن</h1>
          <p className="text-slate-500 mb-8 font-medium">نظام إدارة عيادة الأسنان المتكامل (نسخة تجريبية)</p>
          <button
            id="login-button"
            onClick={handleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-sky-600 text-white py-4 rounded-xl font-bold hover:bg-sky-700 transition-colors shadow-lg shadow-sky-100"
          >
            <LogIn size={20} />
            بدء استخدام النظام
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex rtl">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            id="sidebar"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="fixed md:relative z-40 w-60 h-screen bg-white border-l border-slate-200 p-6 flex flex-col shrink-0"
          >
            <div className="flex items-center gap-3 mb-10 px-2">
              <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-sm">
                <Stethoscope size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">مركز السن</h2>
            </div>

            <nav className="flex-1 space-y-1">
              <SidebarItem 
                icon={ClipboardList} 
                label="لوحة التحكم" 
                active={activeTab === 'dashboard'} 
                onClick={() => setActiveTab('dashboard')} 
              />
              <SidebarItem 
                icon={UserPlus} 
                label="إضافة مريض" 
                active={activeTab === 'add-patient'} 
                onClick={() => setActiveTab('add-patient')} 
              />
              <SidebarItem 
                icon={Users} 
                label="قائمة المرضى" 
                active={activeTab === 'patients'} 
                onClick={() => setActiveTab('patients')} 
              />
              <SidebarItem 
                icon={Calendar} 
                label="المواعيد القادمة" 
                active={activeTab === 'appointments'} 
                onClick={() => setActiveTab('appointments')} 
              />
            </nav>

          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <button 
            id="toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-500"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center bg-slate-100 px-4 py-2 rounded-lg w-72 lg:w-96 transition-all focus-within:ring-2 focus-within:ring-sky-500/20">
               <Search className="text-slate-400" size={16} />
               <input 
                 type="text" 
                 placeholder="البحث السريع..." 
                 className="bg-transparent border-none focus:ring-0 text-sm w-full pr-3 text-slate-600 outline-none"
               />
             </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <DashboardView key="dashboard" patients={patients} onSelectPatient={(p) => { setSelectedPatient(p); setActiveTab('patient-details'); }} setActiveTab={setActiveTab} />}
            {activeTab === 'add-patient' && (
              <AddPatientView 
                key="add-patient" 
                onComplete={(newPatient) => {
                  setPatients(prev => [newPatient, ...prev]);
                  setActiveTab('patients');
                }} 
              />
            )}
            {activeTab === 'patients' && <PatientsListView key="patients" patients={patients} onSelectPatient={(p) => { setSelectedPatient(p); setActiveTab('patient-details'); }} />}
            {activeTab === 'appointments' && <AppointmentsListView key="appointments" patients={patients} onSelectPatient={(p) => { setSelectedPatient(p); setActiveTab('patient-details'); }} />}
            {activeTab === 'patient-details' && selectedPatient && (
              <PatientDetailsView 
                key="patient-details" 
                patient={selectedPatient} 
                visits={visits.filter(v => v.patientId === selectedPatient.id)}
                onAddVisit={(newVisit) => {
                  setVisits(prev => [newVisit, ...prev]);
                  // Update patient next appointment if needed
                  if (newVisit.nextAppointment) {
                    setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, nextAppointment: newVisit.nextAppointment } : p));
                    setSelectedPatient(prev => prev ? { ...prev, nextAppointment: newVisit.nextAppointment } : null);
                  }
                }}
                onBack={() => setActiveTab('patients')} 
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Sub-Views ---

function DashboardView({ patients, onSelectPatient, setActiveTab }: { patients: Patient[], onSelectPatient: (p: Patient) => void, setActiveTab: (tab: string) => void, key?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900">نظرة عامة</h1>
        <p className="text-slate-500">مرحباً بك في لوحة تحكم عيادتك اليوم</p>
      </div>

      {/* Compact Quick Actions */}
      <div className="flex gap-4 max-w-lg">
        <button 
          onClick={() => setActiveTab('add-patient')}
          className="flex-1 flex items-center justify-center gap-2 bg-sky-600 text-white py-2.5 px-4 rounded-lg font-bold text-sm hover:bg-sky-700 transition-all shadow-sm"
        >
          <UserPlus size={16} />
          <span>إضافة مريض</span>
        </button>
        <button 
          onClick={() => setActiveTab('patients')}
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-2.5 px-4 rounded-lg font-bold text-sm hover:bg-slate-50 transition-all"
        >
          <Search size={16} className="text-slate-400" />
          <span>بحث مريض</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card id="stat-card-patients" className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">المرضى المسجلين</p>
              <h3 className="text-3xl font-bold text-slate-900">{patients.length}</h3>
            </div>
            <div className="bg-sky-50 p-3 rounded-xl text-sky-600">
              <Users size={24} />
            </div>
          </div>
        </Card>

        <Card id="stat-card-today" className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">مواعيد اليوم</p>
              <h3 className="text-3xl font-bold text-slate-900">--</h3>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
              <Calendar size={24} />
            </div>
          </div>
        </Card>

        <Card id="stat-card-urgent" className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">التقارير</p>
              <h3 className="text-3xl font-bold text-slate-900">--</h3>
            </div>
            <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
              <ClipboardList size={24} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card id="recent-patients" className="p-6">
          <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            آخر المرضى المضافين
            <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{patients.slice(0, 5).length}</span>
          </h4>
          <div className="space-y-4">
            {patients.slice(0, 5).map(p => (
              <div 
                key={p.id} 
                onClick={() => onSelectPatient(p)}
                className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:bg-slate-50 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 font-bold">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{p.nationalId}</p>
                  </div>
                </div>
                <div className="text-left">
                  {p.nextAppointment && (
                    <p className="text-[10px] text-sky-600 font-bold">موعد: {format(p.nextAppointment, 'MM/dd')}</p>
                  )}
                  <button className="text-sky-600 hover:bg-sky-50 p-2 rounded-lg transition-colors">
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
            {patients.length === 0 && (
              <p className="text-center py-8 text-slate-400 text-sm">لا يوجد مرضى مسجلين بعد</p>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

function AddPatientView({ onComplete }: { onComplete: (p: Patient) => void, key?: string }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nationalId: '',
    name: '',
    phone: '',
    age: '',
    nextAppointment: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPatient: Patient = {
        id: Math.random().toString(36).substr(2, 9),
        nationalId: formData.nationalId,
        name: formData.name,
        phone: formData.phone,
        age: Number(formData.age),
        createdAt: new Date(),
        nextAppointment: formData.nextAppointment ? new Date(formData.nextAppointment) : undefined
      };
      
      onComplete(newPatient);
      setLoading(false);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card id="add-patient-form" className="p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">تسجيل مريض جديد</h2>
          <p className="text-slate-500">يرجى تعبئة كافة الحقول المطلوبة بدقة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                رقم الهوية
              </label>
              <input
                required
                type="text"
                placeholder="1XXXXXXXXX"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white transition-all outline-none"
                value={formData.nationalId}
                onChange={e => setFormData({ ...formData, nationalId: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                اسم المريض
              </label>
              <input
                required
                type="text"
                placeholder="الاسم الكامل"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white transition-all outline-none"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                رقم الهاتف
              </label>
              <input
                required
                type="tel"
                placeholder="05XXXXXXXX"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white transition-all outline-none"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                العمر
              </label>
              <input
                required
                type="number"
                placeholder="مثال: 25"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white transition-all outline-none"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                تاريخ الموعد القادم (اختياري)
              </label>
              <input
                type="datetime-local"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white transition-all outline-none"
                value={formData.nextAppointment}
                onChange={e => setFormData({ ...formData, nextAppointment: e.target.value })}
              />
            </div>
          </div>

          <button
            id="submit-patient"
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-lg text-white font-bold transition-all shadow-md ${
              loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700 shadow-sky-100'
            }`}
          >
            {loading ? 'جاري الحفظ...' : 'حفظ المريض والرجوع'}
          </button>
        </form>
      </Card>
    </motion.div>
  );
}

function AppointmentsListView({ patients, onSelectPatient }: { patients: Patient[], onSelectPatient: (p: Patient) => void, key?: string }) {
  const upcoming = patients
    .filter(p => p.nextAppointment)
    .sort((a, b) => a.nextAppointment!.getTime() - b.nextAppointment!.getTime());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-900">المواعيد القادمة</h2>
        <p className="text-slate-500">قائمة المرضى الذين لديهم موعد مجدول</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcoming.map(p => (
           <Card key={p.id} className="p-5 border-r-4 border-r-sky-500">
             <div className="flex flex-col h-full">
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 font-bold">
                   {p.name.charAt(0)}
                 </div>
                 <div>
                   <h4 className="font-bold text-slate-900">{p.name}</h4>
                   <p className="text-xs text-slate-500">{p.phone}</p>
                 </div>
               </div>
               
               <div className="bg-slate-50 p-4 rounded-xl mb-4 flex-1">
                 <div className="flex items-center gap-2 text-sky-700 font-bold mb-1">
                   <Calendar size={16} />
                   <span className="text-sm">تاريخ الموعد</span>
                 </div>
                 <p className="text-lg font-bold text-slate-900">
                   {format(p.nextAppointment!, 'eeee, d MMMM', { locale: ar })}
                 </p>
                 <p className="text-sm text-slate-500">
                   الساعة: {format(p.nextAppointment!, 'p', { locale: ar })}
                 </p>
               </div>

               <button 
                 onClick={() => onSelectPatient(p)}
                 className="w-full py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
               >
                 فتح السجل الطبي
               </button>
             </div>
           </Card>
        ))}
        {upcoming.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-100">
             <Calendar size={48} className="mx-auto text-slate-200 mb-4" />
             <p className="text-slate-400 font-medium">لا يوجد مواعيد قادمة مجدولة</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
function PatientsListView({ patients, onSelectPatient }: { patients: Patient[], onSelectPatient: (p: Patient) => void, key?: string }) {
  const [search, setSearch] = useState('');
  
  const filtered = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.nationalId.includes(search)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900">سجل المرضى</h2>
        <div className="relative max-w-sm w-full">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            id="search-patients"
            type="text"
            placeholder="ابحث بالاسم أو رقم الهوية..."
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card id="patients-table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">المريض</th>
                <th className="px-6 py-4">رقم الهوية</th>
                <th className="px-6 py-4">الهاتف</th>
                <th className="px-6 py-4">العمر</th>
                <th className="px-6 py-4">تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(p => (
                <tr 
                  key={p.id} 
                  onClick={() => onSelectPatient(p)}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-xs">
                        {p.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono">{p.nationalId}</td>
                  <td className="px-6 py-4 text-slate-500">{p.phone}</td>
                  <td className="px-6 py-4 text-slate-600">{p.age} سنة</td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {p.createdAt ? format(p.createdAt, 'yyyy/MM/dd', { locale: ar }) : '--'}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-slate-400">لا توجد نتائج مطابقة لبحثك</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}

function PatientDetailsView({ patient, visits, onAddVisit, onBack }: { 
  patient: Patient, 
  visits: Visit[], 
  onAddVisit: (v: Visit) => void,
  onBack: () => void, 
  key?: string 
}) {
  const [showAddVisit, setShowAddVisit] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4">
        <button 
          id="back-to-list"
          onClick={onBack} 
          className="p-3 bg-white border border-slate-100 rounded-xl text-slate-500 hover:text-slate-900 shadow-sm"
        >
          <ArrowRight className="rotate-180 md:rotate-0" size={20} />
        </button>
        <h2 className="text-2xl font-bold text-slate-900">ملف المريض</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patient Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card id="patient-mini-profile" className="p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-sky-600 rounded-3xl mx-auto flex items-center justify-center text-white text-3xl font-bold border-4 border-sky-50 mb-4">
                {patient.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{patient.name}</h3>
              <p className="text-slate-400 text-sm font-mono">{patient.nationalId}</p>
            </div>
            
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">الهاتف</span>
                <span className="font-bold text-slate-800">{patient.phone}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">العمر</span>
                <span className="font-bold text-slate-800">{patient.age} سنة</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">تاريخ الانضمام</span>
                <span className="font-bold text-slate-800">{patient.createdAt ? format(patient.createdAt, 'yyyy/MM/dd') : '--'}</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-50 mt-2">
                <span className="text-sky-600 font-bold">الموعد القادم</span>
                <span className="font-bold text-sky-700">
                  {patient.nextAppointment ? format(patient.nextAppointment, 'yyyy/MM/dd HH:mm', { locale: ar }) : 'لا يوجد'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Visit History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <History size={20} className="text-sky-500" />
              سجل الزيارات
              <span className="bg-slate-100 text-slate-400 text-xs px-2 py-0.5 rounded-full font-normal">{visits.length}</span>
            </h3>
            <button
              id="show-add-visit"
              onClick={() => setShowAddVisit(true)}
              className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-sky-700 transition-all shadow-md shadow-sky-100"
            >
              <PlusCircle size={18} />
              + إضافة زيارة
            </button>
          </div>

          {showAddVisit && (
            <AddVisitForm 
              patientId={patient.id} 
              onAddVisit={(v) => {
                onAddVisit(v);
                setShowAddVisit(false);
              }}
              onClose={() => setShowAddVisit(false)} 
            />
          )}

          <div className="space-y-4">
            {visits.length > 0 ? (
              visits.map((visit) => (
                <Card key={visit.id} className="p-0 border-l-4 border-l-sky-500">
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                        <Calendar size={14} className="text-slate-400" />
                        {format(visit.date, 'eeee, d MMMM yyyy', { locale: ar })}
                      </div>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">مكتمل</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <span className="block text-xs font-semibold text-slate-500">الإجراء المنفذ</span>
                        <p className="text-slate-800 text-sm font-medium">{visit.treatment}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="block text-xs font-semibold text-slate-500">الأدوية الموصوفة</span>
                        <p className="text-slate-800 text-sm font-medium">{visit.medication || 'لا يوجد'}</p>
                      </div>
                    </div>

                    {visit.notes && (
                      <div className="mt-4 pt-3 border-t border-slate-50">
                        <p className="text-slate-500 text-xs italic leading-relaxed">
                          ملاحظات: {visit.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <div className="py-20 text-center flex flex-col items-center gap-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <ClipboardList size={40} className="text-slate-300" />
                <p className="text-slate-500 font-medium">لا يوجد تاريخ زيارات لهذا المريض بعد</p>
                <button 
                   onClick={() => setShowAddVisit(true)}
                   className="text-blue-600 font-bold hover:underline"
                >
                  اضغط هنا لإضافة أول زيارة
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AddVisitForm({ patientId, onAddVisit, onClose }: { patientId: string, onAddVisit: (v: Visit) => void, onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    treatment: '',
    medication: '',
    notes: '',
    nextAppointment: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const newVisit: Visit = {
        id: Math.random().toString(36).substr(2, 9),
        patientId: patientId,
        date: new Date(),
        treatment: formData.treatment,
        medication: formData.medication,
        notes: formData.notes,
        nextAppointment: formData.nextAppointment ? new Date(formData.nextAppointment) : undefined
      };
      
      onAddVisit(newVisit);
      setLoading(false);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <Card id="add-visit-form" className="p-6 bg-slate-50 border-sky-100 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-slate-800">تفاصيل الإجراء (ماذا تم عمله)</h4>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500">تفاصيل الإجراء</label>
            <textarea
              required
              placeholder="حشوة عصب، تنظيف..."
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm h-24 resize-none outline-none focus:ring-2 focus:ring-sky-500/20"
              value={formData.treatment}
              onChange={e => setFormData({ ...formData, treatment: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-500">الأدوية الموصوفة</label>
              <input
                type="text"
                placeholder="أسماء الأدوية والجرعة"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500/20"
                value={formData.medication}
                onChange={e => setFormData({ ...formData, medication: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-500">تحديد الموعد القادم</label>
              <input
                type="datetime-local"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500/20"
                value={formData.nextAppointment}
                onChange={e => setFormData({ ...formData, nextAppointment: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500">ملاحظات إضافية</label>
              <input
                type="text"
                placeholder="حالة جيدة..."
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500/20"
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
               id="save-visit"
               type="submit"
               disabled={loading}
               className={`flex-1 py-3 rounded-lg text-white font-bold transition-all shadow-md ${
                 loading ? 'bg-slate-400' : 'bg-sky-600 hover:bg-sky-700 shadow-sky-100'
               }`}
            >
              {loading ? 'جاري الحفظ...' : 'حفظ الزيارة'}
            </button>
            <button
               type="button"
               disabled={loading}
               onClick={onClose}
               className="px-6 py-3 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-white transition-all text-sm"
            >
              إلغاء
            </button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
