import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Blocks, 
  Coins, 
  Shield, 
  Terminal, 
  Settings,
  Database,
  Network,
  Lock,
  Unlock,
  Key,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users,
  Zap,
  Home,
  Code,
  FileText,
  Download,
  Server,
  Activity,
  Eye,
  EyeOff,
  Plus,
  Minus,
  RotateCw,
  Pause,
  Play,
  Upload,
  Save,
  RefreshCw,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface DevAccess {
  code: string;
  level: 'admin' | 'senior' | 'junior' | 'emergency';
  permissions: string[];
  expires: string;
}

interface TokenAllocation {
  name: string;
  amount: string;
  percentage: number;
  status: 'locked' | 'vested' | 'public' | 'mining';
  address: string;
  description: string;
}

interface Validator {
  id: string;
  address: string;
  stake: number;
  status: 'active' | 'inactive' | 'slashed';
  uptime: number;
  lastBlock: number;
  commission: number;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  status: 'confirmed' | 'pending' | 'failed';
  blockHeight: number;
}

interface NetworkConfig {
  blockTime: number;
  gasLimit: number;
  minStake: number;
  maxValidators: number;
  slashingPercentage: number;
  consensusThreshold: number;
}

export default function BlockchainManager() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [userLevel, setUserLevel] = useState<string>('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showAccessForm, setShowAccessForm] = useState(true);
  const [loading, setLoading] = useState(false);

  const [networkStats, setNetworkStats] = useState({
    totalSupply: '250,000,000',
    circulatingSupply: '62,500,000',
    lockedSupply: '187,500,000',
    validators: 21,
    blockHeight: 2547893,
    networkHash: '0x1a2b3c4d5e6f...',
    consensusStatus: 'healthy' as 'healthy' | 'warning' | 'critical',
    tps: 3247,
    activeNodes: 127,
    gasPrice: 0.001
  });

  const [validators, setValidators] = useState<Validator[]>([
    {
      id: 'validator-001',
      address: '0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234',
      stake: 10000000,
      status: 'active',
      uptime: 99.8,
      lastBlock: 2547893,
      commission: 5
    },
    {
      id: 'validator-002', 
      address: '0x892f45Dd7654B1543836c4d9G49F8D8b1d7E5678',
      stake: 8500000,
      status: 'active',
      uptime: 99.9,
      lastBlock: 2547892,
      commission: 3
    },
    {
      id: 'validator-003',
      address: '0x123a56Ee8765C2654947d5eH60G9E9c2e8F9901',
      stake: 7200000,
      status: 'inactive',
      uptime: 97.5,
      lastBlock: 2547885,
      commission: 4
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      hash: '0xabc123def456...',
      from: '0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234',
      to: '0x892f45Dd7654B1543836c4d9G49F8D8b1d7E5678',
      amount: 1000000,
      timestamp: Date.now() - 120000,
      status: 'confirmed',
      blockHeight: 2547893
    },
    {
      hash: '0xdef456ghi789...',
      from: '0x123a56Ee8765C2654947d5eH60G9E9c2e8F9901',
      to: '0x456b78Ff9876D3765058e6fI71H0F0d3f9G0A12',
      amount: 500000,
      timestamp: Date.now() - 300000,
      status: 'confirmed',
      blockHeight: 2547891
    }
  ]);

  const [networkConfig, setNetworkConfig] = useState<NetworkConfig>({
    blockTime: 5000,
    gasLimit: 30000000,
    minStake: 1000000,
    maxValidators: 100,
    slashingPercentage: 5,
    consensusThreshold: 67
  });

  const [tokenAllocations] = useState<TokenAllocation[]>([
    {
      name: 'Foundation Reserve',
      amount: '50,000,000',
      percentage: 20,
      status: 'locked',
      address: '0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234',
      description: 'Long-term protocol development and governance'
    },
    {
      name: 'Development Fund',
      amount: '37,500,000',
      percentage: 15,
      status: 'vested',
      address: '0x892f45Dd7654B1543836c4d9G49F8D8b1d7E5678',
      description: 'Core development team compensation'
    },
    {
      name: 'Validator Rewards',
      amount: '75,000,000',
      percentage: 30,
      status: 'mining',
      address: '0x123a56Ee8765C2654947d5eH60G9E9c2e8F9901',
      description: 'Network security and block validation incentives'
    },
    {
      name: 'Public Circulation',
      amount: '62,500,000',
      percentage: 25,
      status: 'public',
      address: '0x456b78Ff9876D3765058e6fI71H0F0d3f9G0A12',
      description: 'Initial public distribution and trading'
    },
    {
      name: 'Ecosystem Growth',
      amount: '25,000,000',
      percentage: 10,
      status: 'locked',
      address: '0x789c90Aa0987E4876169f7gJ82I1A1e4a0H1B23',
      description: 'Developer grants, partnerships, marketing'
    }
  ]);

  // Developer access codes
  const devAccessCodes: Record<string, DevAccess> = {
    'CLI256-PRIME-DEV-2024': {
      code: 'CLI256-PRIME-DEV-2024',
      level: 'admin',
      permissions: ['blockchain_control', 'token_management', 'validator_control', 'emergency_functions', 'system_configuration'],
      expires: '2025-12-31'
    },
    'CLI256-SENIOR-ACCESS-7891': {
      code: 'CLI256-SENIOR-ACCESS-7891',
      level: 'senior',
      permissions: ['blockchain_monitoring', 'token_operations', 'validator_monitoring', 'system_maintenance'],
      expires: '2025-06-30'
    },
    'CLI256-JUNIOR-READ-4567': {
      code: 'CLI256-JUNIOR-READ-4567',
      level: 'junior',
      permissions: ['blockchain_read', 'transaction_monitoring', 'basic_operations'],
      expires: '2025-03-31'
    },
    'CLI256-EMERGENCY-OVERRIDE-9999': {
      code: 'CLI256-EMERGENCY-OVERRIDE-9999',
      level: 'emergency',
      permissions: ['emergency_stop', 'network_pause', 'security_lockdown', 'full_system_access'],
      expires: '2026-12-31'
    }
  };

  const handleAuthentication = () => {
    setLoading(true);
    
    setTimeout(() => {
      const access = devAccessCodes[accessCode];
      if (access) {
        setIsAuthenticated(true);
        setUserLevel(access.level);
        setShowAccessForm(false);
        toast.success(`Access granted - ${access.level.toUpperCase()} level`);
      } else {
        toast.error('Invalid access code');
      }
      setLoading(false);
    }, 1500);
  };

  const hasPermission = (permission: string): boolean => {
    const access = devAccessCodes[accessCode];
    return access?.permissions.includes(permission) || false;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'locked': return 'bg-red-500';
      case 'vested': return 'bg-yellow-500';
      case 'public': return 'bg-green-500';
      case 'mining': return 'bg-blue-500';
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-yellow-500';
      case 'slashed': return 'bg-red-500';
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Authority Actions
  const mintTokens = () => {
    if (!hasPermission('token_management')) {
      toast.error('Insufficient permissions');
      return;
    }
    toast.success('Token minting initiated');
  };

  const freezeAccount = () => {
    if (!hasPermission('token_management')) {
      toast.error('Insufficient permissions');
      return;
    }
    toast.success('Account freeze initiated');
  };

  const updateConfig = () => {
    if (!hasPermission('system_configuration')) {
      toast.error('Insufficient permissions');
      return;
    }
    toast.success('Configuration updated');
  };

  const exportData = () => {
    if (!hasPermission('blockchain_read')) {
      toast.error('Insufficient permissions');
      return;
    }
    
    const data = {
      networkStats,
      validators,
      transactions,
      tokenAllocations,
      networkConfig,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cli256-blockchain-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  const addValidator = () => {
    if (!hasPermission('validator_control')) {
      toast.error('Insufficient permissions');
      return;
    }
    toast.success('New validator added');
  };

  const removeValidator = (id: string) => {
    if (!hasPermission('validator_control')) {
      toast.error('Insufficient permissions');
      return;
    }
    setValidators(prev => prev.filter(v => v.id !== id));
    toast.success('Validator removed');
  };

  useEffect(() => {
    // Real-time updates
    const interval = setInterval(() => {
      setNetworkStats(prev => ({
        ...prev,
        blockHeight: prev.blockHeight + Math.floor(Math.random() * 2),
        tps: 3000 + Math.floor(Math.random() * 500)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative">
        <div className="modern-bg"></div>
        
        <Card className="w-full max-w-md modern-card relative z-10">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Developer Access Required</CardTitle>
            <p className="text-muted-foreground">Enter your CLI256 developer access code</p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="access-code">Access Code</Label>
              <Input
                id="access-code"
                type="password"
                placeholder="CLI256-XXX-XXX-XXXX"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAuthentication()}
              />
            </div>
            
            <Button 
              onClick={handleAuthentication} 
              className="w-full modern-btn"
              disabled={loading || !accessCode}
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Key className="h-4 w-4 mr-2" />
                  Access Blockchain Manager
                </>
              )}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground mt-4">
              <p>Available Access Levels:</p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                <div className="p-2 bg-card rounded border">
                  <strong>Admin</strong><br/>Full Control
                </div>
                <div className="p-2 bg-card rounded border">
                  <strong>Senior</strong><br/>Operations
                </div>
                <div className="p-2 bg-card rounded border">
                  <strong>Junior</strong><br/>Read Only
                </div>
                <div className="p-2 bg-card rounded border">
                  <strong>Emergency</strong><br/>Crisis Mode
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="modern-bg"></div>
      
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <Home className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center space-x-3">
                <Database className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold modern-glow">
                    CLI256 Blockchain Manager
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Layer-1 Protocol Management Console
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {userLevel.toUpperCase()} ACCESS
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setIsAuthenticated(false);
                  setAccessCode('');
                  setUserLevel('');
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Network Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="modern-card p-6">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Total Supply</h3>
              <Coins className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
              {networkStats.totalSupply}
            </div>
            <p className="text-xs text-muted-foreground">CLI256 Tokens</p>
          </div>

          <div className="modern-card p-6">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Block Height</h3>
              <Blocks className="h-5 w-5 text-accent" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
              {networkStats.blockHeight.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Latest Block</p>
          </div>

          <div className="modern-card p-6">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Active Validators</h3>
              <Users className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
              {networkStats.validators}
            </div>
            <p className="text-xs text-muted-foreground">Network Authorities</p>
          </div>

          <div className="modern-card p-6">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-sm font-medium text-muted-foreground">TPS Current</h3>
              <Zap className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
              {networkStats.tps.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Transactions/Second</p>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex w-full modern-card p-1">
            <TabsTrigger value="overview" className="flex-1">Network Overview</TabsTrigger>
            <TabsTrigger value="nodes" className="flex-1">Node Status</TabsTrigger>
            <TabsTrigger value="transactions" className="flex-1">Transactions</TabsTrigger>
            <TabsTrigger value="contracts" className="flex-1">Smart Contracts</TabsTrigger>
            <TabsTrigger value="distribution" className="flex-1">Token Distribution</TabsTrigger>
            <TabsTrigger value="validators" className="flex-1">Validator Management</TabsTrigger>
            <TabsTrigger value="config" className="flex-1">Network Config</TabsTrigger>
            <TabsTrigger value="deployment" className="flex-1">Deployment</TabsTrigger>
          </div>

          {/* Network Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="modern-card p-6">
              <h2 className="text-xl font-semibold mb-6">Network Health Overview</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Network Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Network Uptime</span>
                      <span className="text-sm font-semibold text-green-600">99.97%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{width: '99.97%'}}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Consensus Health</span>
                      <span className="text-sm font-semibold text-green-600">100%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{width: '100%'}}></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Block #{networkStats.blockHeight} mined</p>
                        <p className="text-xs text-muted-foreground">2 seconds ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New validator joined</p>
                        <p className="text-xs text-muted-foreground">5 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Node Status Tab */}
          <TabsContent value="nodes" className="space-y-6">
            <div className="modern-card p-6">
              <h2 className="text-xl font-semibold mb-6">Node Network Status</h2>
              
              <div className="space-y-4">
                {validators.map((validator) => (
                  <div key={validator.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border/50">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 ${getStatusColor(validator.status)} rounded-full animate-pulse`}></div>
                      <div>
                        <p className="font-medium">{validator.id}</p>
                        <p className="text-sm text-muted-foreground">{validator.address.slice(0, 10)}...{validator.address.slice(-8)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{validator.uptime}% uptime</p>
                      <p className="text-xs text-muted-foreground">Last block: #{validator.lastBlock}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="modern-card p-6">
              <h2 className="text-xl font-semibold mb-6">Recent Transactions</h2>
              
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.hash} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border/50">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 ${getStatusColor(tx.status)} rounded-full`}></div>
                      <div>
                        <p className="font-mono text-sm">{tx.hash.slice(0, 20)}...</p>
                        <p className="text-xs text-muted-foreground">
                          {tx.from.slice(0, 8)}... → {tx.to.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{tx.amount.toLocaleString()} CLI256</p>
                      <p className="text-xs text-muted-foreground">Block #{tx.blockHeight}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Smart Contracts Tab */}
          <TabsContent value="contracts" className="space-y-6">
            <div className="modern-card p-6">
              <h2 className="text-xl font-semibold mb-6">Smart Contract Management</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-secondary/50 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">CLI256 Native Token</h3>
                      <p className="text-sm text-muted-foreground">Native blockchain token contract</p>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      DEPLOYED
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4 bg-secondary/50 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Governance Contract</h3>
                      <p className="text-sm text-muted-foreground">Decentralized governance and voting</p>
                    </div>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                      PENDING
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Token Distribution Tab */}
          <TabsContent value="distribution" className="space-y-6">
            <div className="modern-card p-6">
              <h2 className="text-xl font-semibold mb-6">CLI256 Token Distribution</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Supply Breakdown</h3>
                  <div className="space-y-3">
                    {tokenAllocations.map((allocation, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border/50">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 ${getStatusColor(allocation.status)} rounded-full animate-pulse`}></div>
                          <div>
                            <p className="font-medium text-sm">{allocation.name}</p>
                            <p className="text-xs text-muted-foreground">{allocation.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">{allocation.amount}</p>
                          <p className="text-xs text-muted-foreground">{allocation.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Authority Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={mintTokens} 
                      className="modern-btn"
                      disabled={!hasPermission('token_management')}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Mint Tokens
                    </Button>
                    <Button 
                      onClick={freezeAccount}
                      variant="destructive"
                      disabled={!hasPermission('token_management')}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Freeze Account
                    </Button>
                    <Button 
                      onClick={updateConfig}
                      variant="outline"
                      disabled={!hasPermission('system_configuration')}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Update Config
                    </Button>
                    <Button 
                      onClick={exportData}
                      variant="outline"
                      disabled={!hasPermission('blockchain_read')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Validator Management Tab */}
          <TabsContent value="validators" className="space-y-6">
            <div className="modern-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Validator Management</h2>
                <Button 
                  onClick={addValidator}
                  className="modern-btn"
                  disabled={!hasPermission('validator_control')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Validator
                </Button>
              </div>
              
              <div className="space-y-4">
                {validators.map((validator) => (
                  <div key={validator.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border/50">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 ${getStatusColor(validator.status)} rounded-full animate-pulse`}></div>
                      <div>
                        <p className="font-medium">{validator.id}</p>
                        <p className="text-sm text-muted-foreground">{validator.address}</p>
                        <p className="text-xs text-muted-foreground">
                          Stake: {validator.stake.toLocaleString()} CLI256 | Commission: {validator.commission}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={`${getStatusColor(validator.status)} text-white border-transparent`}>
                        {validator.status.toUpperCase()}
                      </Badge>
                      {hasPermission('validator_control') && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeValidator(validator.id)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Network Config Tab */}
          <TabsContent value="config" className="space-y-6">
            <div className="modern-card p-6">
              <h2 className="text-xl font-semibold mb-6">Network Configuration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="blockTime">Block Time (ms)</Label>
                    <Input 
                      id="blockTime" 
                      type="number" 
                      value={networkConfig.blockTime}
                      onChange={(e) => setNetworkConfig(prev => ({...prev, blockTime: parseInt(e.target.value)}))}
                      disabled={!hasPermission('system_configuration')}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="gasLimit">Gas Limit</Label>
                    <Input 
                      id="gasLimit" 
                      type="number" 
                      value={networkConfig.gasLimit}
                      onChange={(e) => setNetworkConfig(prev => ({...prev, gasLimit: parseInt(e.target.value)}))}
                      disabled={!hasPermission('system_configuration')}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="minStake">Minimum Stake</Label>
                    <Input 
                      id="minStake" 
                      type="number" 
                      value={networkConfig.minStake}
                      onChange={(e) => setNetworkConfig(prev => ({...prev, minStake: parseInt(e.target.value)}))}
                      disabled={!hasPermission('system_configuration')}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="maxValidators">Max Validators</Label>
                    <Input 
                      id="maxValidators" 
                      type="number" 
                      value={networkConfig.maxValidators}
                      onChange={(e) => setNetworkConfig(prev => ({...prev, maxValidators: parseInt(e.target.value)}))}
                      disabled={!hasPermission('system_configuration')}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="slashing">Slashing Percentage</Label>
                    <Input 
                      id="slashing" 
                      type="number" 
                      value={networkConfig.slashingPercentage}
                      onChange={(e) => setNetworkConfig(prev => ({...prev, slashingPercentage: parseInt(e.target.value)}))}
                      disabled={!hasPermission('system_configuration')}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="threshold">Consensus Threshold (%)</Label>
                    <Input 
                      id="threshold" 
                      type="number" 
                      value={networkConfig.consensusThreshold}
                      onChange={(e) => setNetworkConfig(prev => ({...prev, consensusThreshold: parseInt(e.target.value)}))}
                      disabled={!hasPermission('system_configuration')}
                    />
                  </div>
                </div>
              </div>
              
              {hasPermission('system_configuration') && (
                <div className="mt-6 pt-6 border-t border-border">
                  <Button onClick={updateConfig} className="modern-btn">
                    <Save className="h-4 w-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Deployment Tab */}
          <TabsContent value="deployment" className="space-y-6">
            <div className="modern-card p-6">
              <h2 className="text-xl font-semibold mb-6">Deployment Management</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Network Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <span className="font-medium">Mainnet Status</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        ACTIVE
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <span className="font-medium">Testnet Status</span>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        RUNNING
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <span className="font-medium">Devnet Status</span>
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                        MAINTENANCE
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Deployment Actions</h3>
                  <div className="space-y-2">
                    <Button 
                      className="w-full modern-btn"
                      disabled={!hasPermission('system_configuration')}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Deploy Update
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      disabled={!hasPermission('blockchain_control')}
                    >
                      <RotateCw className="h-4 w-4 mr-2" />
                      Restart Network
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      disabled={!hasPermission('emergency_functions')}
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Emergency Stop
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
