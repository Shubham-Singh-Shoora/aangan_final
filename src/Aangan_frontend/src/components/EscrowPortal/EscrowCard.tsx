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
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface EscrowCardProps {
  rental: {
    id: string;
    property_title: string;
    property_address: string;
    landlord_name?: string;
    deposit_amount: number;
    status: string;
    start_date: string;
    end_date: string;
  };
  onViewDetails: (rentalId: string) => void;
}

const EscrowCard: React.FC<EscrowCardProps> = ({ rental, onViewDetails }) => {
  // Generate dummy escrow data
  const escrowData = {
    depositSubmitted: Math.random() > 0.3,
    submissionDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    escrowId: `ESC-${rental.id.slice(-6)}`,
    timelineStatus: Math.floor(Math.random() * 4), // 0-3 for different stages
    daysRemaining: Math.floor(Math.random() * 7) + 1
  };

  const getEscrowStatus = () => {
    if (!escrowData.depositSubmitted) {
      return {
        status: 'Pending Submission',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <AlertCircle className="w-3 h-3" />
      };
    }
    
    switch (escrowData.timelineStatus) {
      case 0:
        return {
          status: 'Under Review',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock className="w-3 h-3" />
        };
      case 1:
        return {
          status: 'Verification in Progress',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Shield className="w-3 h-3" />
        };
      case 2:
        return {
          status: 'Funds Secured',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="w-3 h-3" />
        };
      default:
        return {
          status: 'Active Escrow',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <Shield className="w-3 h-3" />
        };
    }
  };

  const statusInfo = getEscrowStatus();

  return (
    <Card className="card-futuristic border-gray-200 bg-gradient-to-r from-white to-gray-50/30 hover-glow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-gray-900 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            Escrow Protection
          </CardTitle>
          <Badge className={statusInfo.color}>
            {statusInfo.icon}
            <span className="ml-1">{statusInfo.status}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Property Information */}
        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-blue-600" />
            Property Details
          </h4>
          <p className="font-medium text-gray-800">{rental.property_title}</p>
          <p className="text-sm text-gray-600">{rental.property_address}</p>
          {rental.landlord_name && (
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <User className="w-4 h-4 mr-1" />
              <span>Landlord: {rental.landlord_name}</span>
            </div>
          )}
        </div>

        {/* Escrow Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Security Deposit</p>
              <p className="text-2xl font-bold text-green-600 flex items-center">
                <IndianRupee className="w-5 h-5 mr-1" />
                {rental.deposit_amount.toLocaleString('en-IN')}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Escrow ID</p>
              <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {escrowData.escrowId}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {escrowData.depositSubmitted ? 'Escrow Period' : 'Submission Deadline'}
              </p>
              <p className="font-semibold text-gray-800">
                {escrowData.depositSubmitted 
                  ? `${new Date(rental.start_date).toLocaleDateString()} - ${new Date(rental.end_date).toLocaleDateString()}`
                  : escrowData.submissionDeadline.toLocaleDateString('en-IN')
                }
              </p>
            </div>

            {!escrowData.depositSubmitted && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800 font-medium">
                  ⚠️ {escrowData.daysRemaining} days remaining
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Submit deposit to avoid lease cancellation
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Progress */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="font-medium text-gray-900 mb-3">Escrow Timeline</h5>
          <div className="flex items-center space-x-2">
            {[
              { label: 'Deposit Submit', completed: escrowData.depositSubmitted },
              { label: 'Verification', completed: escrowData.timelineStatus >= 1 },
              { label: 'Funds Secured', completed: escrowData.timelineStatus >= 2 },
              { label: 'Active Protection', completed: escrowData.timelineStatus >= 3 }
            ].map((step, index) => (
              <React.Fragment key={step.label}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 text-center">{step.label}</p>
                </div>
                {index < 3 && (
                  <div className={`flex-1 h-1 ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
          <Button 
            onClick={() => onViewDetails(rental.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none"
          >
            <Shield className="w-4 h-4 mr-2" />
            View Full Details
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
          
          {!escrowData.depositSubmitted && (
            <Button className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none">
              <IndianRupee className="w-4 h-4 mr-2" />
              Submit Deposit
            </Button>
          )}
          
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            <Calendar className="w-4 h-4 mr-2" />
            View Timeline
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EscrowCard;
