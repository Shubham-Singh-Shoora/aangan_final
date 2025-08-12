import { useICP } from '../contexts/ICPContext';
import { PropertyService } from '../services/PropertyService';
import { RentalService } from '../services/RentalService';

export const useServices = () => {
    const { actor } = useICP();

    if (!actor) {
        throw new Error('Actor not available. Please authenticate first.');
    }

    return {
        propertyService: new PropertyService(actor),
        rentalService: new RentalService(actor),
    };
};

export const usePropertyService = () => {
    const { propertyService } = useServices();
    return propertyService;
};

export const useRentalService = () => {
    const { rentalService } = useServices();
    return rentalService;
};
