import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye
} from 'lucide-react';

interface RentalRequest {
  id: string;
  property_title: string;
  property_address: string;
  tenant_name?: string;
  tenant_principal?: string;
  rent_amount: number;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
}

interface RentalRequestCardProps {
  request: RentalRequest;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onMarkUnderReview: (requestId: string) => void;
  onViewTenant: (tenantId: string) => void;
  loading?: boolean;
}

const RentalRequestCard: React.FC<RentalRequestCardProps> = ({
  request,
  onApprove,
  onReject,
  onMarkUnderReview,
  onViewTenant,
  loading = false
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(parseInt(dateString) / 1000000);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'requested':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'underreview':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'requested':
        return 'New Request';
      case 'underreview':
        return 'Under Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  return (
    <Card className="card-futuristic border-blue-200 bg-gradient-to-r from-white to-blue-50/30 hover-glow">
      <CardContent className="p-6">
        <div className="grid md:grid-cols-4 gap-6 items-center">
          {/* Property & Tenant Info */}
          <div className="md:col-span-2">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{request.property_title}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                  <span className="text-sm">{request.property_address}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusText(request.status)}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Tenant: {request.tenant_name || 'Anonymous'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rental Details */}
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Monthly Rent</p>
              <p className="text-xl font-bold text-blue-600">
                ₹{request.rent_amount?.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Requested Period</p>
              <div className="flex items-center text-sm text-gray-700">
                <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                <span>{formatDate(request.start_date)} - {formatDate(request.end_date)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-2">
            {request.status.toLowerCase() === 'requested' && (
              <>
                <Button
                  onClick={() => onApprove(request.id)}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  onClick={() => onMarkUnderReview(request.id)}
                  disabled={loading}
                  variant="outline"
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                  size="sm"
                >
                  <Clock className="w-4 h-4 mr-1" />
                  Mark Under Review
                </Button>
                <Button
                  onClick={() => onReject(request.id)}
                  disabled={loading}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                  size="sm"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
            
            {request.status.toLowerCase() === 'underreview' && (
              <>
                <Button
                  onClick={() => onApprove(request.id)}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  onClick={() => onReject(request.id)}
                  disabled={loading}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                  size="sm"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </>
            )}

            <Button
              onClick={() => onViewTenant(request.tenant_principal || '')}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
              size="sm"
            >
              <Eye className="w-4 h-4 mr-1" />
              View Tenant
            </Button>
          </div>
        </div>

        {/* Request Timestamp */}
        <div className="mt-4 pt-4 border-t border-blue-100">
          <p className="text-xs text-gray-500">
            Request submitted: {formatDate(request.created_at)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RentalRequestCard;
