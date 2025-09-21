
import { Status } from '@/types/customer';

export interface StatusTransition {
  from: Status;
  to: Status[];
  requiresAdmin: boolean;
  requiresComment?: boolean;
  requiresDocuments?: boolean;
}

export const STATUS_TRANSITIONS: StatusTransition[] = [
  {
    from: 'Draft',
    to: ['Submitted'],
    requiresAdmin: false,
    requiresDocuments: true,
  },
  {
    from: 'Submitted', 
    to: ['Returned', 'Need More Info', 'Ready for Bank', 'Rejected'],
    requiresAdmin: false, // Managers can do these transitions
  },
  {
    from: 'Returned',
    to: ['Submitted'],
    requiresAdmin: false,
  },
  {
    from: 'Need More Info',
    to: ['Submitted'],
    requiresAdmin: false,
    requiresComment: true,
  },
  {
    from: 'Ready for Bank',
    to: ['Sent to Bank'],
    requiresAdmin: true, // Only admins can send to bank
    requiresComment: true,
  },
  {
    from: 'Sent to Bank',
    to: ['Complete', 'Rejected'],
    requiresAdmin: true,
  },
  {
    from: 'Complete',
    to: ['Paid'], // Complete can go to Paid (optional)
    requiresAdmin: true,
  },
  {
    from: 'Rejected',
    to: [], // Rejected is final
    requiresAdmin: true,
  },
  {
    from: 'Paid',
    to: [], // Paid is final
    requiresAdmin: true,
  },
];

export const getAvailableTransitions = (
  currentStatus: Status, 
  isAdmin: boolean,
  isUserOwner: boolean,
  hasRequiredDocuments: boolean = false
): Status[] => {
  const transition = STATUS_TRANSITIONS.find(t => t.from === currentStatus);
  
  if (!transition) return [];
  
  // If transition requires admin access and user is not admin, return empty array
  if (transition.requiresAdmin && !isAdmin) {
    return [];
  }
  
  // For non-admin users, they can only transition their own applications
  if (!isAdmin && !isUserOwner) {
    return [];
  }
  
  // Filter out transitions that require documents when not available
  if (transition.requiresDocuments && !hasRequiredDocuments) {
    return [];
  }
  
  return transition.to;
};

export const validateStatusTransition = (
  from: Status,
  to: Status,
  isAdmin: boolean,
  isUserOwner: boolean,
  hasRequiredDocuments: boolean = false,
  comment?: string
): { isValid: boolean; error?: string } => {
  const transition = STATUS_TRANSITIONS.find(t => t.from === from);
  
  if (!transition) {
    return { isValid: false, error: 'Invalid current status' };
  }
  
  if (!transition.to.includes(to)) {
    return { isValid: false, error: `Cannot transition from ${from} to ${to}` };
  }
  
  if (transition.requiresAdmin && !isAdmin) {
    return { isValid: false, error: 'Admin access required for this transition' };
  }
  
  if (!isAdmin && !isUserOwner) {
    return { isValid: false, error: 'You can only modify your own applications' };
  }
  
  if (transition.requiresDocuments && !hasRequiredDocuments) {
    return { isValid: false, error: 'All mandatory documents must be uploaded' };
  }
  
  if (transition.requiresComment && (!comment || comment.trim().length === 0)) {
    return { isValid: false, error: 'Comment is required for this status change' };
  }
  
  return { isValid: true };
};

export const getStatusColor = (status: Status): string => {
  switch (status) {
    case 'Draft': return 'bg-gray-100 text-gray-800';
    case 'Submitted': return 'bg-blue-100 text-blue-800';
    case 'Returned': return 'bg-yellow-100 text-yellow-800';
    case 'Need More Info': return 'bg-orange-100 text-orange-800';
    case 'Ready for Bank': return 'bg-indigo-100 text-indigo-800';
    case 'Sent to Bank': return 'bg-purple-100 text-purple-800';
    case 'Complete': return 'bg-green-100 text-green-800';
    case 'Rejected': return 'bg-red-100 text-red-800';
    case 'Paid': return 'bg-emerald-100 text-emerald-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusDescription = (status: Status): string => {
  switch (status) {
    case 'Draft': return 'Application is being prepared';
    case 'Submitted': return 'Application submitted for review';
    case 'Returned': return 'Application returned for corrections';
    case 'Need More Info': return 'Additional information required';
    case 'Ready for Bank': return 'Manager reviewed and ready for admin approval';
    case 'Sent to Bank': return 'Application sent to bank for processing';
    case 'Complete': return 'Bank account successfully opened';
    case 'Rejected': return 'Application rejected';
    case 'Paid': return 'Payment received';
    default: return 'Unknown status';
  }
};

export const getNextRecommendedStatus = (currentStatus: Status, isAdmin: boolean, isManager: boolean): Status | null => {
  if (isManager || isAdmin) {
    switch (currentStatus) {
      case 'Draft': return 'Submitted';
      case 'Submitted': return 'Ready for Bank';
      case 'Ready for Bank': return isAdmin ? 'Sent to Bank' : null;
      case 'Sent to Bank': return isAdmin ? 'Complete' : null;
      case 'Complete': return isAdmin ? 'Paid' : null;
      default: return null;
    }
  }
  return null;
};
