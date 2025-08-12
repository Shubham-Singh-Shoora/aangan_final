use crate::auth;
use crate::storage::{property_store, user_store};
use crate::types::{Property, PropertyType, Role};
use candid::Principal;
use ic_cdk_macros::*;

#[update]
pub fn add_property(
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

    // Verify user is a landlord
    let user = user_store::get_user(&caller).ok_or_else(|| "User not found".to_string())?;

    if user.role != Role::Landlord {
        return Err("Only landlords can add properties".to_string());
    }

    let property_id = crate::storage::get_next_property_id();
    let property = Property::new(
        property_id,
        caller,
        title,
        description,
        address,
        rent_amount,
        deposit_amount,
        property_type,
        bedrooms,
        bathrooms,
        area_sqft,
        images,
        amenities,
    );

    property_store::create_property(property.clone())?;
    Ok(property)
}

#[query]
pub fn get_all_properties() -> Vec<Property> {
    property_store::get_all_properties()
}

#[query]
pub fn get_available_properties() -> Vec<Property> {
    property_store::get_available_properties()
}

#[query]
pub fn get_property_by_id(id: u64) -> Result<Property, String> {
    property_store::get_property(id).ok_or_else(|| "Property not found".to_string())
}

#[query]
pub fn get_properties_by_landlord(landlord: Option<Principal>) -> Result<Vec<Property>, String> {
    let target_principal = match landlord {
        Some(p) => p,
        None => auth::require_authenticated()?,
    };

    Ok(property_store::get_properties_by_owner(&target_principal))
}

#[query]
pub fn get_my_properties() -> Result<Vec<Property>, String> {
    let caller = auth::require_authenticated()?;
    Ok(property_store::get_properties_by_owner(&caller))
}

#[update]
pub fn update_property_availability(property_id: u64, available: bool) -> Result<Property, String> {
    let caller = auth::require_authenticated()?;

    let mut property = property_store::get_property(property_id)
        .ok_or_else(|| "Property not found".to_string())?;

    if property.owner != caller {
        return Err("Only property owner can update availability".to_string());
    }

    property.update_availability(available);
    property_store::update_property(property.clone())?;

    Ok(property)
}

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

    property_store::update_property(property.clone())?;
    Ok(property)
}
