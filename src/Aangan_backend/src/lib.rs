use ic_cdk_macros::*;

mod api;
mod auth;
mod rental_core;
mod storage;
mod types;

// Re-export types for Candid interface
pub use types::{
    NFTAttribute, NFTMetadata, Property, PropertyType, RentalAgreement, RentalStatus, Role, User,
    EscrowAccount, EscrowStatus, EscrowTimelineEvent, EscrowEventType,
};

#[init]
fn init() {
    // Initialize storage
    storage::init_storage();
}

#[pre_upgrade]
fn pre_upgrade() {
    storage::pre_upgrade();
}

#[post_upgrade]
fn post_upgrade() {
    storage::post_upgrade();
}

// Export all API methods
pub use api::nft_api::*;
pub use api::property_api::*;
pub use api::rental_api::*;
pub use api::user_api::*;
