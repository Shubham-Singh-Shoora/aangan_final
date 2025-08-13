
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { useICP } from '@/contexts/ICPContext';
import { CheckCircle, Copy, ExternalLink, Home, Share2, Clock } from 'lucide-react';
import { toast } from 'sonner';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useICP();
  const [countdown, setCountdown] = useState(10);
  const [autoRedirect, setAutoRedirect] = useState(true);
  
  // Get data from navigation state
  const { type, nftId, rentalId, propertyTitle, transactionHash } = location.state || {};
  
  // Default values if no state is passed
  const successType = type || 'rental';
  const defaultNftId = nftId || rentalId || `NFT-${successType.toUpperCase()}-${Date.now()}`;
  const defaultTransactionHash = transactionHash || `0x${Math.random().toString(16).substring(2, 66)}`;

  // Auto-redirect countdown
  useEffect(() => {
    if (!autoRedirect || countdown <= 0) {
      if (countdown <= 0 && autoRedirect) {
        navigate('/tenant-dashboard');
        toast.success('Welcome to your new rental!');
      }
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, autoRedirect, navigate]);

  // Show success toast on mount
  useEffect(() => {
    toast.success('🎉 Rental Agreement Successfully Created!');
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AANGAN - Property Rental Success',
        text: `I just completed a property rental on AANGAN! NFT ID: ${defaultNftId}`,
        url: window.location.origin
      });
    } else {
      copyToClipboard(window.location.origin, 'App link');
    }
  };

  const getSuccessMessage = () => {
    switch (successType) {
      case 'rental':
        return {
          title: 'Rental Agreement Successful!',
          subtitle: 'Your rental agreement has been minted as an NFT and secured on the blockchain',
          dashboardText: 'Go to Tenant Dashboard',
          dashboardLink: '/tenant-dashboard'
        };
      case 'listing':
        return {
          title: 'Property Listed Successfully!',
          subtitle: 'Your property is now live on our NFT-secured marketplace',
          dashboardText: 'Go to Landlord Dashboard',
          dashboardLink: '/landlord-dashboard'
        };
      default:
        return {
          title: 'Success!',
          subtitle: 'Your transaction has been completed successfully',
          dashboardText: 'Go to Dashboard',
          dashboardLink: '/tenant-dashboard'
        };
    }
  };

  const successInfo = getSuccessMessage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Animation and Header */}
        <div className="text-center mb-12">
          <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-2xl">
            <CheckCircle className="w-16 h-16 text-white animate-pulse" />
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4 animate-fade-in">
            {successInfo.title}
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in mb-6">
            {successInfo.subtitle}
          </p>

          {/* Auto-redirect countdown */}
          {autoRedirect && countdown > 0 && (
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full border border-blue-200">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                Redirecting to your dashboard in {countdown} second{countdown !== 1 ? 's' : ''}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setAutoRedirect(false)}
                className="text-xs ml-2 h-6 px-2"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Success Details Card */}
        <Card className="border-green-200 bg-gradient-to-br from-green-50/80 to-blue-50/50 shadow-xl mb-8 hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* NFT Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-2">
                      <Home className="w-4 h-4 text-white" />
                    </div>
                    Rental NFT Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">NFT ID</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200 font-mono text-sm px-3 py-1">
                          #{defaultNftId}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(defaultNftId, 'NFT ID')}
                          className="h-6 w-6 p-0 hover:bg-blue-100"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Blockchain Status</p>
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                        ✅ Minted & Verified
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rental Agreement Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Rental Agreement Details</h3>
                  
                  <div className="space-y-3">
                    {propertyTitle && (
                      <div>
                        <p className="text-sm text-gray-600">Property</p>
                        <p className="font-medium text-gray-900">{propertyTitle}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm text-gray-600">Agreement Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date().toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                        ✅ Active & Confirmed
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Blockchain Network</p>
                      <p className="font-medium text-gray-900">Internet Computer (ICP)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button 
            onClick={() => {
              setAutoRedirect(false);
              navigate(successInfo.dashboardLink);
              toast.success('Welcome to your new rental!');
            }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            {successInfo.dashboardText}
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => {
              setAutoRedirect(false);
              navigate('/marketplace');
            }}
            className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-medium"
            size="lg"
          >
            Browse More Properties
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleShare}
            className="border-gray-200 text-gray-600 hover:bg-gray-50 px-6 py-3"
            size="lg"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Success
          </Button>
        </div>

        {/* What's Next Section */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50/80 to-cyan-50/50 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              🎉 Congratulations! What's Next?
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>Your rental agreement is blockchain-secured</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>NFT has been minted to your wallet</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>Legal compliance ensured</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                  <span>Access your tenant dashboard</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                  <span>Manage rental payments & communications</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                  <span>View your NFT proof of tenancy</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-gray-800 text-center">
                🔐 Your rental agreement is now permanently secured on the Internet Computer blockchain!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Success;
