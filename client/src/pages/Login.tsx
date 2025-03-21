import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { LoginUser, loginUserSchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { signInWithGoogle, signInWithFacebook, getExternalBrowserUrl } from '@/lib/firebase';
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
import { FaGoogle, FaFacebook, FaExternalLinkAlt, FaCopy } from 'react-icons/fa';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [inAppBrowserInfo, setInAppBrowserInfo] = useState<{ detected: boolean; browserName?: string }>({ detected: false });
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  
  // Check for in-app browser on component mount
  React.useEffect(() => {
    try {
      // We'll try to access the navigator user agent
      const userAgent = navigator.userAgent || '';
      
      // Common in-app browser indicators with friendly names
      const inAppBrowsers = [
        { keyword: 'FB_IAB', name: 'Facebook' },
        { keyword: 'FBAN', name: 'Facebook' },
        { keyword: 'FBAV', name: 'Facebook' },
        { keyword: 'Instagram', name: 'Instagram' },
        { keyword: 'KAKAOTALK', name: 'KakaoTalk' },
        { keyword: 'WhatsApp', name: 'WhatsApp' },
        { keyword: 'WeChat', name: 'WeChat' },
        { keyword: 'MicroMessenger', name: 'WeChat' }
      ];
      
      for (const browser of inAppBrowsers) {
        if (userAgent.includes(browser.keyword)) {
          setInAppBrowserInfo({ 
            detected: true, 
            browserName: browser.name 
          });
          break;
        }
      }
    } catch (e) {
      console.error("Error checking browser type:", e);
    }
  }, []);
  
  // Function to copy the URL to clipboard
  const copyUrlToClipboard = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setShowCopiedMessage(true);
      
      // Hide the "Copied!" message after 3 seconds
      setTimeout(() => {
        setShowCopiedMessage(false);
      }, 3000);
      
      toast({
        title: "URL Copied",
        description: "URL copied to clipboard. Open your browser and paste it there.",
      });
    } catch (e) {
      console.error("Failed to copy URL:", e);
      toast({
        title: "Copy Failed",
        description: "Please copy the URL manually from the address bar.",
        variant: "destructive"
      });
    }
  };

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
      
      // Handle specific Firebase errors
      let errorMessage = '';
      if (error instanceof Error) {
        if (error.message.includes('auth/configuration-not-found')) {
          errorMessage = 'Google sign-in is not properly configured in Firebase. Please contact the administrator.';
        } else {
          errorMessage = error.message;
        }
      } else {
        errorMessage = t('login.googleSignInError');
      }
      
      toast({
        title: t('login.errorTitle'),
        description: errorMessage,
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
      
      // Handle specific Firebase errors
      let errorMessage = '';
      if (error instanceof Error) {
        if (error.message.includes('auth/configuration-not-found')) {
          errorMessage = 'Facebook sign-in is not properly configured in Firebase. Please contact the administrator.';
        } else {
          errorMessage = error.message;
        }
      } else {
        errorMessage = t('login.facebookSignInError');
      }
      
      toast({
        title: t('login.errorTitle'),
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }
  
  // LINE login has been removed to simplify the MVP
  
  // Handle test account login
  function handleTestLogin() {
    testLoginMutation.mutate();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {t('login.title')}
          </CardTitle>
          <CardDescription className="flex items-center">
            <span>{t('login.newUser')}</span> 
            <span 
              onClick={() => setLocation('/register')} 
              className="ml-1 text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            >
              {t('login.createAccount')}
            </span>
          </CardDescription>
        </CardHeader>
        
        {/* In-app browser warning alert */}
        {inAppBrowserInfo.detected && (
          <div className="px-6 pb-2">
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTitle className="text-amber-800 flex items-center gap-2">
                <FaExternalLinkAlt className="h-4 w-4" /> 
                {inAppBrowserInfo.browserName} Browser Detected
              </AlertTitle>
              <AlertDescription className="text-amber-700">
                <p className="mb-3">
                  Social login (Google/Facebook) does not work in the {inAppBrowserInfo.browserName} browser 
                  due to security policies. Please use one of these options:
                </p>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full bg-white border-amber-300 text-amber-700 hover:bg-amber-50"
                    onClick={copyUrlToClipboard}
                  >
                    <FaCopy className="mr-2 h-4 w-4" />
                    {showCopiedMessage ? "Copied!" : "Copy URL to clipboard"}
                  </Button>
                  <p className="text-xs">
                    After copying, open Chrome or Safari and paste the URL.
                  </p>
                  <p className="text-xs">
                    Alternatively, you can use username/password login below which works in all browsers.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
            <Separator className="my-6" />
          </div>
        )}
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <FormLabel className="text-base">Email address</FormLabel>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormControl>
                        <Input 
                          placeholder={t('login.usernamePlaceholder')} 
                          {...field} 
                          className="h-11 text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>{t('login.password')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder={t('login.passwordPlaceholder')} 
                        {...field} 
                        className="h-11 text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span 
                    onClick={() => setLocation('/forgot-password')} 
                    className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    {t('login.forgotPassword')}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? t('common.loading') : "Continue"}
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

              <div className="mt-6 space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50 justify-center"
                  onClick={handleGoogleSignIn}
                  disabled={oauthLoginMutation.isPending || inAppBrowserInfo.detected}
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  <span>Continue with Google</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50 justify-center"
                  onClick={handleFacebookSignIn}
                  disabled={oauthLoginMutation.isPending || inAppBrowserInfo.detected}
                >
                  <FaFacebook className="mr-2 h-5 w-5 text-[#1877F2]" />
                  <span>Continue with Facebook</span>
                </Button>
                {/* LINE login button removed to simplify the MVP */}
                {/* "View more" button removed as we only have two providers now */}
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
            {t('login.signInInfo')}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
