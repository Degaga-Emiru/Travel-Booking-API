import React, { useState, useEffect } from 'react';
import { FiShield, FiSearch, FiChevronDown, FiChevronRight, FiFilter } from 'react-icons/fi';
import api from '../../services/api';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (actionFilter) params.action = actionFilter;
      if (resourceFilter) params.resourceType = resourceFilter;
      const response = await api.get('/admin/audit-logs', { params });
      setLogs(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.count);
    } catch (error) {
      console.error('Failed to fetch logs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, [page, search, actionFilter, resourceFilter]);

  const getActionColor = (action) => {
    if (!action) return 'bg-gray-50 text-gray-600';
    const a = action.toUpperCase();
    if (a.includes('BLOCK') || a.includes('REJECT') || a.includes('DISABLE') || a.includes('CANCEL')) return 'bg-rose-50 text-rose-600';
    if (a.includes('APPROVE') || a.includes('VERIFIED') || a.includes('ENABLE') || a.includes('UNBLOCK')) return 'bg-emerald-50 text-emerald-600';
    if (a.includes('UPDATE') || a.includes('PROCESS')) return 'bg-blue-50 text-blue-600';
    if (a.includes('EXPORT')) return 'bg-purple-50 text-purple-600';
    if (a.includes('REFUND')) return 'bg-amber-50 text-amber-600';
    return 'bg-gray-50 text-gray-600';
  };

  const resourceTypes = ['User', 'VendorProfile', 'Booking', 'RefundRequest', 'Payment', 'Flight', 'Hotel', 'Car'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center"><FiShield className="mr-2 text-blue-600" /> Security Audit Logs</h1>
          <p className="text-sm text-gray-500">Track all administrative actions. <span className="font-bold text-blue-600">{totalCount}</span> total entries.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <FiFilter className="text-gray-400" />
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by admin name..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none" value={actionFilter} onChange={e => { setActionFilter(e.target.value); setPage(1); }}>
          <option value="">All Actions</option>
          <option value="BLOCK">Block</option>
          <option value="UNBLOCK">Unblock</option>
          <option value="VENDOR">Vendor</option>
          <option value="REFUND">Refund</option>
          <option value="BOOKING">Booking</option>
          <option value="ENABLE">Enable</option>
          <option value="DISABLE">Disable</option>
          <option value="EXPORT">Export</option>
          <option value="UPDATE">Update</option>
        </select>
        <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none" value={resourceFilter} onChange={e => { setResourceFilter(e.target.value); setPage(1); }}>
          <option value="">All Resources</option>
          {resourceTypes.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        {(search || actionFilter || resourceFilter) && (
          <button onClick={() => { setSearch(''); setActionFilter(''); setResourceFilter(''); setPage(1); }}
            className="px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors">Clear</button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-4 py-4 w-8"></th>
                <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Admin</th>
                <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Resource</th>
                <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">IP Address</th>
                <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">Loading audit history...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">No logs found.</td></tr>
              ) : (
                logs.map(log => (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-gray-50/50 transition-colors text-sm cursor-pointer" onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}>
                      <td className="px-4 py-4 text-gray-400">
                        {log.details && Object.keys(log.details).length > 0 ? (expandedRow === log.id ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />) : null}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-bold">{log.User?.firstName} {log.User?.lastName}</p>
                        <p className="text-xs text-gray-500">{log.User?.email}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${getActionColor(log.action)}`}>
                          {log.action?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-700">{log.resourceType}</p>
                        <p className="text-[10px] text-gray-400 font-mono">ID: {log.resourceId?.substring(0, 8) || '—'}</p>
                      </td>
                      <td className="px-4 py-4 text-gray-500 font-mono text-xs">{log.ipAddress || 'Unknown'}</td>
                      <td className="px-4 py-4 text-xs text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                    {expandedRow === log.id && log.details && (
                      <tr>
                        <td colSpan="6" className="px-8 py-4 bg-gray-50/80">
                          <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">Action Details</p>
                          <pre className="text-xs text-gray-600 bg-white p-4 rounded-xl border border-gray-100 overflow-x-auto font-mono">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs text-gray-400">Page {page} of {totalPages} · {totalCount} total</span>
            <div className="flex space-x-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs disabled:opacity-50">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
