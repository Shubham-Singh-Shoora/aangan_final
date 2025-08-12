import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Home, Upload, X, Plus } from 'lucide-react';
import { useICP } from '@/contexts/ICPContext';
import { PropertyService } from '@/services/PropertyService';
import { imageUploadService } from '@/services/ImageUploadService';
import { toast } from 'sonner';
import Header from '@/components/Header';

const AddProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { actor, user } = useICP();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    rent: '',
    deposit: '',
    leaseDuration: '',
    amenities: [] as string[]
  });

  // Load existing property data for editing
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!actor || !id) return;

      try {
        const propertyService = new PropertyService(actor);
        const property = await propertyService.getPropertyById(parseInt(id));
        
        // Populate form with existing data
        setFormData({
          title: property.title,
          description: property.description,
          address: property.address.split(',')[0] || '', // Extract address part
          city: property.address.split(',')[1]?.trim() || '',
          state: property.address.split(',')[2]?.trim() || '',
          pincode: property.address.split('-')[1]?.trim() || '',
          propertyType: Object.keys(property.property_type)[0] || '',
          bedrooms: property.bedrooms.toString(),
          bathrooms: property.bathrooms.toString(),
          area: property.area_sqft.toString(),
          rent: property.rent_amount.toString(),
          deposit: property.deposit_amount.toString(),
          leaseDuration: '',
          amenities: property.amenities || []
        });
        
        setImages(property.images || []);
      } catch (error) {
        console.error('Error fetching property data:', error);
        toast.error('Failed to load property data');
        navigate('/landlord-dashboard');
      }
    };

    if (isEditing && id && actor) {
      fetchPropertyData();
    }
  }, [isEditing, id, actor, navigate]);

  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
  ];

  const propertyTypes = [
    'Apartment', 'House', 'Villa', 'Studio', 'Condo', 'Townhouse'
  ];

  const amenitiesList = [
    'Wi-Fi', 'Parking', 'Air Conditioning', 'Furnished', 'Gym',
    'Swimming Pool', 'Security', 'Elevator', 'Balcony', 'Garden',
    'Power Backup', 'Water Supply 24/7', 'Gated Community', 'CCTV Surveillance',
    'Intercom', 'Maintenance Staff', 'Club House', 'Children\'s Play Area'
  ];

  // Check if user is a landlord
  React.useEffect(() => {
    if (user && Object.keys(user.role)[0] !== 'Landlord') {
      navigate('/tenant-dashboard');
      toast.error('Only landlords can add properties');
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Property title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.rent.trim()) newErrors.rent = 'Monthly rent is required';
    if (!formData.bedrooms.trim()) newErrors.bedrooms = 'Number of bedrooms is required';
    if (!formData.bathrooms.trim()) newErrors.bathrooms = 'Number of bathrooms is required';
    if (!formData.area.trim()) newErrors.area = 'Area is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
    if (!formData.deposit.trim()) newErrors.deposit = 'Security deposit is required';

    // Validate pincode format (6 digits)
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    // Validate numeric fields are positive numbers
    if (formData.rent && (isNaN(Number(formData.rent)) || Number(formData.rent) <= 0)) {
      newErrors.rent = 'Rent must be a positive number';
    }
    if (formData.deposit && (isNaN(Number(formData.deposit)) || Number(formData.deposit) <= 0)) {
      newErrors.deposit = 'Deposit must be a positive number';
    }
    if (formData.bedrooms && (isNaN(Number(formData.bedrooms)) || Number(formData.bedrooms) <= 0)) {
      newErrors.bedrooms = 'Bedrooms must be a positive number';
    }
    if (formData.bathrooms && (isNaN(Number(formData.bathrooms)) || Number(formData.bathrooms) <= 0)) {
      newErrors.bathrooms = 'Bathrooms must be a positive number';
    }
    if (formData.area && (isNaN(Number(formData.area)) || Number(formData.area) <= 0)) {
      newErrors.area = 'Area must be a positive number';
    }

    if (images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    // Debug logging
    console.log('Validation errors:', newErrors);
    console.log('Form data:', formData);
    console.log('Images count:', images.length);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Validate file sizes before upload
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = Array.from(files).filter(file => file.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      toast.error('Some files are too large. Please select images under 5MB.');
      return;
    }

    // Limit total number of images
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    try {
      // Show upload progress
      toast.info('Compressing and uploading images...');
      
      const imageUrls = await imageUploadService.uploadMultipleImages(files);
      setImages(prev => [...prev, ...imageUrls].slice(0, 5));
      
      toast.success(`${files.length} image(s) uploaded successfully`);
      
      // Clear images error if it exists
      if (errors.images) {
        setErrors(prev => ({ ...prev, images: '' }));
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Failed to upload images. Please try smaller images or try again.');
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    if (!actor) {
      toast.error('Please login to add a property');
      return;
    }

    setIsSubmitting(true);

    try {
      const propertyService = new PropertyService(actor);

      // Prepare the property data
      const propertyData = {
        title: formData.title,
        description: formData.description,
        address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        rent_amount: Number(formData.rent),
        deposit_amount: Number(formData.deposit),
        property_type: formData.propertyType as 'Apartment' | 'House' | 'Villa' | 'Studio' | 'Condo' | 'Townhouse',
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area_sqft: Number(formData.area),
        images: images, // In production, these would be IPFS hashes or URLs
        amenities: formData.amenities
      };

      let result;
      if (isEditing && id) {
        // Update existing property
        result = await propertyService.updateProperty(parseInt(id), propertyData);
        toast.success('Property updated successfully!');
      } else {
        // Create new property
        result = await propertyService.addProperty(propertyData);
        toast.success('Property listed successfully!');
      }

      // Navigate back to landlord dashboard
      navigate('/landlord-dashboard');
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'add'} property. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/20">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mr-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 glass-card"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {isEditing ? 'Edit Property' : 'Add New Property'}
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                {isEditing ? 'Update your property details' : 'List your property on the NFT marketplace'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="card-futuristic border-blue-200 bg-gradient-to-r from-white to-blue-50/30">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-blue-600">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
                  Property Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Modern 3BHK Apartment in Bandra"
                  className="input-futuristic"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your property in detail..."
                  rows={4}
                  className="input-futuristic"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="propertyType" className="text-sm font-medium text-gray-700 mb-2 block">
                    Property Type *
                  </Label>
                  <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                    <SelectTrigger className="input-futuristic">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>}
                </div>

                <div>
                  <Label htmlFor="bedrooms" className="text-sm font-medium text-gray-700 mb-2 block">
                    Bedrooms *
                  </Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                    placeholder="Number of bedrooms"
                    className="input-futuristic"
                  />
                  {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bathrooms" className="text-sm font-medium text-gray-700 mb-2 block">
                    Bathrooms *
                  </Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    placeholder="Number of bathrooms"
                    className="input-futuristic"
                  />
                  {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
                </div>

                <div>
                  <Label htmlFor="area" className="text-sm font-medium text-gray-700 mb-2 block">
                    Area (sq ft) *
                  </Label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    placeholder="Area in square feet"
                    className="input-futuristic"
                  />
                  {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="card-futuristic border-blue-200 bg-gradient-to-r from-white to-blue-50/30">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-blue-600">Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 block">
                  Full Address *
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter complete address"
                  rows={2}
                  className="input-futuristic"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700 mb-2 block">
                    City *
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter city"
                    className="input-futuristic"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <Label htmlFor="state" className="text-sm font-medium text-gray-700 mb-2 block">
                    State *
                  </Label>
                  <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                    <SelectTrigger className="input-futuristic">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="pincode" className="text-sm font-medium text-gray-700 mb-2 block">
                  PIN Code *
                </Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  placeholder="Enter 6-digit PIN code"
                  className="input-futuristic"
                />
                {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="card-futuristic border-blue-200 bg-gradient-to-r from-white to-blue-50/30">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-blue-600">Pricing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rent" className="text-sm font-medium text-gray-700 mb-2 block">
                    Monthly Rent (₹) *
                  </Label>
                  <Input
                    id="rent"
                    type="number"
                    value={formData.rent}
                    onChange={(e) => handleInputChange('rent', e.target.value)}
                    placeholder="Enter monthly rent"
                    className="input-futuristic"
                  />
                  {errors.rent && <p className="text-red-500 text-sm mt-1">{errors.rent}</p>}
                </div>

                <div>
                  <Label htmlFor="deposit" className="text-sm font-medium text-gray-700 mb-2 block">
                    Security Deposit (₹) *
                  </Label>
                  <Input
                    id="deposit"
                    type="number"
                    value={formData.deposit}
                    onChange={(e) => handleInputChange('deposit', e.target.value)}
                    placeholder="Enter security deposit"
                    className="input-futuristic"
                  />
                  {errors.deposit && <p className="text-red-500 text-sm mt-1">{errors.deposit}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="card-futuristic border-blue-200 bg-gradient-to-r from-white to-blue-50/30">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-blue-600">Property Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-lg text-gray-600">Click to upload images</p>
                  <p className="text-sm text-gray-500 mt-2">Upload up to 10 images</p>
                </label>
              </div>
              {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="card-futuristic border-blue-200 bg-gradient-to-r from-white to-blue-50/30">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-blue-600">Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenitiesList.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                    />
                    <Label htmlFor={amenity} className="text-sm text-gray-700">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="px-8 py-3 text-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-futuristic px-8 py-3 text-lg"
            >
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update Property' : 'List Property')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
