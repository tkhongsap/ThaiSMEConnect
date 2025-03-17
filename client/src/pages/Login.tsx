import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { LoginUser, loginUserSchema } from '@shared/schema';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { signInWithGoogle, signInWithFacebook } from '@/lib/firebase';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginUser>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginUser) => {
      return await apiRequest('POST', '/api/auth/login', data);
    },
    onSuccess: () => {
      toast({
        title: t('login.successTitle'),
        description: t('login.successMessage'),
      });
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: t('login.errorTitle'),
        description: error.message || t('login.errorMessage'),
        variant: 'destructive',
      });
    },
  });
  
  // OAuth login mutation
  const oauthLoginMutation = useMutation({
    mutationFn: async (oauthData: any) => {
      return await apiRequest('POST', '/api/auth/oauth', oauthData);
    },
    onSuccess: () => {
      toast({
        title: t('login.successTitle'),
        description: t('login.oauthSuccessMessage'),
      });
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: t('login.errorTitle'),
        description: error.message || t('login.oauthErrorMessage'),
        variant: 'destructive',
      });
    },
  });
  
  // Test account login mutation
  const testLoginMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/auth/test-login', { username: 'test', password: 'test' });
    },
    onSuccess: () => {
      toast({
        title: t('login.successTitle'),
        description: t('login.testLoginSuccessMessage'),
      });
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: t('login.errorTitle'),
        description: error.message || t('login.testLoginErrorMessage'),
        variant: 'destructive',
      });
    },
  });

  async function onSubmit(data: LoginUser) {
    loginMutation.mutate(data);
  }
  
  // Handle Google sign-in
  async function handleGoogleSignIn() {
    try {
      const googleUser = await signInWithGoogle();
      oauthLoginMutation.mutate(googleUser);
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: t('login.errorTitle'),
        description: error instanceof Error 
          ? error.message 
          : t('login.googleSignInError'),
        variant: 'destructive',
      });
    }
  }
  
  // Handle Facebook sign-in
  async function handleFacebookSignIn() {
    try {
      const facebookUser = await signInWithFacebook();
      oauthLoginMutation.mutate(facebookUser);
    } catch (error) {
      console.error("Facebook sign-in error:", error);
      toast({
        title: t('login.errorTitle'),
        description: error instanceof Error 
          ? error.message 
          : t('login.facebookSignInError'),
        variant: 'destructive',
      });
    }
  }
  
  // Handle test account login
  function handleTestLogin() {
    testLoginMutation.mutate();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold text-gray-900">
            {t('login.title')}
          </CardTitle>
          <CardDescription className="text-center mt-2">
            {t('login.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('login.username')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('login.usernamePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('login.password')}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder={t('login.passwordPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link href="/forgot-password">
                    <a className="font-medium text-primary hover:text-blue-600">
                      {t('login.forgotPassword')}
                    </a>
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? t('common.loading') : t('login.submitButton')}
              </Button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t('login.orContinueWith')}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={oauthLoginMutation.isPending}
                >
                  <FaGoogle className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleFacebookSignIn}
                  disabled={oauthLoginMutation.isPending}
                >
                  <FaFacebook className="mr-2 h-4 w-4" />
                  Facebook
                </Button>
              </div>
              
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={handleTestLogin}
                    disabled={testLoginMutation.isPending}
                  >
                    Test Account Login
                  </Button>
                </div>
              )}
            </div>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            {t('login.noAccount')}{' '}
            <Link href="/register">
              <a className="font-medium text-primary hover:text-blue-600">
                {t('login.registerLink')}
              </a>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
