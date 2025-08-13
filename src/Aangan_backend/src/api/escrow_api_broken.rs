use can#[query]
fn get_escrow_accounts_for_user(user: Principal) -> Vec<EscrowAccount> {
    if is_anonymous() {
        return vec![];
    }
    
    escrow_store::get_escrow_accounts_by_landlord(&user)
}ncipal;
use ic_cdk_macros::*;

use crate::auth::{is_anonymous, require_authenticated};
use crate::types::{EscrowAccount, EscrowStatus, EscrowTimelineEvent, EscrowEventType};
use crate::storage::escrow_store;

#[query]
fn get_escrow_accounts_for_user(user: Principal) -> Vec<EscrowAccount> {
    if !is_authenticated() {
        return vec![];
    }
    
    escrow_store::get_accounts_for_user(user)
}

#[query]
fn get_escrow_accounts_by_landlord(landlord: Principal) -> Vec<EscrowAccount> {
    if !is_authenticated() {
        return vec![];
    }
    
    escrow_store::get_accounts_by_landlord(landlord)
}

#[query]
fn get_escrow_accounts_by_tenant(tenant: Principal) -> Vec<EscrowAccount> {
    if !is_authenticated() {
        return vec![];
    }
    
    escrow_store::get_accounts_by_tenant(tenant)
}

#[query]
fn get_escrow_account_by_id(id: u64) -> Option<EscrowAccount> {
    if !is_authenticated() {
        return None;
    }
    
    escrow_store::get_account_by_id(id)
}

#[query]
fn get_escrow_timeline_events(escrow_id: u64) -> Vec<EscrowTimelineEvent> {
    if !is_authenticated() {
        return vec![];
    }
    
    escrow_store::get_timeline_events(escrow_id)
}

#[query]
fn get_user_escrow_statistics(user: Principal) -> (u64, u64, u64, u64) {
    if !is_authenticated() {
        return (0, 0, 0, 0);
    }
    
    escrow_store::get_user_statistics(user)
}

#[update]
fn create_escrow_account(request: CreateEscrowRequest) -> Result<EscrowAccount, String> {
    if !is_authenticated() {
        return Err("Authentication required".to_string());
    }
    
    escrow_store::create_account(request)
}

#[update]
fn submit_security_deposit(escrow_id: u64) -> Result<EscrowAccount, String> {
    if !is_authenticated() {
        return Err("Authentication required".to_string());
    }
    
    let caller = ic_cdk::caller();
    
    // Get the escrow account
    let mut account = escrow_store::get_account_by_id(escrow_id)
        .ok_or("Escrow account not found")?;
    
    // Verify the caller is the tenant
    if account.tenant != caller {
        return Err("Only the tenant can submit the security deposit".to_string());
    }
    
    // Check if already submitted
    if account.status != EscrowStatus::PendingDeposit {
        return Err("Security deposit has already been submitted or escrow is not in pending state".to_string());
    }
    
    // Update status
    account.status = EscrowStatus::DepositSubmitted;
    account.deposit_submitted_at = Some(ic_cdk::api::time());
    
    // Save the updated account
    escrow_store::update_account(account.clone())?;
    
    // Add timeline event
    escrow_store::add_timeline_event(
        escrow_id,
        "deposit_submitted".to_string(),
        "Security deposit submitted by tenant".to_string(),
        Some(caller),
    );
    
    Ok(account)
}

#[update]
fn approve_security_deposit(escrow_id: u64) -> Result<EscrowAccount, String> {
    if !is_authenticated() {
        return Err("Authentication required".to_string());
    }
    
    let caller = ic_cdk::caller();
    
    // Get the escrow account
    let mut account = escrow_store::get_account_by_id(escrow_id)
        .ok_or("Escrow account not found")?;
    
    // Verify the caller is the landlord
    if account.landlord != caller {
        return Err("Only the landlord can approve the security deposit".to_string());
    }
    
    // Check if deposit was submitted
    if account.status != EscrowStatus::DepositSubmitted {
        return Err("Security deposit has not been submitted yet".to_string());
    }
    
    // Update status
    account.status = EscrowStatus::Approved;
    account.approved_at = Some(ic_cdk::api::time());
    
    // Save the updated account
    escrow_store::update_account(account.clone())?;
    
    // Add timeline event
    escrow_store::add_timeline_event(
        escrow_id,
        "deposit_approved".to_string(),
        "Security deposit approved by landlord".to_string(),
        Some(caller),
    );
    
    Ok(account)
}

#[update]
fn refund_security_deposit(escrow_id: u64) -> Result<EscrowAccount, String> {
    if !is_authenticated() {
        return Err("Authentication required".to_string());
    }
    
    let caller = ic_cdk::caller();
    
    // Get the escrow account
    let mut account = escrow_store::get_account_by_id(escrow_id)
        .ok_or("Escrow account not found")?;
    
    // Verify the caller is the landlord
    if account.landlord != caller {
        return Err("Only the landlord can initiate the refund".to_string());
    }
    
    // Check if approved
    if account.status != EscrowStatus::Approved {
        return Err("Security deposit must be approved before refund".to_string());
    }
    
    // Update status
    account.status = EscrowStatus::Refunded;
    account.refunded_at = Some(ic_cdk::api::time());
    
    // Save the updated account
    escrow_store::update_account(account.clone())?;
    
    // Add timeline event
    escrow_store::add_timeline_event(
        escrow_id,
        "deposit_refunded".to_string(),
        "Security deposit refunded to tenant".to_string(),
        Some(caller),
    );
    
    Ok(account)
}

#[update]
fn expire_escrow_account(escrow_id: u64) -> Result<EscrowAccount, String> {
    if !is_authenticated() {
        return Err("Authentication required".to_string());
    }
    
    // Get the escrow account
    let mut account = escrow_store::get_account_by_id(escrow_id)
        .ok_or("Escrow account not found")?;
    
    // Check if past deadline
    let current_time = ic_cdk::api::time();
    if current_time <= account.submission_deadline {
        return Err("Escrow has not reached the deadline yet".to_string());
    }
    
    // Check if not already completed/expired
    if matches!(account.status, EscrowStatus::Approved | EscrowStatus::Refunded | EscrowStatus::Expired) {
        return Err("Escrow is already completed or expired".to_string());
    }
    
    // Update status
    account.status = EscrowStatus::Expired;
    
    // Save the updated account
    escrow_store::update_account(account.clone())?;
    
    // Add timeline event
    escrow_store::add_timeline_event(
        escrow_id,
        "escrow_expired".to_string(),
        "Escrow account expired due to deadline".to_string(),
        None,
    );
    
    Ok(account)
}
