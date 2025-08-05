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
import { 
  Wallet as WalletIcon, 
  Plus, 
  Send, 
  QrCode,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  Shield,
  Key,
  FileText,
  Download,
  Upload,
  Home
} from 'lucide-react';
import { toast } from 'sonner';

interface WalletData {
  address: string;
  balance: string;
  privateKey: string;
  publicKey: string;
  mnemonic: string;
}

interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: string;
  address: string;
  timestamp: string;
  status: 'confirmed' | 'pending' | 'failed';
  hash: string;
}

export default function Wallet() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'received',
      amount: '150.00',
      address: '0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234',
      timestamp: '2024-01-15 14:30:22',
      status: 'confirmed',
      hash: '0xabc123...'
    },
    {
      id: '2',
      type: 'sent',
      amount: '75.50',
      address: '0x892f45Dd7654B1543836c4d9G49F8D8b1d7E5678',
      timestamp: '2024-01-14 09:15:45',
      status: 'confirmed',
      hash: '0xdef456...'
    },
    {
      id: '3',
      type: 'received',
      amount: '300.00',
      address: '0x123a56Ee8765C2654947d5eH60G9E9c2e8F9901',
      timestamp: '2024-01-13 16:45:10',
      status: 'confirmed',
      hash: '0xghi789...'
    }
  ]);

  const generateWallet = () => {
    setIsLoading(true);
    
    // Simulate wallet generation
    setTimeout(() => {
      const newWallet: WalletData = {
        address: '0x' + Math.random().toString(16).slice(2, 42),
        balance: '1,247.85',
        privateKey: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
        publicKey: '0x04' + Array.from({length: 128}, () => Math.floor(Math.random()*16).toString(16)).join(''),
        mnemonic: 'abandon ability able about above absent absorb abstract absurd abuse access accident account accuse achieve'
      };
      
      setWallet(newWallet);
      setIsLoading(false);
      toast.success('New wallet generated successfully!');
    }, 2000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const refreshBalance = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (wallet) {
        setWallet({
          ...wallet,
          balance: (parseFloat(wallet.balance.replace(',', '')) + Math.random() * 10).toFixed(2)
        });
      }
      setIsLoading(false);
      toast.success('Balance refreshed!');
    }, 1000);
  };

  const sendTransaction = () => {
    if (!sendAmount || !sendAddress) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSendAmount('');
      setSendAddress('');
      toast.success('Transaction sent successfully!');
    }, 2000);
  };

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
                  <WalletIcon className="h-7 w-7 text-black animate-pixel-pulse" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold font-mono neon-glow">CLI256 WALLET</h1>
                  <p className="text-sm text-primary font-mono terminal-text">
                    &gt; SECURE DIGITAL ASSET MANAGEMENT_
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center px-4 py-2 bg-card border border-primary cyber-glow">
                <div className="w-3 h-3 bg-primary mr-3 animate-pixel-pulse rounded-full"></div>
                <span className="text-primary font-mono text-sm font-bold">CONNECTED</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!wallet ? (
          /* Wallet Setup */
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
                  <WalletIcon className="h-8 w-8" />
                  <span>Welcome to CLI256 Wallet</span>
                </CardTitle>
                <p className="text-muted-foreground">
                  Create a new wallet or import an existing one to get started
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={generateWallet} 
                    disabled={isLoading}
                    className="h-20 flex-col space-y-2"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    ) : (
                      <Plus className="h-6 w-6" />
                    )}
                    <span>Generate New Wallet</span>
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-20 flex-col space-y-2">
                        <Upload className="h-6 w-6" />
                        <span>Import Existing Wallet</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Import Wallet</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="import-method">Import Method</Label>
                          <Tabs defaultValue="mnemonic" className="mt-2">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="mnemonic">Mnemonic Phrase</TabsTrigger>
                              <TabsTrigger value="private-key">Private Key</TabsTrigger>
                            </TabsList>
                            <TabsContent value="mnemonic" className="space-y-4">
                              <Textarea 
                                placeholder="Enter your 12 or 24 word mnemonic phrase..."
                                rows={3}
                              />
                              <Button className="w-full">Import from Mnemonic</Button>
                            </TabsContent>
                            <TabsContent value="private-key" className="space-y-4">
                              <Input 
                                placeholder="Enter your private key..."
                                type="password"
                              />
                              <Button className="w-full">Import from Private Key</Button>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="pt-6 border-t">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Your private keys are stored locally and never leave your device</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Main Wallet Interface */
          <div className="space-y-8">
            {/* Wallet Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Wallet Balance</CardTitle>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={refreshBalance}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold">{wallet.balance} CLI256</p>
                      <p className="text-muted-foreground">≈ $2,847.32 USD</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => copyToClipboard(wallet.address, 'Address')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Send className="h-4 w-4 mr-2" />
                        Send CLI256
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send CLI256</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="send-address">Recipient Address</Label>
                          <Input 
                            id="send-address"
                            placeholder="0x..."
                            value={sendAddress}
                            onChange={(e) => setSendAddress(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="send-amount">Amount (CLI256)</Label>
                          <Input 
                            id="send-amount"
                            type="number"
                            placeholder="0.00"
                            value={sendAmount}
                            onChange={(e) => setSendAmount(e.target.value)}
                          />
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={sendTransaction}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4 mr-2" />
                          )}
                          Send Transaction
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" className="w-full">
                    <QrCode className="h-4 w-4 mr-2" />
                    Receive
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Key className="h-4 w-4 mr-2" />
                        Export Wallet
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Export Wallet</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Private Key</Label>
                          <div className="flex items-center space-x-2">
                            <Input 
                              type={showPrivateKey ? "text" : "password"}
                              value={wallet.privateKey}
                              readOnly
                              className="font-mono text-xs"
                            />
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => setShowPrivateKey(!showPrivateKey)}
                            >
                              {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => copyToClipboard(wallet.privateKey, 'Private Key')}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <Label>Mnemonic Phrase</Label>
                          <div className="flex items-center space-x-2">
                            <Textarea 
                              value={showMnemonic ? wallet.mnemonic : '••••• ••••• ••••• •••••'}
                              readOnly
                              rows={3}
                              className="font-mono text-xs"
                            />
                            <div className="flex flex-col space-y-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => setShowMnemonic(!showMnemonic)}
                              >
                                {showMnemonic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => copyToClipboard(wallet.mnemonic, 'Mnemonic')}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          tx.type === 'sent' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {tx.type === 'sent' ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownLeft className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {tx.type === 'sent' ? 'Sent to' : 'Received from'}
                          </p>
                          <p className="text-sm text-muted-foreground font-mono">
                            {tx.address.slice(0, 10)}...{tx.address.slice(-8)}
                          </p>
                          <p className="text-xs text-muted-foreground">{tx.timestamp}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          tx.type === 'sent' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {tx.type === 'sent' ? '-' : '+'}{tx.amount} CLI256
                        </p>
                        <Badge 
                          variant={tx.status === 'confirmed' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
