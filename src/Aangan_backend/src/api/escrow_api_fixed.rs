use candid::Principal;
use ic_cdk_macros::*;

use crate::auth::{is_anonymous, require_authenticated};
use crate::types::{EscrowAccount, EscrowStatus, EscrowTimelineEvent, EscrowEventType};
use crate::storage::escrow_store;

#[derive(candid::CandidType, serde::Deserialize)]
pub struct CreateEscrowRequest {
    pub rental_id: u64,
    pub property_id: u64,
    pub landlord: Principal,
    pub tenant: Principal,
    pub amount: u64,
}

#[derive(candid::CandidType, serde::Serialize)]
pub struct EscrowResult {
    pub Ok: Option<EscrowAccount>,
    pub Err: Option<String>,
}

impl From<Result<EscrowAccount, String>> for EscrowResult {
    fn from(result: Result<EscrowAccount, String>) -> Self {
        match result {
            Ok(account) => EscrowResult { Ok: Some(account), Err: None },
            Err(error) => EscrowResult { Ok: None, Err: Some(error) },
        }
    }
}

#[query]
fn get_escrow_accounts_for_user(user: Principal) -> Vec<EscrowAccount> {
    if is_anonymous() {
        return vec![];
    }
    
    // Return accounts where user is either landlord or tenant
    let mut accounts = escrow_store::get_escrow_accounts_by_tenant(&user);
    accounts.extend(escrow_store::get_escrow_accounts_by_landlord(&user));
    accounts
}

#[query]
fn get_escrow_accounts_by_landlord(landlord: Principal) -> Vec<EscrowAccount> {
    if is_anonymous() {
        return vec![];
    }
    
    escrow_store::get_escrow_accounts_by_landlord(&landlord)
}

#[query]
fn get_escrow_accounts_by_tenant(tenant: Principal) -> Vec<EscrowAccount> {
    if is_anonymous() {
        return vec![];
    }
    
    escrow_store::get_escrow_accounts_by_tenant(&tenant)
}

#[query]
fn get_escrow_account_by_id(id: u64) -> Option<EscrowAccount> {
    if is_anonymous() {
        return None;
    }
    
    escrow_store::get_escrow_account(id)
}

#[query]
fn get_escrow_timeline_events(escrow_id: u64) -> Vec<EscrowTimelineEvent> {
    if is_anonymous() {
        return vec![];
    }
    
    escrow_store::get_timeline_events_by_escrow(escrow_id)
}

#[query]
fn get_user_escrow_statistics(user: Principal) -> (u64, u64, u64, u64, u64) {
    if is_anonymous() {
        return (0, 0, 0, 0, 0);
    }
    
    // Determine user type by checking which type of accounts they have
    let tenant_accounts = escrow_store::get_escrow_accounts_by_tenant(&user);
    let landlord_accounts = escrow_store::get_escrow_accounts_by_landlord(&user);
    
    if tenant_accounts.len() >= landlord_accounts.len() {
        escrow_store::get_escrow_stats_by_user(&user, "tenant")
    } else {
        escrow_store::get_escrow_stats_by_user(&user, "landlord")
    }
}

#[update]
fn create_escrow_account(request: CreateEscrowRequest) -> EscrowResult {
    if is_anonymous() {
        return EscrowResult::from(Err("Authentication required".to_string()));
    }
    
    let id = crate::storage::get_next_escrow_id();
    let account = EscrowAccount::new(
        id,
        request.rental_id,
        request.property_id,
        request.landlord,
        request.tenant,
        request.amount,
    );
    
    match escrow_store::create_escrow_account(account.clone()) {
        Ok(_) => EscrowResult::from(Ok(account)),
        Err(error) => EscrowResult::from(Err(error)),
    }
}

#[update]
fn submit_security_deposit(escrow_id: u64, transaction_hash: String) -> EscrowResult {
    if is_anonymous() {
        return EscrowResult::from(Err("Authentication required".to_string()));
    }
    
    let caller = ic_cdk::caller();
    
    // Get the escrow account
    let mut account = match escrow_store::get_escrow_account(escrow_id) {
        Some(acc) => acc,
        None => return EscrowResult::from(Err("Escrow account not found".to_string())),
    };
    
    // Verify the caller is the tenant
    if account.tenant != caller {
        return EscrowResult::from(Err("Only the tenant can submit the security deposit".to_string()));
    }
    
    // Check if already submitted
    if account.status != EscrowStatus::PendingSubmission {
        return EscrowResult::from(Err("Security deposit has already been submitted or escrow is not in pending state".to_string()));
    }
    
    // Update status
    account.submit_deposit(transaction_hash.clone());
    
    // Save the updated account
    if let Err(error) = escrow_store::update_escrow_account(account.clone()) {
        return EscrowResult::from(Err(error));
    }
    
    // Add timeline event
    let _ = escrow_store::add_timeline_event(
        escrow_id,
        EscrowEventType::DepositSubmitted,
        "Security Deposit Submitted".to_string(),
        "Tenant has submitted the security deposit for review".to_string(),
        Some(account.amount),
        Some(transaction_hash),
    );
    
    EscrowResult::from(Ok(account))
}

