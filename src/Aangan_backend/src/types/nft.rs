use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use ic_stable_structures::Storable;
use std::borrow::Cow;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NFTMetadata {
    pub id: u64,
    pub owner: Principal,
    pub property_id: u64,
    pub rental_agreement_id: u64,
    pub name: String,
    pub description: String,
    pub image: String,
    pub attributes: Vec<NFTAttribute>,
    pub created_at: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NFTAttribute {
    pub trait_type: String,
    pub value: String,
}

impl NFTMetadata {
    pub fn new(
        id: u64,
        owner: Principal,
        property_id: u64,
        rental_agreement_id: u64,
        property_title: String,
        property_address: String,
        property_image: String,
        rent_amount: u64,
        start_date: u64,
        end_date: u64,
    ) -> Self {
        let timestamp = ic_cdk::api::time();
        Self {
            id,
            owner,
            property_id,
            rental_agreement_id,
            name: format!("Rental Agreement NFT - {}", property_title),
            description: format!(
                "This NFT represents a rental agreement for the property at {}",
                property_address
            ),
            image: property_image,
            attributes: vec![
                NFTAttribute {
                    trait_type: "Property ID".to_string(),
                    value: property_id.to_string(),
                },
                NFTAttribute {
                    trait_type: "Rental Agreement ID".to_string(),
                    value: rental_agreement_id.to_string(),
                },
                NFTAttribute {
                    trait_type: "Property Address".to_string(),
                    value: property_address,
                },
                NFTAttribute {
                    trait_type: "Monthly Rent".to_string(),
                    value: rent_amount.to_string(),
                },
                NFTAttribute {
                    trait_type: "Start Date".to_string(),
                    value: start_date.to_string(),
                },
                NFTAttribute {
                    trait_type: "End Date".to_string(),
                    value: end_date.to_string(),
                },
            ],
            created_at: timestamp,
        }
    }
}

impl Storable for NFTMetadata {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }
    
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Bounded {
        max_size: 65536, // 64KB for NFT metadata including base64 images and large text
        is_fixed_size: false,
    };
}

impl Storable for NFTAttribute {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }
    
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Bounded {
        max_size: 256,
        is_fixed_size: false,
    };
}
