import { Principal } from '@dfinity/principal';

export interface EscrowAccount {
  id: number;
  rental_id: number;
  property_id: number;
  landlord: Principal;
  tenant: Principal;
  amount: number;
  status: EscrowStatus;
  submission_deadline: number;
  approval_deadline: number;
  created_at: number;
  deposit_submitted_at?: number;
  approved_at?: number;
  refunded_at?: number;
}

export interface EscrowTimelineEvent {
  id: number;
  escrow_id: number;
  event_type: string;
  description: string;
  user?: Principal;
  timestamp: number;
}

export interface CreateEscrowRequest {
  rental_id: number;
  property_id: number;
  landlord: Principal;
  tenant: Principal;
  amount: number;
  submission_deadline: number;
  approval_deadline: number;
}

export enum EscrowStatus {
  PendingDeposit = 'PendingDeposit',
  DepositSubmitted = 'DepositSubmitted',
  Approved = 'Approved',
  Refunded = 'Refunded',
  Expired = 'Expired',
}

export class EscrowService {
  private backend: any;

  constructor() {
    // We'll get the backend instance from the hook
    this.backend = null;
  }

  setBackend(backend: any) {
    this.backend = backend;
  }

  async getEscrowAccountsForUser(user: Principal): Promise<EscrowAccount[]> {
    if (!this.backend) throw new Error('Backend not initialized');
    
    try {
      const accounts = await this.backend.get_escrow_accounts_for_user(user);
      return accounts.map(this.transformEscrowAccount);
    } catch (error) {
      console.error('Error fetching escrow accounts for user:', error);
      return [];
    }
  }

  async getEscrowAccountsByLandlord(landlord: Principal): Promise<EscrowAccount[]> {
    if (!this.backend) throw new Error('Backend not initialized');
    
    try {
      const accounts = await this.backend.get_escrow_accounts_by_landlord(landlord);
      return accounts.map(this.transformEscrowAccount);
    } catch (error) {
      console.error('Error fetching escrow accounts for landlord:', error);
      return [];
    }
  }

  async getEscrowAccountsByTenant(tenant: Principal): Promise<EscrowAccount[]> {
    if (!this.backend) throw new Error('Backend not initialized');
    
    try {
      const accounts = await this.backend.get_escrow_accounts_by_tenant(tenant);
      return accounts.map(this.transformEscrowAccount);
    } catch (error) {
      console.error('Error fetching escrow accounts for tenant:', error);
      return [];
    }
  }

  async getEscrowAccountById(id: number): Promise<EscrowAccount | null> {
    if (!this.backend) throw new Error('Backend not initialized');
    
    try {
      const result = await this.backend.get_escrow_account_by_id(BigInt(id));
      return result.length > 0 ? this.transformEscrowAccount(result[0]) : null;
    } catch (error) {
      console.error('Error fetching escrow account by ID:', error);
      return null;
    }
  }

  async getEscrowTimelineEvents(escrowId: number): Promise<EscrowTimelineEvent[]> {
    if (!this.backend) throw new Error('Backend not initialized');
    
    try {
      const events = await this.backend.get_escrow_timeline_events(BigInt(escrowId));
      return events.map(this.transformTimelineEvent);
    } catch (error) {
      console.error('Error fetching timeline events:', error);
      return [];
    }
  }

  async getUserEscrowStatistics(user: Principal): Promise<{ total: number; pending: number; approved: number; refunded: number }> {
    if (!this.backend) throw new Error('Backend not initialized');
    
    try {
      const [total, pending, approved, refunded] = await this.backend.get_user_escrow_statistics(user);
      return {
        total: Number(total),
        pending: Number(pending),
        approved: Number(approved),
        refunded: Number(refunded),
      };
    } catch (error) {
      console.error('Error fetching user escrow statistics:', error);
      return { total: 0, pending: 0, approved: 0, refunded: 0 };
    }
  }

