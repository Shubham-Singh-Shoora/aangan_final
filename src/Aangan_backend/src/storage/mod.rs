use candid::Principal;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::cell::RefCell;

use crate::types::*;

pub mod property_store;
pub mod rental_store;
pub mod user_store;

type Memory = VirtualMemory<DefaultMemoryImpl>;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    static USERS: RefCell<StableBTreeMap<Principal, User, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );

    static PROPERTIES: RefCell<StableBTreeMap<u64, Property, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1))),
        )
    );

    static RENTALS: RefCell<StableBTreeMap<u64, RentalAgreement, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2))),
        )
    );

    static NFTS: RefCell<StableBTreeMap<u64, NFTMetadata, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(3))),
        )
    );

    static PROPERTY_COUNTER: RefCell<u64> = RefCell::new(0);
    static RENTAL_COUNTER: RefCell<u64> = RefCell::new(0);
    static NFT_COUNTER: RefCell<u64> = RefCell::new(0);
}

pub fn init_storage() {
    // Initialize counters
    PROPERTY_COUNTER.with(|counter| {
        *counter.borrow_mut() = 0;
    });
    RENTAL_COUNTER.with(|counter| {
        *counter.borrow_mut() = 0;
    });
    NFT_COUNTER.with(|counter| {
        *counter.borrow_mut() = 0;
    });
}

pub fn pre_upgrade() {
    // Stable structures handle persistence automatically
}

pub fn post_upgrade() {
    // Stable structures handle restoration automatically
}

pub fn get_next_property_id() -> u64 {
    PROPERTY_COUNTER.with(|counter| {
        let mut counter = counter.borrow_mut();
        *counter += 1;
        *counter
    })
}

pub fn get_next_rental_id() -> u64 {
    RENTAL_COUNTER.with(|counter| {
        let mut counter = counter.borrow_mut();
        *counter += 1;
        *counter
    })
}

pub fn get_next_nft_id() -> u64 {
    NFT_COUNTER.with(|counter| {
        let mut counter = counter.borrow_mut();
        *counter += 1;
        *counter
    })
}
