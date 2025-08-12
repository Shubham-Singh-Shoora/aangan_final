use candid::{CandidType, Principal};
use ic_stable_structures::Storable;
use serde::{Deserialize, Serialize};
use std::borrow::Cow;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum Role {
    Landlord,
    Tenant,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct User {
    pub user_principal: Principal,
    pub role: Role,
    pub name: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub created_at: u64,
    pub updated_at: u64,
}

impl User {
    pub fn new(
        user_principal: Principal,
        role: Role,
        name: Option<String>,
        email: Option<String>,
        phone: Option<String>,
    ) -> Self {
        let now = ic_cdk::api::time();
        Self {
            user_principal,
            role,
            name,
            email,
            phone,
            created_at: now,
            updated_at: now,
        }
    }

    pub fn update_profile(
        &mut self,
        name: Option<String>,
        email: Option<String>,
        phone: Option<String>,
    ) {
        if let Some(n) = name {
            self.name = Some(n);
        }
        if let Some(e) = email {
            self.email = Some(e);
        }
        if let Some(p) = phone {
            self.phone = Some(p);
        }
        self.updated_at = ic_cdk::api::time();
    }
}

impl Storable for User {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }

    const BOUND: ic_stable_structures::storable::Bound =
        ic_stable_structures::storable::Bound::Bounded {
            max_size: 1024,
            is_fixed_size: false,
        };
}

impl Storable for Role {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }

    const BOUND: ic_stable_structures::storable::Bound =
        ic_stable_structures::storable::Bound::Bounded {
            max_size: 32,
            is_fixed_size: false,
        };
}
