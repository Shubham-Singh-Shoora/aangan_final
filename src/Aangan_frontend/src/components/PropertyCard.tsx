
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Home, Wifi, Car, Zap } from 'lucide-react';

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  image: string;
  isNFTBacked?: boolean;
}

const PropertyCard = ({
  id,
  title,
  location,
  rent,
  bedrooms,
  bathrooms,
  image,
  isNFTBacked = true
}: PropertyCardProps) => {
  const navigate = useNavigate();
  
  console.log('PropertyCard rendered with id:', id);
  console.log('Navigate function available:', !!navigate);

  const handleViewDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Button clicked! Navigating to property:', id);
    console.log('Current window location:', window.location.href);
    try {
      // Try React Router navigation first
      navigate(`/property/${id}`);
      console.log('Navigation attempted to:', `/property/${id}`);
    } catch (error) {
      console.error('React Router navigation failed:', error);
      // Fallback to window navigation
      console.log('Trying window navigation...');
      window.location.href = `/property/${id}`;
    }
  };

  // Alternative direct navigation function
  const handleDirectNavigation = () => {
    console.log('Direct navigation to:', `/property/${id}`);
    window.location.href = `/property/${id}`;
  };

  // Use the provided image or fallback to a placeholder
  const imageUrl = image && image !== 'placeholder'
    ? image
    : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&auto=format&fit=crop';

  return (
    <Card 
      className="card-futuristic bg-gradient-to-br from-white to-blue-50/30 border-blue-100 hover:border-blue-300 group"
      onClick={(e) => {
        console.log('Card clicked, target:', e.target);
        // Don't navigate if clicking on the card itself
      }}
    >
      <div className="aspect-[4/3] overflow-hidden rounded-t-xl">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          {isNFTBacked && (
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg">
              <Zap className="w-3 h-3 mr-1" />
              NFT
            </Badge>
          )}
        </div>

        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
          <span className="text-sm">{location}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Home className="w-4 h-4 text-blue-500" />
              <span>{bedrooms} BHK</span>
            </div>
            <span className="text-gray-300">•</span>
            <span>{bathrooms} Bath</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Wifi className="w-3 h-3" />
          <Car className="w-3 h-3" />
          <span>Furnished</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-blue-600">
              ₹{rent.toLocaleString('en-IN')}
            </span>
            <span className="text-gray-500 ml-1">/month</span>
          </div>

          <Button
            onClick={handleViewDetails}
            type="button"
            style={{ 
              pointerEvents: 'auto', 
              zIndex: 10,
              position: 'relative'
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg cursor-pointer"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
