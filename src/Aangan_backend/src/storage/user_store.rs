use super::USERS;
use crate::types::User;
use candid::Principal;

pub fn create_user(user: User) -> Result<(), String> {
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        if users.contains_key(&user.user_principal) {
            return Err("User already exists".to_string());
        }
        users.insert(user.user_principal, user);
        Ok(())
    })
}

pub fn get_user(principal: &Principal) -> Option<User> {
    USERS.with(|users| users.borrow().get(principal))
}

pub fn update_user(principal: &Principal, updated_user: User) -> Result<User, String> {
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        if users.contains_key(principal) {
            users.insert(*principal, updated_user.clone());
            Ok(updated_user)
        } else {
            Err("User not found".to_string())
        }
    })
}

pub fn get_all_users() -> Vec<User> {
    USERS.with(|users| users.borrow().values().collect())
}

#[allow(dead_code)]
pub fn user_exists(principal: &Principal) -> bool {
    USERS.with(|users| users.borrow().contains_key(principal))
}
