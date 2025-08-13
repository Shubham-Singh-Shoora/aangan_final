use crate::auth;
use crate::rental_core::rental_manager;
use crate::storage::{property_store, rental_store, user_store};
use crate::types::{RentalAgreement, RentalStatus, Role};
use ic_cdk_macros::*;

#[update]
pub fn request_rental(
    property_id: u64,
    start_date: u64,
    end_date: u64,
) -> Result<RentalAgreement, String> {
    let caller = auth::require_authenticated()?;

    // Verify user is a tenant
    let user = user_store::get_user(&caller).ok_or_else(|| "User not found".to_string())?;

    if user.role != Role::Tenant {
        return Err("Only tenants can request rentals".to_string());
    }

    let property = property_store::get_property(property_id)
        .ok_or_else(|| "Property not found".to_string())?;

    if !property.is_available {
        return Err("Property is not available for rent".to_string());
    }

    // Check if there's already an active rental for this property
    if let Some(existing_rental) = rental_store::get_rental_by_property(property_id) {
        if existing_rental.status == RentalStatus::Active
            || existing_rental.status == RentalStatus::Confirmed
        {
            return Err("Property already has an active rental".to_string());
        }
    }

    let rental_id = crate::storage::get_next_rental_id();
    let rental = RentalAgreement::new(
        rental_id,
        property_id,
        property.owner,
        caller,
        start_date,
        end_date,
        property.rent_amount,
        property.deposit_amount,
    );

    rental_store::create_rental(rental.clone())?;

    // Update property availability
    let mut updated_property = property;
    updated_property.update_availability(false);
    property_store::update_property(updated_property)?;

    Ok(rental)
}

#[update]
pub fn confirm_rental(rental_id: u64) -> Result<RentalAgreement, String> {
    let caller = auth::require_authenticated()?;

    let mut rental =
        rental_store::get_rental(rental_id).ok_or_else(|| "Rental not found".to_string())?;

    // Allow both landlord and tenant to confirm, but tenant can only confirm approved rentals
    let user = user_store::get_user(&caller).ok_or_else(|| "User not found".to_string())?;
    
    match user.role {
        Role::Landlord => {
            if rental.landlord != caller {
                return Err("Access denied".to_string());
            }
            // Landlord can confirm from requested state (legacy support)
            if rental.status != RentalStatus::Requested && rental.status != RentalStatus::Approved {
                return Err("Rental must be in requested or approved state".to_string());
            }
        },
        Role::Tenant => {
            if rental.tenant != caller {
                return Err("Access denied".to_string());
            }
            // Tenant can only confirm approved rentals
            if rental.status != RentalStatus::Approved {
                return Err("Rental must be approved by landlord before confirmation".to_string());
            }
        }
    }

    // Mint NFT for the rental
    let nft_id = rental_manager::mint_rental_nft(&rental)?;

    // Update rental status
    rental.confirm(nft_id);
    rental_store::update_rental(rental.clone())?;

    Ok(rental)
}

#[query]
pub fn get_my_rentals() -> Vec<RentalAgreement> {
    let caller = match auth::require_authenticated() {
        Ok(caller) => caller,
        Err(_) => return vec![], // Return empty vector if not authenticated
    };

    rental_store::get_rentals_by_user(&caller)
}

#[update]
pub fn cancel_rental(rental_id: u64) -> Result<RentalAgreement, String> {
    let caller = auth::require_authenticated()?;

    let mut rental =
        rental_store::get_rental(rental_id).ok_or_else(|| "Rental not found".to_string())?;

    if rental.landlord != caller && rental.tenant != caller {
        return Err("Only landlord or tenant can cancel rental".to_string());
    }

    if rental.status == RentalStatus::Active {
        return Err("Cannot cancel active rental".to_string());
    }

    rental.cancel();
    rental_store::update_rental(rental.clone())?;

    // Make property available again
    if let Some(mut property) = property_store::get_property(rental.property_id) {
        property.update_availability(true);
        let _ = property_store::update_property(property);
    }

    Ok(rental)
}

#[query]
pub fn get_rental_by_id(rental_id: u64) -> Result<RentalAgreement, String> {
    let caller = auth::require_authenticated()?;

    let rental =
        rental_store::get_rental(rental_id).ok_or_else(|| "Rental not found".to_string())?;

    if rental.landlord != caller && rental.tenant != caller {
        return Err("Access denied".to_string());
    }

    Ok(rental)
}

#[query]
pub fn get_pending_rental_requests() -> Result<Vec<RentalAgreement>, String> {
    let caller = auth::require_authenticated()?;

    let user = user_store::get_user(&caller).ok_or_else(|| "User not found".to_string())?;

    if user.role != Role::Landlord {
        return Err("Only landlords can view rental requests".to_string());
    }

    Ok(rental_store::get_pending_rental_requests_by_landlord(&caller))
}

#[query]
pub fn get_approved_rentals() -> Result<Vec<RentalAgreement>, String> {
    let caller = auth::require_authenticated()?;

    let user = user_store::get_user(&caller).ok_or_else(|| "User not found".to_string())?;

    if user.role != Role::Tenant {
        return Err("Only tenants can view approved rentals".to_string());
    }

    Ok(rental_store::get_approved_rentals_by_tenant(&caller))
}

#[update]
pub fn approve_rental_request(rental_id: u64) -> Result<RentalAgreement, String> {
    let caller = auth::require_authenticated()?;

    let mut rental =
        rental_store::get_rental(rental_id).ok_or_else(|| "Rental not found".to_string())?;

    if rental.landlord != caller {
        return Err("Only landlord can approve rental request".to_string());
    }

    if rental.status != RentalStatus::Requested && rental.status != RentalStatus::UnderReview {
        return Err("Rental request is not in a state that can be approved".to_string());
    }

    rental.approve();
    rental_store::update_rental(rental.clone())?;

    Ok(rental)
}

#[update]
pub fn reject_rental_request(rental_id: u64) -> Result<RentalAgreement, String> {
    let caller = auth::require_authenticated()?;

    let mut rental =
        rental_store::get_rental(rental_id).ok_or_else(|| "Rental not found".to_string())?;

    if rental.landlord != caller {
        return Err("Only landlord can reject rental request".to_string());
    }

    if rental.status != RentalStatus::Requested && rental.status != RentalStatus::UnderReview {
        return Err("Rental request is not in a state that can be rejected".to_string());
    }

    rental.reject();
    rental_store::update_rental(rental.clone())?;

    // Make property available again
    if let Some(mut property) = property_store::get_property(rental.property_id) {
        property.update_availability(true);
        let _ = property_store::update_property(property);
    }

    Ok(rental)
}

#[update]
pub fn mark_rental_under_review(rental_id: u64) -> Result<RentalAgreement, String> {
    let caller = auth::require_authenticated()?;

    let mut rental =
        rental_store::get_rental(rental_id).ok_or_else(|| "Rental not found".to_string())?;

    if rental.landlord != caller {
        return Err("Only landlord can mark rental under review".to_string());
    }

    if rental.status != RentalStatus::Requested {
        return Err("Rental must be in requested state to mark under review".to_string());
    }

    rental.mark_under_review();
    rental_store::update_rental(rental.clone())?;

    Ok(rental)
}
