import { api } from '../api-client';

export function getSignUpHero() {
  return api.get('/api/sign-up?populate=*');
}

export function customRegister(payload) {
  return api.post('/api/new-auth/custom-register', payload);
}

export function forgotPassword(email) {
  return api.post('/api/auth/forgot-password', { email });
}

export function resetPassword(payload) {
  return api.post('/api/auth/reset-password', payload);
}

export function sendEmailConfirmation(payload) {
  return api.post('/api/auth/send-email-confirmation', payload);
}
