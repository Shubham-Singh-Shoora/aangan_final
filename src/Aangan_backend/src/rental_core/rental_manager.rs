use crate::rental_core::nft_minter;
use crate::storage::{property_store, rental_store};
use crate::types::RentalAgreement;

pub fn mint_rental_nft(rental: &RentalAgreement) -> Result<u64, String> {
    let property = property_store::get_property(rental.property_id)
        .ok_or_else(|| "Property not found".to_string())?;

    let nft_id = crate::storage::get_next_nft_id();

    let nft = nft_minter::create_rental_nft(
        nft_id,
        rental.tenant,
        rental.property_id,
        rental.id,
        property.title.clone(),
        property.address.clone(),
        property.images.get(0).cloned().unwrap_or_default(),
        rental.rent_amount,
        rental.start_date,
        rental.end_date,
    );

    rental_store::create_nft(nft)?;

    Ok(nft_id)
}

pub fn activate_rental(rental_id: u64) -> Result<(), String> {
    let mut rental =
        rental_store::get_rental(rental_id).ok_or_else(|| "Rental not found".to_string())?;

    if rental.status != crate::types::RentalStatus::Confirmed {
        return Err("Rental must be confirmed before activation".to_string());
    }

    rental.activate();
    rental_store::update_rental(rental)?;

    Ok(())
}
