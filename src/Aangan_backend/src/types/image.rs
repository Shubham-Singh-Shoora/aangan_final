use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use ic_stable_structures::Storable;
use std::borrow::Cow;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PropertyImage {
    pub id: String,          // Unique image ID
    pub property_id: u64,    // Associated property
    pub owner: Principal,    // Image owner
    pub data: String,        // Base64 image data
    pub content_type: String, // e.g., "image/jpeg"
    pub size_bytes: u64,     // Original file size
    pub created_at: u64,
}

impl PropertyImage {
    pub fn new(
        id: String,
        property_id: u64,
        owner: Principal,
        data: String,
        content_type: String,
        size_bytes: u64,
    ) -> Self {
        Self {
            id,
            property_id,
            owner,
            data,
            content_type,
            size_bytes,
            created_at: ic_cdk::api::time(),
        }
    }
}

impl Storable for PropertyImage {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }
    
    // Allow larger size for images - up to 1MB per image
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Bounded {
        max_size: 1024 * 1024, // 1MB max per image
        is_fixed_size: false,
    };
}
