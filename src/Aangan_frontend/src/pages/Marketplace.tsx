import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Sparkles, Shield } from 'lucide-react';
import { useICP } from '@/contexts/ICPContext';
import { PropertyService } from '@/services/PropertyService';
import { toast } from 'sonner';

const Marketplace = () => {
  const { actor, isAuthenticated } = useICP();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    minRent: '',
    maxRent: '',
    bedrooms: '',
    propertyType: ''
  });
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, [actor]);

  const formatPropertyForDisplay = (prop: any) => {
    return {
      id: prop.id.toString(),
      title: prop.title,
      address: prop.address,
      rent: Number(prop.rent_amount),
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      images: prop.images && prop.images.length > 0 ? prop.images : ['placeholder'],
      propertyType: Object.keys(prop.property_type)[0] || 'Apartment'
    };
  };

  const fetchProperties = async () => {
    if (!actor) return;

    try {
      setLoading(true);
      setError(null);
      const propertyService = new PropertyService(actor);
      const rawProperties = await propertyService.getAvailableProperties();
      const formattedProperties = rawProperties.map(formatPropertyForDisplay);
      setProperties(formattedProperties);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again.');
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation = !filters.location ||
      property.address.toLowerCase().includes(filters.location.toLowerCase());

    const matchesMinRent = !filters.minRent || property.rent >= parseInt(filters.minRent);
    const matchesMaxRent = !filters.maxRent || property.rent <= parseInt(filters.maxRent);
    const matchesBedrooms = !filters.bedrooms || property.bedrooms.toString() === filters.bedrooms;
    const matchesPropertyType = !filters.propertyType || property.propertyType === filters.propertyType;

    return matchesSearch && matchesLocation && matchesMinRent && matchesMaxRent && matchesBedrooms && matchesPropertyType;
  });

  const locations = ['Mumbai', 'Delhi NCR', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/20">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 pulse-glow">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Properties...</h2>
            <p className="text-gray-600">Please wait while we fetch the latest properties</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/20">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to view available properties</p>
            <Button
              onClick={() => window.location.href = '/login'}
              className="btn-futuristic"
            >
              Login to Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/20 relative">
      {/* Futuristic background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-200/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            NFT-Secured Properties Across India
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              Dream Home
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover verified, NFT-backed rental properties across major Indian cities
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="glass-card mb-8 border-blue-100">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-futuristic pl-10"
                />
              </div>

              <select
                className="input-futuristic"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              <select
                className="input-futuristic"
                value={filters.bedrooms}
                onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
              >
                <option value="">Any BHK</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK</option>
              </select>

              <Button
                className="btn-futuristic"
                onClick={fetchProperties}
              >
                <Filter className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                <MapPin className="w-3 h-3 mr-1" />
                {filteredProperties.length} Properties
              </Badge>
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                NFT Verified
              </Badge>
              <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                Blockchain Secured
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card text-center p-4">
            <div className="text-2xl font-bold text-blue-600">{filteredProperties.length}</div>
            <div className="text-sm text-gray-600">Properties Available</div>
          </Card>
          <Card className="glass-card text-center p-4">
            <div className="text-2xl font-bold text-green-600">100%</div>
            <div className="text-sm text-gray-600">NFT Verified</div>
          </Card>
          <Card className="glass-card text-center p-4">
            <div className="text-2xl font-bold text-purple-600">ICP</div>
            <div className="text-sm text-gray-600">Blockchain Powered</div>
          </Card>
          <Card className="glass-card text-center p-4">
            <div className="text-2xl font-bold text-cyan-600">24/7</div>
            <div className="text-sm text-gray-600">Support Available</div>
          </Card>
        </div>

        {/* Property Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id.toString()}
                title={property.title}
                location={property.address}
                rent={property.rent}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                image={property.images[0] || 'placeholder'}
                isNFTBacked={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No properties found</h3>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              {searchTerm || Object.values(filters).some(filter => filter)
                ? 'Try adjusting your search criteria or filters'
                : 'No properties are currently available'}
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  location: '',
                  minRent: '',
                  maxRent: '',
                  bedrooms: '',
                  propertyType: ''
                });
                fetchProperties();
              }}
              className="btn-futuristic"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
