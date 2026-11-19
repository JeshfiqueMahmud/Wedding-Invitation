import React, { useState, useEffect } from 'react';
import { X, Download, Trash2, Search, RefreshCw, Users, CheckSquare, XCircle, Lock, Phone, Mail } from 'lucide-react';

export default function AdminDashboard({ isOpen, onClose }) {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [rsvps, setRsvps] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('all');
  const [loading, setLoading] = useState(false);

  const CORRECT_PIN = '2026';

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === CORRECT_PIN || pin === '1225') {
      setIsAuthenticated(true);
      setPinError(false);
      fetchData();
    } else {
      setPinError(true);
      setPin('');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rsvpsRes, statsRes] = await Promise.all([
        fetch('/api/rsvps'),
        fetch('/api/stats')
      ]);
      const rsvpsData = await rsvpsRes.json();
      const statsData = await statsRes.json();
      setRsvps(Array.isArray(rsvpsData) ? rsvpsData : []);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete RSVP for ${name}?`)) return;
    try {
      await fetch(`/api/rsvp/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const filteredRsvps = rsvps.filter((r) => {
    const matchesSearch =
      r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterEvent === 'all' || r.attendance === filterEvent;
    return matchesSearch && matchesFilter;
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-navy-950/92 backdrop-blur-md flex items-center justify-center p-2 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full max-h-[94vh] flex flex-col navy-gold-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 overflow-hidden text-baroque-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-baroque-300 hover:text-white p-2"
          aria-label="Close"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {!isAuthenticated ? (
          // PIN Protection Screen
          <div className="max-w-xs mx-auto my-auto text-center py-8 sm:py-10">
            <div className="w-14 h-14 rounded-full border border-baroque-400/40 bg-baroque-400/10 flex items-center justify-center mx-auto mb-4 text-baroque-300">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="font-cinzel text-lg font-bold gold-foil-text mb-1">
              Organizer Passcode
            </h3>
            <p className="font-sans text-xs text-baroque-200/70 mb-5">
              Enter wedding year or event date (Default: <strong className="text-baroque-300">2026</strong>)
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-3 font-sans">
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN"
                autoFocus
                className="w-full text-center tracking-widest text-lg font-bold px-4 py-2.5 rounded-xl bg-white text-navy-950 focus:outline-none focus:ring-2 focus:ring-baroque-400"
              />
              {pinError && (
                <p className="text-xs text-red-400">Incorrect PIN. Try 2026</p>
              )}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-baroque-300 hover:bg-baroque-200 active:scale-95 text-navy-950 font-bold text-xs uppercase tracking-wider shadow"
              >
                Access RSVP Database
              </button>
            </form>
          </div>
        ) : (
          // Authenticated Dashboard
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-baroque-400/20 pr-8 sm:pr-0">
              <div>
                <h3 className="font-cinzel text-base sm:text-xl font-bold gold-foil-text">
                  RSVP Database &amp; Guests
                </h3>
                <p className="font-sans text-[11px] sm:text-xs text-baroque-300/80">
                  Live SQLite records for Jeshfique &amp; Tamanna’s celebrations
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchData}
                  className="p-1.5 sm:p-2 rounded-xl border border-baroque-400/30 hover:bg-baroque-400/15 text-baroque-200 active:scale-95"
                  title="Refresh data"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <a
                  href="/api/export-rsvps"
                  download="Jeshfique_Tamanna_Wedding_RSVP_List.csv"
                  className="px-3 py-1.5 rounded-xl bg-baroque-300 hover:bg-baroque-200 active:scale-95 text-navy-950 text-xs font-bold inline-flex items-center gap-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </a>
              </div>
            </div>

            {/* Metric KPI Cards (Responsive grid) */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 my-3 sm:my-4">
                <div className="navy-gold-card rounded-xl p-2.5 sm:p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-baroque-300 text-[11px] sm:text-xs font-semibold mb-0.5">
                    <Users className="w-3 h-3" />
                    <span>Total Confirmed</span>
                  </div>
                  <div className="font-cinzel text-xl sm:text-2xl font-bold gold-foil-text">
                    {stats.total_confirmed_guests}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-baroque-200/70">
                    {stats.total_submissions} RSVPs
                  </div>
                </div>

                <div className="navy-gold-card rounded-xl p-2.5 sm:p-3 text-center">
                  <div className="text-baroque-300 text-[11px] sm:text-xs font-semibold mb-0.5">
                    🌼 Holud (25 Dec)
                  </div>
                  <div className="font-cinzel text-xl sm:text-2xl font-bold gold-foil-text">
                    {(stats.breakdown?.both?.guests || 0) + (stats.breakdown?.holud_only?.guests || 0)}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-baroque-200/70">Guests expected</div>
                </div>

                <div className="navy-gold-card rounded-xl p-2.5 sm:p-3 text-center">
                  <div className="text-baroque-300 text-[11px] sm:text-xs font-semibold mb-0.5">
                    ✨ Reception (27 Dec)
                  </div>
                  <div className="font-cinzel text-xl sm:text-2xl font-bold gold-foil-text">
                    {(stats.breakdown?.both?.guests || 0) + (stats.breakdown?.reception_only?.guests || 0)}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-baroque-200/70">Guests expected</div>
                </div>

                <div className="navy-gold-card rounded-xl p-2.5 sm:p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-baroque-300 text-[11px] sm:text-xs font-semibold mb-0.5">
                    <XCircle className="w-3 h-3 text-red-400" />
                    <span>Regrets</span>
                  </div>
                  <div className="font-cinzel text-xl sm:text-2xl font-bold text-red-300">
                    {stats.breakdown?.unable?.submissions || 0}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-baroque-200/70">Unable</div>
                </div>
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 mb-3 text-xs font-sans">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search guest name, phone, email..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-navy-950/80 border border-baroque-400/30 text-baroque-100 placeholder-baroque-300/40 text-base sm:text-xs focus:outline-none focus:border-baroque-300"
                />
              </div>

              {/* Event Filter pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {['all', 'both', 'holud', 'reception', 'unable'].map((filterKey) => (
                  <button
                    key={filterKey}
                    type="button"
                    onClick={() => setFilterEvent(filterKey)}
                    className={`px-2.5 py-1 rounded-full uppercase text-[9px] sm:text-[10px] font-semibold transition-all whitespace-nowrap active:scale-95 ${
                      filterEvent === filterKey
                        ? 'bg-baroque-400 text-navy-950 font-bold'
                        : 'border border-baroque-400/30 text-baroque-200/80 hover:bg-baroque-400/15'
                    }`}
                  >
                    {filterKey}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile View: Guest Cards (sm:hidden) */}
            <div className="sm:hidden flex-1 overflow-y-auto space-y-2.5 pr-0.5">
              {filteredRsvps.length === 0 ? (
                <div className="p-6 text-center text-baroque-300/60 font-sans text-xs">
                  No RSVP records found matching your query.
                </div>
              ) : (
                filteredRsvps.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl bg-navy-900/80 border border-baroque-400/25 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-baroque-400 font-bold text-[10px] mr-1.5">
                          #{String(r.id).padStart(3, '0')}
                        </span>
                        <span className="font-semibold text-baroque-100 text-sm">
                          {r.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id, r.name)}
                        className="p-1 text-red-400 hover:bg-red-900/40 rounded-lg"
                        title="Delete RSVP"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[10px]">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                          r.attendance === 'both'
                            ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40'
                            : r.attendance === 'holud'
                            ? 'bg-amber-900/60 text-amber-300 border border-amber-500/40'
                            : r.attendance === 'reception'
                            ? 'bg-blue-900/60 text-blue-300 border border-blue-500/40'
                            : 'bg-red-900/60 text-red-300 border border-red-500/40'
                        }`}
                      >
                        {r.attendance}
                      </span>

                      <span className="text-baroque-200 font-medium">
                        Party: {r.attendance === 'unable' ? '0' : r.guests_count || 1}
                      </span>
                    </div>

                    {(r.phone || r.email) && (
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-baroque-300/80 font-mono pt-1 border-t border-baroque-400/10">
                        {r.phone && (
                          <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1 text-baroque-200 hover:underline">
                            <Phone className="w-3 h-3 text-baroque-400" />
                            <span>{r.phone}</span>
                          </a>
                        )}
                        {r.email && (
                          <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1 text-baroque-200 hover:underline">
                            <Mail className="w-3 h-3 text-baroque-400" />
                            <span>{r.email}</span>
                          </a>
                        )}
                      </div>
                    )}

                    {(r.dietary || r.message) && (
                      <p className="text-[11px] text-baroque-200/75 italic pt-0.5">
                        {r.dietary && <strong className="text-baroque-300 font-sans not-italic mr-1">[{r.dietary}]</strong>}
                        {r.message}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Desktop View: Full Table (hidden sm:block) */}
            <div className="hidden sm:block flex-1 overflow-y-auto rounded-2xl border border-baroque-400/25 bg-navy-950/60 font-sans text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-navy-900/90 text-baroque-300 uppercase text-[10px] tracking-wider sticky top-0 border-b border-baroque-400/20">
                  <tr>
                    <th className="p-3">#ID</th>
                    <th className="p-3">Guest</th>
                    <th className="p-3">Attendance</th>
                    <th className="p-3">Party</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Note / Message</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-baroque-400/10">
                  {filteredRsvps.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-baroque-300/60">
                        No RSVP records found matching your query.
                      </td>
                    </tr>
                  ) : (
                    filteredRsvps.map((r) => (
                      <tr key={r.id} className="hover:bg-baroque-400/5 transition-colors">
                        <td className="p-3 font-mono text-baroque-400 font-bold">
                          #{String(r.id).padStart(3, '0')}
                        </td>
                        <td className="p-3 font-medium text-baroque-100">
                          {r.name}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              r.attendance === 'both'
                                ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40'
                                : r.attendance === 'holud'
                                ? 'bg-amber-900/60 text-amber-300 border border-amber-500/40'
                                : r.attendance === 'reception'
                                ? 'bg-blue-900/60 text-blue-300 border border-blue-500/40'
                                : 'bg-red-900/60 text-red-300 border border-red-500/40'
                            }`}
                          >
                            {r.attendance}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-center text-baroque-200">
                          {r.attendance === 'unable' ? '0' : r.guests_count || 1}
                        </td>
                        <td className="p-3 text-baroque-200/80 font-mono text-[11px]">
                          <div>{r.phone || '—'}</div>
                          <div className="text-baroque-300/60 text-[10px]">{r.email || ''}</div>
                        </td>
                        <td className="p-3 max-w-xs truncate text-baroque-200/75" title={r.message}>
                          {r.dietary && (
                            <span className="text-baroque-300 font-semibold mr-1">[{r.dietary}]</span>
                          )}
                          {r.message || '—'}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDelete(r.id, r.name)}
                            className="p-1 rounded-lg hover:bg-red-900/50 text-red-400 transition-colors"
                            title="Delete RSVP"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
