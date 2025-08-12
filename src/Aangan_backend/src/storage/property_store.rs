use super::PROPERTIES;
use crate::types::Property;
use candid::Principal;

pub fn create_property(property: Property) -> Result<(), String> {
    PROPERTIES.with(|properties| {
        let mut properties = properties.borrow_mut();
        properties.insert(property.id, property);
        Ok(())
    })
}

pub fn get_property(id: u64) -> Option<Property> {
    PROPERTIES.with(|properties| properties.borrow().get(&id))
}

pub fn update_property(property: Property) -> Result<(), String> {
    PROPERTIES.with(|properties| {
        let mut properties = properties.borrow_mut();
        if !properties.contains_key(&property.id) {
            return Err("Property not found".to_string());
        }
        properties.insert(property.id, property);
        Ok(())
    })
}

pub fn get_all_properties() -> Vec<Property> {
    PROPERTIES.with(|properties| {
        properties
            .borrow()
            .iter()
            .map(|(_, property)| property)
            .collect()
    })
}

pub fn get_properties_by_owner(owner: &Principal) -> Vec<Property> {
    PROPERTIES.with(|properties| {
        properties
            .borrow()
            .iter()
            .filter(|(_, property)| property.owner == *owner)
            .map(|(_, property)| property)
            .collect()
    })
}

pub fn get_available_properties() -> Vec<Property> {
    PROPERTIES.with(|properties| {
        properties
            .borrow()
            .iter()
            .filter(|(_, property)| property.is_available)
            .map(|(_, property)| property)
            .collect()
    })
}
