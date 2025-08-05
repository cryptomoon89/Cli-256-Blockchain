/**
 * CLI256 Blockchain Analytics & Monitoring
 * Production-ready analytics for user engagement and performance tracking
 */

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class CLI256Analytics {
  private sessionId: string;
  private userId?: string;
  private events: AnalyticsEvent[] = [];
  private metrics: PerformanceMetric[] = [];
  private isProduction = import.meta.env.PROD;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeAnalytics();
  }

  private generateSessionId(): string {
    return `cli256_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeAnalytics() {
    // Track page load performance
    this.trackPerformance('page_load', performance.now());
    
    // Track viewport size
    this.trackEvent('viewport', 'screen_size', `${window.innerWidth}x${window.innerHeight}`);
    
    // Track user agent
    this.trackEvent('browser', 'user_agent', navigator.userAgent);
    
    // Start performance monitoring
    this.startPerformanceMonitoring();
  }

  // Event Tracking
  trackEvent(category: string, action: string, label?: string, value?: number) {
    const event: AnalyticsEvent = {
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    };

    this.events.push(event);
    
    if (this.isProduction) {
      // Send to analytics service
      this.sendEvent(event);
    } else {
      console.log('📊 Analytics Event:', event);
    }
  }

  // Performance Tracking
  trackPerformance(name: string, value: number, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata
    };

    this.metrics.push(metric);
    
    if (this.isProduction) {
      this.sendPerformanceMetric(metric);
    } else {
      console.log('⚡ Performance Metric:', metric);
    }
  }

  // Blockchain-specific tracking
  trackBlockchainEvent(action: string, data?: Record<string, any>) {
    this.trackEvent('blockchain', action, JSON.stringify(data));
  }

  trackWalletEvent(action: string, data?: Record<string, any>) {
    this.trackEvent('wallet', action, JSON.stringify(data));
  }

  trackNodeEvent(action: string, data?: Record<string, any>) {
    this.trackEvent('node', action, JSON.stringify(data));
  }

  // User Journey Tracking
  trackPageView(path: string) {
    this.trackEvent('navigation', 'page_view', path);
  }

  trackUserInteraction(element: string, action: string) {
    this.trackEvent('interaction', action, element);
  }

  trackFeatureUsage(feature: string, action: string, metadata?: Record<string, any>) {
    this.trackEvent('feature', `${feature}_${action}`, JSON.stringify(metadata));
  }

  // Error Tracking
  trackError(error: Error, context?: string) {
    this.trackEvent('error', 'javascript_error', `${context}: ${error.message}`);
    
    if (this.isProduction) {
      this.sendErrorReport(error, context);
    }
  }

  // Network Performance
  trackNetworkRequest(url: string, duration: number, status: number) {
    this.trackPerformance('network_request', duration, {
      url,
      status,
      success: status >= 200 && status < 400
    });
  }

  // CLI Usage Tracking
  trackCLICommand(command: string, success: boolean, duration?: number) {
    this.trackEvent('cli', 'command_executed', command, duration);
    this.trackEvent('cli', success ? 'command_success' : 'command_failure', command);
  }

  // Real-time Metrics
  private startPerformanceMonitoring() {
    // Monitor frame rate
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        this.trackPerformance('fps', frameCount);
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.trackPerformance('memory_used', memory.usedJSHeapSize);
        this.trackPerformance('memory_total', memory.totalJSHeapSize);
      }, 30000); // Every 30 seconds
    }

    // Monitor connection quality
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.trackPerformance('connection_speed', connection.downlink);
      this.trackEvent('network', 'connection_type', connection.effectiveType);
    }
  }

  // Data Export for Analysis
  getAnalyticsData() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      events: this.events,
      metrics: this.metrics,
      sessionDuration: Date.now() - (this.events[0]?.timestamp || Date.now())
    };
  }

  // Send data to analytics service
  private async sendEvent(event: AnalyticsEvent) {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.warn('Failed to send analytics event:', error);
    }
  }

  private async sendPerformanceMetric(metric: PerformanceMetric) {
    try {
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric)
      });
    } catch (error) {
      console.warn('Failed to send performance metric:', error);
    }
  }

  private async sendErrorReport(error: Error, context?: string) {
    try {
      await fetch('/api/analytics/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          context,
          sessionId: this.sessionId,
          timestamp: Date.now()
        })
      });
    } catch (e) {
      console.warn('Failed to send error report:', e);
    }
  }

  // User identification
  setUserId(userId: string) {
    this.userId = userId;
    this.trackEvent('user', 'identified', userId);
  }

  // Session management
  endSession() {
    this.trackEvent('session', 'ended');
    
    if (this.isProduction) {
      // Send final session data
      this.sendSessionSummary();
    }
  }

  private async sendSessionSummary() {
    const summary = {
      sessionId: this.sessionId,
      userId: this.userId,
      duration: Date.now() - (this.events[0]?.timestamp || Date.now()),
      eventCount: this.events.length,
      metricCount: this.metrics.length,
      timestamp: Date.now()
    };

    try {
      await fetch('/api/analytics/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(summary)
      });
    } catch (error) {
      console.warn('Failed to send session summary:', error);
    }
  }
}

// Create global analytics instance
export const analytics = new CLI256Analytics();

// Set up global error handling
window.addEventListener('error', (event) => {
  analytics.trackError(event.error, 'global_error_handler');
});

window.addEventListener('unhandledrejection', (event) => {
  analytics.trackError(new Error(event.reason), 'unhandled_promise_rejection');
});

// Track page unload
window.addEventListener('beforeunload', () => {
  analytics.endSession();
});

// Export for use in components
export default analytics;
