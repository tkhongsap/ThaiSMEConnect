import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentItem, User } from '@shared/schema';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ['/api/auth/me'],
  });

  const { data: contentItems, isLoading: isLoadingContent } = useQuery<ContentItem[]>({
    queryKey: ['/api/content/items'],
  });

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">{t('dashboard.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // If no user is found, redirect to login
    setLocation('/login');
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.welcome', { username: user.username })}</h1>
        <p className="mt-2 text-lg text-gray-600">
          {t('dashboard.yourSubdomain')}{' '}
          <a
            href={`https://${user.subdomain}.aicontentpro.com`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {user.subdomain}.aicontentpro.com
          </a>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>{t('dashboard.stats.content')}</CardTitle>
            <CardDescription>{t('dashboard.stats.contentDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-4xl font-bold text-primary">
              {isLoadingContent ? '...' : contentItems?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>{t('dashboard.stats.subscription')}</CardTitle>
            <CardDescription>{t('dashboard.stats.subscriptionDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl font-semibold text-green-600">
              {t('dashboard.stats.activePlan')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>{t('dashboard.stats.quota')}</CardTitle>
            <CardDescription>{t('dashboard.stats.quotaDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-4xl font-bold text-primary">
              50 <span className="text-lg text-gray-500">/ 50</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 flex justify-end">
        <Link href="/content-generator">
          <Button className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>{t('dashboard.createContent')}</span>
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="recent">
        <TabsList className="mb-4">
          <TabsTrigger value="recent">{t('dashboard.tabs.recent')}</TabsTrigger>
          <TabsTrigger value="favorites">{t('dashboard.tabs.favorites')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('dashboard.tabs.analytics')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent">
          {isLoadingContent ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">{t('dashboard.loadingContent')}</p>
            </div>
          ) : contentItems?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentItems.map(item => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg truncate">{item.title}</CardTitle>
                    <CardDescription className="flex justify-between">
                      <span>{item.contentType}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {item.content}
                    </p>
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button variant="outline" size="sm">
                        {t('dashboard.actions.edit')}
                      </Button>
                      <Button variant="outline" size="sm">
                        {t('dashboard.actions.view')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">{t('dashboard.noContent')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('dashboard.noContentMessage')}</p>
              <div className="mt-6">
                <Link href="/content-generator">
                  <Button>
                    {t('dashboard.createFirstContent')}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="favorites">
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">{t('dashboard.noFavorites')}</h3>
            <p className="mt-1 text-sm text-gray-500">{t('dashboard.noFavoritesMessage')}</p>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">{t('dashboard.analyticsTitle')}</h3>
            <p className="mt-1 text-sm text-gray-500">{t('dashboard.analyticsMessage')}</p>
            <div className="mt-6">
              <Button variant="outline">
                {t('dashboard.upgradeButton')}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
