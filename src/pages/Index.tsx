import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<Array<{code: string, article: string, title?: string, url: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    setAnswer('');
    setSources([]);
    
    try {
      const response = await fetch('https://functions.poehali.dev/34de8437-f9f6-4a45-a537-2b1cb7ea60ca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question.trim() }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAnswer(data.answer);
        setSources(data.sources || []);
      } else {
        setAnswer(`Ошибка: ${data.error || 'Не удалось получить ответ'}`);
      }
    } catch (error) {
      setAnswer('Ошибка соединения. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  const services = [
    {
      icon: 'Scale',
      title: 'Гражданское право',
      description: 'Ответы на вопросы по гражданским спорам, защите прав и интересов'
    },
    {
      icon: 'Briefcase',
      title: 'Корпоративное право',
      description: 'Юридические вопросы для бизнеса, договоры, регистрация компаний'
    },
    {
      icon: 'Home',
      title: 'Недвижимость',
      description: 'Консультации по сделкам с недвижимостью и оформлению документов'
    },
    {
      icon: 'Users',
      title: 'Семейное право',
      description: 'Вопросы о разводах, алиментах, разделе имущества, опеке'
    },
    {
      icon: 'FileText',
      title: 'Трудовое право',
      description: 'Помощь в защите трудовых прав, споры с работодателем'
    },
    {
      icon: 'ShieldCheck',
      title: 'Уголовное право',
      description: 'Консультации по уголовным делам и процессуальным вопросам'
    }
  ];

  const faqItems = [
    {
      question: 'Как работает ИИ "Мой юрист"?',
      answer: 'ИИ использует технологию RAG (Retrieval-Augmented Generation) - сначала находит релевантные статьи законов в базе данных, затем YandexGPT формирует ответ на основе этих конкретных статей. Все ответы основаны на реальных источниках российского законодательства с указанием конкретных номеров статей.'
    },
    {
      question: 'Бесплатно ли пользоваться сервисом?',
      answer: 'Да, ИИ-консультант полностью бесплатный. Вы можете задавать неограниченное количество юридических вопросов.'
    },
    {
      question: 'Как быстро я получу ответ?',
      answer: 'ИИ-помощник отвечает практически мгновенно — обычно это занимает 5-10 секунд.'
    },
    {
      question: 'Насколько точны ответы ИИ?',
      answer: 'Модель обучена на актуальном российском законодательстве и судебной практике. Однако для сложных случаев и важных решений рекомендуем также проконсультироваться с практикующим юристом.'
    },
    {
      question: 'Какие вопросы можно задавать?',
      answer: 'Любые вопросы, связанные с российским правом: гражданское, трудовое, семейное, уголовное, корпоративное право, недвижимость, налоги и другие области.'
    },
    {
      question: 'Заменяет ли ИИ реального юриста?',
      answer: 'ИИ дает первичную консультацию и помогает разобраться в ситуации, но не заменяет профессионального юриста в сложных делах, судебных процессах или официальном представительстве.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Scale" size={32} className="text-primary" />
            <span className="text-2xl font-bold text-primary">Мой юрист</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">Главная</a>
            <a href="#services" className="text-foreground hover:text-primary transition-colors">Направления</a>
            <a href="#faq" className="text-foreground hover:text-primary transition-colors">FAQ</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">О сервисе</a>
          </nav>
          <Button variant="default">Задать вопрос</Button>
        </div>
      </header>

      <section id="home" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                ИИ-помощник по российскому праву
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Получите мгновенные ответы на юридические вопросы от специализированного ИИ, 
                обученного на российском законодательстве
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="gap-2">
                  <Icon name="MessageSquare" size={20} />
                  Задать вопрос
                </Button>
                <Button size="lg" variant="outline">Узнать больше</Button>
              </div>
            </div>
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Sparkles" size={24} className="text-primary" />
                  Задайте юридический вопрос
                </CardTitle>
                <CardDescription>
                  ИИ проанализирует ситуацию и даст консультацию
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Опишите вашу юридическую ситуацию..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <Button 
                  onClick={handleAskQuestion} 
                  disabled={!question.trim() || isLoading}
                  className="w-full gap-2"
                >
                  {isLoading && <Icon name="Loader2" size={16} className="animate-spin" />}
                  {isLoading ? 'Анализирую законодательство...' : 'Получить консультацию'}
                </Button>
                {isLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Clock" size={14} />
                    <span>Это может занять 5-15 секунд...</span>
                  </div>
                )}
                {answer && (
                  <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-br from-muted/50 to-muted rounded-xl border animate-fade-in max-h-[500px] overflow-y-auto">
                      <div className="flex items-start gap-3">
                        <Icon name="Scale" size={24} className="text-primary mt-1 flex-shrink-0" />
                        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">{answer}</div>
                      </div>
                    </div>
                    
                    {sources.length > 0 && (
                      <div className="p-4 bg-accent/30 rounded-lg border border-accent">
                        <div className="flex items-center gap-2 mb-3">
                          <Icon name="BookOpen" size={18} className="text-primary" />
                          <h3 className="font-semibold text-sm">Источники:</h3>
                        </div>
                        <div className="space-y-2">
                          {sources.map((source, idx) => (
                            <a
                              key={idx}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-start gap-2 text-sm p-2 rounded hover:bg-accent/50 transition-colors group"
                            >
                              <Icon name="ExternalLink" size={14} className="mt-0.5 flex-shrink-0 text-muted-foreground group-hover:text-primary" />
                              <div>
                                <span className="font-medium">{source.code} Статья {source.article}</span>
                                {source.title && <span className="text-muted-foreground"> - {source.title}</span>}
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Направления консультаций</h2>
            <p className="text-xl text-muted-foreground">
              ИИ поможет разобраться в вопросах по всем отраслям права
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon name={service.icon} size={24} className="text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Частые вопросы</h2>
            <p className="text-xl text-muted-foreground">
              Всё, что нужно знать о работе с ИИ-помощником
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg px-6 border">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section id="about" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">О сервисе</h2>
          <p className="text-xl text-muted-foreground mb-8">
            "Мой юрист" — это специализированная модель YandexGPT, дообученная на российском законодательстве. 
            ИИ-помощник дает первичные юридические консультации, помогает разобраться в правовых вопросах 
            и понять свои права. Работает круглосуточно и абсолютно бесплатно.
          </p>
          <div className="flex flex-wrap gap-8 justify-center items-center pt-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Работает всегда</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">∞</div>
              <div className="text-muted-foreground">Вопросов без лимита</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Бесплатно</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Scale" size={28} className="text-primary" />
                <span className="text-xl font-bold">Мой юрист</span>
              </div>
              <p className="text-gray-400">
                ИИ-помощник для юридических консультаций на основе российского законодательства
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Навигация</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-white transition-colors">Главная</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Направления</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">О сервисе</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Контакты</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  <span>support@moy-lawyer.ru</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 Мой юрист. ИИ-помощник для юридических консультаций.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}