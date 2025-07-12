import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Users, 
  UserPlus,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface ClinicRegistrationData {
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  subscriptionPlan: string;
  maxCounselors: number;
  maxPatients: number;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPhone: string;
}

const ClinicRegistration = () => {
  const [formData, setFormData] = useState<ClinicRegistrationData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    subscriptionPlan: 'BASIC',
    maxCounselors: 5,
    maxPatients: 100,
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPhone: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscriptionPlans = [
    {
      id: 'BASIC',
      name: 'Basic Plan',
      price: '₹8,299/month',
      counselors: 5,
      patients: 100,
      features: ['Basic Dashboard', 'Patient Management', 'Assessment Tools', 'Email Support', 'Hindi Language Support']
    },
    {
      id: 'PREMIUM',
      name: 'Premium Plan',
      price: '₹16,599/month',
      counselors: 15,
      patients: 500,
      features: ['Advanced Analytics', 'Custom Branding', 'API Access', 'Priority Support', 'EMR Integration Ready', 'WhatsApp Integration']
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise Plan',
      price: '₹41,499/month',
      counselors: 'Unlimited',
      patients: 'Unlimited',
      features: ['White Label Solution', 'Custom Integrations', 'Dedicated Support', 'SLA Guarantee', 'Advanced Security', 'On-premise Deployment']
    }
  ];

  const handleInputChange = (field: keyof ClinicRegistrationData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/data?type=clinic-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        // Redirect to Clerk sign-up with clinic context
        window.location.href = `/sign-up?clinic=${result.data.clinicId}`;
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-700">Registration Successful!</CardTitle>
            <CardDescription>
              Your clinic has been registered successfully. You will be redirected to create your admin account.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Register Your Clinic</h1>
          <p className="text-xl text-gray-600">Join the Santana AI Counseling Platform</p>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {subscriptionPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`cursor-pointer transition-all ${
                formData.subscriptionPlan === plan.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => {
                handleInputChange('subscriptionPlan', plan.id);
                handleInputChange('maxCounselors', typeof plan.counselors === 'number' ? plan.counselors : 999);
                handleInputChange('maxPatients', typeof plan.patients === 'number' ? plan.patients : 9999);
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.name}
                  {formData.subscriptionPlan === plan.id && (
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  )}
                </CardTitle>
                <CardDescription className="text-2xl font-bold text-blue-600">
                  {plan.price}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2" />
                    {plan.counselors} Counselors
                  </div>
                  <div className="flex items-center text-sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    {plan.patients} Patients
                  </div>
                </div>
                <ul className="space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Clinic Information</CardTitle>
            <CardDescription>
              Please provide your clinic details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Clinic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clinicName">Clinic Name *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="clinicName"
                      placeholder="Enter clinic name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinicEmail">Clinic Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="clinicEmail"
                      type="email"
                      placeholder="clinic@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinicPhone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="clinicPhone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="website"
                      placeholder="https://www.yourclinic.com"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="address"
                    placeholder="Enter clinic address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="pl-10"
                    rows={3}
                  />
                </div>
              </div>

              {/* Admin User Details */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Primary Administrator</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminFirstName">First Name *</Label>
                    <Input
                      id="adminFirstName"
                      placeholder="John"
                      value={formData.adminFirstName}
                      onChange={(e) => handleInputChange('adminFirstName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminLastName">Last Name *</Label>
                    <Input
                      id="adminLastName"
                      placeholder="Doe"
                      value={formData.adminLastName}
                      onChange={(e) => handleInputChange('adminLastName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email *</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      placeholder="admin@clinic.com"
                      value={formData.adminEmail}
                      onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminPhone">Admin Phone</Label>
                    <Input
                      id="adminPhone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.adminPhone}
                      onChange={(e) => handleInputChange('adminPhone', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering Clinic...
                  </>
                ) : (
                  'Register Clinic & Create Account'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClinicRegistration;
