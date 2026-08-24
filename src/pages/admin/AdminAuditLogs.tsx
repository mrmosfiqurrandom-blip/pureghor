import React from 'react';
import { useStore } from '../../context/StoreContext';

export const AdminAuditLogs: React.FC = () => {
  const { auditLogs } = useStore();

  return (
    <div className="space-y-6 font-['Hind_Siliguri']">
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#E5E0D5] flex items-center justify-between shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-[#123B2A]">অডিট লগ ও পরিবর্তন ইতিহাস</h2>
          <p className="text-xs text-gray-500">অ্যাডমিন কার্যকলাপ ও সিকিউরিটি ট্র্যাকিং</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E5E0D5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF6EE] text-gray-500 uppercase tracking-wider font-bold border-b border-[#E5E0D5]">
                <th className="p-4">সময়</th>
                <th className="p-4">অ্যাডমিন</th>
                <th className="p-4">অ্যাকশন</th>
                <th className="p-4">টার্গেট</th>
                <th className="p-4">আইডি</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D5]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAF6EE]/30">
                  <td className="p-4 font-mono text-gray-400">
                    {new Date(log.timestamp).toLocaleString('bn-BD')}
                  </td>
                  <td className="p-4 font-bold text-[#123B2A]">{log.performedByEmail || log.performedBy}</td>
                  <td className="p-4">
                    <span className="bg-[#1F6B45]/10 text-[#1F6B45] font-bold px-2 py-0.5 rounded text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-gray-600">{log.collection}</td>
                  <td className="p-4 text-gray-700 font-mono">{log.documentId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
