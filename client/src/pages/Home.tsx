import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">{t('home.hero.title1')}</span>
                <span className="block text-primary">{t('home.hero.title2')}</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                {t('home.hero.description')}
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link href="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-blue-600 md:py-4 md:text-lg md:px-10">
                    {t('home.hero.startFree')}
                  </Link>
                  <a href="#demo" className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                    {t('home.hero.watchDemo')}
                  </a>
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  {t('home.hero.noCard')}
                </p>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <img 
                    className="w-full" 
                    src="/images/image-001.jpg" 
                    alt={t('home.hero.imageAlt')} 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button 
                      className="flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-75 text-primary hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      variant="ghost"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="sr-only">{t('home.hero.playDemo')}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
              {t('home.features.overline')}
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {t('home.features.title')}
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              {t('home.features.description')}
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="rounded-md bg-blue-50 p-3 inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {t('home.features.feature1.title')}
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  {t('home.features.feature1.description')}
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="rounded-md bg-green-50 p-3 inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {t('home.features.feature2.title')}
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  {t('home.features.feature2.description')}
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="rounded-md bg-indigo-50 p-3 inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {t('home.features.feature3.title')}
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  {t('home.features.feature3.description')}
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="rounded-md bg-red-50 p-3 inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {t('home.features.feature4.title')}
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  {t('home.features.feature4.description')}
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="rounded-md bg-yellow-50 p-3 inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {t('home.features.feature5.title')}
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  {t('home.features.feature5.description')}
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="rounded-md bg-purple-50 p-3 inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {t('home.features.feature6.title')}
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  {t('home.features.feature6.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
              {t('home.howItWorks.overline')}
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {t('home.howItWorks.title')}
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              {t('home.howItWorks.description')}
            </p>
          </div>

          <div className="mt-16">
            <div className="relative">
              <div className="hidden md:block absolute top-1/2 w-full border-t-2 border-gray-200 -translate-y-1/2"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="relative">
                  <div className="flex flex-col items-center">
                    <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white text-2xl font-bold z-10 border-4 border-white shadow-md">1</div>
                    <div className="mt-6 text-center bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-medium text-gray-900">
                        {t('home.howItWorks.step1.title')}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500">
                        {t('home.howItWorks.step1.description')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="flex flex-col items-center">
                    <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white text-2xl font-bold z-10 border-4 border-white shadow-md">2</div>
                    <div className="mt-6 text-center bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-medium text-gray-900">
                        {t('home.howItWorks.step2.title')}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500">
                        {t('home.howItWorks.step2.description')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="flex flex-col items-center">
                    <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white text-2xl font-bold z-10 border-4 border-white shadow-md">3</div>
                    <div className="mt-6 text-center bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-medium text-gray-900">
                        {t('home.howItWorks.step3.title')}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500">
                        {t('home.howItWorks.step3.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                {t('home.demo.title')}
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                {t('home.demo.description')}
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {t('home.demo.feature1.title')}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {t('home.demo.feature1.description')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {t('home.demo.feature2.title')}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {t('home.demo.feature2.description')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {t('home.demo.feature3.title')}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {t('home.demo.feature3.description')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/login" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  {t('home.demo.cta')}
                </Link>
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0 lg:col-span-7">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Mockup UI for AI Content Generator */}
                <div className="bg-gray-800 p-4 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="ml-4 text-white text-sm">
                    {t('home.demo.toolTitle')}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900">
                        {t('home.demo.optionsTitle')}
                      </h4>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {t('home.demo.contentType')}
                          </label>
                          <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                            <option>{t('home.demo.contentTypeOption')}</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {t('home.demo.business')}
                          </label>
                          <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                            <option>{t('home.demo.businessOption')}</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {t('home.demo.tone')}
                          </label>
                          <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                            <option>{t('home.demo.toneOption')}</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {t('home.demo.length')}
                          </label>
                          <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                            <option>{t('home.demo.lengthOption')}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <div className="bg-white p-4 border border-gray-200 rounded-lg h-full">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700">
                            {t('home.demo.details')}
                          </label>
                          <textarea rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" placeholder={t('home.demo.detailsPlaceholder')}></textarea>
                        </div>
                        
                        <Button className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                          </svg>
                          {t('home.demo.generateButton')}
                        </Button>
                        
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-700">
                            {t('home.demo.result')}
                          </h4>
                          <div className="mt-2 text-sm text-gray-800">
                            <p>✨ {t('home.demo.sampleContent1')}</p>
                            <p>🎉 {t('home.demo.sampleContent2')}</p>
                            <p>🍽️ {t('home.demo.sampleContent3')}</p>
                            <p>📍 {t('home.demo.sampleContent4')}</p>
                            <p>{t('home.demo.sampleContent5')}</p>
                          </div>
                          
                          <div className="mt-4 flex space-x-2">
                            <Button variant="outline" size="sm" className="px-3 py-1 text-xs">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              {t('home.demo.regenerateButton')}
                            </Button>
                            <Button variant="outline" size="sm" className="px-3 py-1 text-xs">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              {t('home.demo.editButton')}
                            </Button>
                            <Button variant="outline" size="sm" className="px-3 py-1 text-xs">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              {t('home.demo.copyButton')}
                            </Button>
                            <Button variant="outline" size="sm" className="px-3 py-1 text-xs">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              {t('home.demo.downloadButton')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
              {t('home.pricing.overline')}
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {t('home.pricing.title')}
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              {t('home.pricing.description')}
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-8">
            {/* Starter Plan */}
            <div className="border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('home.pricing.starter.title')}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {t('home.pricing.starter.subtitle')}
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">{t('home.pricing.starter.price')}</span>
                  <span className="text-base font-medium text-gray-500">/mo</span>
                </p>
                <div className="mt-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      {t('home.pricing.starter.feature1')}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      {t('home.pricing.starter.feature2')}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      {t('home.pricing.starter.feature3')}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      {t('home.pricing.starter.feature4')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50">
                <Button 
                  variant="outline" 
                  className="block w-full text-center px-4 py-2 border border-primary text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {t('home.pricing.getStarted')}
                </Button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="border border-primary rounded-lg shadow-lg bg-white overflow-hidden transform scale-105">
              <div className="p-1 bg-primary">
                <p className="text-center text-xs font-medium text-white uppercase tracking-wide">
                  {t('home.pricing.recommended')}
                </p>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('home.pricing.pro.title')}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {t('home.pricing.pro.subtitle')}
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">{t('home.pricing.pro.price')}</span>
                  <span className="text-base font-medium text-gray-500">/mo</span>
                </p>
                <div className="mt-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      {t('home.pricing.pro.feature1')}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      {t('home.pricing.pro.feature2')}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      {t('home.pricing.pro.feature3')}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      {t('home.pricing.pro.feature4')}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      {t('home.pricing.pro.feature5')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50">
                <Button 
                  className="block w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {t('home.pricing.getStarted')}
                </Button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('home.pricing.enterprise.title')}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {t('home.pricing.enterprise.subtitle')}
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">{t('home.pricing.enterprise.price')}</span>
                  <span className="text-base font-medium text-gray-500">/mo</span>
                </p>
                <div className="mt-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      {t('home.pricing.enterprise.feature1')}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      {t('home.pricing.enterprise.feature2')}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      {t('home.pricing.enterprise.feature3')}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      {t('home.pricing.enterprise.feature4')}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      {t('home.pricing.enterprise.feature5')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50">
                <Button 
                  variant="outline" 
                  className="block w-full text-center px-4 py-2 border border-primary text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {t('home.pricing.contactSales')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                {t('home.cta.title')}
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-blue-100">
                {t('home.cta.description')}
              </p>
              <div className="mt-8 flex space-x-4">
                <a href="#" className="bg-white text-primary hover:bg-blue-50 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md shadow-sm">
                  {t('home.cta.startFree')}
                </a>
                <a href="#" className="text-white hover:text-blue-100 inline-flex items-center justify-center px-5 py-3 border border-white border-opacity-40 text-base font-medium rounded-md">
                  {t('home.cta.seeMore')}
                  <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 flex justify-center">
              <Card className="bg-white p-5 rounded-lg shadow-lg max-w-md">
                <CardContent className="p-0">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t('home.cta.signupTitle')}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {t('home.cta.signupDescription')}
                  </p>
                  <form className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('home.cta.email')}
                      </label>
                      <input type="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('home.cta.businessName')}
                      </label>
                      <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div>
                      <Button 
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        {t('home.cta.signupButton')}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
