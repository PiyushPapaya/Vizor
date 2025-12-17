import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { updateMetaTags, SEO_CONFIGS } from '@/lib/seo';

export default function Privacy() {
  useEffect(() => {
    updateMetaTags(SEO_CONFIGS.privacy);
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: December 17, 2025</p>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              At ChartForge, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our data visualization platform.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Email address and name (when you create an account)</li>
                <li>Profile information you choose to provide</li>
                <li>Payment information (processed securely through Stripe)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Usage Data</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Charts and visualizations you create</li>
                <li>Project data and configurations</li>
                <li>Feature usage and interactions</li>
                <li>Device information and browser type</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Analytics Data</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Page views and navigation patterns</li>
                <li>Session duration and frequency</li>
                <li>Error logs and performance metrics</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Provide, operate, and maintain our service</li>
              <li>Improve and personalize your experience</li>
              <li>Process your transactions and manage subscriptions</li>
              <li>Send you updates, security alerts, and support messages</li>
              <li>Analyze usage patterns to enhance our platform</li>
              <li>Detect, prevent, and address technical issues</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Storage and Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Your data is stored securely using industry-standard encryption. We use Supabase 
              for backend services with built-in security features including:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>End-to-end encryption for data in transit (TLS/SSL)</li>
              <li>Encrypted data at rest</li>
              <li>Regular security audits and updates</li>
              <li>Row-level security policies</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>We do not sell your personal information. We may share your information with:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Service providers (Supabase, Stripe, PostHog, Sentry)</li>
              <li>Law enforcement if required by law</li>
              <li>Other parties with your explicit consent</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We use cookies and similar tracking technologies to analyze usage and improve our service. 
              You can control cookies through your browser settings.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              ChartForge is not intended for children under 13. We do not knowingly collect 
              information from children under 13.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>If you have questions about this Privacy Policy, please contact us at:</p>
            <p className="font-semibold text-foreground">privacy@chartforge.com</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
