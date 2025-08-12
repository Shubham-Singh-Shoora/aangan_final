
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Copy, ExternalLink, Home, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get data from navigation state
  const { type, nftId, propertyTitle, transactionHash } = location.state || {};
  
  // Default values if no state is passed
  const successType = type || 'rental';
  const defaultNftId = nftId || `NFT-${successType.toUpperCase()}-${Date.now()}`;
  const defaultTransactionHash = transactionHash || `0x${Math.random().toString(16).substring(2, 66)}`;

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
          title: 'Rental Confirmed Successfully!',
          subtitle: 'Your property rental has been secured with blockchain technology',
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
          dashboardLink: user?.type === 'tenant' ? '/tenant-dashboard' : '/landlord-dashboard'
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
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
            {successInfo.title}
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in">
            {successInfo.subtitle}
          </p>
        </div>

        {/* Success Details Card */}
        <Card className="border-green-100 bg-gradient-to-br from-green-50/50 to-white shadow-lg mb-8">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* NFT Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                      <Home className="w-4 h-4 text-white" />
                    </div>
                    NFT Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">NFT ID</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 font-mono">
                          {defaultNftId}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(defaultNftId, 'NFT ID')}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Transaction Hash</p>
                      <div className="flex items-center space-x-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {defaultTransactionHash.substring(0, 20)}...
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(defaultTransactionHash, 'Transaction hash')}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h3>
                  
                  <div className="space-y-3">
                    {propertyTitle && (
                      <div>
                        <p className="text-sm text-gray-600">Property</p>
                        <p className="font-medium text-gray-900">{propertyTitle}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm text-gray-600">Date & Time</p>
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
                      <Badge className="bg-green-50 text-green-700 border-green-200">
                        Confirmed
                      </Badge>
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
            onClick={() => navigate(successInfo.dashboardLink)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium"
            size="lg"
          >
            {successInfo.dashboardText}
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/marketplace')}
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
            Share
          </Button>
        </div>

        {/* What's Next Section */}
        <Card className="border-blue-100 bg-blue-50/30">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>Your agreement is now blockchain-secured</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>NFT has been minted to your wallet</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>Transaction is permanently recorded</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                  <span>Access your dashboard to manage rentals</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                  <span>Track payments and communications</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                  <span>View your NFT proof of ownership</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Success;
