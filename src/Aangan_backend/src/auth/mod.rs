use candid::Principal;
use ic_cdk::caller;

pub fn get_caller() -> Principal {
    caller()
}

pub fn is_anonymous() -> bool {
    caller() == Principal::anonymous()
}

pub fn require_authenticated() -> Result<Principal, String> {
    let caller = get_caller();
    if is_anonymous() {
        return Err("Authentication required".to_string());
    }
    Ok(caller)
}
