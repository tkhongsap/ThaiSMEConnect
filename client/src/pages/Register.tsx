import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { InsertUser, insertUserSchema } from '@shared/schema';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
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
import { z } from 'zod';

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      businessName: '',
      subdomain: '',
      preferredLanguage: 'th'
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: Omit<RegisterFormData, "confirmPassword">) => {
      return await apiRequest('POST', '/api/auth/register', data);
    },
    onSuccess: () => {
      toast({
        title: t('register.successTitle'),
        description: t('register.successMessage'),
      });
      setLocation('/login');
    },
    onError: (error: any) => {
      toast({
        title: t('register.errorTitle'),
        description: error.message || t('register.errorMessage'),
        variant: 'destructive',
      });
    },
  });

  async function onSubmit(data: RegisterFormData) {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  }

  const handleSubdomainGeneration = () => {
    const businessName = form.getValues('businessName');
    if (businessName) {
      // Generate subdomain from business name by removing spaces and special characters
      const subdomain = businessName
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '')
        .trim();
      
      form.setValue('subdomain', subdomain);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold text-gray-900">
            {t('register.title')}
          </CardTitle>
          <CardDescription className="text-center mt-2">
            {t('register.subtitle')}
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
                    <FormLabel>{t('register.username')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('register.usernamePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('register.email')}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t('register.emailPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('register.businessName')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('register.businessNamePlaceholder')} 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          // We don't auto-generate on every change to avoid annoying the user
                          // They can click the button when ready
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subdomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-between items-center">
                      <span>{t('register.subdomain')}</span>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleSubdomainGeneration}
                        disabled={!form.getValues('businessName')}
                      >
                        {t('register.generateSubdomain')}
                      </Button>
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input placeholder={t('register.subdomainPlaceholder')} {...field} />
                        <span className="ml-2 text-gray-500">.aicontentpro.com</span>
                      </div>
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
                    <FormLabel>{t('register.password')}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder={t('register.passwordPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('register.confirmPassword')}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder={t('register.confirmPasswordPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('register.preferredLanguage')}</FormLabel>
                    <FormControl>
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value="th"
                            checked={field.value === 'th'}
                            onChange={() => field.onChange('th')}
                            className="h-4 w-4 text-primary"
                          />
                          <span>{t('register.thai')}</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value="en"
                            checked={field.value === 'en'}
                            onChange={() => field.onChange('en')}
                            className="h-4 w-4 text-primary"
                          />
                          <span>{t('register.english')}</span>
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? t('common.loading') : t('register.submitButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            {t('register.haveAccount')}{' '}
            <Link href="/login">
              <a className="font-medium text-primary hover:text-blue-600">
                {t('register.loginLink')}
              </a>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
