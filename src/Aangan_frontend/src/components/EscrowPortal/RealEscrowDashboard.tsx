import React, { useState, useEffect, useCallback } from 'react';
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
  AlertCircle,
  CheckCircle,
  Building,
  Phone,
  Mail,
  Loader2,
  Lock
} from 'lucide-react';
import { useEscrowService } from '../../hooks/useServices';
import { useICP } from '../../contexts/ICPContext';
import { EscrowAccount, EscrowStatus } from '../../services/RealEscrowService';
import { Principal } from '@dfinity/principal';

type TabType = 'active' | 'pending' | 'completed';

interface EscrowDashboardProps {
  userType: 'tenant' | 'landlord';
  onClose?: () => void;
}

const EscrowDashboard: React.FC<EscrowDashboardProps> = ({ userType, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [escrowAccounts, setEscrowAccounts] = useState<EscrowAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({ total: 0, active: 0, pending: 0, completed: 0, overdue: 0 });
  
  const escrowService = useEscrowService();
  const { identity } = useICP();

  const loadEscrowData = useCallback(async () => {
    if (!identity || !escrowService) return;
    
    setLoading(true);
    try {
      const userPrincipal = identity.getPrincipal();
      let accounts: EscrowAccount[] = [];
      
      if (userType === 'tenant') {
        accounts = await escrowService.getEscrowAccountsByTenant(userPrincipal);
      } else {
        accounts = await escrowService.getEscrowAccountsByLandlord(userPrincipal);
      }
      
      setEscrowAccounts(accounts);
    } catch (error) {
      console.error('Error loading escrow data:', error);
    } finally {
      setLoading(false);
    }
  }, [identity, escrowService, userType]);

  const loadStatistics = useCallback(async () => {
    if (!identity || !escrowService) return;
    
    try {
      const userPrincipal = identity.getPrincipal();
      const stats = await escrowService.getUserEscrowStatistics(userPrincipal);
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }, [identity, escrowService]);

  useEffect(() => {
    if (identity && escrowService) {
      loadEscrowData();
      loadStatistics();
    } else {
      setLoading(false);
    }
  }, [identity, escrowService, loadEscrowData, loadStatistics]);

  const handleSubmitDeposit = async (escrowId: number) => {
    try {
      // In a real implementation, this would involve actual payment processing
      // For now, we'll use a mock transaction hash
      const mockTransactionHash = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await escrowService.submitSecurityDeposit(escrowId, mockTransactionHash);
      loadEscrowData();
      loadStatistics();
    } catch (error) {
      console.error('Error submitting deposit:', error);
    }
  };

  const handleApproveDeposit = async (escrowId: number) => {
    try {
      // In a real implementation, this would involve smart contract deployment
      // For now, we'll use a mock contract address
      const mockContractAddress = `contract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await escrowService.approveSecurityDeposit(escrowId, mockContractAddress);
      loadEscrowData();
      loadStatistics();
    } catch (error) {
      console.error('Error approving deposit:', error);
    }
  };

  const handleActivateProtection = async (escrowId: number) => {
    try {
      await escrowService.activateEscrowProtection(escrowId);
      loadEscrowData();
      loadStatistics();
    } catch (error) {
      console.error('Error activating protection:', error);
    }
  };

  const handleInitiateRefund = async (escrowId: number, account: EscrowAccount) => {
    try {
      // Refund the full amount by default
      await escrowService.initiateRefund(escrowId, account.amount);
      loadEscrowData();
      loadStatistics();
    } catch (error) {
      console.error('Error initiating refund:', error);
    }
  };

  const getFilteredEscrows = () => {
    switch (activeTab) {
      case 'active':
        return escrowAccounts.filter(account => 
          account.status === EscrowStatus.PendingSubmission || 
          account.status === EscrowStatus.UnderReview ||
          account.status === EscrowStatus.FundsSecured ||
          account.status === EscrowStatus.ActiveProtection
        );
      case 'pending':
        return escrowAccounts.filter(account => 
          account.status === EscrowStatus.PendingSubmission || 
          account.status === EscrowStatus.UnderReview
        );
      case 'completed':
        return escrowAccounts.filter(account => 
          account.status === EscrowStatus.Completed || 
          account.status === EscrowStatus.RefundProcessing ||
          account.status === EscrowStatus.Cancelled ||
          account.status === EscrowStatus.Disputed
        );
      default:
        return escrowAccounts;
    }
  };

  const getStatusBadge = (status: EscrowStatus) => {
    switch (status) {
      case EscrowStatus.PendingSubmission:
        return <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">Pending Submission</Badge>;
      case EscrowStatus.UnderReview:
        return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Under Review</Badge>;
      case EscrowStatus.FundsSecured:
        return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Funds Secured</Badge>;
      case EscrowStatus.ActiveProtection:
        return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Active Protection</Badge>;
      case EscrowStatus.RefundProcessing:
        return <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">Processing Refund</Badge>;
      case EscrowStatus.Completed:
        return <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50">Completed</Badge>;
      case EscrowStatus.Disputed:
        return <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">Disputed</Badge>;
      case EscrowStatus.Cancelled:
        return <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp / 1000000).toLocaleDateString();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const isDeadlineNear = (deadline: number) => {
    const now = Date.now() * 1000000; // Convert to nanoseconds
    const dayInNanoseconds = 24 * 60 * 60 * 1000 * 1000000;
    return deadline - now < dayInNanoseconds; // Less than 1 day
  };

  if (!identity || !escrowService) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600">Please log in to access the escrow dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading escrow data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            Escrow Portal
          </h1>
          <p className="text-gray-600 mt-2">
            {userType === 'tenant' 
              ? 'Manage your security deposit submissions and track escrow status'
              : 'Review tenant deposits and manage escrow approvals'}
          </p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close Portal
          </Button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Shield className="w-10 h-10 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Escrows</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Clock className="w-10 h-10 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <IndianRupee className="w-10 h-10 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {(['active', 'pending', 'completed'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Escrows
            </button>
          ))}
        </nav>
      </div>

      {/* Escrow Cards */}
      <div className="space-y-6">
        {getFilteredEscrows().length > 0 ? (
          getFilteredEscrows().map((escrow) => (
            <Card key={escrow.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Escrow #{escrow.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Property ID: {escrow.property_id} | Rental ID: {escrow.rental_id}
                    </p>
                  </div>
                </div>
                {getStatusBadge(escrow.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">Amount</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {formatAmount(escrow.amount)}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">Submission Deadline</span>
                  </div>
                  <p className={`text-sm ${isDeadlineNear(escrow.submission_deadline) ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                    {formatDate(escrow.submission_deadline)}
                    {isDeadlineNear(escrow.submission_deadline) && (
                      <AlertCircle className="w-4 h-4 inline ml-1" />
                    )}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      {userType === 'tenant' ? 'Landlord' : 'Tenant'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {userType === 'tenant' 
                      ? escrow.landlord.toString().slice(0, 8) + '...'
                      : escrow.tenant.toString().slice(0, 8) + '...'
                    }
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {userType === 'tenant' && escrow.status === EscrowStatus.PendingSubmission && (
                  <Button 
                    onClick={() => handleSubmitDeposit(escrow.id)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Submit Deposit
                  </Button>
                )}
                
                {userType === 'landlord' && escrow.status === EscrowStatus.UnderReview && (
                  <Button 
                    onClick={() => handleApproveDeposit(escrow.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve Deposit
                  </Button>
                )}
                
                {userType === 'landlord' && escrow.status === EscrowStatus.FundsSecured && (
                  <Button 
                    onClick={() => handleActivateProtection(escrow.id)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Activate Protection
                  </Button>
                )}
                
                {userType === 'landlord' && escrow.status === EscrowStatus.ActiveProtection && (
                  <Button 
                    onClick={() => handleInitiateRefund(escrow.id, escrow)}
                    variant="outline"
                  >
                    Initiate Refund
                  </Button>
                )}

                <Button variant="outline">
                  View Timeline
                </Button>
              </div>
            </Card>
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
  );
};

export default EscrowDashboard;
