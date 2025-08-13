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
  created_at: number;
  updated_at: number;
  smart_contract_address?: string;
  transaction_hash?: string;
  refund_amount?: number;
  dispute_reason?: string;
}

export interface EscrowTimelineEvent {
  id: number;
  escrow_id: number;
  event_type: EscrowEventType;
  title: string;
  description: string;
  timestamp: number;
  amount?: number;
  transaction_hash?: string;
  metadata?: string;
}

export interface CreateEscrowRequest {
  rental_id: number;
  property_id: number;
  landlord: Principal;
  tenant: Principal;
  amount: number;
}

export enum EscrowStatus {
  PendingSubmission = 'PendingSubmission',
  UnderReview = 'UnderReview',
  FundsSecured = 'FundsSecured',
  ActiveProtection = 'ActiveProtection',
  RefundProcessing = 'RefundProcessing',
  Completed = 'Completed',
  Disputed = 'Disputed',
  Cancelled = 'Cancelled',
}

export enum EscrowEventType {
  Created = 'Created',
  DepositSubmitted = 'DepositSubmitted',
  LandlordApproval = 'LandlordApproval',
  FundsLocked = 'FundsLocked',
  LeaseActivated = 'LeaseActivated',
  PropertyInspected = 'PropertyInspected',
  RefundInitiated = 'RefundInitiated',
  RefundCompleted = 'RefundCompleted',
  DisputeRaised = 'DisputeRaised',
  DisputeResolved = 'DisputeResolved',
  Cancelled = 'Cancelled',
}

export class EscrowService {
  private backend: any;

  constructor() {
    this.backend = null;
  }

  setBackend(backend: any) {
    this.backend = backend;
  }

  async getEscrowAccountsForUser(user: Principal): Promise<EscrowAccount[]> {
    if (!this.backend) throw new Error('Backend not initialized');
    
    try {
      const accounts = await this.backend.get_escrow_accounts_for_user(user);
      return accounts.map((account: any) => this.transformEscrowAccount(account));
    } catch (error) {
      console.error('Error fetching escrow accounts for user:', error);
      return [];
    }
  }

  async getEscrowAccountsByLandlord(landlord: Principal): Promise<EscrowAccount[]> {
    if (!this.backend) throw new Error('Backend not initialized');
    
    try {
      const accounts = await this.backend.get_escrow_accounts_by_landlord(landlord);
      return accounts.map((account: any) => this.transformEscrowAccount(account));
    } catch (error) {
      console.error('Error fetching escrow accounts for landlord:', error);
      return [];
    }
  }

  async getEscrowAccountsByTenant(tenant: Principal): Promise<EscrowAccount[]> {
    if (!this.backend) throw new Error('Backend not initialized');
    
    try {
      const accounts = await this.backend.get_escrow_accounts_by_tenant(tenant);
      return accounts.map((account: any) => this.transformEscrowAccount(account));
    } catch (error) {
      console.error('Error fetching escrow accounts for tenant:', error);
      return [];
    }
  }

  async getEscrowAccountById(escrowId: number): Promise<EscrowAccount | null> {
    if (!this.backend) throw new Error('Backend not initialized');
    
    try {
      const result = await this.backend.get_escrow_account_by_id(BigInt(escrowId));
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
      return events.map((event: any) => this.transformTimelineEvent(event));
    } catch (error) {
      console.error('Error fetching timeline events:', error);
      return [];
    }
  }

