'use client';

import React, { useState, useEffect } from 'react';
import { PLOTS_DATA } from '@/data/plots';
import { Plot, PlotStatus, Lead } from '@/types';
import { formatINR, formatNumberINR, getStatusColor } from '@/lib/utils';
import {
  Shield, Users, Database, Search, Edit3, CheckCircle2, Download, RefreshCw, Filter, Layers
} from 'lucide-react';

export default function AdminPage() {
  const [plots, setPlots] = useState<Plot[]>(PLOTS_DATA);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState<'plots' | 'leads'>('plots');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dbSource, setDbSource] = useState<'supabase' | 'local'>('local');
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);

  const fetchLiveLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const res = await fetch('/api/leads');
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
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
          },
          {
            id: '2',
            fullName: 'Karthik Narayanan',
            phone: '+91 99001 88765',
            email: 'karthik.n@yahoo.com',
            plotNumber: 'Plot 18',
            type: 'enquiry',
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

  useEffect(() => {
    fetchLiveLeads();
  }, []);

  // Update plot status
  const handleStatusChange = (plotId: number, newStatus: PlotStatus) => {
    setPlots(prev =>
      prev.map(p => {
        if (p.id === plotId) {
          return { ...p, status: newStatus };
        }
        return p;
      })
    );
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

  const availableCount = plots.filter(p => p.status === 'available').length;
  const reservedCount = plots.filter(p => p.status === 'reserved').length;
  const soldCount = plots.filter(p => p.status === 'sold').length;

  const exportLeadsCSV = () => {
    const headers = ['ID', 'Full Name', 'Phone', 'Email', 'Preferred Date', 'Plot Interest', 'Type', 'Date'];
    const rows = leads.map(l => [
      l.id,
      `"${l.fullName}"`,
      l.phone,
      l.email || '',
      l.preferredDate || '',
      l.plotNumber || '',
      l.type,
      l.createdAt
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Shield className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Internal Management Console
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Plot Inventory & Leads Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Live status override, price adjustments, and lead follow-up management.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('plots')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'plots'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Plots Inventory ({plots.length})
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'leads'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Captured Leads ({leads.length})
            </button>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Enclave Plots</span>
            <span className="text-3xl font-black text-white mt-1 block">{plots.length}</span>
            <span className="text-[11px] text-slate-500">12.5 Acres Development</span>
          </div>

          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">Available</span>
            <span className="text-3xl font-black text-emerald-400 mt-1 block">{availableCount}</span>
            <span className="text-[11px] text-slate-500">Ready for booking</span>
          </div>

          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">Reserved</span>
            <span className="text-3xl font-black text-amber-400 mt-1 block">{reservedCount}</span>
            <span className="text-[11px] text-slate-500">Token advance in process</span>
          </div>

          <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-5">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block">Sold & Registered</span>
            <span className="text-3xl font-black text-rose-400 mt-1 block">{soldCount}</span>
            <span className="text-[11px] text-slate-500">{((soldCount / plots.length) * 100).toFixed(0)}% Allocation</span>
          </div>
        </div>

        {/* Tab 1: Plot Inventory Table */}
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
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs text-slate-400">Status:</span>
                {['all', 'available', 'reserved', 'sold'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                      statusFilter === st
                        ? 'bg-slate-800 text-white border border-slate-600'
                        : 'text-slate-400 hover:text-white'
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
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                    <th className="p-3">Plot #</th>
                    <th className="p-3">Dimensions</th>
                    <th className="p-3">Area</th>
                    <th className="p-3">Facing</th>
                    <th className="p-3">Base Price</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions / Toggle Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredPlots.slice(0, 30).map(plot => {
                    const statusColor = getStatusColor(plot.status);
                    return (
                      <tr key={plot.id} className="hover:bg-slate-950/50 transition-colors">
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <span>{plot.number}</span>
                          {plot.isCorner && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                              CORNER
                            </span>
                          )}
                        </td>
                        <td className="p-3">{plot.width} × {plot.depth} ft ({plot.size})</td>
                        <td className="p-3 font-medium text-emerald-400">{plot.area.toLocaleString()} sq.ft</td>
                        <td className="p-3">{plot.facing}</td>
                        <td className="p-3 font-bold text-amber-400">{formatINR(plot.price)}</td>
                        <td className="p-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${statusColor.bg} ${statusColor.text}`}
                          >
                            {plot.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleStatusChange(plot.id, 'available')}
                              className={`px-2 py-1 rounded text-[10px] font-bold ${
                                plot.status === 'available'
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              Avail
                            </button>
                            <button
                              onClick={() => handleStatusChange(plot.id, 'reserved')}
                              className={`px-2 py-1 rounded text-[10px] font-bold ${
                                plot.status === 'reserved'
                                  ? 'bg-amber-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              Reserv
                            </button>
                            <button
                              onClick={() => handleStatusChange(plot.id, 'sold')}
                              className={`px-2 py-1 rounded text-[10px] font-bold ${
                                plot.status === 'sold'
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-slate-800 text-slate-400 hover:text-white'
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

        {/* Tab 2: Captured Leads Table */}
        {activeTab === 'leads' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Registered Customer Inquiries & Site Visits</h3>
                  {dbSource === 'supabase' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Database className="w-3 h-3" />
                      <span>Supabase Cloud Live</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20" title="Add Supabase env variables to sync live from all devices">
                      <Database className="w-3 h-3" />
                      <span>Local Storage Mode</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">Captured in real-time from website forms and WhatsApp CTAs</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchLiveLeads}
                  disabled={isLoadingLeads}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  title="Reload leads from database"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLeads ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={exportLeadsCSV}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Leads as CSV</span>
                </button>
              </div>
            </div>

            {leads.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No inquiries captured yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                      <th className="p-3">Customer Name</th>
                      <th className="p-3">Phone Number</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Plot Preference</th>
                      <th className="p-3">Visit Date</th>
                      <th className="p-3">Inquiry Type</th>
                      <th className="p-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {leads.map(lead => (
                      <tr key={lead.id} className="hover:bg-slate-950/50 transition-colors">
                        <td className="p-3 font-bold text-white">{lead.fullName}</td>
                        <td className="p-3 font-mono text-emerald-400">
                          <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                        </td>
                        <td className="p-3 text-slate-400">{lead.email || '—'}</td>
                        <td className="p-3 font-semibold text-amber-300">{lead.plotNumber || 'General Layout'}</td>
                        <td className="p-3 text-slate-300">{lead.preferredDate || 'Immediate'}</td>
                        <td className="p-3">
                          <span className="text-[10px] font-bold bg-slate-800 px-2 py-0.5 rounded-full uppercase">
                            {lead.type}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 font-mono text-[11px]">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
