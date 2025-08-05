import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Home } from 'lucide-react';

export default function Transactions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <Home className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <Activity className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Transaction Management</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Management System</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <Activity className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground mb-6">
              Advanced transaction monitoring, filtering, and analytics will be available here.
            </p>
            <Button asChild>
              <Link to="/">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
