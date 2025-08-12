use crate::auth;
use crate::storage::user_store;
use crate::types::{Role, User};
use candid::Principal;
use ic_cdk_macros::*;

#[update]
pub fn create_user(
    role: Role,
    name: Option<String>,
    email: Option<String>,
    phone: Option<String>,
) -> Result<User, String> {
    let caller = auth::require_authenticated()?;

    let user = User::new(caller, role, name, email, phone);

    user_store::create_user(user.clone())?;
    Ok(user)
}

#[query]
pub fn get_user(principal: Option<Principal>) -> Result<User, String> {
    let target_principal = match principal {
        Some(p) => p,
        None => auth::require_authenticated()?,
    };

    user_store::get_user(&target_principal).ok_or_else(|| "User not found".to_string())
}

#[update]
pub fn update_user_profile(
    name: Option<String>,
    email: Option<String>,
    phone: Option<String>,
) -> Result<User, String> {
    let caller = auth::require_authenticated()?;

    let mut user = user_store::get_user(&caller).ok_or_else(|| "User not found".to_string())?;

    user.update_profile(name, email, phone);
    user_store::update_user(&caller, user.clone())?;

    Ok(user)
}

#[query]
pub fn get_all_users() -> Vec<User> {
    user_store::get_all_users()
}

#[query]
pub fn get_my_profile() -> Result<User, String> {
    let caller = auth::require_authenticated()?;
    get_user(Some(caller))
}
