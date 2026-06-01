import { useState } from 'react';
import { Moon, Sun, Building2, Clock, RefreshCw, User, Shield, Save, AlertTriangle } from 'lucide-react';
import { getSettings, saveSettings, resetAllData } from '@/utils/localStorage';
import { AppSettings } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SettingsProps {
  darkMode: boolean;
  onToggleDark: () => void;
}

export default function Settings({ darkMode, onToggleDark }: SettingsProps) {
  const [settings, setSettings] = useState<AppSettings>(getSettings);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveSettings({ ...settings, darkMode });
    setSaved(true);
    toast.success('Settings saved successfully');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetAllData();
    setResetConfirm(false);
    toast.success('All data has been reset. Refreshing...');
    setTimeout(() => window.location.reload(), 1500);
  };

  const Section = ({ title, icon: Icon, children }: { title: string; icon: typeof Building2; children: React.ReactNode }) => (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
          <Icon size={16} className="text-accent-foreground" />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );

  const inputCls = 'w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all';

  return (
    <div className="max-w-2xl space-y-6">
      {/* Appearance */}
      <Section title="Appearance" icon={darkMode ? Moon : Sun}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Dark Mode</p>
            <p className="text-xs text-muted-foreground mt-0.5">Toggle between light and dark theme</p>
          </div>
          <button
            onClick={onToggleDark}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
              darkMode ? 'bg-primary' : 'bg-muted-foreground/30'
            )}
            role="switch"
            aria-checked={darkMode}
          >
            <span className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
              darkMode ? 'translate-x-6' : 'translate-x-1'
            )} />
          </button>
        </div>
      </Section>

      {/* Company */}
      <Section title="Company Settings" icon={Building2}>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Company Name</label>
          <input
            type="text"
            value={settings.companyName}
            onChange={e => setSettings(s => ({ ...s, companyName: e.target.value }))}
            className={inputCls}
            placeholder="Your Company Name"
          />
        </div>
      </Section>

      {/* Work Hours */}
      <Section title="Work Schedule" icon={Clock}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Work Start Time</label>
            <input
              type="time"
              value={settings.workStartTime}
              onChange={e => setSettings(s => ({ ...s, workStartTime: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Work End Time</label>
            <input
              type="time"
              value={settings.workEndTime}
              onChange={e => setSettings(s => ({ ...s, workEndTime: e.target.value }))}
              className={inputCls}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Employees checking in after start time will be marked as "Late".</p>
      </Section>

      {/* Profile */}
      <Section title="Profile" icon={User}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Sample Accounts</label>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">AA</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Alex Admin</p>
                    <p className="text-xs text-muted-foreground">Username: Admin · Password: admin123</p>
                  </div>
                </div>
                <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full font-medium">Admin</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold">EE</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Emma Employee</p>
                    <p className="text-xs text-muted-foreground">Username: Employee · Password: emp123</p>
                  </div>
                </div>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full font-medium">Employee</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Danger Zone */}
      <Section title="Data Management" icon={Shield}>
        <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-destructive mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Reset All Data</p>
              <p className="text-xs text-muted-foreground mt-1 mb-3">This will permanently delete all employees, attendance records, and settings. This action cannot be undone.</p>
              <button
                onClick={() => setResetConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <RefreshCw size={14} />
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* Save button */}
      <div className="flex justify-end pb-4">
        <button
          onClick={handleSave}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all',
            saved ? 'bg-emerald-500 text-white' : 'bg-primary text-primary-foreground hover:opacity-90'
          )}
        >
          <Save size={16} />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      {/* Reset confirm dialog */}
      {resetConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border p-6 max-w-sm w-full shadow-2xl animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle size={20} className="text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Reset All Data?</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-6">All employees, attendance records, and settings will be permanently deleted and reset to defaults.</p>
            <div className="flex gap-3">
              <button onClick={() => setResetConfirm(false)} className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                Cancel
              </button>
              <button onClick={handleReset} className="flex-1 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
