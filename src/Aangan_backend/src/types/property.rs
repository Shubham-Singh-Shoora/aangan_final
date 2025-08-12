use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use ic_stable_structures::Storable;
use std::borrow::Cow;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Property {
    pub id: u64,
    pub owner: Principal,
    pub title: String,
    pub description: String,
    pub address: String,
    pub rent_amount: u64,
    pub deposit_amount: u64,
    pub property_type: PropertyType,
    pub bedrooms: u32,
    pub bathrooms: u32,
    pub area_sqft: u32,
    pub images: Vec<String>, // URLs or base64 encoded images
    pub amenities: Vec<String>,
    pub is_available: bool,
    pub created_at: u64,
    pub updated_at: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum PropertyType {
    Apartment,
    House,
    Villa,
    Studio,
    Condo,
    Townhouse,
}

impl Property {
    pub fn new(
        id: u64,
        owner: Principal,
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
    ) -> Self {
        let timestamp = ic_cdk::api::time();
        Self {
            id,
            owner,
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
            is_available: true,
            created_at: timestamp,
            updated_at: timestamp,
        }
    }

    pub fn update_availability(&mut self, available: bool) {
        self.is_available = available;
        self.updated_at = ic_cdk::api::time();
    }
}

impl Storable for Property {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }
    
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Bounded {
        max_size: 4096, // 4KB should be enough for property data including images and amenities
        is_fixed_size: false,
    };
}

impl Storable for PropertyType {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }
    
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Bounded {
        max_size: 32,
        is_fixed_size: false,
    };
}
