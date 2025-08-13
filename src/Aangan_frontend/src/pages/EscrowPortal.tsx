import React from 'react';
import { useNavigate } from 'react-router-dom';
import EscrowDashboard from '../components/EscrowPortal/RealEscrowDashboard';
import { useICP } from '../contexts/ICPContext';

const EscrowPortal: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useICP();

  const handleClose = () => {
    // Determine user type and redirect to appropriate dashboard
    const userType = (user as any)?.role || 'tenant';
    if (userType === 'landlord') {
      navigate('/landlord-dashboard');
    } else {
      navigate('/tenant-dashboard');
    }
  };

  // Determine user type (this is a simplified version - in real implementation, 
  // you'd get this from user context/authentication)
  const getUserType = (): 'tenant' | 'landlord' => {
    const userRole = (user as any)?.role;
    return userRole === 'landlord' ? 'landlord' : 'tenant';
  };

  return (
    <EscrowDashboard 
      userType={getUserType()} 
      onClose={handleClose}
    />
  );
};

export default EscrowPortal;
