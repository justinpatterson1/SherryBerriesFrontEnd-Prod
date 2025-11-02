import { useRouter } from 'next/router';

export default function AuthErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  const errorMessages = {
    CredentialsSignin: 'Invalid username or password.',
    AccessDenied: 'Access denied. Please try again.',
    Configuration: 'There was an error with the server configuration.',
    default: 'An unknown error occurred. Please try again.'
  };

  return (
    <div>
      <h1>Authentication Error</h1>
      <p>{errorMessages[error] || errorMessages.default}</p>
    </div>
  );
}
