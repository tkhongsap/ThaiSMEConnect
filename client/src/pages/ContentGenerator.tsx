import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ContentGeneration, contentGenerationSchema } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Wand2, RotateCcw, Edit, Copy, Download } from 'lucide-react';

const ContentGenerator: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [contentTitle, setContentTitle] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const form = useForm<ContentGeneration>({
    resolver: zodResolver(contentGenerationSchema),
    defaultValues: {
      contentType: 'social',
      businessType: 'restaurant',
      tone: 'friendly',
      length: 'short',
      details: '',
      language: i18n.language || 'th',
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: ContentGeneration) => {
      setIsGenerating(true);
      const response = await apiRequest('POST', '/api/content/generate', data);
      const result = await response.json();
      setIsGenerating(false);
      return result;
    },
    onSuccess: (data) => {
      setGeneratedContent(data.content);
      setContentTitle(data.title || getDefaultTitle());
      toast({
        title: t('contentGenerator.successTitle'),
        description: t('contentGenerator.successMessage'),
      });
    },
    onError: (error: any) => {
      setIsGenerating(false);
      toast({
        title: t('contentGenerator.errorTitle'),
        description: error.message || t('contentGenerator.errorMessage'),
        variant: 'destructive',
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!generatedContent) return;
      
      const data = {
        title: contentTitle,
        contentType: form.getValues('contentType'),
        content: generatedContent,
        prompt: form.getValues('details'),
        language: form.getValues('language'),
      };
      
      return await apiRequest('POST', '/api/content/save', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content/items'] });
      toast({
        title: t('contentGenerator.saveSuccessTitle'),
        description: t('contentGenerator.saveSuccessMessage'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('contentGenerator.saveErrorTitle'),
        description: error.message || t('contentGenerator.saveErrorMessage'),
        variant: 'destructive',
      });
    }
  });

  const handleGenerate = (data: ContentGeneration) => {
    setGeneratedContent('');
    generateMutation.mutate(data);
  };

  const handleRegenerate = () => {
    generateMutation.mutate(form.getValues());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: t('contentGenerator.copiedTitle'),
      description: t('contentGenerator.copiedMessage'),
    });
  };

  const handleSave = () => {
    saveMutation.mutate();
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${contentTitle.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getDefaultTitle = () => {
    const contentType = form.getValues('contentType');
    const businessType = form.getValues('businessType');
    return `${t(`contentGenerator.contentTypes.${contentType}`)} - ${t(`contentGenerator.businessTypes.${businessType}`)}`;
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('contentGenerator.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{t('contentGenerator.optionsTitle')}</CardTitle>
            <CardDescription>{t('contentGenerator.optionsDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contentGenerator.contentType')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('contentGenerator.selectContentType')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="social">{t('contentGenerator.contentTypes.social')}</SelectItem>
                          <SelectItem value="ad">{t('contentGenerator.contentTypes.ad')}</SelectItem>
                          <SelectItem value="email">{t('contentGenerator.contentTypes.email')}</SelectItem>
                          <SelectItem value="blog">{t('contentGenerator.contentTypes.blog')}</SelectItem>
                          <SelectItem value="promo">{t('contentGenerator.contentTypes.promo')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contentGenerator.businessType')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('contentGenerator.selectBusinessType')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="restaurant">{t('contentGenerator.businessTypes.restaurant')}</SelectItem>
                          <SelectItem value="retail">{t('contentGenerator.businessTypes.retail')}</SelectItem>
                          <SelectItem value="salon">{t('contentGenerator.businessTypes.salon')}</SelectItem>
                          <SelectItem value="cafe">{t('contentGenerator.businessTypes.cafe')}</SelectItem>
                          <SelectItem value="hotel">{t('contentGenerator.businessTypes.hotel')}</SelectItem>
                          <SelectItem value="fitness">{t('contentGenerator.businessTypes.fitness')}</SelectItem>
                          <SelectItem value="tech">{t('contentGenerator.businessTypes.tech')}</SelectItem>
                          <SelectItem value="other">{t('contentGenerator.businessTypes.other')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contentGenerator.tone')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('contentGenerator.selectTone')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="friendly">{t('contentGenerator.tones.friendly')}</SelectItem>
                          <SelectItem value="professional">{t('contentGenerator.tones.professional')}</SelectItem>
                          <SelectItem value="casual">{t('contentGenerator.tones.casual')}</SelectItem>
                          <SelectItem value="formal">{t('contentGenerator.tones.formal')}</SelectItem>
                          <SelectItem value="enthusiastic">{t('contentGenerator.tones.enthusiastic')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contentGenerator.length')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('contentGenerator.selectLength')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="short">{t('contentGenerator.lengths.short')}</SelectItem>
                          <SelectItem value="medium">{t('contentGenerator.lengths.medium')}</SelectItem>
                          <SelectItem value="long">{t('contentGenerator.lengths.long')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contentGenerator.language')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('contentGenerator.selectLanguage')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="th">{t('contentGenerator.languages.thai')}</SelectItem>
                          <SelectItem value="en">{t('contentGenerator.languages.english')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contentGenerator.details')}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={t('contentGenerator.detailsPlaceholder')} 
                          className="resize-none" 
                          rows={5} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('contentGenerator.generating')}
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      {t('contentGenerator.generateButton')}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t('contentGenerator.resultTitle')}</CardTitle>
            <CardDescription>{t('contentGenerator.resultDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            {generatedContent ? (
              <>
                <div className="mb-4">
                  <FormLabel htmlFor="contentTitle">{t('contentGenerator.contentTitle')}</FormLabel>
                  <Input 
                    id="contentTitle"
                    value={contentTitle}
                    onChange={(e) => setContentTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg mb-4">
                  <div className="whitespace-pre-line text-sm text-gray-800">
                    {generatedContent}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={isGenerating}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    {t('contentGenerator.regenerateButton')}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-1" />
                    {t('contentGenerator.copyButton')}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-1" />
                    {t('contentGenerator.downloadButton')}
                  </Button>
                  <Button variant="default" size="sm" onClick={handleSave} disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Edit className="h-4 w-4 mr-1" />
                    )}
                    {t('contentGenerator.saveButton')}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-24 bg-gray-50 rounded-lg">
                {isGenerating ? (
                  <>
                    <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      {t('contentGenerator.generatingContent')}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {t('contentGenerator.generatingDescription')}
                    </p>
                  </>
                ) : (
                  <>
                    <Wand2 className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      {t('contentGenerator.noContent')}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {t('contentGenerator.noContentDescription')}
                    </p>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="examples">
          <TabsList className="mb-4">
            <TabsTrigger value="examples">{t('contentGenerator.tabs.examples')}</TabsTrigger>
            <TabsTrigger value="tips">{t('contentGenerator.tabs.tips')}</TabsTrigger>
            <TabsTrigger value="help">{t('contentGenerator.tabs.help')}</TabsTrigger>
          </TabsList>

          <TabsContent value="examples">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{t(`contentGenerator.examples.${i}.title`)}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm whitespace-pre-line">
                    {t(`contentGenerator.examples.${i}.content`)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tips">
            <Card>
              <CardHeader>
                <CardTitle>{t('contentGenerator.tips.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc pl-5">
                  <li>{t('contentGenerator.tips.tip1')}</li>
                  <li>{t('contentGenerator.tips.tip2')}</li>
                  <li>{t('contentGenerator.tips.tip3')}</li>
                  <li>{t('contentGenerator.tips.tip4')}</li>
                  <li>{t('contentGenerator.tips.tip5')}</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="help">
            <Card>
              <CardHeader>
                <CardTitle>{t('contentGenerator.help.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">{t('contentGenerator.help.question1')}</h3>
                    <p className="text-gray-600 mt-1">{t('contentGenerator.help.answer1')}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">{t('contentGenerator.help.question2')}</h3>
                    <p className="text-gray-600 mt-1">{t('contentGenerator.help.answer2')}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">{t('contentGenerator.help.question3')}</h3>
                    <p className="text-gray-600 mt-1">{t('contentGenerator.help.answer3')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContentGenerator;
