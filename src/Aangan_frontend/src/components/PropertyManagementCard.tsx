import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreVertical, 
  Edit, 
  Eye, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  MapPin,
  Home,
  IndianRupee,
  Calendar,
  Zap
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    address: string;
    rent: number;
    bedrooms: number;
    bathrooms: number;
    isAvailable: boolean;
    images: string[];
    status?: 'Available' | 'Rented' | 'Maintenance';
    tenant?: string;
    createdAt: Date;
  };
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string, available: boolean) => void;
}

const PropertyManagementCard: React.FC<PropertyCardProps> = ({
  property,
  onUpdate,
  onDelete,
  onToggleAvailability
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleAvailability = async () => {
    setIsLoading(true);
    try {
      await onToggleAvailability(property.id, !property.isAvailable);
      toast.success(`Property ${property.isAvailable ? 'marked as unavailable' : 'made available'}`);
    } catch (error) {
      toast.error('Failed to update property status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        await onDelete(property.id);
        toast.success('Property deleted successfully');
      } catch (error) {
        toast.error('Failed to delete property');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getStatusBadge = () => {
    if (!property.isAvailable) {
      return <Badge variant="secondary">Unavailable</Badge>;
    }
    
    switch (property.status) {
      case 'Rented':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Rented</Badge>;
      case 'Available':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Available</Badge>;
      case 'Maintenance':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Maintenance</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="card-futuristic hover-glow">
      <CardContent className="p-6">
        <div className="grid md:grid-cols-5 gap-6 items-center">
          {/* Property Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src={property.images[0] || '/placeholder-property.jpg'}
                  alt={property.title}
                  className="w-20 h-20 rounded-xl object-cover shadow-lg"
                />
                {!property.isAvailable && (
                  <div className="absolute inset-0 bg-gray-500/50 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs font-bold">INACTIVE</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {property.title}
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{property.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge()}
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-sm text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    NFT
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Details</p>
            <p className="font-semibold">{property.bedrooms} BHK • {property.bathrooms} Bath</p>
            <p className="text-xs text-gray-500">
              Listed: {property.createdAt.toLocaleDateString('en-IN')}
            </p>
          </div>

          {/* Rent Info */}
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Monthly Rent</p>
            <p className="text-2xl font-bold text-blue-600">
              ₹{property.rent.toLocaleString('en-IN')}
            </p>
            {property.tenant && (
              <p className="text-xs text-green-600">Tenant: {property.tenant}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                asChild
                className="flex-1"
              >
                <Link to={`/property/${property.id}`}>
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                asChild
                className="flex-1"
              >
                <Link to={`/edit-property/${property.id}`}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Link>
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleAvailability}
                disabled={isLoading}
                className="flex-1"
              >
                {property.isAvailable ? (
                  <>
                    <ToggleLeft className="w-4 h-4 mr-1" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <ToggleRight className="w-4 h-4 mr-1" />
                    Activate
                  </>
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Property
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyManagementCard;
