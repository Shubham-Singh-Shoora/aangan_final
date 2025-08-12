use super::{NFTS, RENTALS};
use crate::types::{NFTMetadata, RentalAgreement};
use candid::Principal;

pub fn create_rental(rental: RentalAgreement) -> Result<(), String> {
    RENTALS.with(|rentals| {
        let mut rentals = rentals.borrow_mut();
        rentals.insert(rental.id, rental);
        Ok(())
    })
}

pub fn get_rental(id: u64) -> Option<RentalAgreement> {
    RENTALS.with(|rentals| rentals.borrow().get(&id))
}

pub fn update_rental(rental: RentalAgreement) -> Result<(), String> {
    RENTALS.with(|rentals| {
        let mut rentals = rentals.borrow_mut();
        if !rentals.contains_key(&rental.id) {
            return Err("Rental not found".to_string());
        }
        rentals.insert(rental.id, rental);
        Ok(())
    })
}

pub fn get_rentals_by_tenant(tenant: &Principal) -> Vec<RentalAgreement> {
    RENTALS.with(|rentals| {
        rentals
            .borrow()
            .iter()
            .filter(|(_, rental)| rental.tenant == *tenant)
            .map(|(_, rental)| rental)
            .collect()
    })
}

pub fn get_rentals_by_landlord(landlord: &Principal) -> Vec<RentalAgreement> {
    RENTALS.with(|rentals| {
        rentals
            .borrow()
            .iter()
            .filter(|(_, rental)| rental.landlord == *landlord)
            .map(|(_, rental)| rental)
            .collect()
    })
}

pub fn get_rental_by_property(property_id: u64) -> Option<RentalAgreement> {
    RENTALS.with(|rentals| {
        rentals
            .borrow()
            .iter()
            .find(|(_, rental)| rental.property_id == property_id)
            .map(|(_, rental)| rental)
    })
}

pub fn create_nft(nft: NFTMetadata) -> Result<(), String> {
    NFTS.with(|nfts| {
        let mut nfts = nfts.borrow_mut();
        nfts.insert(nft.id, nft);
        Ok(())
    })
}

pub fn get_nft(id: u64) -> Option<NFTMetadata> {
    NFTS.with(|nfts| nfts.borrow().get(&id))
}

pub fn get_nfts_by_owner(owner: &Principal) -> Vec<NFTMetadata> {
    NFTS.with(|nfts| {
        nfts.borrow()
            .iter()
            .filter(|(_, nft)| nft.owner == *owner)
            .map(|(_, nft)| nft)
            .collect()
    })
}