  async getUserEscrowStatistics(user: Principal): Promise<{
    total: number;
    active: number;
    pending: number;
    completed: number;
    overdue: number;
  }> {
    if (!this.backend) throw new Error('Backend not initialized');
    
    try {
      const result = await this.backend.get_user_escrow_statistics(user);
      const [total, active, pending, completed, overdue] = result;
      return {
        total: Number(total),
        active: Number(active),
        pending: Number(pending),
        completed: Number(completed),
        overdue: Number(overdue),
      };
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      return {
        total: 0,
        active: 0,
        pending: 0,
        completed: 0,
        overdue: 0,
      };
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
      };
      
      const result = await this.backend.create_escrow_account(backendRequest);
      if (result.Ok) {
        return this.transformEscrowAccount(result.Ok);
      } else {
        throw new Error(result.Err || 'Unknown error');
      }
    } catch (error) {
      console.error('Error creating escrow account:', error);
      throw error;
    }
  }

  async submitSecurityDeposit(escrowId: number, transactionHash: string): Promise<EscrowAccount> {
    if (!this.backend) throw new Error('Backend not initialized');
    
    try {
      const result = await this.backend.submit_security_deposit(BigInt(escrowId), transactionHash);
      if (result.Ok) {
        return this.transformEscrowAccount(result.Ok);
      } else {
        throw new Error(result.Err || 'Unknown error');
      }
    } catch (error) {
      console.error('Error submitting security deposit:', error);
      throw error;
    }
  }

  async approveSecurityDeposit(escrowId: number, contractAddress: string): Promise<EscrowAccount> {
    if (!this.backend) throw new Error('Backend not initialized');
    
    try {
      const result = await this.backend.approve_security_deposit(BigInt(escrowId), contractAddress);
      if (result.Ok) {
        return this.transformEscrowAccount(result.Ok);
      } else {
        throw new Error(result.Err || 'Unknown error');
      }
    } catch (error) {
      console.error('Error approving security deposit:', error);
      throw error;
    }
  }

  async activateEscrowProtection(escrowId: number): Promise<EscrowAccount> {
    if (!this.backend) throw new Error('Backend not initialized');
    
    try {
      const result = await this.backend.activate_escrow_protection(BigInt(escrowId));
      if (result.Ok) {
        return this.transformEscrowAccount(result.Ok);
      } else {
        throw new Error(result.Err || 'Unknown error');
      }
    } catch (error) {
      console.error('Error activating escrow protection:', error);
      throw error;
    }
  }

  async initiateRefund(escrowId: number, amount: number): Promise<EscrowAccount> {
    if (!this.backend) throw new Error('Backend not initialized');
    
    try {
      const result = await this.backend.initiate_refund(BigInt(escrowId), BigInt(amount));
      if (result.Ok) {
        return this.transformEscrowAccount(result.Ok);
      } else {
        throw new Error(result.Err || 'Unknown error');
      }
    } catch (error) {
      console.error('Error initiating refund:', error);
      throw error;
    }
  }

  async completeRefund(escrowId: number, transactionHash: string): Promise<EscrowAccount> {
    if (!this.backend) throw new Error('Backend not initialized');
    
    try {
      const result = await this.backend.complete_refund(BigInt(escrowId), transactionHash);
      if (result.Ok) {
        return this.transformEscrowAccount(result.Ok);
      } else {
        throw new Error(result.Err || 'Unknown error');
      }
    } catch (error) {
      console.error('Error completing refund:', error);
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
      created_at: Number(backendAccount.created_at),
      updated_at: Number(backendAccount.updated_at),
      smart_contract_address: backendAccount.smart_contract_address?.length > 0 ? backendAccount.smart_contract_address[0] : undefined,
      transaction_hash: backendAccount.transaction_hash?.length > 0 ? backendAccount.transaction_hash[0] : undefined,
      refund_amount: backendAccount.refund_amount?.length > 0 ? Number(backendAccount.refund_amount[0]) : undefined,
      dispute_reason: backendAccount.dispute_reason?.length > 0 ? backendAccount.dispute_reason[0] : undefined,
    };
  }

  private transformTimelineEvent(backendEvent: any): EscrowTimelineEvent {
    return {
      id: Number(backendEvent.id),
      escrow_id: Number(backendEvent.escrow_id),
      event_type: this.transformEventType(backendEvent.event_type),
      title: this.getEventTitle(backendEvent.event_type),
      description: backendEvent.description,
      timestamp: Number(backendEvent.timestamp),
      transaction_hash: backendEvent.transaction_hash?.length > 0 ? backendEvent.transaction_hash[0] : undefined,
      metadata: backendEvent.metadata?.length > 0 ? backendEvent.metadata[0] : undefined,
    };
  }

  private transformEscrowStatus(backendStatus: any): EscrowStatus {
    if ('PendingSubmission' in backendStatus) return EscrowStatus.PendingSubmission;
    if ('UnderReview' in backendStatus) return EscrowStatus.UnderReview;
    if ('FundsSecured' in backendStatus) return EscrowStatus.FundsSecured;
    if ('ActiveProtection' in backendStatus) return EscrowStatus.ActiveProtection;
    if ('RefundProcessing' in backendStatus) return EscrowStatus.RefundProcessing;
    if ('Completed' in backendStatus) return EscrowStatus.Completed;
    if ('Disputed' in backendStatus) return EscrowStatus.Disputed;
    if ('Cancelled' in backendStatus) return EscrowStatus.Cancelled;
    return EscrowStatus.PendingSubmission;
  }

  private transformEventType(backendEventType: any): EscrowEventType {
    if ('Created' in backendEventType) return EscrowEventType.Created;
    if ('DepositSubmitted' in backendEventType) return EscrowEventType.DepositSubmitted;
    if ('LandlordApproval' in backendEventType) return EscrowEventType.LandlordApproval;
    if ('FundsLocked' in backendEventType) return EscrowEventType.FundsLocked;
    if ('LeaseActivated' in backendEventType) return EscrowEventType.LeaseActivated;
    if ('PropertyInspected' in backendEventType) return EscrowEventType.PropertyInspected;
    if ('RefundInitiated' in backendEventType) return EscrowEventType.RefundInitiated;
    if ('RefundCompleted' in backendEventType) return EscrowEventType.RefundCompleted;
    if ('DisputeRaised' in backendEventType) return EscrowEventType.DisputeRaised;
    if ('DisputeResolved' in backendEventType) return EscrowEventType.DisputeResolved;
    if ('Cancelled' in backendEventType) return EscrowEventType.Cancelled;
    return EscrowEventType.Created;
  }

  private getEventTitle(eventType: any): string {
    if ('Created' in eventType) return 'Escrow Created';
    if ('DepositSubmitted' in eventType) return 'Deposit Submitted';
    if ('LandlordApproval' in eventType) return 'Landlord Approval';
    if ('FundsLocked' in eventType) return 'Funds Locked';
    if ('LeaseActivated' in eventType) return 'Lease Activated';
    if ('PropertyInspected' in eventType) return 'Property Inspected';
    if ('RefundInitiated' in eventType) return 'Refund Initiated';
    if ('RefundCompleted' in eventType) return 'Refund Completed';
    if ('DisputeRaised' in eventType) return 'Dispute Raised';
    if ('DisputeResolved' in eventType) return 'Dispute Resolved';
    if ('Cancelled' in eventType) return 'Escrow Cancelled';
    return 'Unknown Event';
  }
}
