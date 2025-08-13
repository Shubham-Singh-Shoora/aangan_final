// Dummy Escrow Service for Frontend-Only Implementation
// This provides realistic data structure for escrow portal demonstration

export interface EscrowAccount {
  id: string;
  rentalId: string;
  propertyId: string;
  tenantId: string;
  landlordId: string;
  amount: number;
  status: 'pending_submission' | 'under_review' | 'funds_secured' | 'active_protection' | 'refund_processing' | 'completed' | 'disputed';
  submissionDeadline: Date;
  createdAt: Date;
  updatedAt: Date;
  timeline: EscrowTimelineStep[];
  propertyDetails: {
    title: string;
    address: string;
    type: string;
  };
  landlordDetails: {
    name: string;
    contact: string;
    email: string;
  };
  tenantDetails: {
    name: string;
    contact: string;
    email: string;
  };
}

export interface EscrowTimelineStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'overdue';
  timestamp?: string;
  deadline?: string;
  amount?: number;
  documents?: string[];
}

export class EscrowService {
  // Generate dummy escrow data for demonstration
  static generateDummyEscrowData(userType: 'tenant' | 'landlord', userId: string): EscrowAccount[] {
    const baseEscrows: Partial<EscrowAccount>[] = [
      {
        id: 'ESC-001',
        rentalId: 'RNT-001',
        propertyId: 'PROP-001',
        amount: 50000,
        status: 'active_protection',
        propertyDetails: {
          title: 'Luxury 2BHK Apartment',
          address: 'Sector 62, Noida, UP',
          type: '2BHK'
        },
        landlordDetails: {
          name: 'Rajesh Kumar',
          contact: '+91 98765 43210',
          email: 'rajesh.kumar@email.com'
        },
        tenantDetails: {
          name: 'Priya Sharma',
          contact: '+91 87654 32109',
          email: 'priya.sharma@email.com'
        }
      },
      {
        id: 'ESC-002',
        rentalId: 'RNT-002', 
        propertyId: 'PROP-002',
        amount: 35000,
        status: 'under_review',
        propertyDetails: {
          title: 'Modern Studio in Gurgaon',
          address: 'DLF Phase 3, Gurgaon',
          type: 'Studio'
        },
        landlordDetails: {
          name: 'Amit Singh',
          contact: '+91 76543 21098',
          email: 'amit.singh@email.com'
        },
        tenantDetails: {
          name: 'Rohit Verma',
          contact: '+91 65432 10987',
          email: 'rohit.verma@email.com'
        }
      },
      {
        id: 'ESC-003',
        rentalId: 'RNT-003',
        propertyId: 'PROP-003',
        amount: 75000,
        status: 'pending_submission',
        propertyDetails: {
          title: '3BHK Family Home',
          address: 'Lajpat Nagar, Delhi',
          type: '3BHK'
        },
        landlordDetails: {
          name: 'Sunita Devi',
          contact: '+91 54321 09876',
          email: 'sunita.devi@email.com'
        },
        tenantDetails: {
          name: 'Neha Gupta',
          contact: '+91 43210 98765',
          email: 'neha.gupta@email.com'
        }
      }
    ];

    return baseEscrows.map(escrow => ({
      ...escrow,
      tenantId: userType === 'tenant' ? userId : escrow.tenantDetails!.email,
      landlordId: userType === 'landlord' ? userId : escrow.landlordDetails!.email,
      submissionDeadline: new Date(Date.now() + (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000),
      timeline: this.generateTimelineSteps(escrow.status!, escrow.amount!)
    })) as EscrowAccount[];
  }

  static generateTimelineSteps(status: string, amount: number): EscrowTimelineStep[] {
    const baseSteps: EscrowTimelineStep[] = [
      {
        id: 'step-1',
        title: 'Security Deposit Submission',
        description: 'Tenant submits security deposit to escrow smart contract',
        status: 'pending',
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        amount: amount
      },
      {
        id: 'step-2',
        title: 'Landlord Verification',
        description: 'Landlord verifies deposit amount and confirms escrow setup',
        status: 'pending'
      },
      {
        id: 'step-3',
        title: 'Smart Contract Activation',
        description: 'Blockchain escrow contract activated with funds secured',
        status: 'pending'
      },
      {
        id: 'step-4',
        title: 'Active Protection Period',
        description: 'Escrow provides protection throughout lease period',
        status: 'pending'
      },
      {
        id: 'step-5',
        title: 'Lease Completion Review',
        description: 'Property inspection and damage assessment upon lease end',
        status: 'pending'
      },
      {
        id: 'step-6',
        title: 'Automatic Refund Processing',
        description: 'Smart contract processes refund based on lease conditions',
        status: 'pending'
      }
    ];

    // Update step statuses based on escrow status
    switch (status) {
      case 'pending_submission':
        // All steps remain pending
        break;
      case 'under_review':
        baseSteps[0].status = 'completed';
        baseSteps[0].timestamp = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
        baseSteps[1].status = 'in-progress';
        break;
      case 'funds_secured':
        baseSteps.slice(0, 3).forEach((step, index) => {
          step.status = 'completed';
          step.timestamp = new Date(Date.now() - (3 - index) * 24 * 60 * 60 * 1000).toISOString();
        });
        break;
      case 'active_protection':
        baseSteps.slice(0, 4).forEach((step, index) => {
          step.status = 'completed';
          step.timestamp = new Date(Date.now() - (4 - index) * 24 * 60 * 60 * 1000).toISOString();
        });
        break;
      case 'refund_processing':
        baseSteps.slice(0, 5).forEach((step, index) => {
          step.status = 'completed';
          step.timestamp = new Date(Date.now() - (5 - index) * 24 * 60 * 60 * 1000).toISOString();
        });
        baseSteps[5].status = 'in-progress';
        break;
      case 'completed':
        baseSteps.forEach((step, index) => {
          step.status = 'completed';
          step.timestamp = new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toISOString();
        });
        break;
    }

    // Mark overdue if submission deadline passed and not submitted
    if (status === 'pending_submission' && baseSteps[0].deadline) {
      const deadline = new Date(baseSteps[0].deadline);
      if (deadline < new Date()) {
        baseSteps[0].status = 'overdue';
      }
    }

    return baseSteps;
  }

  // Get escrow accounts by user type and filter
  static getEscrowAccounts(userType: 'tenant' | 'landlord', userId: string, filter?: string): EscrowAccount[] {
    const accounts = this.generateDummyEscrowData(userType, userId);
    
    if (!filter) return accounts;

    switch (filter) {
      case 'active':
        return accounts.filter(acc => ['funds_secured', 'active_protection'].includes(acc.status));
      case 'pending':
        return accounts.filter(acc => ['pending_submission', 'under_review'].includes(acc.status));
      case 'completed':
        return accounts.filter(acc => ['completed', 'refund_processing'].includes(acc.status));
      default:
        return accounts;
    }
  }

  // Get single escrow account details
  static getEscrowAccount(escrowId: string): EscrowAccount | null {
    const allAccounts = this.generateDummyEscrowData('tenant', 'dummy-user');
    return allAccounts.find(acc => acc.id === escrowId) || null;
  }

  // Calculate total escrow amounts
  static calculateTotalEscrow(accounts: EscrowAccount[]): number {
    return accounts.reduce((total, acc) => total + acc.amount, 0);
  }

  // Get escrow statistics
  static getEscrowStats(userType: 'tenant' | 'landlord', userId: string) {
    const accounts = this.generateDummyEscrowData(userType, userId);
    
    return {
      total: accounts.length,
      totalAmount: this.calculateTotalEscrow(accounts),
      active: accounts.filter(acc => ['funds_secured', 'active_protection'].includes(acc.status)).length,
      pending: accounts.filter(acc => ['pending_submission', 'under_review'].includes(acc.status)).length,
      completed: accounts.filter(acc => acc.status === 'completed').length,
      overdue: accounts.filter(acc => acc.timeline.some(step => step.status === 'overdue')).length
    };
  }

  // Dummy action methods (would integrate with backend in real implementation)
  static async submitDeposit(escrowId: string, amount: number): Promise<{ success: boolean; message: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: Math.random() > 0.1, // 90% success rate
      message: Math.random() > 0.1 
        ? `Security deposit of ₹${amount.toLocaleString('en-IN')} submitted successfully. Escrow ID: ${escrowId}`
        : 'Failed to submit deposit. Please try again or contact support.'
    };
  }

  static async approveEscrow(escrowId: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: Math.random() > 0.05, // 95% success rate
      message: Math.random() > 0.05
        ? `Escrow ${escrowId} approved successfully. Funds are now secured in smart contract.`
        : 'Failed to approve escrow. Please review and try again.'
    };
  }

  static async initiateRefund(escrowId: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: Math.random() > 0.02, // 98% success rate  
      message: Math.random() > 0.02
        ? `Refund process initiated for escrow ${escrowId}. Funds will be released within 7 business days.`
        : 'Failed to initiate refund. Please contact support for assistance.'
    };
  }
}
