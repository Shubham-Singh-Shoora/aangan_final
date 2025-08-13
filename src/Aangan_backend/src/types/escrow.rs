use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use ic_stable_structures::Storable;
use std::borrow::Cow;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum EscrowStatus {
    PendingSubmission,    // Tenant needs to submit deposit
    UnderReview,         // Landlord reviewing deposit
    FundsSecured,        // Funds locked in escrow contract
    ActiveProtection,    // Escrow active during lease
    RefundProcessing,    // Processing refund at lease end
    Completed,           // Escrow completed and funds released
    Disputed,            // Dispute in progress
    Cancelled,           // Escrow cancelled
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EscrowAccount {
    pub id: u64,
    pub rental_id: u64,
    pub property_id: u64,
    pub landlord: Principal,
    pub tenant: Principal,
    pub amount: u64,
    pub status: EscrowStatus,
    pub submission_deadline: u64,
    pub created_at: u64,
    pub updated_at: u64,
    pub smart_contract_address: Option<String>,
    pub transaction_hash: Option<String>,
    pub refund_amount: Option<u64>,
    pub dispute_reason: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EscrowTimelineEvent {
    pub id: u64,
    pub escrow_id: u64,
    pub event_type: EscrowEventType,
    pub title: String,
    pub description: String,
    pub timestamp: u64,
    pub amount: Option<u64>,
    pub transaction_hash: Option<String>,
    pub metadata: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum EscrowEventType {
    Created,
    DepositSubmitted,
    LandlordApproval,
    FundsLocked,
    LeaseActivated,
    PropertyInspected,
    RefundInitiated,
    RefundCompleted,
    DisputeRaised,
    DisputeResolved,
    Cancelled,
}

impl EscrowAccount {
    pub fn new(
        id: u64,
        rental_id: u64,
        property_id: u64,
        landlord: Principal,
        tenant: Principal,
        amount: u64,
    ) -> Self {
        let timestamp = ic_cdk::api::time();
        // Set submission deadline to 7 days from creation
        let submission_deadline = timestamp + (7 * 24 * 60 * 60 * 1_000_000_000); // 7 days in nanoseconds
        
        Self {
            id,
            rental_id,
            property_id,
            landlord,
            tenant,
            amount,
            status: EscrowStatus::PendingSubmission,
            submission_deadline,
            created_at: timestamp,
            updated_at: timestamp,
            smart_contract_address: None,
            transaction_hash: None,
            refund_amount: None,
            dispute_reason: None,
        }
    }

    pub fn submit_deposit(&mut self, transaction_hash: String) {
        self.status = EscrowStatus::UnderReview;
        self.transaction_hash = Some(transaction_hash);
        self.updated_at = ic_cdk::api::time();
    }

    pub fn approve_deposit(&mut self, contract_address: String) {
        self.status = EscrowStatus::FundsSecured;
        self.smart_contract_address = Some(contract_address);
        self.updated_at = ic_cdk::api::time();
    }

    pub fn activate_protection(&mut self) {
        self.status = EscrowStatus::ActiveProtection;
        self.updated_at = ic_cdk::api::time();
    }

    pub fn initiate_refund(&mut self, refund_amount: u64) {
        self.status = EscrowStatus::RefundProcessing;
        self.refund_amount = Some(refund_amount);
        self.updated_at = ic_cdk::api::time();
    }

    pub fn complete_refund(&mut self, transaction_hash: String) {
        self.status = EscrowStatus::Completed;
        self.transaction_hash = Some(transaction_hash);
        self.updated_at = ic_cdk::api::time();
    }

    pub fn raise_dispute(&mut self, reason: String) {
        self.status = EscrowStatus::Disputed;
        self.dispute_reason = Some(reason);
        self.updated_at = ic_cdk::api::time();
    }

    pub fn cancel(&mut self) {
        self.status = EscrowStatus::Cancelled;
        self.updated_at = ic_cdk::api::time();
    }

    pub fn is_overdue(&self) -> bool {
        self.status == EscrowStatus::PendingSubmission && 
        ic_cdk::api::time() > self.submission_deadline
    }
}

impl Storable for EscrowAccount {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }
    
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Bounded {
        max_size: 2048, // 2KB for escrow account data
        is_fixed_size: false,
    };
}

impl Storable for EscrowTimelineEvent {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }
    
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Bounded {
        max_size: 1024, // 1KB for timeline event data
        is_fixed_size: false,
    };
}
