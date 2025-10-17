// API configuration for different environments
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  VERIFY: `${API_BASE_URL}/api/auth/verify`,
  
  // Payout Guard
  CHECK_REFUND_STATUS: `${API_BASE_URL}/api/check-refund-status`,
  SUBMIT_REVIEW: `${API_BASE_URL}/api/submit-review`,
  MY_REVIEWS: `${API_BASE_URL}/api/my-reviews`,
  
  // Payouts (Admin)
  PAYOUTS_PENDING: `${API_BASE_URL}/api/payouts/pending`,
  PAYOUTS_STATS: `${API_BASE_URL}/api/payouts/stats`,
  PAYOUTS_APPROVE: `${API_BASE_URL}/api/payouts/approve`,
  PAYOUTS_REJECT: `${API_BASE_URL}/api/payouts/reject`,
  PAYOUTS_BULK_APPROVE: `${API_BASE_URL}/api/payouts/bulk-approve`,
  
  // Operations (Admin)
  OPS_DASHBOARD: `${API_BASE_URL}/api/ops/dashboard`,
  OPS_FLAGGED_REVIEWS: `${API_BASE_URL}/api/ops/flagged-reviews`,
  OPS_FLAGGED_USERS: `${API_BASE_URL}/api/ops/flagged-users`,
  OPS_ELIGIBLE_USERS: `${API_BASE_URL}/api/ops/eligible-users`,
  OPS_FLAG_USER: `${API_BASE_URL}/api/ops/flag-user`,
  OPS_UNFLAG_USER: `${API_BASE_URL}/api/ops/unflag-user`,
};

// Axios configuration helper
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default API_BASE_URL;