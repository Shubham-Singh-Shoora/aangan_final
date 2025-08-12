use super::IMAGES;
use crate::types::PropertyImage;
use candid::Principal;

pub fn store_image(image: PropertyImage) -> Result<String, String> {
    IMAGES.with(|images| {
        let mut images = images.borrow_mut();
        let image_id = image.id.clone();
        images.insert(image_id.clone(), image);
        Ok(image_id)
    })
}

pub fn get_image(image_id: &str) -> Option<PropertyImage> {
    IMAGES.with(|images| images.borrow().get(image_id))
}

pub fn get_images_by_property(property_id: u64) -> Vec<PropertyImage> {
    IMAGES.with(|images| {
        images
            .borrow()
            .iter()
            .filter(|(_, image)| image.property_id == property_id)
            .map(|(_, image)| image)
            .collect()
    })
}

pub fn get_images_by_owner(owner: &Principal) -> Vec<PropertyImage> {
    IMAGES.with(|images| {
        images
            .borrow()
            .iter()
            .filter(|(_, image)| image.owner == *owner)
            .map(|(_, image)| image)
            .collect()
    })
}

pub fn delete_image(image_id: &str) -> Result<(), String> {
    IMAGES.with(|images| {
        let mut images = images.borrow_mut();
        if images.contains_key(image_id) {
            images.remove(image_id);
            Ok(())
        } else {
            Err("Image not found".to_string())
        }
    })
}

pub fn delete_images_by_property(property_id: u64) {
    IMAGES.with(|images| {
        let mut images = images.borrow_mut();
        let keys_to_remove: Vec<String> = images
            .iter()
            .filter(|(_, image)| image.property_id == property_id)
            .map(|(key, _)| key)
            .collect();
        
        for key in keys_to_remove {
            images.remove(&key);
        }
    });
}
