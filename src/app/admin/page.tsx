'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PLOTS_DATA } from '@/data/plots';
import { Plot, PlotStatus, Lead, LeadStatus } from '@/types';
import { formatINR, getStatusColor } from '@/lib/utils';
import { preventCsvInjection } from '@/lib/security';
import {
  Shield, Database, Search, Download, RefreshCw,
  Lock, KeyRound, LogOut, AlertCircle, ShieldCheck, ArrowRight,
  MessageSquare, Phone as PhoneIcon, CheckCircle2, Clock, Calendar,
  Edit3, UserCheck, TrendingUp, Trash2
} from 'lucide-react';
import { toast } from 'sonner';

const LEAD_STATUS_CONFIG: Record<LeadStatus, { label: string; bg: string; text: string; border: string }> = {
  new: { label: 'New Lead', bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30' },
  contacted: { label: 'Contacted', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  site_visit: { label: 'Site Visit', bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  negotiation: { label: 'Negotiation', bg: 'bg-amber-400/20', text: 'text-amber-300', border: 'border-amber-400/50' },
  closed: { label: 'Closed / Booked', bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
};

export default function AdminPage() {
  // Authentication State (True Server-Side Auth with httpOnly Session Cookies)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingInitialAuth, setIsCheckingInitialAuth] = useState<boolean>(true);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Dashboard State
  const [plots, setPlots] = useState<Plot[]>(PLOTS_DATA);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState<'plots' | 'leads'>('leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all');
  const [dbSource, setDbSource] = useState<'supabase' | 'local'>('local');
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [editingLeadNotesId, setEditingLeadNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // 1. Check existing server session cookie on mount
  useEffect(() => {
    let mounted = true;
    const verifyExistingSession = async () => {
      try {
        const res = await fetch('/api/admin/verify', { credentials: 'include' });
        if (mounted && res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
            fetchLiveLeads();
            fetchLivePlots();
          }
        }
      } catch (err) {
        console.warn('Initial session check failed:', err);
      } finally {
        if (mounted) setIsCheckingInitialAuth(false);
      }
    };

    verifyExistingSession();
    return () => {
      mounted = false;
    };
  }, []);

  // 2. Server-side login handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!passcode.trim()) {
      setAuthError('Please enter the administrative master passcode.');
      triggerShake();
      return;
    }

    setIsVerifying(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: passcode }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setIsAuthenticated(true);
        setPasscode('');
        toast.success('Admin Console Authenticated', {
          description: 'Secure httpOnly server session established for Anurag Enclave.',
          duration: 3500,
        });
        fetchLiveLeads();
        fetchLivePlots();
      } else {
        const msg = data?.error || 'Invalid passcode. Access denied.';
        setAuthError(msg);
        triggerShake();
        toast.error('Authentication Failed', { description: msg });
      }
    } catch {
      setAuthError('Network error. Unable to reach authentication server.');
      triggerShake();
    } finally {
      setIsVerifying(false);
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  // 3. Server-side logout handler
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.warn('Logout request failed:', err);
    }
    setIsAuthenticated(false);
    setPasscode('');
    setAuthError('');
    toast.info('Session Terminated', {
      description: 'Admin desk safely locked and cookie cleared.',
    });
  };

  // 4. Fetch live leads with cookie auth
  const fetchLiveLeads = async () => {
    setIsLoadingLeads(true);

    try {
      const res = await fetch('/api/leads', {
        credentials: 'include',
      });

      if (res.status === 401) {
        setIsAuthenticated(false);
        setIsLoadingLeads(false);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        if (data.source === 'supabase' && Array.isArray(data.leads)) {
          setLeads(data.leads);
          setDbSource('supabase');
          setIsLoadingLeads(false);
          return;
        }
      }
    } catch (err) {
      console.warn('API leads fetch error:', err);
    }

    // Fallback to localStorage if Supabase is not yet configured
    try {
      const storedLeads = JSON.parse(localStorage.getItem('horizon_leads') || '[]');
      if (storedLeads.length === 0) {
        const initialLeads: Lead[] = [
          {
            id: '1',
            fullName: 'Ananya Sharma',
            phone: '+91 98860 44321',
            email: 'ananya.s@gmail.com',
            preferredDate: '2026-09-12',
            plotNumber: 'Plot 42',
            type: 'site_visit',
            status: 'site_visit',
            notes: 'Interested in East facing 30x40. Requested coffee plantation layout walk.',
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
          },
          {
            id: '2',
            fullName: 'Karthik Narayanan',
            phone: '+91 99001 88765',
            email: 'karthik.n@yahoo.com',
            plotNumber: 'Plot 18',
            type: 'enquiry',
            status: 'contacted',
            notes: 'Spoke over phone. Sent e-brochure & DTCP approval copies via WhatsApp.',
            createdAt: new Date(Date.now() - 3600000 * 14).toISOString()
          }
        ];
        setLeads(initialLeads);
        localStorage.setItem('horizon_leads', JSON.stringify(initialLeads));
      } else {
        setLeads(storedLeads);
      }
      setDbSource('local');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  // 5. Update lead status in pipeline
  const handleLeadStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    // Optimistic UI update
    setLeads(prev =>
      prev.map(l => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    try {
      if (dbSource === 'supabase') {
        await fetch('/api/leads', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ id: leadId, status: newStatus }),
        });
      } else {
        const stored = JSON.parse(localStorage.getItem('horizon_leads') || '[]');
        const updated = stored.map((l: Lead) => (l.id === leadId ? { ...l, status: newStatus } : l));
        localStorage.setItem('horizon_leads', JSON.stringify(updated));
      }
      toast.success(`Pipeline Updated`, {
        description: `Lead moved to ${LEAD_STATUS_CONFIG[newStatus].label}.`,
      });
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  // 6. Save lead notes
  const handleSaveNotes = async (leadId: string) => {
    setLeads(prev =>
      prev.map(l => (l.id === leadId ? { ...l, notes: tempNotes } : l))
    );
    setEditingLeadNotesId(null);

    try {
      if (dbSource === 'supabase') {
        await fetch('/api/leads', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ id: leadId, notes: tempNotes }),
        });
      } else {
        const stored = JSON.parse(localStorage.getItem('horizon_leads') || '[]');
        const updated = stored.map((l: Lead) => (l.id === leadId ? { ...l, notes: tempNotes } : l));
        localStorage.setItem('horizon_leads', JSON.stringify(updated));
      }
      toast.success('Notes Saved');
    } catch (err) {
      console.error('Failed to update notes:', err);
    }
  };

  // Fetch live plot overrides from database
  const fetchLivePlots = async () => {
    try {
      const res = await fetch('/api/plots');
      if (res.ok) {
        const data = await res.json();
        if (data.plots && Array.isArray(data.plots)) {
          setPlots(data.plots);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch live plots:', err);
    }
  };

  // Permanently delete a lead under DPDP Act 2023
  const handleDeleteLead = async (leadId: string, leadName: string) => {
    if (!confirm(`Are you sure you want to permanently delete lead data for "${leadName}" under DPDP Act 2023?`)) {
      return;
    }
    setLeads(prev => prev.filter(l => l.id !== leadId));
    try {
      if (dbSource === 'supabase') {
        await fetch(`/api/leads?id=${leadId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
      } else {
        const stored = JSON.parse(localStorage.getItem('horizon_leads') || '[]');
        const updated = stored.filter((l: Lead) => l.id !== leadId);
        localStorage.setItem('horizon_leads', JSON.stringify(updated));
      }
      toast.success('Lead Record Purged', {
        description: 'Customer record deleted per DPDP Act 2023 compliance.',
      });
    } catch (err) {
      console.error('Delete lead error:', err);
    }
  };

  // Update plot status both locally and on server
  const handleStatusChange = async (plotId: number, newStatus: PlotStatus) => {
    setPlots(prev =>
      prev.map(p => {
        if (p.id === plotId) {
          return { ...p, status: newStatus };
        }
        return p;
      })
    );

    try {
      const res = await fetch('/api/plots', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: plotId, status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Plot #${plotId} updated to ${newStatus}`, {
          description: 'Live masterplan and database updated without redeployment.',
        });
      }
    } catch (err) {
      console.warn('Failed to sync plot status to server:', err);
    }
  };

  // Filtered plots
  const filteredPlots = plots.filter(p => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.number.toLowerCase().includes(q) && !p.size.toLowerCase().includes(q)) return false;
    }
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  // Filtered leads
  const filteredLeads = leads.filter(l => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        l.fullName.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        (l.plotNumber && l.plotNumber.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (leadStatusFilter === 'overdue') {
      if (!l.followUpDate || l.status === 'closed') return false;
      const today = new Date().toISOString().slice(0, 10);
      return l.followUpDate < today;
    }
    if (leadStatusFilter === 'hot_leads') {
      return (l.inquiryCount || 1) > 1;
    }
    if (leadStatusFilter !== 'all' && (l.status || 'new') !== leadStatusFilter) return false;
    return true;
  });

  const handleFollowUpDateChange = async (leadId: string, newDate: string) => {
    setLeads(prev =>
      prev.map(l => (l.id === leadId ? { ...l, followUpDate: newDate } : l))
    );
    try {
      if (dbSource === 'supabase') {
        await fetch('/api/leads', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ id: leadId, followUpDate: newDate }),
        });
      }
      toast.success('Follow-up Date Scheduled');
    } catch (err) {
      console.warn('Failed to save follow-up date:', err);
    }
  };

  const availableCount = plots.filter(p => p.status === 'available').length;
  const reservedCount = plots.filter(p => p.status === 'reserved').length;
  const soldCount = plots.filter(p => p.status === 'sold').length;

  // CSV Export with CSV formula injection protection
  const exportLeadsCSV = () => {
    const headers = ['ID', 'Full Name', 'Phone', 'Email', 'Preferred Date', 'Plot Interest', 'Pipeline Status', 'Notes', 'UTM Source', 'Timestamp'];
    const rows = leads.map(l => [
      preventCsvInjection(String(l.id)),
      `"${preventCsvInjection(l.fullName)}"`,
      preventCsvInjection(l.phone),
      preventCsvInjection(l.email || ''),
      preventCsvInjection(l.preferredDate || ''),
      preventCsvInjection(l.plotNumber || ''),
      preventCsvInjection(l.status || 'new'),
      `"${preventCsvInjection(l.notes || '')}"`,
      preventCsvInjection(l.utmSource || ''),
      preventCsvInjection(l.createdAt)
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `anurag_enclave_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Initial loader
  if (isCheckingInitialAuth) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
          <span className="text-xs font-mono text-slate-400">Verifying administrative security session...</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // Imperial Obsidian & Champagne Bronze Security Lockscreen
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden pt-20">
        {/* Ambient radial lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div
          className={`relative w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl transition-transform ${
            isShaking ? 'animate-shake' : ''
          }`}
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px -10px rgba(189, 159, 103, 0.15)',
          }}
        >
          {/* Header Icon & Brand Pill */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/90 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Restricted Executive Console
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Anurag Enclave Admin Gate
              </h1>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Enter your administrative master passcode to access customer leads, pipeline tracking, and plot inventory.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Master Passcode
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={passcode}
                  onChange={e => {
                    setPasscode(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="Enter administrator passcode"
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/80 transition-colors tracking-widest font-mono"
                />
              </div>

              {authError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1.5 animate-fadeIn">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Server Session...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate & Unlock Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Security Badges */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>TLS 1.3 / Signed Cookie</span>
            </span>
            <span className="text-amber-400/80">HMAC-SHA256 Auth</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // Authenticated Admin Dashboard (Imperial Obsidian & Champagne Bronze)
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                Executive Desk • Server Session Active
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Anurag Enclave Management Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Track customer sales pipeline, update follow-up notes, and monitor layout inventory.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 duration-150 ${
                activeTab === 'leads'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Sales Pipeline ({leads.length})
            </button>

            <button
              onClick={() => setActiveTab('plots')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 duration-150 ${
                activeTab === 'plots'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Plots Inventory ({plots.length})
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-800/40 text-xs font-semibold transition-all cursor-pointer active:scale-95 duration-150"
              title="Lock dashboard and terminate session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Desk</span>
            </button>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Inquiries</span>
            <span className="text-3xl font-black text-white mt-1 block">{leads.length}</span>
            <span className="text-[11px] text-slate-500">All channels active</span>
          </div>

          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">Available Plots</span>
            <span className="text-3xl font-black text-emerald-400 mt-1 block">{availableCount}</span>
            <span className="text-[11px] text-slate-500">Ready for booking</span>
          </div>

          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">Reserved Plots</span>
            <span className="text-3xl font-black text-amber-400 mt-1 block">{reservedCount}</span>
            <span className="text-[11px] text-slate-500">Token in progress</span>
          </div>

          <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-5">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block">Sold & Registered</span>
            <span className="text-3xl font-black text-rose-400 mt-1 block">{soldCount}</span>
            <span className="text-[11px] text-slate-500">{((soldCount / plots.length) * 100).toFixed(0)}% Allocation</span>
          </div>
        </div>

        {/* Tab 1: Sales Pipeline & Leads */}
        {activeTab === 'leads' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Customer Leads & Sales Pipeline</h3>
                  {dbSource === 'supabase' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Database className="w-3 h-3" />
                      <span>Supabase Cloud Synced</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Database className="w-3 h-3" />
                      <span>Local Mode</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">Manage pipeline stages, follow-up notes, and direct WhatsApp contacts</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => fetchLiveLeads()}
                  disabled={isLoadingLeads}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 active:scale-95 duration-150"
                  title="Reload leads from database"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLeads ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={exportLeadsCSV}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 duration-150"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Filter by search and pipeline status */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by name, phone, plot #..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto text-xs">
                <span className="text-slate-400 mr-1">Filter:</span>
                {[
                  { key: 'all', label: 'All Leads' },
                  { key: 'new', label: 'New' },
                  { key: 'contacted', label: 'Contacted' },
                  { key: 'site_visit', label: 'Site Visit' },
                  { key: 'negotiation', label: 'Negotiation' },
                  { key: 'closed', label: 'Closed' },
                  { key: 'overdue', label: '⚠️ Overdue' },
                  { key: 'hot_leads', label: '🔥 Hot (2+x)' },
                ].map(st => (
                  <button
                    key={st.key}
                    onClick={() => setLeadStatusFilter(st.key)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                      leadStatusFilter === st.key
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredLeads.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No inquiries matching criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                      <th className="p-3">Customer</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Plot Interest</th>
                      <th className="p-3">Pipeline Stage</th>
                      <th className="p-3">Next Follow-Up</th>
                      <th className="p-3">Follow-Up Notes</th>
                      <th className="p-3">Source</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredLeads.map(lead => {
                      const currentStatus: LeadStatus = lead.status || 'new';
                      const stBadge = LEAD_STATUS_CONFIG[currentStatus] || LEAD_STATUS_CONFIG.new;
                      const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
                      const waLink = `https://wa.me/${cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone}?text=${encodeURIComponent(
                        `Hello ${lead.fullName}, thank you for inquiring about Anurag Enclave, Sakrayapatna!`
                      )}`;

                      return (
                        <tr key={lead.id} className="hover:bg-slate-950/50 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white">{lead.fullName}</span>
                              {lead.inquiryCount && lead.inquiryCount > 1 ? (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30" title="Repeated customer inquiry">
                                  🔥 {lead.inquiryCount}x
                                </span>
                              ) : null}
                            </div>
                            {lead.email && <div className="text-[11px] text-slate-400">{lead.email}</div>}
                          </td>
                          <td className="p-3 font-mono text-emerald-400">
                            <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-amber-300">{lead.plotNumber || 'General Layout'}</span>
                            {lead.preferredDate && (
                              <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <Calendar className="w-2.5 h-2.5" />
                                <span>{lead.preferredDate}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            <select
                              value={currentStatus}
                              onChange={e => handleLeadStatusChange(lead.id, e.target.value as LeadStatus)}
                              className={`text-[10px] font-bold uppercase tracking-wider rounded-lg px-2 py-1 border cursor-pointer outline-none bg-slate-950 ${stBadge.text} ${stBadge.border}`}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="site_visit">Site Visit</option>
                              <option value="negotiation">Negotiation</option>
                              <option value="closed">Closed / Booked</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <input
                              type="date"
                              value={lead.followUpDate || ''}
                              onChange={e => handleFollowUpDateChange(lead.id, e.target.value)}
                              className={`bg-slate-950 border rounded px-2 py-1 text-[11px] font-mono outline-none cursor-pointer ${
                                lead.followUpDate && lead.followUpDate < new Date().toISOString().slice(0, 10) && lead.status !== 'closed'
                                  ? 'border-rose-500 text-rose-300 font-bold'
                                  : 'border-slate-800 text-slate-300'
                              }`}
                              title={lead.followUpDate && lead.followUpDate < new Date().toISOString().slice(0, 10) && lead.status !== 'closed' ? 'Overdue Follow-Up!' : 'Set Follow-up Date'}
                            />
                          </td>
                          <td className="p-3 max-w-xs">
                            {editingLeadNotesId === lead.id ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={tempNotes}
                                  onChange={e => setTempNotes(e.target.value)}
                                  placeholder="Add notes..."
                                  className="w-full bg-slate-950 border border-amber-400/60 rounded px-2 py-1 text-xs text-white"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSaveNotes(lead.id)}
                                  className="px-2 py-1 bg-amber-400 text-slate-950 rounded text-[10px] font-bold"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <div
                                onClick={() => {
                                  setEditingLeadNotesId(lead.id);
                                  setTempNotes(lead.notes || '');
                                }}
                                className="group flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-white"
                                title="Click to edit notes"
                              >
                                <span className="truncate max-w-[180px] text-[11px]">
                                  {lead.notes || <span className="italic text-slate-600">Click to add note</span>}
                                </span>
                                <Edit3 className="w-3 h-3 text-slate-600 group-hover:text-amber-400 shrink-0" />
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-slate-400 font-mono text-[10px]">
                            {lead.utmSource || lead.type || 'direct'}
                          </td>
                          <td className="p-3 text-slate-500 font-mono text-[11px]">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-right">
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 transition-all active:scale-90"
                                title="Open WhatsApp Chat with Lead"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`tel:${lead.phone}`}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all active:scale-90"
                                title="Call Lead Phone Number"
                              >
                                <PhoneIcon className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => handleDeleteLead(lead.id, lead.fullName)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-800/40 text-slate-400 hover:text-rose-400 transition-all active:scale-90 cursor-pointer"
                                title="Purge customer lead under DPDP Act 2023"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Plot Inventory Table */}
        {activeTab === 'plots' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by Plot # or size..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs text-slate-400">Status:</span>
                {['all', 'available', 'reserved', 'sold'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                      statusFilter === st
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                    <th className="p-3">Plot #</th>
                    <th className="p-3">Dimensions</th>
                    <th className="p-3">Facing</th>
                    <th className="p-3">Current Status</th>
                    <th className="p-3">Price</th>
                    <th className="p-3 text-right">Quick Status Override</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredPlots.slice(0, 30).map(plot => {
                    const stColor = getStatusColor(plot.status);
                    return (
                      <tr key={plot.id} className="hover:bg-slate-950/50 transition-colors">
                        <td className="p-3 font-bold text-white">{plot.number}</td>
                        <td className="p-3 text-slate-400">{plot.width}×{plot.depth} ft ({plot.area} sq.ft)</td>
                        <td className="p-3 text-slate-400">{plot.facing}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${stColor.bg} ${stColor.text} border ${stColor.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${stColor.dot}`} />
                            {plot.status}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-white">{formatINR(plot.price)}</td>
                        <td className="p-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleStatusChange(plot.id, 'available')}
                              className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                plot.status === 'available'
                                  ? 'bg-emerald-500 text-slate-950 font-black'
                                  : 'bg-slate-800 text-slate-400 hover:text-emerald-400'
                              }`}
                            >
                              Available
                            </button>
                            <button
                              onClick={() => handleStatusChange(plot.id, 'reserved')}
                              className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                plot.status === 'reserved'
                                  ? 'bg-amber-500 text-slate-950 font-black'
                                  : 'bg-slate-800 text-slate-400 hover:text-amber-400'
                              }`}
                            >
                              Reserved
                            </button>
                            <button
                              onClick={() => handleStatusChange(plot.id, 'sold')}
                              className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                plot.status === 'sold'
                                  ? 'bg-rose-500 text-white font-black'
                                  : 'bg-slate-800 text-slate-400 hover:text-rose-400'
                              }`}
                            >
                              Sold
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredPlots.length > 30 && (
              <div className="p-3 text-center text-xs text-slate-500 border-t border-slate-800">
                Showing top 30 of {filteredPlots.length} plots. Use search to find specific plot numbers.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
