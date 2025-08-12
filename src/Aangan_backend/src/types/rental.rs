use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use ic_stable_structures::Storable;
use std::borrow::Cow;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct RentalAgreement {
    pub id: u64,
    pub property_id: u64,
    pub landlord: Principal,
    pub tenant: Principal,
    pub status: RentalStatus,
    pub start_date: u64,
    pub end_date: u64,
    pub rent_amount: u64,
    pub deposit_amount: u64,
    pub nft_id: Option<u64>,
    pub created_at: u64,
    pub updated_at: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum RentalStatus {
    Requested,
    Confirmed,
    Active,
    Completed,
    Cancelled,
}

impl RentalAgreement {
    pub fn new(
        id: u64,
        property_id: u64,
        landlord: Principal,
        tenant: Principal,
        start_date: u64,
        end_date: u64,
        rent_amount: u64,
        deposit_amount: u64,
    ) -> Self {
        let timestamp = ic_cdk::api::time();
        Self {
            id,
            property_id,
            landlord,
            tenant,
            status: RentalStatus::Requested,
            start_date,
            end_date,
            rent_amount,
            deposit_amount,
            nft_id: None,
            created_at: timestamp,
            updated_at: timestamp,
        }
    }

    pub fn confirm(&mut self, nft_id: u64) {
        self.status = RentalStatus::Confirmed;
        self.nft_id = Some(nft_id);
        self.updated_at = ic_cdk::api::time();
    }

    pub fn activate(&mut self) {
        self.status = RentalStatus::Active;
        self.updated_at = ic_cdk::api::time();
    }

    pub fn cancel(&mut self) {
        self.status = RentalStatus::Cancelled;
        self.updated_at = ic_cdk::api::time();
    }
}

impl Storable for RentalAgreement {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }
    
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Bounded {
        max_size: 1024, // 1KB should be enough for rental agreement data
        is_fixed_size: false,
    };
}

impl Storable for RentalStatus {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
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
