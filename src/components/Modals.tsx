import React, { useState } from 'react';
import { FacilityNode } from '../types/facility';
import { FACILITY_NODES, MOCK_AUDIT_LOGS, MOCK_REGISTERS } from '../data/mockFacilityData';

interface NodeSwitcherModalProps {
  isOpen: boolean;
  activeNode: FacilityNode;
  onSelectNode: (node: FacilityNode) => void;
  onClose: () => void;
}

export const NodeSwitcherModal: React.FC<NodeSwitcherModalProps> = ({
  isOpen,
  activeNode,
  onSelectNode,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1c2028] border border-[#31353e] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#31353e] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd6fb] text-[20px]">domain</span>
            <h3 className="text-sm font-semibold text-[#dfe2ee]">
              Select Target Operational Node
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#869398] hover:text-[#dfe2ee] p-1 rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 space-y-2.5 max-h-[70vh] overflow-y-auto">
          {FACILITY_NODES.map((node) => {
            const isSelected = node.id === activeNode.id;
            return (
              <div
                key={node.id}
                onClick={() => {
                  onSelectNode(node);
                  onClose();
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#262a33] border-[#4cd6fb] shadow-[0_0_12px_rgba(76,214,251,0.2)]'
                    : 'bg-[#181c24] border-[#31353e]/80 hover:border-[#869398]/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#4cd6fb]/20 text-[#4cd6fb]' : 'bg-[#262a33] text-[#869398]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">corporate_fare</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#dfe2ee] truncate">{node.name}</div>
                    <div className="text-[11px] text-[#bcc9ce] truncate font-mono">
                      {node.region} • {node.cluster}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 pl-2 font-mono text-[11px]">
                  <span className="text-[#4edea3] flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                    {node.gatewaysActive} Active
                  </span>
                  <span className="text-[#869398]">{node.latencyMs}ms Latency</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDisconnect: () => void;
  onOpenAuditLogs: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onDisconnect,
  onOpenAuditLogs,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#1c2028] border border-[#31353e] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#31353e] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#dfe2ee]">Field Operator Session</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#869398] hover:text-[#dfe2ee] p-1 rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3.5">
          <div className="flex items-center gap-3 p-3 bg-[#262a33] rounded-xl border border-[#31353e]">
            <img
              alt="Alex Mercer"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-[#4cd6fb]/40"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx7nfL70jAEjAvvUxVPH5Yc9aA-0ce-Z7yuFU1XhEC6lgP1EF-VrRoYdWa_dTEg-Vj1RJM0mZuCxWt0-KQlzxvVCP4aQNRZBojegrzjF3VOZjGcvA2d0hOZv6X1gkq3LkIYLBzLdIcOVrMBqKZvR3XNn5b-6WcBxe65-MIe1JCfvHqOfAFk9kI6luBAu-VV6QI7zADGRjhGe_8y2uZCzZw16YRQewtdhcjmtsep7LXEE8JudaIJo7e"
            />
            <div className="min-w-0">
              <div className="text-sm font-bold text-[#dfe2ee]">Alex Mercer</div>
              <div className="text-xs text-[#bcc9ce]">Lead Field Engineer</div>
              <div className="text-[11px] text-[#4cd6fb] font-mono">Operator ID: #9942</div>
            </div>
          </div>

          <div className="p-3 bg-[#0a0e16] rounded-xl text-xs space-y-2 font-mono border border-[#31353e]/60">
            <div className="flex justify-between">
              <span className="text-[#869398]">Clearance:</span>
              <span className="text-[#4cd6fb] font-bold">Tier 3 Root</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#869398]">2FA Token:</span>
              <span className="text-[#4edea3]">YubiKey 5 FIPS (Active)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#869398]">Session TTL:</span>
              <span className="text-[#dfe2ee]">30 Minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#869398]">BACnet Peer:</span>
              <span className="text-[#dfe2ee]">10.240.18.99:47808</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAuditLogs();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee] text-xs font-semibold flex items-center justify-center gap-2 border border-[#31353e] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px] text-[#4cd6fb]">history</span>
            <span>View Operator Audit Trail</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onDisconnect();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-[#93000a]/20 hover:bg-[#93000a]/40 text-[#ffb4ab] text-xs font-semibold flex items-center justify-center gap-2 border border-[#ffb4ab]/30 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">logout</span>
            <span>Disconnect Session (Switch to Login)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface AuditLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogsModal: React.FC<AuditLogsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownloadCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Timestamp,Operator,Action,Status', ...MOCK_AUDIT_LOGS.map(l => `${l.id},${l.timestamp},"${l.operator}","${l.action}",${l.status}`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apex_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#1c2028] border border-[#31353e] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#31353e] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd6fb] text-[20px]">assignment</span>
            <h3 className="text-sm font-semibold text-[#dfe2ee]">
              Security &amp; Hardware Audit Logs
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#869398] hover:text-[#dfe2ee] p-1 rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            {MOCK_AUDIT_LOGS.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg bg-[#0a0e16] border border-[#31353e]/60 font-mono text-xs flex flex-col gap-1"
              >
                <div className="flex items-center justify-between text-[#869398] text-[10px]">
                  <span>{log.id}</span>
                  <span>{log.timestamp}</span>
                </div>
                <div className="text-[#dfe2ee] font-semibold">{log.action}</div>
                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <span className="text-[#bcc9ce]">{log.operator}</span>
                  <span className="text-[#4edea3]">{log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-[#31353e] bg-[#181c24] flex justify-end gap-2">
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="px-3 py-2 rounded-lg bg-[#4cd6fb] text-[#003642] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Download CSV Audit File</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface RegistersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegistersModal: React.FC<RegistersModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(MOCK_REGISTERS, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `node_8812_registers_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#1c2028] border border-[#31353e] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#31353e] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd6fb] text-[20px]">developer_board</span>
            <h3 className="text-sm font-semibold text-[#dfe2ee]">
              NODE-8812 Hardware Register Map
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#869398] hover:text-[#dfe2ee] p-1 rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto font-mono text-xs">
          {MOCK_REGISTERS.map((reg) => (
            <div
              key={reg.address}
              className="p-2.5 rounded-lg bg-[#0a0e16] border border-[#31353e]/60 flex items-center justify-between"
            >
              <div>
                <div className="text-[#4cd6fb] font-semibold">{reg.address} : {reg.name}</div>
                <div className="text-[10px] text-[#869398]">{reg.type} • Mode: {reg.access}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-[#4edea3]">{reg.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-[#31353e] bg-[#181c24] flex justify-end gap-2">
          <button
            type="button"
            onClick={handleDownloadJson}
            className="px-3 py-2 rounded-lg bg-[#4edea3] text-[#003824] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export Registers (JSON)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface OfflineDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineDiagnosticsModal: React.FC<OfflineDiagnosticsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [diagStep, setDiagStep] = useState(0);

  if (!isOpen) return null;

  const runDiagnostics = () => {
    setIsRunning(true);
    setDiagStep(1);
    setTimeout(() => {
      setDiagStep(2);
      setTimeout(() => {
        setDiagStep(3);
        setTimeout(() => {
          setDiagStep(4);
          setIsRunning(false);
        }, 800);
      }, 800);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1c2028] border border-[#31353e] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#31353e] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd6fb] text-[20px]">medical_services</span>
            <h3 className="text-sm font-semibold text-[#dfe2ee]">
              FIPS 140-3 Hardware Diagnostics
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#869398] hover:text-[#dfe2ee] p-1 rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 space-y-3 font-mono text-xs">
          <div className="p-3 bg-[#0a0e16] rounded-xl space-y-2 border border-[#31353e]/60">
            <div className="flex justify-between items-center">
              <span>Cryptographic HSM Self-Test:</span>
              <span className={diagStep >= 1 ? 'text-[#4edea3]' : 'text-[#869398]'}>
                {diagStep >= 1 ? 'PASSED (FIPS 140-3)' : 'Pending'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Opto-Coupler Isolation Resistance:</span>
              <span className={diagStep >= 2 ? 'text-[#4edea3]' : 'text-[#869398]'}>
                {diagStep >= 2 ? '&gt; 2.5 GΩ Nominal' : 'Pending'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>RS-485 Hardwire Loopback:</span>
              <span className={diagStep >= 3 ? 'text-[#4edea3]' : 'text-[#869398]'}>
                {diagStep >= 3 ? '0 CRC Errors' : 'Pending'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Triac Power Contactor Line:</span>
              <span className={diagStep >= 4 ? 'text-[#4edea3]' : 'text-[#869398]'}>
                {diagStep >= 4 ? '24/24 Verified' : 'Pending'}
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={isRunning}
            onClick={runDiagnostics}
            className="w-full py-2.5 rounded-xl bg-[#4cd6fb] text-[#003642] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow disabled:opacity-75"
          >
            {isRunning ? (
              <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
            ) : (
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
            )}
            <span>{isRunning ? 'Running Hardware Probes...' : 'Execute Diagnostic Sweep'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
