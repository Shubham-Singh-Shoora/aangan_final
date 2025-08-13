
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useICP } from '@/contexts/ICPContext';
import { PropertyService } from '@/services/PropertyService';
import { RentalService } from '@/services/RentalService';
import EscrowDisclaimerBanner from '@/components/EscrowPortal/EscrowDisclaimerBanner';
import {
  Home,
  Clock,
  CheckCircle,
  Star,
  Eye,
  Zap,
  MapPin,
  Calendar,
  User,
  Settings,
  Edit,
  Save,
  X,
  Mail,
  Phone,
  AlertCircle,
  CreditCard,
  IndianRupee
} from 'lucide-react';
import { toast } from 'sonner';

const TenantDashboard = () => {
  const { user, actor, updateProfile } = useICP();
  const [rentals, setRentals] = useState<any[]>([]);
  const [approvedRentals, setApprovedRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: (user as any)?.email || '',
    phone: (user as any)?.phone || ''
  });

  useEffect(() => {
    if (actor) {
      fetchTenantRentals();
      fetchApprovedRentals();
    }
  }, [actor]);

  const fetchTenantRentals = async () => {
    if (!actor) return;

    try {
      setLoading(true);
      const rentalService = new RentalService(actor);
      const tenantRentals = await rentalService.getTenantRentals();
      setRentals(tenantRentals);
    } catch (error) {
      console.error('Error fetching tenant rentals:', error);
      toast.error('Failed to load rental data');
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedRentals = async () => {
    if (!actor) return;

    try {
      const rentalService = new RentalService(actor);
      const approved = await rentalService.getApprovedRentals();
      setApprovedRentals(approved);
    } catch (error) {
      console.error('Error fetching approved rentals:', error);
      // Don't show error toast as the method might not exist yet
    }
  };

  const handleProceedToAgreement = (rental: any) => {
    // Validate that we have a proper property ID before navigating
    const propertyId = rental.propertyId || rental.property_id;
    if (!propertyId || propertyId === 'undefined' || propertyId === 'null') {
      console.error('Invalid property ID for rental:', rental);
      toast.error('Cannot proceed: Invalid property information');
      return;
    }

    // Navigate to rental agreement page for approved rental
    window.location.href = `/rental-agreement/${propertyId}?rental_id=${rental.id}`;
  };

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(profileData.name, profileData.email, profileData.phone);
      toast.success('Profile updated successfully');
      setEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const formatDate = (dateString: string | bigint) => {
    const date = typeof dateString === 'bigint' ? new Date(Number(dateString) / 1000000) : new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilPayment = (dueDateString: string | bigint) => {
    const dueDate = typeof dueDateString === 'bigint' ? new Date(Number(dueDateString) / 1000000) : new Date(dueDateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const activeRentals = rentals.filter(rental => rental.status === 'Active');
  const completedRentals = rentals.filter(rental => rental.status === 'Completed');
  const pendingRentals = rentals.filter(rental => 
    rental.status === 'Requested' || 
    rental.status === 'UnderReview' || 
    rental.status === 'Rejected'
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Requested':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Request Pending
        </Badge>;
      case 'UnderReview':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <Eye className="w-3 h-3 mr-1" />
          Under Review
        </Badge>;
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Request Rejected
        </Badge>;
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          {status}
        </Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/20">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 pulse-glow">
              <Home className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Dashboard...</h2>
            <p className="text-gray-600">Please wait while we fetch your rental data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/20">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg mr-4 pulse-glow">
              <Home className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-lg text-gray-600">Manage your rentals and payments seamlessly</p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="card-futuristic border-blue-200 bg-gradient-to-br from-blue-50/80 to-white hover-glow mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                <p className="text-gray-600">Manage your account details</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setEditingProfile(!editingProfile)}
              className="flex items-center space-x-2"
            >
              {editingProfile ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              <span>{editingProfile ? 'Cancel' : 'Edit'}</span>
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            {editingProfile ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleProfileUpdate} className="btn-futuristic">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{user?.name || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{(user as any)?.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{(user as any)?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Escrow Portal Disclaimer Banner */}
        <EscrowDisclaimerBanner 
          activeRentals={activeRentals}
          onViewEscrow={() => window.location.href = '/escrow-portal'}
        />

        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="card-futuristic border-blue-200 bg-gradient-to-br from-blue-50/80 to-white hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-medium mb-1 text-sm">Active Rentals</p>
                  <p className="text-4xl font-bold text-gray-900">{activeRentals.length}</p>
                  <p className="text-xs text-blue-500 mt-1">Properties rented</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Home className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-futuristic border-green-200 bg-gradient-to-br from-green-50/80 to-white hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-medium mb-1 text-sm">Payments Status</p>
                  <p className="text-4xl font-bold text-gray-900">{activeRentals.length}</p>
                  <p className="text-xs text-green-500 mt-1">All up to date</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-futuristic border-purple-200 bg-gradient-to-br from-purple-50/80 to-white hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 font-medium mb-1 text-sm">NFT Properties</p>
                  <p className="text-4xl font-bold text-gray-900">{rentals.length}</p>
                  <p className="text-xs text-purple-500 mt-1">Blockchain verified</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Rental Requests */}
        {pendingRentals.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-6">
              Pending Requests
            </h2>
            <div className="space-y-6">
              {pendingRentals.map((rental) => (
                <Card key={rental.id} className="card-futuristic border-yellow-200 bg-gradient-to-r from-white to-yellow-50/30 hover-glow">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-4 gap-8 items-center">
                      <div className="md:col-span-2">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                            <Clock className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{rental.property_title}</h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="w-4 h-4 mr-1 text-yellow-500" />
                              <span className="text-sm">{rental.property_address}</span>
                            </div>
                            {getStatusBadge(rental.status)}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 mb-1">Monthly Rent</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          ₹{rental.rent_amount?.toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm text-gray-600">
                          Period: {formatDate(rental.start_date)} - {formatDate(rental.end_date)}
                        </p>
                      </div>

                      <div className="flex flex-col space-y-3">
                        {rental.status === 'Rejected' ? (
                          <Button 
                            onClick={() => window.location.href = '/marketplace'}
                            variant="outline" 
                            className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          >
                            <Home className="w-4 h-4 mr-2" />
                            Browse Other Properties
                          </Button>
                        ) : (
                          <>
                            <Button disabled className="bg-gray-300 text-gray-500 cursor-not-allowed">
                              <Clock className="w-4 h-4 mr-2" />
                              Waiting for Approval
                            </Button>
                          </>
                        )}
                        <Button variant="outline" className="border-yellow-200 text-yellow-600 hover:bg-yellow-50">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : null}

        {/* Approved Rentals - Ready to Sign */}
        {approvedRentals.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-6">
              Approved Rentals - Ready to Sign
            </h2>
            <div className="space-y-6">
              {approvedRentals.map((rental) => (
                <Card key={rental.id} className="card-futuristic border-green-200 bg-gradient-to-r from-white to-green-50/30 hover-glow">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-4 gap-8 items-center">
                      <div className="md:col-span-2">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{rental.property_title}</h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="w-4 h-4 mr-1 text-green-500" />
                              <span className="text-sm">{rental.property_address}</span>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approved by Landlord
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 mb-1">Monthly Rent</p>
                        <p className="text-2xl font-bold text-green-600">
                          ₹{rental.rent_amount?.toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm text-gray-600">
                          Period: {formatDate(rental.start_date)} - {formatDate(rental.end_date)}
                        </p>
                      </div>

                      <div className="flex flex-col space-y-3">
                        <Button 
                          onClick={() => handleProceedToAgreement(rental)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Proceed to Agreement
                        </Button>
                        <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : null}

        {/* Active Rentals */}
        {activeRentals.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
              Active Rentals
            </h2>
            <div className="space-y-6">
              {activeRentals.map((rental) => (
                <Card key={rental.id} className="card-futuristic border-blue-200 bg-gradient-to-r from-white to-blue-50/30 hover-glow">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-4 gap-8 items-center">
                      <div className="md:col-span-2">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <Home className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{rental.property_title}</h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                              <span className="text-sm">{rental.property_address}</span>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              <Zap className="w-3 h-3 mr-1" />
                              NFT: {rental.nft_id}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 mb-1">Monthly Rent</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ₹{rental.rent_amount?.toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm text-gray-600">
                          Period: {formatDate(rental.start_date)} - {formatDate(rental.end_date)}
                        </p>
                      </div>

                      <div className="flex flex-col space-y-3">
                        <Button className="btn-futuristic">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay Rent
                        </Button>
                        <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : null}

        {/* Past Rentals */}
        {completedRentals.length > 0 ? (
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent mb-6">
              Rental History
            </h2>
            <div className="space-y-4">
              {completedRentals.map((rental) => (
                <Card key={rental.id} className="card-futuristic border-gray-200 bg-gradient-to-r from-gray-50/80 to-white">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-4 gap-6 items-center">
                      <div className="md:col-span-2">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg flex items-center justify-center opacity-75">
                            <Home className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-700 mb-1">{rental.property_title}</h3>
                            <div className="flex items-center text-gray-500 mb-2">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">{rental.property_address}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">Rental Period</p>
                        <p className="font-medium text-gray-700">
                          {formatDate(rental.start_date)} - {formatDate(rental.end_date)}
                        </p>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Rate Property
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : null}

        {/* Empty State - Show when user has no rentals at all */}
        {rentals.length === 0 && approvedRentals.length === 0 && !loading && (
          <Card className="card-futuristic border-blue-200 text-center py-20 bg-gradient-to-br from-blue-50/50 to-white">
            <CardContent>
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 pulse-glow">
                <Home className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Welcome to AANGAN!</h3>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                You haven't started any rental requests yet. Browse our marketplace to find available properties and request rentals from landlords.
              </p>
              <Button
                onClick={() => window.location.href = '/marketplace'}
                className="btn-futuristic"
              >
                <Home className="w-5 h-5 mr-2" />
                Browse Available Properties
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;
