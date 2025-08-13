import { useEffect } from 'react';
import { useICP } from '../contexts/ICPContext';
import { escrowService } from '../services/RealEscrowService';

export const useEscrowService = () => {
  const { actor } = useICP();

  useEffect(() => {
    if (actor) {
      escrowService.setBackend(actor);
    }
  }, [actor]);

  return escrowService;
};
