import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Shield, 
  Calendar,
  IndianRupee,
  FileText,
  User
} from 'lucide-react';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'overdue';
  timestamp?: string;
  deadline?: string;
  amount?: number;
}

interface EscrowTimelineProps {
  rentalId: string;
  steps: TimelineStep[];
  landlordDetails?: {
    name: string;
    contact: string;
  };
  propertyDetails?: {
    title: string;
    address: string;
  };
}

const EscrowTimeline: React.FC<EscrowTimelineProps> = ({ 
  rentalId, 
  steps, 
  landlordDetails,
  propertyDetails 
}) => {
  const getStepIcon = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStepColor = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'overdue':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusBadge = (status: TimelineStep['status']) => {
    const badges = {
      completed: <Badge className="bg-green-100 text-green-800">Completed</Badge>,
      'in-progress': <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>,
      pending: <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>,
      overdue: <Badge className="bg-red-100 text-red-800">Overdue</Badge>
    };
    return badges[status];
  };

  return (
    <div className="space-y-6">
      {/* Header Information */}
      <Card className="card-futuristic border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Shield className="w-6 h-6 mr-2 text-blue-600" />
            Escrow Timeline - {rentalId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {propertyDetails && (
              <div className="bg-blue-50/50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  Property Information
                </h4>
                <p className="font-medium text-gray-800">{propertyDetails.title}</p>
                <p className="text-sm text-gray-600">{propertyDetails.address}</p>
              </div>
            )}
            
            {landlordDetails && (
              <div className="bg-gray-50/50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Landlord Contact
                </h4>
                <p className="font-medium text-gray-800">{landlordDetails.name}</p>
                <p className="text-sm text-gray-600">{landlordDetails.contact}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="card-futuristic border-gray-200">
        <CardHeader>
          <CardTitle>Escrow Process Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start space-x-4">
                {/* Timeline line and icon */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.status === 'completed' ? 'bg-green-100' :
                    step.status === 'in-progress' ? 'bg-blue-100' :
                    step.status === 'overdue' ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    {getStepIcon(step.status)}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-1 h-16 mt-2 ${getStepColor(step.status)}`} />
                  )}
                </div>

                {/* Step content */}
                <div className="flex-1 pb-8">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{step.title}</h4>
                    {getStatusBadge(step.status)}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    {step.timestamp && (
                      <div className="flex items-center text-green-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Completed: {new Date(step.timestamp).toLocaleDateString('en-IN')}</span>
                      </div>
                    )}
                    
                    {step.deadline && step.status !== 'completed' && (
                      <div className={`flex items-center ${
                        step.status === 'overdue' ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Deadline: {new Date(step.deadline).toLocaleDateString('en-IN')}</span>
                      </div>
                    )}
                    
                    {step.amount && (
                      <div className="flex items-center text-blue-600">
                        <IndianRupee className="w-4 h-4 mr-1" />
                        <span>₹{step.amount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>

                  {/* Additional info for critical steps */}
                  {step.status === 'overdue' && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-800 text-sm font-medium">
                        ⚠️ This step is overdue. Please take immediate action to avoid lease cancellation.
                      </p>
                    </div>
                  )}

                  {step.status === 'in-progress' && (
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-blue-800 text-sm">
                        📋 This step is currently being processed. You'll be notified once completed.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="border-orange-200 bg-gradient-to-r from-orange-50/80 to-yellow-50/80">
        <CardContent className="p-6">
          <h4 className="font-semibold text-orange-900 mb-3">Important Escrow Information</h4>
          <div className="space-y-2 text-orange-800 text-sm">
            <p>• All funds are held in blockchain-secured smart contracts</p>
            <p>• Automatic release upon successful lease completion</p>
            <p>• Dispute resolution available through smart contract arbitration</p>
            <p>• No manual intervention required for standard transactions</p>
            <p>• 24/7 monitoring and real-time updates via blockchain</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EscrowTimeline;
