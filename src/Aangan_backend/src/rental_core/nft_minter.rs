use crate::types::NFTMetadata;
use candid::Principal;

pub fn create_rental_nft(
    nft_id: u64,
    tenant: Principal,
    property_id: u64,
    rental_agreement_id: u64,
    property_title: String,
    property_address: String,
    property_image: String,
    rent_amount: u64,
    start_date: u64,
    end_date: u64,
) -> NFTMetadata {
    // Use a placeholder image if the original is too large (>50KB)
    let safe_image = if property_image.len() > 51200 {
        format!("Property ID: {} - Image too large for NFT storage", property_id)
    } else {
        property_image
    };
    
    NFTMetadata::new(
        nft_id,
        tenant,
        property_id,
        rental_agreement_id,
        property_title,
        property_address,
        safe_image,
        rent_amount,
        start_date,
        end_date,
    )
}
