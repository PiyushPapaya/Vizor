import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { updateMetaTags, SEO_CONFIGS } from '@/lib/seo';

export default function Terms() {
  useEffect(() => {
    updateMetaTags(SEO_CONFIGS.terms);
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
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: December 17, 2025</p>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              By accessing or using Vizor, you agree to be bound by these Terms of Service. 
              If you disagree with any part of these terms, you may not access the service.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Service Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Vizor is a web-based data visualization platform that allows users to create, 
              customize, and export charts and graphs. We provide:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>15+ chart types and visualization options</li>
              <li>Data import and export capabilities</li>
              <li>Project storage and management</li>
              <li>Export to PNG, SVG, PDF, and JSON formats</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Account Creation</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining account security</li>
                <li>You must be at least 13 years old to create an account</li>
                <li>One person or entity may not maintain multiple free accounts</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Account Termination</h3>
              <p>
                We reserve the right to suspend or terminate your account for violations of 
                these terms or fraudulent activity.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Subscription and Billing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Free Plan</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Limited to 5 projects</li>
                <li>3 exports per day</li>
                <li>Watermark on exports</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Paid Plans</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Subscriptions are billed monthly or annually</li>
                <li>Automatic renewal unless cancelled</li>
                <li>No refunds for partial months</li>
                <li>Price changes with 30 days notice</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Cancellation</h3>
              <p>
                You may cancel your subscription at any time. Access continues until the end 
                of the billing period.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Content and Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Your Data</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>You retain all rights to your data and charts</li>
                <li>You grant us license to host and display your content</li>
                <li>You are responsible for backing up your data</li>
                <li>We are not liable for data loss</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Prohibited Content</h3>
              <p>You may not upload or share content that:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Violates any law or regulation</li>
                <li>Infringes intellectual property rights</li>
                <li>Contains malware or harmful code</li>
                <li>Is defamatory, obscene, or offensive</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Acceptable Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Abuse, harass, or harm other users</li>
              <li>Attempt to gain unauthorized access</li>
              <li>Reverse engineer or decompile the service</li>
              <li>Use automated systems to scrape or access the service</li>
              <li>Resell or redistribute the service</li>
              <li>Overload or interfere with service infrastructure</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              The Vizor platform, including its design, features, and code, is protected 
              by copyright and other intellectual property laws. You may not copy, modify, or 
              create derivative works without permission.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Disclaimers and Limitations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Service Availability</h3>
              <p>
                We strive for 99.9% uptime but do not guarantee uninterrupted service. 
                We may suspend service for maintenance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">"As Is" Basis</h3>
              <p>
                The service is provided "as is" without warranties of any kind, express or implied.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Limitation of Liability</h3>
              <p>
                Vizor shall not be liable for indirect, incidental, or consequential damages 
                arising from use of the service.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Privacy and Data Protection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Your use of Vizor is also governed by our{' '}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              , which explains how we collect and use your information.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Modifications to Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We reserve the right to modify or discontinue the service at any time with or 
              without notice. We are not liable for any modification, suspension, or discontinuation.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              These Terms shall be governed by the laws of the jurisdiction in which Vizor 
              operates, without regard to conflict of law provisions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Questions about these Terms? Contact us at:</p>
            <p className="font-semibold text-foreground">legal@Vizor.com</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
