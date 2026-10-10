import React, { useState } from 'react';
import { FacilityNode } from '../types/facility';

interface AuthScreenProps {
  activeNode: FacilityNode;
  onOpenNodeSwitcher: () => void;
  onAuthenticate: (email: string) => void;
  onOpenDiagnostics: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  activeNode,
  onOpenNodeSwitcher,
  onAuthenticate,
  onOpenDiagnostics,
}) => {
  const [operatorId, setOperatorId] = useState('operator@apextelemetry.io');
  const [securityKey, setSecurityKey] = useState('SecureNodeToken994!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberKey, setRememberKey] = useState(true);
  const [hardwireBypass, setHardwireBypass] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStepMessage, setAuthStepMessage] = useState('Authenticate & Connect Session');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthenticating) return;

    setIsAuthenticating(true);
    setAuthStepMessage('Verifying BACnet/SC 2.4 Keys...');

    setTimeout(() => {
      setAuthStepMessage('ECDSA Attestation Verified • Loading OS...');
      setTimeout(() => {
        setIsAuthenticating(false);
        onAuthenticate(operatorId);
      }, 1000);
    }, 900);
  };

  const handleBiometrics = () => {
    if (isAuthenticating) return;
    setIsAuthenticating(true);
    setAuthStepMessage('Querying WebAuthn FIDO2 Authenticator...');

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([30, 40, 30]);
      } catch {
        // ignore
      }
    }

    setTimeout(() => {
      setAuthStepMessage('TouchID Biometric Token Accepted');
      setTimeout(() => {
        setIsAuthenticating(false);
        onAuthenticate(operatorId);
      }, 700);
    }, 900);
  };

  const handleSSO = (provider: string) => {
    setIsAuthenticating(true);
    setAuthStepMessage(`Handshaking ${provider} Identity Provider...`);
    setTimeout(() => {
      setIsAuthenticating(false);
      onAuthenticate(`sso.${operatorId}`);
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-[#0f131c] text-[#dfe2ee] flex flex-col justify-between selection:bg-[#4cd6fb] selection:text-[#003642] relative overflow-x-hidden">
      {/* Top System Ribbon */}
      <header className="fixed top-0 inset-x-0 z-30 pt-safe bg-[#0f131c]/80 backdrop-blur-xl border-b border-[#31353e]/30">
        <div className="h-12 px-4 flex items-center justify-between text-[#bcc9ce] text-[11px] max-w-lg mx-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span className="uppercase tracking-wider font-semibold text-[#dfe2ee]">
              SYS ONLINE
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">wifi</span>
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span className="font-mono text-[#dfe2ee] font-medium">99.98%</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex flex-col flex-1 w-full pt-16 pb-20 px-4 max-w-md mx-auto relative z-10">
        {/* Brand & System Status Hero */}
        <div className="relative flex flex-col items-center text-center pt-3 pb-5 overflow-hidden">
          {/* Ambient Emissive Background Glow */}
          <div className="absolute -top-10 w-48 h-48 rounded-full bg-[#4cd6fb]/10 blur-3xl pointer-events-none"></div>
          <div className="absolute top-8 w-24 h-24 rounded-full bg-[#4edea3]/10 blur-2xl pointer-events-none"></div>

          {/* Hexagonal Brand Mark with Radial Halo */}
          <div className="relative mb-3 group">
            <div className="absolute inset-0 rounded-2xl bg-[#4cd6fb]/20 blur-xl transform scale-110 group-hover:scale-125 transition-transform duration-500"></div>
            <div className="relative w-[76px] h-[76px] rounded-2xl bg-[#262a33] p-1.5 flex items-center justify-center shadow-[0_4px_24px_rgba(76,214,251,0.25)] border border-[#4cd6fb]/30">
              <img
                alt="Apex Facility OS Telemetry Hexagon Core Logo"
                className="w-full h-full object-contain rounded-xl"
                src="https://lh3.googleusercontent.com/aida/AEtjO1UtSWjjLFxhbc3rgi8ZV3Kc8WB9lzTrgz4M1vObBNlksw6YZnl7rL6ezYXb8NA2l--iYUVGYycq3meUwOosPnScSrXldM6r-GMqDHYYFLRww5NocV3btSpiEO0JwAtwL52GN98WXXel6YRHuolX_FWotqZ1MpcqCq6AxeAwCxsE1zyJ0cBcb_Q_1BZwl0tSdsU9XKoxa8ub1uzl1svKN6ZeUiZIiAG9NUZLbAhhrT5jMc__2bVfiSOYksw"
              />
            </div>
          </div>

          {/* Title Hierarchy */}
          <h1 className="text-2xl text-[#dfe2ee] tracking-tight font-bold">
            Apex Facility OS
          </h1>
          <p className="text-xs text-[#bcc9ce] max-w-[280px] mt-1 leading-snug">
            Autonomous Building Management &amp; Industrial IoT Telemetry
          </p>

          {/* Protocol Security Telemetry Pill */}
          <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-[#262a33] shadow-sm border border-[#31353e]/60">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse shadow-[0_0_8px_rgba(78,222,163,0.8)]"></span>
            <span className="text-[11px] text-[#dfe2ee] uppercase tracking-wider font-semibold font-mono">
              BACnet/SC 2.4 Encrypted • Cluster {activeNode.firmware.replace('-rt', '')}
            </span>
          </div>
        </div>

        {/* Operational Tenant / Cluster Switcher */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <span className="text-[11px] uppercase tracking-wider text-[#bcc9ce] font-semibold">
              Target Operational Node
            </span>
            <span className="text-[11px] text-[#4cd6fb] flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
              {activeNode.status.toUpperCase()}
            </span>
          </div>
          <div className="relative bg-[#181c24] rounded-xl p-2.5 flex items-center justify-between shadow-md border border-[#31353e]/60 hover:border-[#4cd6fb]/40 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#262a33] flex items-center justify-center text-[#4cd6fb] shrink-0 border border-[#31353e]">
                <span className="material-symbols-outlined text-[20px]">domain</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm text-[#dfe2ee] truncate font-semibold">
                  {activeNode.name}
                </span>
                <span className="text-xs text-[#869398] truncate">
                  {activeNode.region} • {activeNode.cluster}
                </span>
              </div>
            </div>
            <button
              type="button"
              aria-label="Change target facility cluster"
              onClick={onOpenNodeSwitcher}
              className="shrink-0 px-2.5 py-1.5 rounded-lg bg-[#262a33] text-[#4cd6fb] hover:bg-[#353942] flex items-center gap-1 transition-colors cursor-pointer text-xs font-semibold"
            >
              <span>SWITCH</span>
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>
          </div>
        </div>

        {/* Authentication Panel */}
        <div className="bg-[#1c2028] rounded-2xl p-4 shadow-xl flex flex-col gap-4 relative overflow-hidden border border-[#31353e]/80">
          {/* Top Emissive Decorative Strip */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#4cd6fb] to-transparent opacity-80"></div>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-3.5">
            {/* Operator Credential Input */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="operatorId"
                className="text-[11px] text-[#bcc9ce] uppercase tracking-wider font-semibold flex items-center justify-between"
              >
                <span>Operator ID / Enterprise Email</span>
                <span className="text-[#869398] font-normal lowercase font-mono">ldap • scim</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 material-symbols-outlined text-[#869398] pointer-events-none text-[20px]">
                  badge
                </span>
                <input
                  id="operatorId"
                  name="operatorId"
                  type="email"
                  required
                  autoComplete="username"
                  value={operatorId}
                  onChange={(e) => setOperatorId(e.target.value)}
                  placeholder="operator@apextelemetry.io"
                  className="w-full bg-[#0a0e16] text-[#dfe2ee] placeholder:text-[#869398] text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#4cd6fb] border border-[#31353e]/60 transition-all font-mono"
                />
              </div>
            </div>

            {/* Gateway Passcode Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="securityKey"
                  className="text-[11px] text-[#bcc9ce] uppercase tracking-wider font-semibold"
                >
                  Security Gateway Key
                </label>
                <button
                  type="button"
                  onClick={() => alert('Credentials recovery initiated. Physical USB hardware security token required at server plenum.')}
                  className="text-[11px] text-[#4cd6fb] hover:underline cursor-pointer"
                >
                  Forgot Credentials?
                </button>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 material-symbols-outlined text-[#869398] pointer-events-none text-[20px]">
                  key
                </span>
                <input
                  id="securityKey"
                  name="securityKey"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={securityKey}
                  onChange={(e) => setSecurityKey(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0a0e16] text-[#dfe2ee] placeholder:text-[#869398] text-sm rounded-xl pl-11 pr-11 py-3 focus:outline-none focus:ring-1 focus:ring-[#4cd6fb] border border-[#31353e]/60 transition-all tracking-wider font-mono"
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#869398] hover:text-[#dfe2ee] p-1 flex items-center transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Hardware Key Toggle Switch */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4edea3] text-[18px]">
                  security
                </span>
                <span className="text-xs text-[#bcc9ce]">
                  Remember hardware session key
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberKey}
                  onChange={(e) => setRememberKey(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#31353e] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#dfe2ee] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00b4d8] shadow-inner"></div>
              </label>
            </div>

            {/* Primary Action CTA */}
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#4cd6fb] text-[#003642] text-sm font-bold flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,180,216,0.35)] active:scale-[0.99] transition-transform cursor-pointer disabled:opacity-75"
            >
              {isAuthenticating ? (
                <span className="material-symbols-outlined text-[20px] animate-spin">
                  refresh
                </span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">bolt</span>
              )}
              <span>{authStepMessage}</span>
            </button>
          </form>

          {/* WebAuthn / Biometrics Quick Login */}
          <button
            type="button"
            onClick={handleBiometrics}
            disabled={isAuthenticating}
            className="w-full py-3 px-4 rounded-xl bg-[#262a33] hover:bg-[#353942] text-[#dfe2ee] text-xs flex items-center justify-center gap-2.5 transition-colors shadow-sm border border-[#31353e] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#4edea3] text-[22px]">
              fingerprint
            </span>
            <span className="font-medium">Quick Sign In with WebAuthn / TouchID</span>
          </button>
        </div>

        {/* Enterprise SSO Identity Providers */}
        <div className="mt-4 flex flex-col gap-3">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full bg-[#31353e] h-[1px]"></div>
            </div>
            <span className="relative px-3 bg-[#0f131c] text-[#869398] text-[10px] uppercase tracking-widest font-semibold">
              Enterprise Identity Mesh
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSSO('SAML / Okta')}
              className="flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl bg-[#181c24] hover:bg-[#1c2028] text-[#dfe2ee] text-xs transition-colors border border-[#31353e]/60 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#4cd6fb] text-[18px]">
                verified_user
              </span>
              <span className="truncate font-medium">SAML / Okta</span>
            </button>
            <button
              type="button"
              onClick={() => handleSSO('Microsoft Entra ID')}
              className="flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl bg-[#181c24] hover:bg-[#1c2028] text-[#dfe2ee] text-xs transition-colors border border-[#31353e]/60 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#00b4d8] text-[18px]">
                cloud_sync
              </span>
              <span className="truncate font-medium">Microsoft Entra</span>
            </button>
          </div>
        </div>

        {/* Operational Health & Security Micro-Stats */}
        <div className="mt-4 bg-[#0a0e16] rounded-xl p-3 flex flex-col gap-2.5 shadow-sm border border-[#31353e]/60">
          <div className="flex items-center justify-between text-[#bcc9ce] text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#4edea3] text-[16px]">hub</span>
              <span className="text-[#dfe2ee] font-semibold font-mono">
                {activeNode.gatewaysActive} of {activeNode.totalGateways}
              </span>{' '}
              Gateways Active
            </span>
            <span className="font-semibold text-[#4edea3] flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-ping"></span>
              {activeNode.latencyMs}ms Latency
            </span>
          </div>
          <div className="w-full bg-[#31353e] rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-[#4edea3] to-[#4cd6fb] h-full w-full rounded-full"></div>
          </div>
          <div className="flex items-center justify-between text-xs text-[#869398] pt-0.5">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">shield</span>
              FIPS 140-3 Level 2 Verified
            </span>
            <button
              type="button"
              onClick={onOpenDiagnostics}
              className="text-[#4cd6fb] hover:underline flex items-center gap-0.5 text-[11px] uppercase tracking-wide font-semibold cursor-pointer"
            >
              <span>Offline Diagnostics</span>
              <span className="material-symbols-outlined text-[12px]">open_in_new</span>
            </button>
          </div>
        </div>

        {/* Field Technician Emergency Support */}
        <div className="mt-3 text-center">
          <p className="text-xs text-[#869398]">
            Isolated industrial field unit?{' '}
            <button
              type="button"
              onClick={() => {
                setHardwireBypass(!hardwireBypass);
                alert(
                  hardwireBypass
                    ? 'Returned to Ethernet BACnet/SC 2.4 Mode.'
                    : 'Switched to RS-485 Hardwire Bypass (Baud 19200, 8-N-1 Opto-Isolated).'
                );
              }}
              className="text-[#bcc9ce] underline hover:text-[#4cd6fb] transition-colors ml-1 cursor-pointer"
            >
              {hardwireBypass ? 'Switch back to BACnet/SC' : 'Switch to RS-485 Hardwire Bypass'}
            </button>
          </p>
        </div>
      </main>

      {/* Security Footer */}
      <footer className="fixed bottom-0 inset-x-0 z-30 pb-safe bg-[#0f131c]/80 backdrop-blur-xl border-t border-[#31353e]/30 shadow-[0_-4px_16px_rgba(0,0,0,0.3)]">
        <div className="h-12 px-4 flex items-center justify-between text-[11px] text-[#869398] max-w-md mx-auto">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[#4cd6fb] text-[16px]">
              verified_user
            </span>
            <span className="uppercase tracking-wider text-[#bcc9ce] font-semibold">
              SOC2 TYPE II • ISO 27001
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#bcc9ce] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cd6fb]"></span>
            <span>v4.18.0-PROD</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
