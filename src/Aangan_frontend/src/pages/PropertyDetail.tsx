
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Home,
  Bath,
  Car,
  Wifi,
  Shield,
  Star,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Zap,
  CheckCircle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useICP } from '@/contexts/ICPContext';
import { PropertyService } from '@/services/PropertyService';
import { RentalService } from '@/services/RentalService';
import { toast } from 'sonner';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, actor } = useICP();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRequestingRental, setIsRequestingRental] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [hasActiveRental, setHasActiveRental] = useState(false);

  useEffect(() => {
    console.log('PropertyDetail mounted with id:', id);
    const fetchPropertyDetails = async () => {
      if (!actor || !id) {
        console.log('Missing actor or id:', { actor: !!actor, id });
        return;
      }

      // Validate the ID parameter
      const propertyId = parseInt(id);
      if (isNaN(propertyId) || !Number.isInteger(propertyId) || propertyId < 0) {
        console.error('Invalid property ID:', id);
        toast.error('Invalid property ID');
        navigate('/marketplace');
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching property with id:', propertyId);
        const propertyService = new PropertyService(actor);
        const rentalService = new RentalService(actor);
        
        // Fetch property data
        const propertyData = await propertyService.getPropertyById(propertyId);
        console.log('Property data received:', propertyData);
        setProperty(propertyData);
        
        // Check if property has active rental
        try {
          const myRentals = await rentalService.getMyRentals();
          const hasActive = myRentals.some(rental => Number(rental.property_id) === propertyId);
          setHasActiveRental(hasActive);
          console.log('Active rental found:', hasActive);
        } catch (rentalError) {
          console.log('Error checking rental status:', rentalError);
          // Don't fail the whole component if rental check fails
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        toast.error('Failed to load property details');
        navigate('/marketplace');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id, actor, navigate]);

  const handleDeleteProperty = async () => {
    if (!actor || !property || !id) return;

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this property? This action cannot be undone.'
    );

    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      const propertyService = new PropertyService(actor);
      await propertyService.deleteProperty(parseInt(id));
      toast.success('Property deleted successfully');
      navigate('/landlord-dashboard');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRequestRental = async () => {
    if (!actor || !property || !id || !user) return;

    // Check property availability before making request
    if (!property.is_available || hasActiveRental) {
      toast.error('This property is currently not available for rent or already has an active rental.');
      return;
    }

    try {
      setIsRequestingRental(true);
      const rentalService = new RentalService(actor);
      
      // Set default rental period (30 days from now)
      const startDate = Date.now() * 1000000; // Convert to nanoseconds
      const endDate = (Date.now() + (30 * 24 * 60 * 60 * 1000)) * 1000000; // 30 days later in nanoseconds
      
      await rentalService.requestRental(parseInt(id), startDate, endDate);
      toast.success('Rental request submitted successfully! The landlord will review your request.');
      
      // Optionally redirect to tenant dashboard to view pending requests
      navigate('/tenant-dashboard');
    } catch (error) {
      console.error('Error requesting rental:', error);
      
      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message.includes('already has an active rental')) {
          toast.error('This property already has an active rental. Please check other available properties.');
        } else if (error.message.includes('not available')) {
          toast.error('This property is currently not available for rent.');
        } else if (error.message.includes('Authentication')) {
          toast.error('Please log in to request a rental.');
        } else {
          toast.error(`Failed to submit rental request: ${error.message}`);
        }
      } else {
        toast.error('Failed to submit rental request. Please try again.');
      }
    } finally {
      setIsRequestingRental(false);
    }
  };

  // Check if current user is the property owner
  const isPropertyOwner = user && property && user.toString() === property.owner;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/20">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 pulse-glow">
              <Home className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Property...</h2>
            <p className="text-gray-600">Please wait while we fetch property details</p>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/20">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h2>
            <p className="text-gray-600 mb-4">The property you're looking for doesn't exist or has been removed</p>
            <Button onClick={() => navigate('/marketplace')} className="btn-futuristic">
              Back to Marketplace
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Format property data for display
  const formatPropertyForDisplay = (prop: any) => {
    return {
      id: prop.id.toString(),
      title: prop.title,
      location: prop.address,
      rent: Number(prop.rent_amount),
      deposit: Number(prop.deposit_amount),
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      area: prop.area_sqft,
      furnished: 'Furnished', // This should come from property data
      parking: true, // This should come from amenities
      images: prop.images && prop.images.length > 0 ? prop.images : [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=800&h=600&auto=format&fit=crop'
      ],
      amenities: prop.amenities || ['WiFi', 'Parking', 'Security'],
      description: prop.description,
      landlord: {
        name: 'Property Owner', // This should come from landlord's profile
        rating: 4.8,
        properties: 1,
        verified: true
      },
      nft: {
        id: `NFT-PROP-${prop.id}`,
        contract: 'ICP-Canister',
        verified: true
      }
    };
  };

  const displayProperty = formatPropertyForDisplay(property);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/20 relative">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-200/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <Card className="glass-card border-blue-100 overflow-hidden">
              <Carousel className="w-full">
                <CarouselContent>
                  {displayProperty.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={image}
                          alt={`Property image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </Card>

            {/* Property Info */}
            <Card className="card-futuristic">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{displayProperty.title}</h1>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                      <span>{displayProperty.location}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsLiked(!isLiked)}
                      className={`glass-card ${isLiked ? 'text-red-500 border-red-200' : 'text-gray-500 border-gray-200'}`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    </Button>
                    <Button variant="outline" size="sm" className="glass-card border-gray-200">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Home className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">{displayProperty.bedrooms} BHK</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-cyan-50 rounded-lg">
                    <Bath className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">{displayProperty.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="w-6 h-6 bg-green-600 rounded mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">ft²</span>
                    </div>
                    <div className="font-semibold text-gray-900">{displayProperty.area}</div>
                    <div className="text-sm text-gray-600">Sq Ft</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Car className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">Yes</div>
                    <div className="text-sm text-gray-600">Parking</div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {displayProperty.amenities.map((amenity) => (
                      <Badge key={amenity} className="bg-blue-50 text-blue-700 border-blue-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{displayProperty.description}</p>
                </div>

                {/* NFT Information */}
                <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">NFT-Secured Property</h3>
                        <p className="text-sm text-gray-600">Blockchain verified ownership</p>
                      </div>
                      <Badge className="ml-auto bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">NFT ID:</span>
                        <span className="ml-2 font-mono bg-white px-2 py-1 rounded">{displayProperty.nft.id}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Contract:</span>
                        <span className="ml-2 font-mono bg-white px-2 py-1 rounded">{displayProperty.nft.contract}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="card-futuristic border-blue-200">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-blue-600">
                    ₹{displayProperty.rent.toLocaleString('en-IN')}
                  </div>
                  <div className="text-gray-600">per month</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Security Deposit: ₹{displayProperty.deposit.toLocaleString('en-IN')}
                  </div>
                </div>

                <Button
                  onClick={handleRequestRental}
                  className="btn-futuristic w-full mb-4 text-lg py-3"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Request to Rent
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="glass-card">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" className="glass-card">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Landlord Info */}
            <Card className="card-futuristic">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Property Owner</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {displayProperty.landlord.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{displayProperty.landlord.name}</div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      {displayProperty.landlord.rating} ({displayProperty.landlord.properties} properties)
                    </div>
                  </div>
                  {displayProperty.landlord.verified && (
                    <Badge className="bg-green-100 text-green-800 border-green-200 ml-auto">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <Button variant="outline" className="w-full glass-card">
                  <Eye className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </CardContent>
            </Card>

            {/* Safety Features */}
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Safety & Security</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span>NFT-secured ownership</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span>Verified landlord identity</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span>Blockchain rental agreement</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span>24/7 support available</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="mt-6 space-y-4">
              {isPropertyOwner ? (
                // Owner Actions
                <div className="flex gap-4">
                  <Button 
                    onClick={() => navigate(`/edit-property/${id}`)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Property
                  </Button>
                  <Button 
                    onClick={handleDeleteProperty}
                    disabled={isDeleting}
                    variant="destructive"
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleting ? 'Deleting...' : 'Delete Property'}
                  </Button>
                </div>
              ) : (
                // Tenant Actions
                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Landlord
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleRequestRental}
                    disabled={isRequestingRental || !property?.is_available || hasActiveRental}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {hasActiveRental ? 'Property Already Rented' :
                     !property?.is_available ? 'Property Not Available' : 
                     isRequestingRental ? 'Submitting Request...' : 'Request Rental'}
                  </Button>
                </div>
              )}
              
              {/* Show availability status */}
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${
                  hasActiveRental ? 'bg-orange-500' : 
                  property?.is_available ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className={`text-sm font-medium ${
                  hasActiveRental ? 'text-orange-700' :
                  property?.is_available ? 'text-green-700' : 'text-red-700'
                }`}>
                  {hasActiveRental ? 'Currently Rented' :
                   property?.is_available ? 'Available for Rent' : 'Currently Unavailable'}
                </span>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/marketplace')}
                className="w-full"
              >
                Back to Marketplace
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
