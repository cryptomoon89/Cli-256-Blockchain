import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Rocket, 
  Wallet, 
  Settings, 
  Book, 
  Play,
  Terminal,
  Copy,
  ExternalLink
} from 'lucide-react';
import { analytics } from '@/utils/analytics';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'action' | 'verification';
  completed: boolean;
  current: boolean;
}

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'welcome',
      title: 'Welcome to CLI256 Blockchain',
      description: 'Get started with the most advanced Layer 1 blockchain platform',
      type: 'info',
      completed: false,
      current: true
    },
    {
      id: 'setup-node',
      title: 'Initialize Your Node',
      description: 'Set up your blockchain node with a simple command',
      type: 'action',
      completed: false,
      current: false
    },
    {
      id: 'create-wallet',
      title: 'Create Your First Wallet',
      description: 'Generate a secure wallet for CLI256 tokens',
      type: 'action',
      completed: false,
      current: false
    },
    {
      id: 'explore-dashboard',
      title: 'Explore the Dashboard',
      description: 'Learn about network monitoring and real-time stats',
      type: 'info',
      completed: false,
      current: false
    },
    {
      id: 'first-transaction',
      title: 'Make Your First Transaction',
      description: 'Send CLI256 tokens using the command line',
      type: 'action',
      completed: false,
      current: false
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'Start building on CLI256 blockchain',
      type: 'verification',
      completed: false,
      current: false
    }
  ]);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('cli256-onboarding-completed');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
      analytics.trackFeatureUsage('onboarding', 'started');
    }
  }, []);

  const progressPercentage = (currentStep / (steps.length - 1)) * 100;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        completed: index < currentStep + 1,
        current: index === currentStep + 1
      })));
      
      setCurrentStep(currentStep + 1);
      analytics.trackFeatureUsage('onboarding', 'step_completed', { step: currentStep + 1 });
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem('cli256-onboarding-completed', 'true');
    setShowOnboarding(false);
    analytics.trackFeatureUsage('onboarding', 'completed');
  };

  const skipOnboarding = () => {
    localStorage.setItem('cli256-onboarding-completed', 'true');
    setShowOnboarding(false);
    analytics.trackFeatureUsage('onboarding', 'skipped', { step: currentStep });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    analytics.trackUserInteraction('copy_button', 'click');
  };

  if (!showOnboarding) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl modern-card">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Step {currentStep + 1} of {steps.length}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={skipOnboarding}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip Tutorial
            </Button>
          </div>
          
          <Progress value={progressPercentage} className="mb-6" />
          
          <div className="flex items-center justify-center mb-4">
            {currentStepData.type === 'info' && <Book className="h-12 w-12 text-primary" />}
            {currentStepData.type === 'action' && <Terminal className="h-12 w-12 text-accent" />}
            {currentStepData.type === 'verification' && <Rocket className="h-12 w-12 text-green-500" />}
          </div>
          
          <CardTitle className="text-2xl font-bold mb-2">{currentStepData.title}</CardTitle>
          <p className="text-muted-foreground">{currentStepData.description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step Content */}
          {currentStep === 0 && (
            <div className="text-center space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="modern-card p-4">
                  <Settings className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">Easy Setup</h3>
                  <p className="text-xs text-muted-foreground">Quick initialization</p>
                </div>
                <div className="modern-card p-4">
                  <Wallet className="h-8 w-8 text-accent mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">Secure Wallet</h3>
                  <p className="text-xs text-muted-foreground">CLI-based management</p>
                </div>
                <div className="modern-card p-4">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">Production Ready</h3>
                  <p className="text-xs text-muted-foreground">Enterprise grade</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                CLI256 is a Layer 1 blockchain using Proof-of-Authority consensus with 5-second block times 
                and 250M total token supply.
              </p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Terminal className="h-4 w-4 mr-2" />
                  Initialize Blockchain Node
                </h3>
                <div className="bg-card p-3 rounded border font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">cd cli && node cli256-node.js init</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => copyToClipboard('cd cli && node cli256-node.js init')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This creates the genesis block and initializes foundation balances.
                </p>
              </div>
              
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h4 className="font-medium text-primary mb-2">What happens during initialization:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Genesis block creation</li>
                  <li>• 250M CLI256 token distribution</li>
                  <li>• Foundation addresses setup</li>
                  <li>• Blockchain data persistence</li>
                </ul>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Wallet className="h-4 w-4 mr-2" />
                  Generate Your Wallet
                </h3>
                <div className="bg-card p-3 rounded border font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">node cli256-wallet.js generate --name my-wallet</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => copyToClipboard('node cli256-wallet.js generate --name my-wallet')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  You'll be prompted to set a secure password for your wallet.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="modern-card p-3">
                  <h4 className="font-medium text-sm mb-1">Secure Encryption</h4>
                  <p className="text-xs text-muted-foreground">AES-256-GCM protection</p>
                </div>
                <div className="modern-card p-3">
                  <h4 className="font-medium text-sm mb-1">CLI Management</h4>
                  <p className="text-xs text-muted-foreground">Full command-line control</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                <h3 className="font-semibold mb-3">Dashboard Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Real-time network stats</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Block height monitoring</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Transaction processing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Validator network status</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground text-center">
                The dashboard provides real-time insights into your blockchain network with 
                a modern, comfortable interface designed for extended use.
              </p>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Play className="h-4 w-4 mr-2" />
                  Send Your First Transaction
                </h3>
                <div className="space-y-2">
                  <div className="bg-card p-3 rounded border font-mono text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">node cli256-wallet.js send --to [address] --amount 1000</span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => copyToClipboard('node cli256-wallet.js send --to [address] --amount 1000')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Replace [address] with the recipient's wallet address.
                  </p>
                </div>
              </div>

              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <h4 className="font-medium text-accent mb-2">Transaction Features:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 5-second confirmation times</li>
                  <li>• Cryptographic signatures</li>
                  <li>• Real-time processing</li>
                  <li>• Network broadcast</li>
                </ul>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
                <Rocket className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
                <p className="text-muted-foreground mb-4">
                  You're now ready to build on CLI256 blockchain. Explore the ecosystem and 
                  start creating decentralized applications.
                </p>
                
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="modern-card p-3 text-center">
                    <Book className="h-6 w-6 mx-auto mb-1 text-primary" />
                    <p className="text-xs font-medium">Documentation</p>
                  </div>
                  <div className="modern-card p-3 text-center">
                    <Terminal className="h-6 w-6 mx-auto mb-1 text-accent" />
                    <p className="text-xs font-medium">CLI Tools</p>
                  </div>
                  <div className="modern-card p-3 text-center">
                    <ExternalLink className="h-6 w-6 mx-auto mb-1 text-green-500" />
                    <p className="text-xs font-medium">Community</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-border">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep} className="modern-btn">
                Continue
              </Button>
            ) : (
              <Button onClick={completeOnboarding} className="modern-btn">
                Start Building
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
