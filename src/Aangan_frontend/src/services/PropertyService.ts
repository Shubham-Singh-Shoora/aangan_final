import { _SERVICE as AanganService, Property, PropertyType } from '../../../declarations/Aangan_backend/Aangan_backend.did';

export interface PropertyData {
    title: string;
    description: string;
    address: string;
    rent_amount: number;
    deposit_amount: number;
    property_type: 'Apartment' | 'House' | 'Villa' | 'Studio' | 'Condo' | 'Townhouse';
    bedrooms: number;
    bathrooms: number;
    area_sqft: number;
    images: string[];
    amenities: string[];
}

type PropertyTypeVariant = PropertyType;

export class PropertyService {
    constructor(private actor: AanganService) { }

    async addProperty(data: PropertyData) {
        try {
            let propertyTypeVariant: PropertyTypeVariant;

            switch (data.property_type) {
                case 'Apartment':
                    propertyTypeVariant = { 'Apartment': null };
                    break;
                case 'House':
                    propertyTypeVariant = { 'House': null };
                    break;
                case 'Villa':
                    propertyTypeVariant = { 'Villa': null };
                    break;
                case 'Studio':
                    propertyTypeVariant = { 'Studio': null };
                    break;
                case 'Condo':
                    propertyTypeVariant = { 'Condo': null };
                    break;
                case 'Townhouse':
                    propertyTypeVariant = { 'Townhouse': null };
                    break;
                default:
                    propertyTypeVariant = { 'Apartment': null };
            }

            const result = await this.actor.add_property(
                data.title,
                data.description,
                data.address,
                BigInt(data.rent_amount),
                BigInt(data.deposit_amount),
                propertyTypeVariant,
                data.bedrooms,
                data.bathrooms,
                data.area_sqft,
                data.images,
                data.amenities
            );

            if ('Ok' in result) {
                return result.Ok;
            } else {
                throw new Error(result.Err);
            }
        } catch (error) {
            console.error('Error adding property:', error);
            throw error;
        }
    }

    async getAllProperties() {
        try {
            return await this.actor.get_all_properties();
        } catch (error) {
            console.error('Error fetching all properties:', error);
            throw error;
        }
    }

    async getAvailableProperties() {
        try {
            return await this.actor.get_available_properties();
        } catch (error) {
            console.error('Error fetching available properties:', error);
            throw error;
        }
    }

    async getPropertyById(id: number) {
        try {
            const result = await this.actor.get_property_by_id(BigInt(id));
            if ('Ok' in result) {
                return result.Ok;
            } else {
                throw new Error(result.Err);
            }
        } catch (error) {
            console.error('Error fetching property by ID:', error);
            throw error;
        }
    }

    async getMyProperties() {
        try {
            return await this.actor.get_my_properties();
        } catch (error) {
            console.error('Error fetching my properties:', error);
            throw error;
        }
    }

    async getLandlordProperties() {
        try {
            const result = await this.actor.get_my_properties();
            if ('Ok' in result) {
                return result.Ok.map(formatPropertyForDisplay);
            } else {
                throw new Error(result.Err);
            }
        } catch (error) {
            console.error('Error fetching landlord properties:', error);
            throw error;
        }
    }

    async updatePropertyAvailability(id: number, isAvailable: boolean) {
        try {
            const result = await this.actor.update_property_availability(BigInt(id), isAvailable);
            if ('Ok' in result) {
                return result.Ok;
            } else {
                throw new Error(result.Err);
            }
        } catch (error) {
            console.error('Error updating property availability:', error);
            throw error;
        }
    }

    // Full property update method
    async updateProperty(id: number, data: PropertyData) {
        try {
            let propertyTypeVariant: PropertyTypeVariant;

            switch (data.property_type) {
                case 'Apartment':
                    propertyTypeVariant = { 'Apartment': null };
                    break;
                case 'House':
                    propertyTypeVariant = { 'House': null };
                    break;
                case 'Villa':
                    propertyTypeVariant = { 'Villa': null };
                    break;
                case 'Studio':
                    propertyTypeVariant = { 'Studio': null };
                    break;
                case 'Condo':
                    propertyTypeVariant = { 'Condo': null };
                    break;
                case 'Townhouse':
                    propertyTypeVariant = { 'Townhouse': null };
                    break;
                default:
                    propertyTypeVariant = { 'Apartment': null };
            }

            const result = await this.actor.update_property(
                BigInt(id),
                data.title,
                data.description,
                data.address,
                BigInt(data.rent_amount),
                BigInt(data.deposit_amount),
                propertyTypeVariant,
                data.bedrooms,
                data.bathrooms,
                data.area_sqft,
                data.images,
                data.amenities
            );

            if ('Ok' in result) {
                return result.Ok;
            } else {
                throw new Error(result.Err);
            }
        } catch (error) {
            console.error('Error updating property:', error);
            throw error;
        }
    }

    async deleteProperty(id: number) {
        try {
            const result = await this.actor.delete_property(BigInt(id));
            if ('Ok' in result) {
                return true;
            } else {
                throw new Error(result.Err);
            }
        } catch (error) {
            console.error('Error deleting property:', error);
            throw error;
        }
    }
}

export const formatPropertyForDisplay = (property: Property) => {
    return {
        id: property.id.toString(),
        title: property.title,
        description: property.description,
        address: property.address,
        rent: Number(property.rent_amount),
        deposit: Number(property.deposit_amount),
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area_sqft,
        propertyType: Object.keys(property.property_type)[0],
        images: property.images,
        amenities: property.amenities,
        isAvailable: property.is_available,
        owner: property.owner.toString(),
        createdAt: new Date(Number(property.created_at) / 1000000), // Convert nanoseconds to milliseconds
        updatedAt: new Date(Number(property.updated_at) / 1000000),
    };
};
