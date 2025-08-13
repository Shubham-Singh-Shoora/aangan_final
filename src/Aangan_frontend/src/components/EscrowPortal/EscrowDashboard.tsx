import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Shield, 
  Clock, 
  IndianRupee, 
  Calendar, 
  User, 
  MapPin,
  FileText,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  Building,
  Phone,
  Mail
} from 'lucide-react';
import EscrowCard from './EscrowCard';

type TabType = 'active' | 'pending' | 'completed';

interface EscrowDashboardProps {
  userType: 'tenant' | 'landlord';
  onClose?: () => void;
}

const EscrowDashboard: React.FC<EscrowDashboardProps> = ({ userType, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('active');

  // Dummy data for demonstration
  const dummyEscrowData = {
    tenant: {
      active: [
        {
          id: '1',
          property_title: 'Luxury 2BHK Apartment',
          property_address: 'Sector 62, Noida, UP',
          landlord_name: 'Rajesh Kumar',
          deposit_amount: 50000,
          status: 'Active',
          start_date: '2025-08-15',
          end_date: '2026-08-14'
        },
        {
          id: '2',
          property_title: 'Modern Studio in Gurgaon',
          property_address: 'DLF Phase 3, Gurgaon',
          landlord_name: 'Priya Sharma',
          deposit_amount: 35000,
          status: 'Active',
          start_date: '2025-07-01',
          end_date: '2026-06-30'
        }
      ],
      pending: [
        {
          id: '3',
          property_title: '3BHK Family Home',
          property_address: 'Lajpat Nagar, Delhi',
          landlord_name: 'Amit Singh',
          deposit_amount: 75000,
          status: 'Pending',
          start_date: '2025-09-01',
          end_date: '2026-08-31'
        }
      ],
      completed: [
        {
          id: '4',
          property_title: '1BHK Near Metro',
          property_address: 'Janakpuri, Delhi',
          landlord_name: 'Sunita Devi',
          deposit_amount: 25000,
          status: 'Completed',
          start_date: '2024-08-01',
          end_date: '2025-07-31'
        }
      ]
    },
    landlord: {
      active: [
        {
          id: '5',
          property_title: 'Premium Villa',
          property_address: 'Sector 45, Gurgaon',
          tenant_name: 'Rohit Verma',
          deposit_amount: 100000,
          status: 'Active',
          start_date: '2025-08-01',
          end_date: '2026-07-31'
        }
      ],
      pending: [
        {
          id: '6',
          property_title: '2BHK Apartment',
          property_address: 'Indirapuram, Ghaziabad',
          tenant_name: 'Neha Gupta',
          deposit_amount: 40000,
          status: 'Pending',
          start_date: '2025-08-20',
          end_date: '2026-08-19'
        }
      ],
      completed: []
    }
  };

  const currentData = dummyEscrowData[userType];
  const currentRentals = currentData[activeTab];

  const getTotalEscrowAmount = () => {
    return Object.values(currentData).flat().reduce((sum, rental) => sum + rental.deposit_amount, 0);
  };

  const handleViewDetails = (rentalId: string) => {
    console.log('View escrow details for rental:', rentalId);
    // Navigate to detailed escrow view
  };

  const renderStats = () => (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <Card className="card-futuristic border-blue-200 bg-gradient-to-br from-blue-50/80 to-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium mb-1 text-sm">Total Escrow Amount</p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{getTotalEscrowAmount().toLocaleString('en-IN')}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-futuristic border-green-200 bg-gradient-to-br from-green-50/80 to-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-medium mb-1 text-sm">Active Escrows</p>
              <p className="text-3xl font-bold text-gray-900">{currentData.active.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-futuristic border-yellow-200 bg-gradient-to-br from-yellow-50/80 to-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 font-medium mb-1 text-sm">Pending Actions</p>
              <p className="text-3xl font-bold text-gray-900">{currentData.pending.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-futuristic border-purple-200 bg-gradient-to-br from-purple-50/80 to-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 font-medium mb-1 text-sm">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{currentData.completed.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabs = () => (
    <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
      {[
        { key: 'active', label: 'Active Escrows', count: currentData.active.length },
        { key: 'pending', label: 'Pending Actions', count: currentData.pending.length },
        { key: 'completed', label: 'Completed', count: currentData.completed.length }
      ].map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key as TabType)}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === tab.key
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span>{tab.label}</span>
          {tab.count > 0 && (
            <Badge className="bg-blue-100 text-blue-800 text-xs">
              {tab.count}
            </Badge>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Escrow Portal</h1>
              <p className="text-gray-600">
                {userType === 'tenant' ? 'Manage your security deposits' : 'Monitor tenant escrow accounts'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="border-gray-300">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            {onClose && (
              <Button onClick={onClose} variant="outline">
                Close Portal
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics */}
        {renderStats()}

        {/* Important Notice */}
        <Card className="mb-8 border-orange-200 bg-gradient-to-r from-orange-50/80 to-yellow-50/80">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <AlertCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-2">Important Escrow Information</h3>
                <div className="text-orange-800 space-y-1">
                  <p>• All security deposits are held in blockchain-secured escrow accounts</p>
                  <p>• Funds are automatically released upon successful lease completion</p>
                  <p>• Dispute resolution available through smart contract arbitration</p>
                  <p>• Maximum processing time: 7 business days for deposit returns</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        {renderTabs()}

        {/* Escrow Cards */}
        <div className="space-y-6">
          {currentRentals.length > 0 ? (
            currentRentals.map((rental) => (
              <EscrowCard
                key={rental.id}
                rental={{
                  ...rental,
                  landlord_name: userType === 'tenant' ? rental.landlord_name || 'N/A' : rental.tenant_name || 'N/A'
                }}
                onViewDetails={handleViewDetails}
              />
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No {activeTab} escrows found
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'active' 
                    ? 'You don\'t have any active escrow accounts at the moment.'
                    : activeTab === 'pending'
                    ? 'No pending escrow actions require your attention.'
                    : 'No completed escrow transactions to display.'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EscrowDashboard;
