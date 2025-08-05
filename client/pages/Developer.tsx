import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Terminal, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Database,
  Settings,
  Code,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  Play,
  Pause,
  Home,
  Key,
  Server,
  FileText,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

// Load access codes from secure location
const DEV_ACCESS_CODES = {
  'CLI256-PRIME-DEV-2024': { level: 'admin', name: 'Prime Developer' },
  'CLI256-SENIOR-ACCESS-7891': { level: 'senior', name: 'Senior Developer' },
  'CLI256-JUNIOR-READ-4567': { level: 'junior', name: 'Junior Developer' },
  'CLI256-EMERGENCY-OVERRIDE-9999': { level: 'emergency', name: 'Emergency Access' }
};

interface SystemMetric {
  name: string;
  value: string;
  status: 'healthy' | 'warning' | 'critical';
  description: string;
}

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
}

export default function Developer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [showPrivateKeys, setShowPrivateKeys] = useState(false);
  
  const [systemMetrics] = useState<SystemMetric[]>([
    { name: 'CPU Usage', value: '45%', status: 'healthy', description: 'System processor utilization' },
    { name: 'Memory Usage', value: '67%', status: 'warning', description: 'RAM consumption' },
    { name: 'Disk Usage', value: '23%', status: 'healthy', description: 'Storage utilization' },
    { name: 'Network I/O', value: '156 MB/s', status: 'healthy', description: 'Network throughput' },
    { name: 'Active Connections', value: '1,247', status: 'healthy', description: 'Current network connections' },
    { name: 'Database Size', value: '2.4 GB', status: 'healthy', description: 'Total blockchain data size' },
  ]);

  const [logs] = useState<LogEntry[]>([
    { timestamp: '2024-01-15 14:32:15', level: 'info', message: 'Block #2547893 successfully mined and added to chain', source: 'consensus' },
    { timestamp: '2024-01-15 14:32:10', level: 'info', message: 'New transaction received: 0xabc123...', source: 'mempool' },
    { timestamp: '2024-01-15 14:31:58', level: 'warning', message: 'Node sync lag detected: 2.3 seconds behind', source: 'network' },
    { timestamp: '2024-01-15 14:31:45', level: 'info', message: 'CLI256 token contract interaction: transfer', source: 'smart-contract' },
    { timestamp: '2024-01-15 14:31:32', level: 'error', message: 'Failed to connect to peer node: timeout', source: 'network' },
    { timestamp: '2024-01-15 14:31:20', level: 'info', message: 'Validator node-004 joined consensus round', source: 'consensus' },
  ]);

  // CLI256 Smart Contract Private Key (hidden from regular users)
  const CLI256_PRIVATE_KEY = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
  const CLI256_CONTRACT_ADDRESS = '0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234';

  const [userLevel, setUserLevel] = useState('');

  const handleAccessSubmit = () => {
    const codeInfo = DEV_ACCESS_CODES[accessCode];
    if (codeInfo) {
      setIsAuthenticated(true);
      setUserLevel(codeInfo.level);
      toast.success(`${codeInfo.name} access granted!`);
    } else {
      toast.error('Invalid access code. Access denied.');
    }
    setAccessCode('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Developer Access Required</CardTitle>
            <p className="text-muted-foreground">
              This section is restricted to authorized developers only
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="access-code">Access Code</Label>
              <Input 
                id="access-code"
                type="password"
                placeholder="Enter developer access code..."
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAccessSubmit()}
              />
            </div>
            <Button onClick={handleAccessSubmit} className="w-full">
              <Unlock className="h-4 w-4 mr-2" />
              Verify Access
            </Button>
            <div className="text-center">
              <Button variant="link" asChild>
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Only authorized developers should access this console. Unauthorized access is prohibited.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b-2 border-primary bg-background/95 backdrop-blur-sm relative z-10 cyber-glow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <Home className="h-5 w-5 text-primary" />
                </Link>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center cyber-glow">
                  <Terminal className="h-7 w-7 text-black animate-pixel-pulse" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold font-mono neon-glow">DEVELOPER CONSOLE</h1>
                  <p className="text-sm text-primary font-mono terminal-text">
                    &gt; SYSTEM ADMINISTRATION INTERFACE_
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center px-4 py-2 bg-card border border-primary cyber-glow">
                <Shield className="h-4 w-4 text-primary mr-2 animate-pixel-pulse" />
                <span className="text-primary font-mono text-sm font-bold">AUTHENTICATED</span>
              </div>
              <button
                className="cyber-btn font-mono text-sm font-bold"
                onClick={() => setIsAuthenticated(false)}
              >
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex w-full bg-card border-2 border-primary p-1">
            <button className="flex-1 px-4 py-2 font-mono text-sm font-bold bg-primary text-black">
              SYSTEM_OVERVIEW
            </button>
            <button className="flex-1 px-4 py-2 font-mono text-sm font-bold text-primary hover:bg-primary/20 transition-colors">
              CLI_BLOCKCHAIN
            </button>
            <button className="flex-1 px-4 py-2 font-mono text-sm font-bold text-primary hover:bg-primary/20 transition-colors">
              SMART_CONTRACTS
            </button>
            <button className="flex-1 px-4 py-2 font-mono text-sm font-bold text-primary hover:bg-primary/20 transition-colors">
              SYSTEM_LOGS
            </button>
            <button className="flex-1 px-4 py-2 font-mono text-sm font-bold text-primary hover:bg-primary/20 transition-colors">
              SECURITY_AUDIT
            </button>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* System Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                          {metric.value}
                        </span>
                        {metric.status === 'healthy' && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {metric.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                        {metric.status === 'critical' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Play className="h-6 w-6" />
                    <span>Start Service</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Pause className="h-6 w-6" />
                    <span>Stop Service</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <RefreshCw className="h-6 w-6" />
                    <span>Restart Node</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Database className="h-6 w-6" />
                    <span>Backup DB</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-6">
            {/* CLI256 Smart Contract Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>CLI256 Native Token Contract</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Contract Address</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        value={CLI256_CONTRACT_ADDRESS}
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(CLI256_CONTRACT_ADDRESS);
                          toast.success('Contract address copied!');
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="flex items-center space-x-2">
                      <span>Private Key</span>
                      <Shield className="h-4 w-4 text-red-500" />
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        type={showPrivateKeys ? "text" : "password"}
                        value={CLI256_PRIVATE_KEY}
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setShowPrivateKeys(!showPrivateKeys)}
                      >
                        {showPrivateKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Security Warning:</strong> The private key above controls the CLI256 native token contract. 
                    Keep this information secure and never share it with unauthorized parties.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <Button variant="outline">
                    <Zap className="h-4 w-4 mr-2" />
                    Mint Tokens
                  </Button>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Update Contract
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export ABI
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    View Source
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contract Deployment */}
            <Card>
              <CardHeader>
                <CardTitle>Deploy New Contract</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contract-code">Contract Source Code</Label>
                  <Textarea 
                    id="contract-code"
                    placeholder="pragma solidity ^0.8.0;&#10;&#10;contract YourContract {&#10;    // Your contract code here&#10;}"
                    rows={8}
                    className="font-mono text-xs"
                  />
                </div>
                <Button className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Deploy Contract
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>System Logs</CardTitle>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index} className="flex items-start space-x-4 p-3 border rounded font-mono text-xs">
                      <span className="text-muted-foreground whitespace-nowrap">
                        {log.timestamp}
                      </span>
                      <Badge variant="outline" className={`${getLogLevelColor(log.level)} text-xs`}>
                        {log.level.toUpperCase()}
                      </Badge>
                      <span className="text-muted-foreground">[{log.source}]</span>
                      <span className="flex-1">{log.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Database Operations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Database className="h-4 w-4 mr-2" />
                    Create Backup
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Restore Backup
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Optimize Database
                  </Button>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Purge Old Data
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Network Operations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Server className="h-4 w-4 mr-2" />
                    Restart Network
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Activity className="h-4 w-4 mr-2" />
                    Force Sync
                  </Button>
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Peer List
                  </Button>
                  <Button variant="destructive" className="w-full">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Emergency Stop
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                This section contains sensitive security information. Ensure you're in a secure environment.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Access Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Current Developer Access Code</Label>
                  <Input 
                    value={DEV_ACCESS_CODE}
                    readOnly
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This code grants access to the developer console. Change regularly for security.
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  <Key className="h-4 w-4 mr-2" />
                  Generate New Access Code
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Audit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>Private Key Encryption</span>
                    <Badge variant="secondary" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Secure
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>Network Security</span>
                    <Badge variant="secondary" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Secure
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>Access Logs</span>
                    <Badge variant="secondary" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Monitored
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CLI Blockchain Management Tab */}
          <div className="space-y-6 mt-6 hidden" id="cli-blockchain">
            <div className="retro-card p-6">
              <h2 className="text-xl font-mono font-bold text-primary neon-glow mb-6">
                CLI256_BLOCKCHAIN_CONTROL
              </h2>

              {/* CLI Commands Interface */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-mono font-bold text-primary">NODE_OPERATIONS</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-card border border-primary/30">
                      <h4 className="font-mono font-bold text-primary text-sm mb-2">INITIALIZE BLOCKCHAIN</h4>
                      <code className="font-mono text-primary/70 text-xs block mb-2">
                        ./cli/cli256-node.js init
                      </code>
                      <button className="pixel-btn font-mono text-xs">INIT BLOCKCHAIN</button>
                    </div>

                    <div className="p-4 bg-card border border-primary/30">
                      <h4 className="font-mono font-bold text-primary text-sm mb-2">START VALIDATOR NODE</h4>
                      <code className="font-mono text-primary/70 text-xs block mb-2">
                        ./cli/cli256-node.js start --validator 0x742d35...
                      </code>
                      <button className="pixel-btn font-mono text-xs">START NODE</button>
                    </div>

                    <div className="p-4 bg-card border border-primary/30">
                      <h4 className="font-mono font-bold text-primary text-sm mb-2">CHECK NODE STATUS</h4>
                      <code className="font-mono text-primary/70 text-xs block mb-2">
                        ./cli/cli256-node.js status
                      </code>
                      <button className="pixel-btn font-mono text-xs">CHECK STATUS</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-mono font-bold text-primary">WALLET_OPERATIONS</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-card border border-primary/30">
                      <h4 className="font-mono font-bold text-primary text-sm mb-2">GENERATE WALLET</h4>
                      <code className="font-mono text-primary/70 text-xs block mb-2">
                        ./cli/cli256-wallet.js generate --name devWallet
                      </code>
                      <button className="pixel-btn font-mono text-xs">GENERATE WALLET</button>
                    </div>

                    <div className="p-4 bg-card border border-primary/30">
                      <h4 className="font-mono font-bold text-primary text-sm mb-2">CHECK BALANCE</h4>
                      <code className="font-mono text-primary/70 text-xs block mb-2">
                        ./cli/cli256-wallet.js balance
                      </code>
                      <button className="pixel-btn font-mono text-xs">CHECK BALANCE</button>
                    </div>

                    <div className="p-4 bg-card border border-primary/30">
                      <h4 className="font-mono font-bold text-primary text-sm mb-2">SEND TRANSACTION</h4>
                      <code className="font-mono text-primary/70 text-xs block mb-2">
                        ./cli/cli256-wallet.js send --to 0x... --amount 100
                      </code>
                      <button className="pixel-btn font-mono text-xs">SEND TOKENS</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Terminal Output */}
              <div className="mt-8 p-4 bg-black border border-primary">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-mono font-bold text-primary">TERMINAL_OUTPUT</h3>
                  <button className="px-3 py-1 bg-primary text-black font-mono text-xs">CLEAR</button>
                </div>
                <div className="font-mono text-xs text-primary space-y-1 max-h-64 overflow-y-auto">
                  <div>&gt; ./cli/cli256-node.js status</div>
                  <div className="text-primary/70">📊 CLI256 Node Status</div>
                  <div className="text-primary/70">════════════════════════════</div>
                  <div className="text-green-500">Status: Running</div>
                  <div className="text-primary/70">Network ID: cli256-mainnet</div>
                  <div className="text-primary/70">Node ID: node-a1b2c3d4e5f6g7h8</div>
                  <div className="text-primary/70">Block Height: 2547893</div>
                  <div className="text-primary/70">Total Transactions: 15847362</div>
                  <div className="text-primary/70">Active Validators: 21</div>
                  <div className="text-primary/70">Mempool Size: 45</div>
                  <div className="text-primary/70">Total Supply: 250,000,000 CLI256</div>
                  <div className="text-primary animate-terminal-cursor">&gt; _</div>
                </div>
              </div>

              {/* Access Level Indicator */}
              <div className="mt-6 p-4 bg-card border border-primary/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-mono font-bold text-primary">ACCESS_LEVEL</h4>
                    <p className="font-mono text-primary/70 text-sm">
                      {userLevel.toUpperCase()} DEVELOPER PERMISSIONS
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-primary text-black font-mono font-bold text-xs">
                    {userLevel === 'admin' ? 'FULL_ACCESS' :
                     userLevel === 'senior' ? 'LIMITED_ACCESS' :
                     userLevel === 'junior' ? 'READ_ONLY' : 'STANDARD_ACCESS'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
