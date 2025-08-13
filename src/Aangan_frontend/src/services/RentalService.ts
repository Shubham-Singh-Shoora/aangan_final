import { _SERVICE as AanganService } from '../../../declarations/Aangan_backend/Aangan_backend.did';

export class RentalService {
    constructor(private actor: AanganService) { }

    async requestRental(propertyId: number, startDate: number, endDate: number) {
        try {
            const result = await this.actor.request_rental(
                BigInt(propertyId),
                BigInt(startDate),
                BigInt(endDate)
            );

            if ('Ok' in result) {
                return result.Ok;
            } else {
                throw new Error(result.Err);
            }
        } catch (error) {
            console.error('Error requesting rental:', error);
            throw error;
        }
    }

    async confirmRental(rentalId: number) {
        try {
            const result = await this.actor.confirm_rental(BigInt(rentalId));
            if ('Ok' in result) {
                return result.Ok;
            } else {
                throw new Error(result.Err);
            }
        } catch (error) {
            console.error('Error confirming rental:', error);
            throw error;
        }
    }

    async cancelRental(rentalId: number) {
        try {
            const result = await this.actor.cancel_rental(BigInt(rentalId));
            if ('Ok' in result) {
                return result.Ok;
            } else {
                throw new Error(result.Err);
            }
        } catch (error) {
            console.error('Error canceling rental:', error);
            throw error;
        }
    }

    async getMyRentals() {
        try {
            return await this.actor.get_my_rentals();
        } catch (error) {
            console.error('Error fetching my rentals:', error);
            throw error;
        }
    }

    async getTenantRentals() {
        try {
            const rentals = await this.actor.get_my_rentals();
            // get_my_rentals returns Vec<RentalAgreement> directly, not wrapped in a Result
            return Array.isArray(rentals) ? rentals.map(formatRentalForDisplay) : [];
        } catch (error) {
            console.error('Error fetching tenant rentals:', error);
            throw error;
        }
    }

    async getRentalById(id: number) {
        try {
            const result = await this.actor.get_rental_by_id(BigInt(id));
            if ('Ok' in result) {
                return result.Ok;
            } else {
                throw new Error(result.Err);
            }
        } catch (error) {
            console.error('Error fetching rental by ID:', error);
            throw error;
        }
    }

    async getMyNFTs() {
        try {
            return await this.actor.get_my_nfts();
        } catch (error) {
            console.error('Error fetching my NFTs:', error);
            throw error;
        }
    }

    async getNFTById(id: number) {
        try {
            const result = await this.actor.get_nft_by_id(BigInt(id));
            if ('Ok' in result) {
                return result.Ok;
            } else {
                throw new Error(result.Err);
            }
        } catch (error) {
            console.error('Error fetching NFT by ID:', error);
            throw error;
        }
    }

    async getPendingRentalRequests() {
        try {
            const result = await this.actor.get_pending_rental_requests();
            if ('Ok' in result) {
                return result.Ok.map(formatRentalForDisplay);
            } else {
                throw new Error(result.Err);
            }
        } catch (error) {
            console.error('Error fetching pending rental requests:', error);
            throw error;
        }
    }

    async getApprovedRentals() {
        try {
            const result = await this.actor.get_approved_rentals();
            if ('Ok' in result) {
                return result.Ok.map(formatRentalForDisplay);
            } else {
                throw new Error(result.Err);
            }
        } catch (error) {
            console.error('Error fetching approved rentals:', error);
            throw error;
        }
    }

    async approveRentalRequest(rentalId: number) {
        try {
            const result = await this.actor.approve_rental_request(BigInt(rentalId));
            if ('Ok' in result) {
                return result.Ok;
            } else {
                throw new Error(result.Err);
            }
        } catch (error) {
            console.error('Error approving rental request:', error);
            throw error;
        }
    }

    async rejectRentalRequest(rentalId: number) {
        try {
            const result = await this.actor.reject_rental_request(BigInt(rentalId));
            if ('Ok' in result) {
                return result.Ok;
            } else {
                throw new Error(result.Err);
            }
        } catch (error) {
            console.error('Error rejecting rental request:', error);
            throw error;
        }
    }

    async markRentalUnderReview(rentalId: number) {
        try {
            const result = await this.actor.mark_rental_under_review(BigInt(rentalId));
            if ('Ok' in result) {
                return result.Ok;
            } else {
                throw new Error(result.Err);
            }
        } catch (error) {
            console.error('Error marking rental under review:', error);
            throw error;
        }
    }
}

export const formatRentalForDisplay = (rental: any) => {
    const statusMap = {
        'Requested': 'Requested',
        'UnderReview': 'Under Review',
        'Approved': 'Approved', 
        'Confirmed': 'Confirmed',
        'Active': 'Active',
        'Completed': 'Completed',
        'Rejected': 'Rejected',
        'Cancelled': 'Cancelled'
    };

    const statusKey = Object.keys(rental.status)[0];
    return {
        id: rental.id.toString(),
        propertyId: rental.property_id.toString(),
        landlord: rental.landlord.toString(),
        tenant: rental.tenant.toString(),
        status: statusMap[statusKey as keyof typeof statusMap] || statusKey,
        rawStatus: statusKey,
        startDate: new Date(Number(rental.start_date) / 1000000),
        endDate: new Date(Number(rental.end_date) / 1000000),
        rentAmount: Number(rental.rent_amount),
        depositAmount: Number(rental.deposit_amount),
        nftId: rental.nft_id.length > 0 ? rental.nft_id[0].toString() : null,
        createdAt: new Date(Number(rental.created_at) / 1000000),
        updatedAt: new Date(Number(rental.updated_at) / 1000000),
    };
};

export const formatNFTForDisplay = (nft: any) => {
    return {
        id: nft.id.toString(),
        owner: nft.owner.toString(),
        propertyId: nft.property_id.toString(),
        rentalAgreementId: nft.rental_agreement_id.toString(),
        name: nft.name,
        description: nft.description,
        image: nft.image,
        attributes: nft.attributes,
        createdAt: new Date(Number(nft.created_at) / 1000000),
    };
};
