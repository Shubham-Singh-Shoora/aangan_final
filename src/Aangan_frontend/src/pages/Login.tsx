import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useICP } from '@/contexts/ICPContext';
import Header from '@/components/Header';
import {
  Home,
  Shield,
  User,
  Zap,
  Sparkles,
  Lock,
  CheckCircle,
  Globe,
  Fingerprint,
  ArrowRight,
  Building
} from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user, loading, createUser } = useICP();
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [userType, setUserType] = useState<'tenant' | 'landlord'>('tenant');
  const [profileData, setProfileData] = useState({
    role: '',
    name: '',
    email: '',
    phone: ''
  });

  const from = location.state?.from?.pathname || '/';

  React.useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      const userRole = Object.keys(user.role)[0];
      if (userRole === 'Tenant') {
        navigate('/tenant-dashboard');
      } else if (userRole === 'Landlord') {
        navigate('/landlord-dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async () => {
    try {
      toast.loading('Connecting to Internet Identity...', { id: 'login-loading' });
      await login();
      toast.success('Logged in successfully!', { id: 'login-loading' });
    } catch (error: any) {
      console.error('Login error:', error);

      let errorMessage = 'Login failed. Please try again.';

      if (error?.message?.includes('UserInterrupt')) {
        errorMessage = 'Login was cancelled. Please try again.';
      } else if (error?.message?.includes('canister ID not found')) {
        errorMessage = 'Backend not configured. Please contact support.';
      } else if (error?.message?.includes('Canister ID is required')) {
        errorMessage = 'Backend not configured. Please contact support.';
      } else if (error?.message?.includes('Not authenticated')) {
        errorMessage = 'Authentication failed. Please try again.';
      }

      toast.error(errorMessage, { id: 'login-loading' });
    }
  };

  const handleCreateProfile = async () => {
    if (!profileData.role || !profileData.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsCreatingProfile(true);
    try {
      await createUser(
        profileData.role as 'Landlord' | 'Tenant',
        profileData.name,
        profileData.email || undefined,
        profileData.phone || undefined
      );
      toast.success('Profile created successfully!');
      // The useEffect will handle the redirect
    } catch (error) {
      toast.error('Failed to create profile. Please try again.');
      console.error('Profile creation error:', error);
    } finally {
      setIsCreatingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 pulse-glow">
            <Shield className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connecting...</h2>
          <p className="text-gray-600">Please wait while we connect you to Internet Identity</p>
        </div>
      </div>
    );
  }

  // If user is authenticated but hasn't created their profile yet
  if (isAuthenticated && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md card-futuristic border-blue-200 bg-gradient-to-br from-white to-blue-50/30">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 pulse-glow">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Complete Your Profile
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Welcome to Aangan! Please complete your profile to get started.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                I am a *
              </Label>
              <Select value={profileData.role} onValueChange={(value) => setProfileData({ ...profileData, role: value })}>
                <SelectTrigger className="input-futuristic">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tenant">Tenant (Looking for rental)</SelectItem>
                  <SelectItem value="Landlord">Landlord (Property owner)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name *
              </Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                placeholder="Enter your full name"
                className="input-futuristic"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                placeholder="Enter your email"
                className="input-futuristic"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="Enter your phone number"
                className="input-futuristic"
              />
            </div>

            <Button
              onClick={handleCreateProfile}
              disabled={isCreatingProfile}
              className="w-full btn-futuristic py-3 text-lg"
            >
              {isCreatingProfile ? 'Creating Profile...' : 'Create Profile'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <p className="text-xs text-gray-500 text-center">
              * Required fields
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/20 relative overflow-hidden">
      {/* Futuristic background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-200/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-cyan-200/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-purple-200/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <Header />

      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 relative z-10 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Main Login Card */}
          <Card className="card-futuristic border-blue-200 shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 pulse-glow float-animation">
                  <Fingerprint className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome to AANGAN
                </h1>
                <p className="text-gray-600">
                  India's first NFT-powered property rental platform
                </p>
              </div>

              {/* User Type Selection */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">I am a:</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setUserType('tenant')}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 ${userType === 'tenant'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300'
                      }`}
                  >
                    <div className="text-center">
                      <Home className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">Tenant</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setUserType('landlord')}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 ${userType === 'landlord'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300'
                      }`}
                  >
                    <div className="text-center">
                      <Globe className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">Landlord</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                onClick={handleLogin}
                disabled={loading}
                className="btn-futuristic w-full text-lg py-3 mb-6"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Connecting...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Login with Internet Identity
                  </div>
                )}
              </Button>

              {/* Future Wallet Support */}
              <div className="text-center text-sm text-gray-500 mb-6">
                <p>Coming Soon: Plug & Bitfinity Wallet Support</p>
              </div>

              {/* Security Features */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Decentralized authentication</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>No password required</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Blockchain-secured identity</span>
                </div>
              </div>

              {/* New user info */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-500">
                  New to Internet Identity?{' '}
                  <a
                    href="https://identity.ic0.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Create an account
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-card border-blue-100 text-center p-4">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Secure</div>
              <div className="text-xs text-gray-600">NFT-backed</div>
            </Card>
            <Card className="glass-card border-cyan-100 text-center p-4">
              <Zap className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Fast</div>
              <div className="text-xs text-gray-600">Instant login</div>
            </Card>
            <Card className="glass-card border-purple-100 text-center p-4">
              <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Modern</div>
              <div className="text-xs text-gray-600">Web3 powered</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
