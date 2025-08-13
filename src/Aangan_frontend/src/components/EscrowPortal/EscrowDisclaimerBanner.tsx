import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Shield, 
  Clock, 
  IndianRupee, 
  AlertTriangle, 
  ChevronRight, 
  X,
  Info
} from 'lucide-react';

interface Rental {
  id: string;
  deposit_amount?: number;
  status: string;
}

interface EscrowDisclaimerBannerProps {
  activeRentals: Rental[];
  onViewEscrow: () => void;
}

const EscrowDisclaimerBanner: React.FC<EscrowDisclaimerBannerProps> = ({ 
  activeRentals, 
  onViewEscrow 
}) => {
  const [dismissed, setDismissed] = useState(false);

  // Don't show if no active rentals or user dismissed
  if (dismissed || activeRentals.length === 0) return null;

  // Calculate dummy escrow data
  const totalEscrowAmount = activeRentals.reduce((sum, rental) => 
    sum + (rental.deposit_amount || 50000), 0
  );

  const pendingEscrows = activeRentals.filter(rental => 
    Math.random() > 0.7 // 30% chance of pending escrow
  ).length;

  return (
    <Card className="mb-6 border-orange-200 bg-gradient-to-r from-orange-50/80 via-yellow-50/60 to-orange-50/80 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            {/* Icon */}
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-bold text-gray-900">
                  Security Deposit Escrow Protection
                </h3>
                <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Action Required
                </Badge>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">
                Your security deposits are protected through our blockchain-based escrow system. 
                Monitor deposit status, timelines, and ensure secure transactions for all your rental agreements.
              </p>

              {/* Escrow Summary */}
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white/60 p-3 rounded-lg border border-orange-100">
                  <div className="flex items-center space-x-2">
                    <IndianRupee className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Total Escrow</span>
                  </div>
                  <p className="text-xl font-bold text-orange-700">
                    ₹{totalEscrowAmount.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="bg-white/60 p-3 rounded-lg border border-orange-100">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Pending Reviews</span>
                  </div>
                  <p className="text-xl font-bold text-blue-700">
                    {pendingEscrows}
                  </p>
                </div>

                <div className="bg-white/60 p-3 rounded-lg border border-orange-100">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Protected Properties</span>
                  </div>
                  <p className="text-xl font-bold text-green-700">
                    {activeRentals.length}
                  </p>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Important Reminder:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>Security deposits must be submitted within 7 days of lease signing</li>
                      <li>Funds are held in secure blockchain escrow until lease completion</li>
                      <li>Automatic refund processing upon successful lease termination</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={onViewEscrow}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  View Escrow Portal
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                
                <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                  <Clock className="w-4 h-4 mr-2" />
                  Check Deadlines
                </Button>
              </div>
            </div>
          </div>

          {/* Dismiss Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EscrowDisclaimerBanner;