  async createEscrowAccount(request: CreateEscrowRequest): Promise<EscrowAccount> {
    if (!this.backend) throw new Error('Backend not initialized');
    
    try {
      const backendRequest = {
        rental_id: BigInt(request.rental_id),
        property_id: BigInt(request.property_id),
        landlord: request.landlord,
        tenant: request.tenant,
        amount: BigInt(request.amount),
        submission_deadline: BigInt(request.submission_deadline),
        approval_deadline: BigInt(request.approval_deadline),
      };
      
      const result = await this.backend.create_escrow_account(backendRequest);
      if ('Ok' in result) {
        return this.transformEscrowAccount(result.Ok);
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error('Error creating escrow account:', error);
      throw error;
    }
  }

  async submitSecurityDeposit(escrowId: number): Promise<EscrowAccount> {
    if (!this.backend) throw new Error('Backend not initialized');
    
    try {
      const result = await this.backend.submit_security_deposit(BigInt(escrowId));
      if ('Ok' in result) {
        return this.transformEscrowAccount(result.Ok);
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error('Error submitting security deposit:', error);
      throw error;
    }
  }

  async approveSecurityDeposit(escrowId: number): Promise<EscrowAccount> {
    if (!this.backend) throw new Error('Backend not initialized');
    
    try {
      const result = await this.backend.approve_security_deposit(BigInt(escrowId));
      if ('Ok' in result) {
        return this.transformEscrowAccount(result.Ok);
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error('Error approving security deposit:', error);
      throw error;
    }
  }

  async refundSecurityDeposit(escrowId: number): Promise<EscrowAccount> {
    if (!this.backend) throw new Error('Backend not initialized');
    
    try {
      const result = await this.backend.refund_security_deposit(BigInt(escrowId));
      if ('Ok' in result) {
        return this.transformEscrowAccount(result.Ok);
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error('Error refunding security deposit:', error);
      throw error;
    }
  }

  private transformEscrowAccount(backendAccount: any): EscrowAccount {
    return {
      id: Number(backendAccount.id),
      rental_id: Number(backendAccount.rental_id),
      property_id: Number(backendAccount.property_id),
      landlord: backendAccount.landlord,
      tenant: backendAccount.tenant,
      amount: Number(backendAccount.amount),
      status: this.transformEscrowStatus(backendAccount.status),
      submission_deadline: Number(backendAccount.submission_deadline),
      approval_deadline: Number(backendAccount.approval_deadline),
      created_at: Number(backendAccount.created_at),
      deposit_submitted_at: backendAccount.deposit_submitted_at?.length > 0 ? Number(backendAccount.deposit_submitted_at[0]) : undefined,
      approved_at: backendAccount.approved_at?.length > 0 ? Number(backendAccount.approved_at[0]) : undefined,
      refunded_at: backendAccount.refunded_at?.length > 0 ? Number(backendAccount.refunded_at[0]) : undefined,
    };
  }

  private transformTimelineEvent(backendEvent: any): EscrowTimelineEvent {
    return {
      id: Number(backendEvent.id),
      escrow_id: Number(backendEvent.escrow_id),
      event_type: backendEvent.event_type,
      description: backendEvent.description,
      user: backendEvent.user?.length > 0 ? backendEvent.user[0] : undefined,
      timestamp: Number(backendEvent.timestamp),
    };
  }

  private transformEscrowStatus(backendStatus: any): EscrowStatus {
    if ('PendingDeposit' in backendStatus) return EscrowStatus.PendingDeposit;
    if ('DepositSubmitted' in backendStatus) return EscrowStatus.DepositSubmitted;
    if ('Approved' in backendStatus) return EscrowStatus.Approved;
    if ('Refunded' in backendStatus) return EscrowStatus.Refunded;
    if ('Expired' in backendStatus) return EscrowStatus.Expired;
    return EscrowStatus.PendingDeposit;
  }
}

// Create a singleton instance
export const escrowService = new EscrowService();
