import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useICP } from '@/contexts/ICPContext';
import { PropertyService } from '@/services/PropertyService';
import { RentalService } from '@/services/RentalService';
import RentalRequestCard from '@/components/RentalRequestCard';
import {
  Home,
  User,
  IndianRupee,
  Plus,
  MapPin,
  Eye,
  MessageCircle,
  Star,
  Calendar,
  Edit,
  Save,
  X,
  Mail,
  Phone,
  Settings,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

const LandlordDashboard = () => {
  const { user, actor, updateProfile } = useICP();
  const [properties, setProperties] = useState<any[]>([]);
  const [rentalRequests, setRentalRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: (user as any)?.email || '',
    phone: (user as any)?.phone || ''
  });

  useEffect(() => {
    if (actor) {
      fetchLandlordProperties();
      fetchRentalRequests();
    }
  }, [actor]);

  const fetchLandlordProperties = async () => {
    if (!actor) return;

    try {
      setLoading(true);
      const propertyService = new PropertyService(actor);
      const landlordProperties = await propertyService.getLandlordProperties();
      setProperties(landlordProperties);
    } catch (error) {
      console.error('Error fetching landlord properties:', error);
      toast.error('Failed to load property data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRentalRequests = async () => {
    if (!actor) return;

    try {
      setRequestsLoading(true);
      const rentalService = new RentalService(actor);
      const requests = await rentalService.getPendingRentalRequests();
      setRentalRequests(requests);
    } catch (error) {
      console.error('Error fetching rental requests:', error);
      // Don't show error toast for rental requests as the methods might not exist yet
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    if (!actor) return;

    try {
      const rentalService = new RentalService(actor);
      await rentalService.approveRentalRequest(parseInt(requestId));
      toast.success('Rental request approved successfully!');
      fetchRentalRequests(); // Refresh the list
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request. Please try again.');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (!actor) return;

    try {
      const rentalService = new RentalService(actor);
      await rentalService.rejectRentalRequest(parseInt(requestId));
      toast.success('Rental request rejected.');
      fetchRentalRequests(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request. Please try again.');
    }
  };

  const handleMarkUnderReview = async (requestId: string) => {
    if (!actor) return;

    try {
      const rentalService = new RentalService(actor);
      await rentalService.markRentalUnderReview(parseInt(requestId));
      toast.success('Request marked as under review.');
      fetchRentalRequests(); // Refresh the list
    } catch (error) {
      console.error('Error marking request under review:', error);
      toast.error('Failed to update request status. Please try again.');
    }
  };

  const handleViewTenant = (tenantId: string) => {
    // For now, just show a toast with tenant ID
    // In a full implementation, this would open a tenant profile modal
    toast.info(`Viewing tenant profile: ${tenantId.slice(0, 10)}...`);
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

  const rentedProperties = properties.filter(prop => prop.status === 'Rented');
  const availableProperties = properties.filter(prop => prop.status === 'Available');
  const totalEarnings = rentedProperties.reduce((sum, prop) => sum + (prop.rent_amount || 0), 0);

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
            <p className="text-gray-600">Please wait while we fetch your property data</p>
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
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="flex items-center mb-4 lg:mb-0">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg mr-4 pulse-glow">
              <Home className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-lg text-gray-600">Manage your properties and tenants</p>
            </div>
          </div>
          <Button asChild className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3">
            <Link to="/add-property">
              <Plus className="w-5 h-5 mr-2" />
              Add New Property
            </Link>
          </Button>
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

        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="card-futuristic border-blue-200 bg-gradient-to-br from-blue-50/80 to-white hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-medium mb-1 text-sm">Total Properties</p>
                  <p className="text-4xl font-bold text-gray-900">{properties.length}</p>
                  <p className="text-xs text-blue-500 mt-1">Listed properties</p>
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
                  <p className="text-green-600 font-medium mb-1 text-sm">Active Rentals</p>
                  <p className="text-4xl font-bold text-gray-900">{rentedProperties.length}</p>
                  <p className="text-xs text-green-500 mt-1">Occupied units</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-futuristic border-orange-200 bg-gradient-to-br from-orange-50/80 to-white hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 font-medium mb-1 text-sm">Available</p>
                  <p className="text-4xl font-bold text-gray-900">{availableProperties.length}</p>
                  <p className="text-xs text-orange-500 mt-1">Ready to rent</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Home className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-futuristic border-purple-200 bg-gradient-to-br from-purple-50/80 to-white hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 font-medium mb-1 text-sm">Monthly Earnings</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ₹{totalEarnings.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-purple-500 mt-1">Total income</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <IndianRupee className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rental Requests Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
              Rental Requests
            </h2>
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              <FileText className="w-4 h-4 mr-1" />
              {rentalRequests.length} Pending
            </Badge>
          </div>

          {requestsLoading ? (
            <Card className="card-futuristic border-purple-200 text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 pulse-glow">
                  <FileText className="w-8 h-8 text-white animate-pulse" />
                </div>
                <p className="text-gray-600 text-lg">Loading rental requests...</p>
              </CardContent>
            </Card>
          ) : rentalRequests.length > 0 ? (
            <div className="space-y-4">
              {rentalRequests.map((request) => (
                <RentalRequestCard
                  key={request.id}
                  request={request}
                  onApprove={handleApproveRequest}
                  onReject={handleRejectRequest}
                  onMarkUnderReview={handleMarkUnderReview}
                  onViewTenant={handleViewTenant}
                />
              ))}
            </div>
          ) : (
            <Card className="card-futuristic border-purple-200 text-center py-12 bg-gradient-to-br from-purple-50/50 to-white">
              <CardContent>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Rental Requests</h3>
                <p className="text-gray-600">New rental requests from tenants will appear here for your review.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Properties List */}
        <div className="space-y-8">
          {/* Active Rentals */}
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-6">
              Active Rentals
            </h2>
            {rentedProperties.length > 0 ? (
              <div className="space-y-6">
                {rentedProperties.map((property) => (
                  <Card key={property.id} className="card-futuristic border-green-200 bg-gradient-to-r from-white to-green-50/30 hover-glow">
                    <CardContent className="p-8">
                      <div className="grid md:grid-cols-4 gap-8 items-center">
                        <div className="md:col-span-2">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                              <Home className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{property.title}</h3>
                              <div className="flex items-center text-gray-600 mb-2">
                                <MapPin className="w-4 h-4 mr-1 text-green-500" />
                                <span className="text-sm">{property.address}</span>
                              </div>
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                Rented
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-gray-600 mb-1">Monthly Rent</p>
                          <p className="text-2xl font-bold text-green-600">
                            ₹{property.rent_amount?.toLocaleString('en-IN')}
                          </p>
                          <p className="text-sm text-gray-600">Tenant: {property.tenant_name || 'Active'}</p>
                        </div>

                        <div className="flex flex-col space-y-3">
                          <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Contact Tenant
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="card-futuristic border-green-200 text-center py-12 bg-gradient-to-br from-green-50/50 to-white">
                <CardContent>
                  <p className="text-gray-600 text-lg">No active rentals at the moment</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Available Properties */}
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent mb-6">
              Available Properties
            </h2>
            {availableProperties.length > 0 ? (
              <div className="space-y-6">
                {availableProperties.map((property) => (
                  <Card key={property.id} className="card-futuristic border-orange-200 bg-gradient-to-r from-white to-orange-50/30 hover-glow">
                    <CardContent className="p-8">
                      <div className="grid md:grid-cols-4 gap-8 items-center">
                        <div className="md:col-span-2">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                              <Home className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{property.title}</h3>
                              <div className="flex items-center text-gray-600 mb-2">
                                <MapPin className="w-4 h-4 mr-1 text-orange-500" />
                                <span className="text-sm">{property.address}</span>
                              </div>
                              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                                Available
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-gray-600 mb-1">Monthly Rent</p>
                          <p className="text-2xl font-bold text-orange-600">
                            ₹{property.rent_amount?.toLocaleString('en-IN')}
                          </p>
                          <p className="text-sm text-gray-600">
                            {property.bedrooms} BHK • {property.bathrooms} Bath
                          </p>
                        </div>

                        <div className="flex flex-col space-y-3">
                          <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Property
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="card-futuristic border-orange-200 text-center py-12 bg-gradient-to-br from-orange-50/50 to-white">
                <CardContent>
                  <p className="text-gray-600 text-lg">All properties are currently rented</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Empty State */}
        {properties.length === 0 && (
          <Card className="card-futuristic border-blue-200 text-center py-20 bg-gradient-to-br from-blue-50/50 to-white">
            <CardContent>
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 pulse-glow">
                <Home className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No properties listed yet</h3>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                Start by adding your first property to the marketplace
              </p>
              <Button asChild className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <Link to="/add-property">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Property
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LandlordDashboard;
