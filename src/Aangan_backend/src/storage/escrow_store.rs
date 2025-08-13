use super::{ESCROW_ACCOUNTS, ESCROW_TIMELINE_EVENTS};
use crate::types::escrow::{EscrowAccount, EscrowTimelineEvent, EscrowStatus, EscrowEventType};
use candid::Principal;

pub fn create_escrow_account(escrow: EscrowAccount) -> Result<(), String> {
    ESCROW_ACCOUNTS.with(|accounts| {
        let mut accounts = accounts.borrow_mut();
        accounts.insert(escrow.id, escrow.clone());
        
        // Create initial timeline event
        let event = EscrowTimelineEvent {
            id: crate::storage::get_next_escrow_event_id(),
            escrow_id: escrow.id,
            event_type: EscrowEventType::Created,
            title: "Escrow Account Created".to_string(),
            description: "Security deposit escrow account has been created for this rental agreement".to_string(),
            timestamp: escrow.created_at,
            amount: Some(escrow.amount),
            transaction_hash: None,
            metadata: None,
        };
        
        ESCROW_TIMELINE_EVENTS.with(|events| {
            events.borrow_mut().insert(event.id, event);
        });
        
        Ok(())
    })
}

pub fn get_escrow_account(id: u64) -> Option<EscrowAccount> {
    ESCROW_ACCOUNTS.with(|accounts| accounts.borrow().get(&id))
}

pub fn update_escrow_account(escrow: EscrowAccount) -> Result<(), String> {
    ESCROW_ACCOUNTS.with(|accounts| {
        let mut accounts = accounts.borrow_mut();
        if !accounts.contains_key(&escrow.id) {
            return Err("Escrow account not found".to_string());
        }
        accounts.insert(escrow.id, escrow);
        Ok(())
    })
}

pub fn get_escrow_accounts_by_tenant(tenant: &Principal) -> Vec<EscrowAccount> {
    ESCROW_ACCOUNTS.with(|accounts| {
        accounts
            .borrow()
            .iter()
            .filter(|(_, escrow)| escrow.tenant == *tenant)
            .map(|(_, escrow)| escrow)
            .collect()
    })
}

pub fn get_escrow_accounts_by_landlord(landlord: &Principal) -> Vec<EscrowAccount> {
    ESCROW_ACCOUNTS.with(|accounts| {
        accounts
            .borrow()
            .iter()
            .filter(|(_, escrow)| escrow.landlord == *landlord)
            .map(|(_, escrow)| escrow)
            .collect()
    })
}

pub fn get_escrow_accounts_by_rental(rental_id: u64) -> Vec<EscrowAccount> {
    ESCROW_ACCOUNTS.with(|accounts| {
        accounts
            .borrow()
            .iter()
            .filter(|(_, escrow)| escrow.rental_id == rental_id)
            .map(|(_, escrow)| escrow)
            .collect()
    })
}

pub fn get_escrow_accounts_by_property(property_id: u64) -> Vec<EscrowAccount> {
    ESCROW_ACCOUNTS.with(|accounts| {
        accounts
            .borrow()
            .iter()
            .filter(|(_, escrow)| escrow.property_id == property_id)
            .map(|(_, escrow)| escrow)
            .collect()
    })
}

pub fn get_escrow_accounts_by_status(status: EscrowStatus) -> Vec<EscrowAccount> {
    ESCROW_ACCOUNTS.with(|accounts| {
        accounts
            .borrow()
            .iter()
            .filter(|(_, escrow)| escrow.status == status)
            .map(|(_, escrow)| escrow)
            .collect()
    })
}

pub fn get_overdue_escrow_accounts() -> Vec<EscrowAccount> {
    ESCROW_ACCOUNTS.with(|accounts| {
        accounts
            .borrow()
            .iter()
            .filter(|(_, escrow)| escrow.is_overdue())
            .map(|(_, escrow)| escrow)
            .collect()
    })
}

// Timeline event management
pub fn create_timeline_event(event: EscrowTimelineEvent) -> Result<(), String> {
    ESCROW_TIMELINE_EVENTS.with(|events| {
        let mut events = events.borrow_mut();
        events.insert(event.id, event);
        Ok(())
    })
}

pub fn get_timeline_events_by_escrow(escrow_id: u64) -> Vec<EscrowTimelineEvent> {
    ESCROW_TIMELINE_EVENTS.with(|events| {
        events
            .borrow()
            .iter()
            .filter(|(_, event)| event.escrow_id == escrow_id)
            .map(|(_, event)| event)
            .collect()
    })
}

pub fn add_timeline_event(
    escrow_id: u64,
    event_type: EscrowEventType,
    title: String,
    description: String,
    amount: Option<u64>,
    transaction_hash: Option<String>,
) -> Result<(), String> {
    let event = EscrowTimelineEvent {
        id: crate::storage::get_next_escrow_event_id(),
        escrow_id,
        event_type,
        title,
        description,
        timestamp: ic_cdk::api::time(),
        amount,
        transaction_hash,
        metadata: None,
    };

    create_timeline_event(event)
}

// Statistics functions
pub fn get_total_escrow_amount_by_user(user: &Principal, user_type: &str) -> u64 {
    let accounts = match user_type {
        "tenant" => get_escrow_accounts_by_tenant(user),
        "landlord" => get_escrow_accounts_by_landlord(user),
        _ => return 0,
    };
    
    accounts.iter().map(|account| account.amount).sum()
}

pub fn get_escrow_stats_by_user(user: &Principal, user_type: &str) -> (u64, u64, u64, u64, u64) {
    let accounts = match user_type {
        "tenant" => get_escrow_accounts_by_tenant(user),
        "landlord" => get_escrow_accounts_by_landlord(user),
        _ => return (0, 0, 0, 0, 0),
    };
    
    let total = accounts.len() as u64;
    let active = accounts.iter().filter(|a| matches!(a.status, EscrowStatus::ActiveProtection | EscrowStatus::FundsSecured)).count() as u64;
    let pending = accounts.iter().filter(|a| matches!(a.status, EscrowStatus::PendingSubmission | EscrowStatus::UnderReview)).count() as u64;
    let completed = accounts.iter().filter(|a| a.status == EscrowStatus::Completed).count() as u64;
    let overdue = accounts.iter().filter(|a| a.is_overdue()).count() as u64;
    
    (total, active, pending, completed, overdue)
}
