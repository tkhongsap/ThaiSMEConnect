import { useEffect } from 'react';
import { useLocation } from 'wouter';

const RegisterRedirect: React.FC = () => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to login page
    setLocation('/login');
  }, [setLocation]);

  return null; // No UI needed, just redirection
};

export default RegisterRedirect;