#[update]
fn approve_security_deposit(escrow_id: u64, contract_address: String) -> EscrowResult {
    if is_anonymous() {
        return EscrowResult::from(Err("Authentication required".to_string()));
    }
    
    let caller = ic_cdk::caller();
    
    // Get the escrow account
    let mut account = match escrow_store::get_escrow_account(escrow_id) {
        Some(acc) => acc,
        None => return EscrowResult::from(Err("Escrow account not found".to_string())),
    };
    
    // Verify the caller is the landlord
    if account.landlord != caller {
        return EscrowResult::from(Err("Only the landlord can approve the security deposit".to_string()));
    }
    
    // Check if deposit was submitted
    if account.status != EscrowStatus::UnderReview {
        return EscrowResult::from(Err("Security deposit has not been submitted yet".to_string()));
    }
    
    // Update status
    account.approve_deposit(contract_address.clone());
    
    // Save the updated account
    if let Err(error) = escrow_store::update_escrow_account(account.clone()) {
        return EscrowResult::from(Err(error));
    }
    
    // Add timeline event
    let _ = escrow_store::add_timeline_event(
        escrow_id,
        EscrowEventType::LandlordApproval,
        "Deposit Approved".to_string(),
        "Landlord has approved the security deposit and funds are secured".to_string(),
        Some(account.amount),
        None,
    );
    
    EscrowResult::from(Ok(account))
}

#[update]
fn activate_escrow_protection(escrow_id: u64) -> EscrowResult {
    if is_anonymous() {
        return EscrowResult::from(Err("Authentication required".to_string()));
    }
    
    let caller = ic_cdk::caller();
    
    // Get the escrow account
    let mut account = match escrow_store::get_escrow_account(escrow_id) {
        Some(acc) => acc,
        None => return EscrowResult::from(Err("Escrow account not found".to_string())),
    };
    
    // Verify the caller is the landlord
    if account.landlord != caller {
        return EscrowResult::from(Err("Only the landlord can activate escrow protection".to_string()));
    }
    
    // Check if funds are secured
    if account.status != EscrowStatus::FundsSecured {
        return EscrowResult::from(Err("Funds must be secured before activating protection".to_string()));
    }
    
    // Update status
    account.activate_protection();
    
    // Save the updated account
    if let Err(error) = escrow_store::update_escrow_account(account.clone()) {
        return EscrowResult::from(Err(error));
    }
    
    // Add timeline event
    let _ = escrow_store::add_timeline_event(
        escrow_id,
        EscrowEventType::LeaseActivated,
        "Escrow Protection Activated".to_string(),
        "Escrow protection is now active for the duration of the lease".to_string(),
        None,
        None,
    );
    
    EscrowResult::from(Ok(account))
}

#[update]
fn initiate_refund(escrow_id: u64, refund_amount: u64) -> EscrowResult {
    if is_anonymous() {
        return EscrowResult::from(Err("Authentication required".to_string()));
    }
    
    let caller = ic_cdk::caller();
    
    // Get the escrow account
    let mut account = match escrow_store::get_escrow_account(escrow_id) {
        Some(acc) => acc,
        None => return EscrowResult::from(Err("Escrow account not found".to_string())),
    };
    
    // Verify the caller is the landlord
    if account.landlord != caller {
        return EscrowResult::from(Err("Only the landlord can initiate the refund".to_string()));
    }
    
    // Check if protection is active
    if account.status != EscrowStatus::ActiveProtection {
        return EscrowResult::from(Err("Escrow must be in active protection to initiate refund".to_string()));
    }
    
    // Update status
    account.initiate_refund(refund_amount);
    
    // Save the updated account
    if let Err(error) = escrow_store::update_escrow_account(account.clone()) {
        return EscrowResult::from(Err(error));
    }
    
    // Add timeline event
    let _ = escrow_store::add_timeline_event(
        escrow_id,
        EscrowEventType::RefundInitiated,
        "Refund Processing".to_string(),
        format!("Refund of ₹{} has been initiated", refund_amount),
        Some(refund_amount),
        None,
    );
    
    EscrowResult::from(Ok(account))
}

#[update]
fn complete_refund(escrow_id: u64, transaction_hash: String) -> EscrowResult {
    if is_anonymous() {
        return EscrowResult::from(Err("Authentication required".to_string()));
    }
    
    // Get the escrow account
    let mut account = match escrow_store::get_escrow_account(escrow_id) {
        Some(acc) => acc,
        None => return EscrowResult::from(Err("Escrow account not found".to_string())),
    };
    
    // Check if refund is processing
    if account.status != EscrowStatus::RefundProcessing {
        return EscrowResult::from(Err("No refund is currently processing for this escrow".to_string()));
    }
    
    // Update status
    account.complete_refund(transaction_hash.clone());
    
    // Save the updated account
    if let Err(error) = escrow_store::update_escrow_account(account.clone()) {
        return EscrowResult::from(Err(error));
    }
    
    // Add timeline event
    let _ = escrow_store::add_timeline_event(
        escrow_id,
        EscrowEventType::RefundCompleted,
        "Refund Completed".to_string(),
        "Security deposit refund has been completed successfully".to_string(),
        account.refund_amount,
        Some(transaction_hash),
    );
    
    EscrowResult::from(Ok(account))
}
