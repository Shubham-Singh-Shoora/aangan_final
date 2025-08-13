import { useICP } from '../contexts/ICPContext';
import { PropertyService } from '../services/PropertyService';
import { RentalService } from '../services/RentalService';
import { EscrowService } from '../services/RealEscrowService';

export const useServices = () => {
    const { actor } = useICP();

    if (!actor) {
        return {
            propertyService: null,
            rentalService: null,
            escrowService: null,
        };
    }

    const escrowService = new EscrowService();
    escrowService.setBackend(actor);

    return {
        propertyService: new PropertyService(actor),
        rentalService: new RentalService(actor),
        escrowService,
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

export const useEscrowService = () => {
    const { escrowService } = useServices();
    return escrowService;
};
