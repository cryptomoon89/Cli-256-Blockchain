import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OnboardingFlow from '@/components/OnboardingFlow';
import { analytics } from '@/utils/analytics';
import {
  Activity,
  Blocks,
  Coins,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Database,
  Network,
  Clock,
  CheckCircle,
  AlertTriangle,
  Cpu,
  HardDrive,
  Globe
} from 'lucide-react';

interface NetworkStats {
  blockHeight: number;
  totalTransactions: number;
  activeNodes: number;
  hashRate: string;
  marketCap: string;
  circulation: string;
  validators: number;
  tps: number;
}

interface NodeStatus {
  id: string;
  status: 'online' | 'offline' | 'syncing';
  location: string;
  uptime: string;
  lastSeen: string;
}

export default function Index() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('modern');

  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    blockHeight: 2547893,
    totalTransactions: 15847362,
    activeNodes: 127,
    hashRate: '1.2 TH/s',
    marketCap: '$892.5M',
    circulation: '21.4M CLI256',
    validators: 45,
    tps: 3247
  });

  const [nodes, setNodes] = useState<NodeStatus[]>([
    { id: 'node-001', status: 'online', location: 'US-East', uptime: '99.8%', lastSeen: '2s ago' },
    { id: 'node-002', status: 'online', location: 'EU-West', uptime: '99.9%', lastSeen: '1s ago' },
    { id: 'node-003', status: 'syncing', location: 'Asia-Pacific', uptime: '98.2%', lastSeen: '5s ago' },
    { id: 'node-004', status: 'online', location: 'US-West', uptime: '99.7%', lastSeen: '3s ago' },
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Track page view
    analytics.trackPageView('/dashboard');
    analytics.trackFeatureUsage('dashboard', 'loaded');

    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate real-time updates
      setNetworkStats(prev => {
        const newStats = {
          ...prev,
          blockHeight: prev.blockHeight + Math.floor(Math.random() * 2),
          tps: 3000 + Math.floor(Math.random() * 500)
        };

        // Track performance metrics
        analytics.trackPerformance('network_update', Date.now());

        return newStats;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-primary';
      case 'offline': return 'bg-red-500';
      case 'syncing': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return;

    setIsAnimating(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setIsAnimating(false);
    }, 150);
  };

  const isTabActive = (tabId: string) => activeTab === tabId;

  const themes = [
    { id: 'dark', name: 'Dark', color: '#8B5CF6' },
    { id: 'neon-blue', name: 'Neon Blue', color: '#00BFFF' },
    { id: 'matrix-green', name: 'Matrix Green', color: '#00FF00' },
    { id: 'fire-orange', name: 'Fire Orange', color: '#FF4500' },
    { id: 'ice-blue', name: 'Ice Blue', color: '#87CEEB' },
    { id: 'pink-cyber', name: 'Pink Cyber', color: '#FF1493' },
    { id: 'gold-luxury', name: 'Gold Luxury', color: '#FFD700' }
  ];

  const changeTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    // Use default modern theme
    document.documentElement.removeAttribute('data-theme');
  };

  useEffect(() => {
    // Initialize theme
    changeTheme(currentTheme);
  }, []);

  return (
    <div className="min-h-screen bg-background relative subtle-pattern overflow-hidden">
      {/* Onboarding Flow */}
      <OnboardingFlow />

      {/* Modern background effect */}
      <div className="modern-bg"></div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="border-b-2 border-primary bg-background/95 backdrop-blur-sm relative z-10 cyber-glow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-14 w-14 bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center cyber-glow relative overflow-hidden">
                <Blocks className="h-9 w-9 text-black animate-pixel-pulse relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-scan-line"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight modern-glow">
                  CLI256 BLOCKCHAIN
                </h1>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-muted-foreground font-medium">
                    Layer-1 Proof-of-Authority Network
                  </p>
                  <span className="animate-terminal-cursor text-primary">_</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">

              <div className="flex items-center px-4 py-2 modern-card">
                <div className="w-3 h-3 bg-primary mr-3 animate-pulse rounded-full"></div>
                <span className="text-primary font-medium text-sm">NETWORK ONLINE</span>
              </div>
              <button className="modern-btn text-sm">
                <Link to="/developer">Developer Console</Link>
              </button>
              <button className="modern-btn text-sm">
                <Link to="/blockchain">Blockchain Manager</Link>
              </button>
              <div className="px-3 py-2 text-sm text-muted-foreground border border-border rounded-md">
                CLI Wallet Only
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section with Modern Design */}
        <div className="mb-8 relative overflow-hidden rounded-xl modern-card">
          <div className="relative h-48 md:h-64 lg:h-80 bg-gradient-to-br from-background to-card">
            <img
              src="https://cdn.builder.io/o/assets%2F097121b3ff954ae893416ecd3a451b7f%2Fc4610bfd0f524c168b9562a83bb767f9?alt=media&token=90e03622-c954-4dd1-b952-77a3a38910ca&apiKey=097121b3ff954ae893416ecd3a451b7f"
              alt="CLI256 Blockchain Network"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>

            {/* Hero Content Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-6">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight modern-glow">
                  CLI256 NETWORK
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Advanced blockchain infrastructure built for enterprise-grade applications with proof-of-authority consensus
                </p>
                <div className="flex items-center justify-center space-x-8 mt-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-foreground">Secure</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-foreground">Scalable</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-foreground">Reliable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Network Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
          <div className="modern-card p-6 group">
            <div className="flex flex-row items-center justify-between pb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Block Height</h3>
              <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                <Blocks className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
              {networkStats.blockHeight.toLocaleString()}
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <p className="text-xs text-muted-foreground">
                +2.3% last hour
              </p>
            </div>
          </div>

          <div className="modern-card p-6 group">
            <div className="flex flex-row items-center justify-between pb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Total Transactions</h3>
              <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                <Activity className="h-5 w-5 text-accent" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
              {networkStats.totalTransactions.toLocaleString()}
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <p className="text-xs text-muted-foreground">
                {networkStats.tps} TPS current
              </p>
            </div>
          </div>

          <div className="modern-card p-6 group">
            <div className="flex flex-row items-center justify-between pb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Active Nodes</h3>
              <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                <Network className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
              {networkStats.activeNodes}
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <p className="text-xs text-muted-foreground">
                {networkStats.validators} validators
              </p>
            </div>
          </div>

          <div className="modern-card p-6 group">
            <div className="flex flex-row items-center justify-between pb-4">
              <h3 className="text-sm font-medium text-muted-foreground">CLI256 Supply</h3>
              <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                <Coins className="h-5 w-5 text-accent" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
              {networkStats.circulation}
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-green-500" />
              <p className="text-xs text-muted-foreground">
                MCap: {networkStats.marketCap}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Main Dashboard Content */}
        <div className="space-y-6 relative z-10">
          <div className="flex w-full modern-card p-1">
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 ${
                isTabActive('overview')
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
              onClick={() => handleTabChange('overview')}
            >
              Network Overview
            </button>
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 ${
                isTabActive('nodes')
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
              onClick={() => handleTabChange('nodes')}
            >
              Node Status
            </button>
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 ${
                isTabActive('transactions')
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
              onClick={() => handleTabChange('transactions')}
            >
              Transactions
            </button>
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 ${
                isTabActive('contracts')
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
              onClick={() => handleTabChange('contracts')}
            >
              Smart Contracts
            </button>
          </div>

          {/* Tab Content with Smooth Transitions */}
          <div className={`space-y-6 mt-6 transition-all duration-300 ${
            isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
          }`}>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Network Health */}
              <div className="modern-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    Network Health
                  </h2>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Network Uptime</span>
                      <span className="text-sm font-semibold text-green-600">99.97%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{width: '99.97%'}}></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Consensus Health</span>
                      <span className="text-sm font-semibold text-green-600">100%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{width: '100%'}}></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Node Synchronization</span>
                      <span className="text-sm font-semibold text-yellow-600">98.4%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full transition-all duration-500" style={{width: '98.4%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="modern-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Clock className="h-6 w-6 text-accent" />
                  <h2 className="text-xl font-semibold text-foreground">
                    Recent Activity
                  </h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4 p-3 bg-secondary/50 rounded-lg border border-border/50">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Block #2547893 mined successfully</p>
                      <p className="text-xs text-muted-foreground">2 seconds ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-secondary/50 rounded-lg border border-border/50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">New validator joined network</p>
                      <p className="text-xs text-muted-foreground">1 minute ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-secondary/50 rounded-lg border border-border/50">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">CLI256 contract updated</p>
                      <p className="text-xs text-muted-foreground">5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-secondary/50 rounded-lg border border-border/50">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Network upgrade deployed</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 mt-6 hidden" id="nodes-content">
            <div className="retro-card p-6">
              <h2 className="text-xl font-mono font-bold text-primary neon-glow mb-6">
                NODE_NETWORK_STATUS
              </h2>
              <div className="space-y-4">
                {nodes.map((node) => (
                  <div key={node.id} className="flex items-center justify-between p-4 bg-card border border-primary/30">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 ${getStatusColor(node.status)} animate-pixel-pulse`}></div>
                      <div>
                        <p className="font-mono font-bold text-primary">{node.id}</p>
                        <p className="text-sm font-mono text-primary/70">&gt; {node.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-bold text-primary">{node.uptime} UPTIME</p>
                      <p className="text-xs font-mono text-primary/70">LAST SEEN: {node.lastSeen}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 mt-6 hidden" id="transactions-content">
            <div className="retro-card p-6">
              <h2 className="text-xl font-mono font-bold text-primary neon-glow mb-6">
                RECENT_TRANSACTIONS
              </h2>
              <div className="text-center py-12">
                <Activity className="h-16 w-16 mx-auto text-primary mb-6 animate-pixel-pulse" />
                <p className="text-primary font-mono mb-6">&gt; TRANSACTION MONITORING INTERFACE</p>
                <button className="pixel-btn font-mono text-sm font-bold">
                  <Link to="/transactions" className="text-black">VIEW ALL TRANSACTIONS</Link>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6 mt-6 hidden" id="contracts-content">
            <div className="retro-card p-6">
              <h2 className="text-xl font-mono font-bold text-primary neon-glow mb-6">
                SMART_CONTRACT_MANAGEMENT
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-card border border-primary/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-mono font-bold text-primary">CLI256 NATIVE TOKEN</h3>
                      <p className="text-sm font-mono text-primary/70">&gt; NATIVE BLOCKCHAIN TOKEN CONTRACT</p>
                    </div>
                    <div className="px-3 py-1 bg-primary text-black font-mono font-bold text-xs">
                      DEPLOYED
                    </div>
                  </div>
                </div>
                <button className="pixel-btn w-full font-mono text-sm font-bold">
                  <Link to="/contracts" className="text-black">MANAGE SMART CONTRACTS</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
