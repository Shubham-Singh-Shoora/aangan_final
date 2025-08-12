# Property Management Enhancements Required

## 1. Image Upload & Storage Implementation

### Current State:
- Form accepts image files but creates temporary URLs
- Images are stored as string arrays in backend

### Required Enhancements:
```typescript
// Add to PropertyService.ts
async uploadToIPFS(file: File): Promise<string> {
  // Implement IPFS upload
  // Return IPFS hash
}

async uploadImages(files: FileList): Promise<string[]> {
  const uploadPromises = Array.from(files).map(file => this.uploadToIPFS(file));
  return Promise.all(uploadPromises);
}
```

### Implementation Steps:
1. Install IPFS client: `npm install ipfs-http-client`
2. Set up IPFS node or use service like Pinata
3. Update image upload handler in AddProperty.tsx
4. Store IPFS hashes instead of blob URLs

## 2. Backend Property Update API

### Current State:
- Only `update_property_availability` exists
- No full property update method

### Required Backend Enhancement:
```rust
// Add to property_api.rs
#[update]
pub fn update_property(
    property_id: u64,
    title: String,
    description: String,
    address: String,
    rent_amount: u64,
    deposit_amount: u64,
    property_type: PropertyType,
    bedrooms: u32,
    bathrooms: u32,
    area_sqft: u32,
    images: Vec<String>,
    amenities: Vec<String>,
) -> Result<Property, String> {
    let caller = auth::require_authenticated()?;
    
    let mut property = property_store::get_property(property_id)
        .ok_or_else(|| "Property not found".to_string())?;
        
    if property.owner != caller {
        return Err("Only property owner can update property".to_string());
    }
    
    // Update property fields
    property.title = title;
    property.description = description;
    property.address = address;
    property.rent_amount = rent_amount;
    property.deposit_amount = deposit_amount;
    property.property_type = property_type;
    property.bedrooms = bedrooms;
    property.bathrooms = bathrooms;
    property.area_sqft = area_sqft;
    property.images = images;
    property.amenities = amenities;
    property.updated_at = ic_cdk::api::time();
    
    property_store::update_property(property.clone())?;
    Ok(property)
}
```

## 3. Property Deletion Feature

### Required Backend Method:
```rust
#[update]
pub fn delete_property(property_id: u64) -> Result<String, String> {
    let caller = auth::require_authenticated()?;
    
    let property = property_store::get_property(property_id)
        .ok_or_else(|| "Property not found".to_string())?;
        
    if property.owner != caller {
        return Err("Only property owner can delete property".to_string());
    }
    
    // Check if property has active rentals
    // If yes, prevent deletion
    
    property_store::delete_property(property_id)?;
    Ok("Property deleted successfully".to_string())
}
```

## 4. Enhanced Property Management Dashboard

### Add to LandlordDashboard.tsx:
- Property performance analytics
- Rental history for each property
- Bulk actions (activate/deactivate multiple properties)
- Property status filters

## 5. Property Validation Enhancements

### Current Issues:
- Basic form validation exists
- Missing advanced validation

### Enhancements Needed:
```typescript
// Enhanced validation in AddProperty.tsx
const validateAdvanced = () => {
  const errors: Record<string, string> = {};
  
  // Rent validation
  if (Number(formData.rent) < 1000) {
    errors.rent = 'Minimum rent should be ₹1,000';
  }
  
  // Area validation
  if (Number(formData.area) < 100) {
    errors.area = 'Minimum area should be 100 sq ft';
  }
  
  // Image validation
  if (images.length > 10) {
    errors.images = 'Maximum 10 images allowed';
  }
  
  // Address validation
  if (!isValidAddress(formData.address)) {
    errors.address = 'Please provide a complete address';
  }
  
  return errors;
};
```

## 6. Mobile Responsiveness

### Current State:
- Desktop-focused design
- Some mobile responsiveness exists

### Enhancements:
- Optimize form layout for mobile
- Touch-friendly image upload
- Mobile-optimized property cards

## 7. Property Draft & Preview

### New Features to Add:
```typescript
// Add draft functionality
const saveDraft = async () => {
  localStorage.setItem('property_draft', JSON.stringify(formData));
  toast.success('Draft saved locally');
};

const loadDraft = () => {
  const draft = localStorage.getItem('property_draft');
  if (draft) {
    setFormData(JSON.parse(draft));
  }
};

const previewProperty = () => {
  // Open modal with property preview
  setShowPreview(true);
};
```

## 8. Geolocation Integration

### Enhancement:
```typescript
// Add location picker
const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      // Reverse geocode to get address
      reverseGeocode(latitude, longitude);
    });
  }
};
```

## 9. Property Analytics

### Add to LandlordDashboard:
- Views per property
- Inquiry counts
- Average time to rent
- Rental rate optimization suggestions

## 10. Bulk Import Feature

### For Landlords with Multiple Properties:
```typescript
// Add CSV import functionality
const importPropertiesFromCSV = async (file: File) => {
  const text = await file.text();
  const properties = parseCSV(text);
  
  for (const property of properties) {
    await propertyService.addProperty(property);
  }
};
```

## Implementation Priority:

1. **High Priority:**
   - Image upload to IPFS/permanent storage
   - Backend property update API
   - Enhanced form validation

2. **Medium Priority:**
   - Property deletion
   - Draft/preview functionality
   - Mobile optimization

3. **Low Priority:**
   - Analytics dashboard
   - Bulk import
   - Geolocation integration

## Testing Checklist:

- [ ] Add property with all required fields
- [ ] Upload multiple images
- [ ] Edit existing property
- [ ] Form validation works correctly
- [ ] Mobile responsive design
- [ ] Error handling for API failures
- [ ] Authentication checks work
- [ ] Property appears in landlord dashboard
- [ ] Property visible in marketplace
