import React, { useState, useEffect } from 'react';
import { FiShield, FiCalendar, FiUser, FiActivity } from 'react-icons/fi';
import api from '../../services/api';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/audit-logs', { params: { page } });
      setLogs(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch logs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security Audit Logs</h1>
        <p className="text-sm text-gray-500">Track all administrative actions performed on the platform.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Admin</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Resource</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">Loading audit history...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">No logs found.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                    <td className="px-6 py-4">
                      <p className="font-bold">{log.User?.firstName} {log.User?.lastName}</p>
                      <p className="text-xs text-gray-500">{log.User?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase
                        ${log.action.includes('BLOCK') || log.action.includes('REJECT') ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}
                      >
                        {log.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-700">{log.resourceType}</p>
                      <p className="text-[10px] text-gray-400 font-mono">ID: {log.resourceId?.substring(0, 8)}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{log.ipAddress || 'Unknown'}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
            <div className="flex space-x-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
