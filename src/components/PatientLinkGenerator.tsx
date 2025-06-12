import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import {
  Copy,
  Share2,
  QrCode,
  Mail,
  MessageCircle,
  CheckCircle,
  User,
  Smartphone,
  Link,
  Send,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

interface PatientLinkData {
  patientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  cycleNumber?: number;
  treatmentPhase?: string;
  counselorName: string;
}

const PatientLinkGenerator: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientLinkData>({
    patientId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cycleNumber: 1,
    treatmentPhase: 'Preparation',
    counselorName: 'Dr. Emily Chen',
  });
  
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  const generatePatientId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `patient-${timestamp}-${random}`;
  };

  const generatePatientLink = () => {
    if (!patientData.firstName || !patientData.lastName || !patientData.email) {
      alert('Please fill in all required fields');
      return;
    }

    // Generate unique patient ID if not provided
    const patientId = patientData.patientId || generatePatientId();
    
    // Create the patient app link
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/patient-app/${patientId}?name=${encodeURIComponent(patientData.firstName + ' ' + patientData.lastName)}`;
    
    setGeneratedLink(link);
    
    // Generate QR code URL (using a QR code service)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`;
    setQrCodeUrl(qrUrl);
    
    // Update patient data with generated ID
    setPatientData(prev => ({ ...prev, patientId }));
    
    // Store patient data for the app
    const patientAppData = {
      id: patientId,
      firstName: patientData.firstName,
      lastName: patientData.lastName,
      email: patientData.email,
      phone: patientData.phone,
      currentCycle: {
        cycleNumber: patientData.cycleNumber || 1,
        day: 1,
        phase: patientData.treatmentPhase || 'Preparation',
        nextAppointment: 'To be scheduled',
      },
      counselorName: patientData.counselorName,
      createdAt: new Date().toISOString(),
    };
    
    localStorage.setItem(`patient-data-${patientId}`, JSON.stringify(patientAppData));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const sendEmail = () => {
    const subject = 'Your Personalized IVF Support App';
    const body = `Dear ${patientData.firstName},

I hope this message finds you well. As part of your IVF journey, I've created a personalized mobile app to support you throughout your treatment.

Your Personal App Link:
${generatedLink}

This app includes:
• Your personalized intervention plan
• Daily tasks and exercises
• Progress tracking
• Educational resources
• Direct communication with me

You can access this on any device - just bookmark it or add it to your home screen for easy access.

If you have any questions, please don't hesitate to reach out.

Best regards,
${patientData.counselorName}
Santaan IVF Counseling Team`;

    const mailtoLink = `mailto:${patientData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const sendSMS = () => {
    if (!patientData.phone) {
      alert('Please enter a phone number');
      return;
    }

    const message = `Hi ${patientData.firstName}! Your personalized IVF support app is ready: ${generatedLink} - ${patientData.counselorName}`;
    const smsLink = `sms:${patientData.phone}?body=${encodeURIComponent(message)}`;
    window.open(smsLink);
    setSmsSent(true);
    setTimeout(() => setSmsSent(false), 3000);
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'IVF Support App',
          text: `${patientData.firstName}'s personalized IVF support app`,
          url: generatedLink,
        });
      } catch (err) {
        console.error('Error sharing: ', err);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <RouterLink to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </RouterLink>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Patient App Link Generator</h1>
          <p className="text-gray-600 mt-2">
            Create personalized mobile app links for your IVF patients
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Information Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Patient Information
              </CardTitle>
              <CardDescription>
                Enter patient details to generate their personalized app link
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={patientData.firstName}
                    onChange={(e) => setPatientData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Sarah"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={patientData.lastName}
                    onChange={(e) => setPatientData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Johnson"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={patientData.email}
                  onChange={(e) => setPatientData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="sarah.johnson@email.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={patientData.phone}
                  onChange={(e) => setPatientData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cycleNumber">Cycle Number</Label>
                  <Input
                    id="cycleNumber"
                    type="number"
                    value={patientData.cycleNumber}
                    onChange={(e) => setPatientData(prev => ({ ...prev, cycleNumber: parseInt(e.target.value) || 1 }))}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="treatmentPhase">Treatment Phase</Label>
                  <select
                    id="treatmentPhase"
                    value={patientData.treatmentPhase}
                    onChange={(e) => setPatientData(prev => ({ ...prev, treatmentPhase: e.target.value }))}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="Preparation">Preparation</option>
                    <option value="Stimulation">Stimulation</option>
                    <option value="Retrieval">Retrieval</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Waiting">Two Week Wait</option>
                    <option value="Follow-up">Follow-up</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="counselorName">Counselor Name</Label>
                <Input
                  id="counselorName"
                  value={patientData.counselorName}
                  onChange={(e) => setPatientData(prev => ({ ...prev, counselorName: e.target.value }))}
                  placeholder="Dr. Emily Chen"
                />
              </div>

              <Button 
                onClick={generatePatientLink} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Generate Patient App Link
              </Button>
            </CardContent>
          </Card>

          {/* Generated Link and Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Link className="w-5 h-5 mr-2" />
                Generated Patient Link
              </CardTitle>
              <CardDescription>
                Share this link with your patient to access their personalized app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedLink ? (
                <>
                  {/* Generated Link Display */}
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <Label className="text-sm font-medium">Patient App URL:</Label>
                    <div className="mt-2 p-3 bg-white rounded border font-mono text-sm break-all">
                      {generatedLink}
                    </div>
                  </div>

                  {/* QR Code */}
                  {qrCodeUrl && (
                    <div className="text-center">
                      <Label className="text-sm font-medium">QR Code:</Label>
                      <div className="mt-2 inline-block p-4 bg-white rounded-lg border">
                        <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={copyToClipboard} 
                      variant="outline"
                      className={copied ? 'bg-green-50 border-green-200' : ''}
                    >
                      {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? 'Copied!' : 'Copy Link'}
                    </Button>

                    <Button onClick={shareLink} variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>

                    <Button 
                      onClick={sendEmail} 
                      variant="outline"
                      className={emailSent ? 'bg-green-50 border-green-200' : ''}
                    >
                      {emailSent ? <CheckCircle className="w-4 h-4 mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                      {emailSent ? 'Email Sent!' : 'Send Email'}
                    </Button>

                    <Button 
                      onClick={sendSMS} 
                      variant="outline"
                      className={smsSent ? 'bg-green-50 border-green-200' : ''}
                      disabled={!patientData.phone}
                    >
                      {smsSent ? <CheckCircle className="w-4 h-4 mr-2" /> : <MessageCircle className="w-4 h-4 mr-2" />}
                      {smsSent ? 'SMS Sent!' : 'Send SMS'}
                    </Button>
                  </div>

                  {/* Preview Button */}
                  <div className="pt-4 border-t">
                    <a 
                      href={generatedLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Patient App
                      </Button>
                    </a>
                  </div>

                  {/* Patient Info Summary */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Patient Summary:</h4>
                    <div className="space-y-1 text-sm text-blue-800">
                      <p><strong>Name:</strong> {patientData.firstName} {patientData.lastName}</p>
                      <p><strong>Email:</strong> {patientData.email}</p>
                      {patientData.phone && <p><strong>Phone:</strong> {patientData.phone}</p>}
                      <p><strong>Cycle:</strong> {patientData.cycleNumber} - {patientData.treatmentPhase}</p>
                      <p><strong>Counselor:</strong> {patientData.counselorName}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Smartphone className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Fill in patient information and click "Generate Patient App Link" to create a personalized mobile app link.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">1. Enter Patient Info</h3>
                <p className="text-sm text-gray-600">Fill in the patient's basic information and treatment details</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Link className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-medium mb-2">2. Generate Link</h3>
                <p className="text-sm text-gray-600">Create a unique, personalized mobile app link for the patient</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Send className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-medium mb-2">3. Share with Patient</h3>
                <p className="text-sm text-gray-600">Send via email, SMS, or share the QR code for easy access</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientLinkGenerator;
