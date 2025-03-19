import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { LoginUser, loginUserSchema } from '@shared/schema';
import { Link } from 'wouter';
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
        { keyword: 'Line', name: 'LINE' },
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
            <Link href="/login" className="ml-1 text-blue-600 hover:text-blue-700 hover:underline">
              {t('login.createAccount')}
            </Link>
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
                  <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 hover:underline">
                    {t('login.forgotPassword')}
                  </Link>
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
                  <FaGoogle className="mr-2 h-5 w-5 text-[#4285F4]" />
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
                <Button
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50 justify-center"
                  onClick={() => {
                    toast({
                      title: "LINE Login",
                      description: "LINE login is not yet implemented",
                      variant: "destructive"
                    });
                  }}
                  disabled={oauthLoginMutation.isPending || inAppBrowserInfo.detected}
                >
                  <svg className="mr-2 h-5 w-5 text-[#06C755]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 10.6C22 5.9 17.5 2 12 2C6.5 2 2 5.9 2 10.6C2 14.9 5.6 18.5 10.4 19.5C10.8 19.6 11.4 19.8 11.5 20.1C11.6 20.4 11.5 21 11.5 21C11.5 21 11.4 21.6 11.3 21.8C11.2 22.1 10.9 22.7 12 22.1C13.1 21.5 17.8 18.5 20 16C21.5 14.3 22 12.6 22 10.6Z" />
                  </svg>
                  <span>Continue with LINE</span>
                </Button>
                <div className="text-center">
                  <Button 
                    variant="link" 
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    View more
                  </Button>
                </div>
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
