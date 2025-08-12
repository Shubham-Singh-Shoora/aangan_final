// Backend Enhancement: Add to property_api.rs

use crate::auth;
use crate::storage::{property_store, user_store};
use crate::types::{Property, PropertyType, Role};
use candid::Principal;
use ic_cdk_macros::*;

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

    // Get existing property
    let mut property = property_store::get_property(property_id)
        .ok_or_else(|| "Property not found".to_string())?;

    // Verify ownership
    if property.owner != caller {
        return Err("Only property owner can update property".to_string());
    }

    // Verify user is still a landlord
    let user = user_store::get_user(&caller).ok_or_else(|| "User not found".to_string())?;
    if user.role != Role::Landlord {
        return Err("Only landlords can update properties".to_string());
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

    // Save updated property
    property_store::update_property(property.clone())?;
    
    Ok(property)
}

#[update]
pub fn delete_property(property_id: u64) -> Result<String, String> {
    let caller = auth::require_authenticated()?;

    // Get existing property
    let property = property_store::get_property(property_id)
        .ok_or_else(|| "Property not found".to_string())?;

    // Verify ownership
    if property.owner != caller {
        return Err("Only property owner can delete property".to_string());
    }

    // Check if property has active rentals
    // This would require checking the rental storage
    // For now, we'll just delete the property
    
    property_store::delete_property(property_id)?;
    
    Ok("Property deleted successfully".to_string())
}

#[query]
pub fn get_property_stats(property_id: u64) -> Result<PropertyStats, String> {
    let caller = auth::require_authenticated()?;

    let property = property_store::get_property(property_id)
        .ok_or_else(|| "Property not found".to_string())?;

    if property.owner != caller {
        return Err("Only property owner can view property stats".to_string());
    }

    // This would be implemented with proper analytics
    let stats = PropertyStats {
        views: 0,
        inquiries: 0,
        bookings: 0,
        average_rating: 0.0,
    };

    Ok(stats)
}

// Add to types/property.rs
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PropertyStats {
    pub views: u64,
    pub inquiries: u64,
    pub bookings: u64,
    pub average_rating: f64,
}
