import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    setAnswer('');
    
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question.trim() }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAnswer(data.answer);
      } else {
        setAnswer(`Ошибка: ${data.error || 'Не удалось получить ответ'}`);
      }
    } catch (error) {
      setAnswer('Ошибка соединения. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: 'MessageSquare',
      title: 'Мгновенные ответы',
      description: 'Получайте ответы на любые вопросы за считанные секунды'
    },
    {
      icon: 'Brain',
      title: 'Умный помощник',
      description: 'ИИ понимает контекст и дает точные рекомендации'
    },
    {
      icon: 'Clock',
      title: 'Доступно 24/7',
      description: 'Помощник работает круглосуточно без выходных'
    },
    {
      icon: 'Shield',
      title: 'Конфиденциально',
      description: 'Ваши данные надежно защищены и не передаются третьим лицам'
    },
    {
      icon: 'Zap',
      title: 'Быстро и эффективно',
      description: 'Экономьте время — получайте решения мгновенно'
    },
    {
      icon: 'Heart',
      title: 'Простота использования',
      description: 'Интуитивный интерфейс, понятный каждому'
    }
  ];

  const faqItems = [
    {
      question: 'Как работает ИИ-помощник?',
      answer: 'Наш ИИ-помощник использует современные технологии искусственного интеллекта для анализа вашего вопроса и предоставления точного ответа. Он обучен на большом объеме данных и постоянно совершенствуется.'
    },
    {
      question: 'Бесплатно ли пользоваться помощником?',
      answer: 'Да, базовые консультации полностью бесплатны. Вы можете задавать неограниченное количество вопросов.'
    },
    {
      question: 'Как быстро я получу ответ?',
      answer: 'ИИ-помощник отвечает практически мгновенно — обычно это занимает всего несколько секунд.'
    },
    {
      question: 'Насколько точны ответы?',
      answer: 'ИИ-помощник дает максимально точные ответы на основе имеющихся данных. Однако для важных решений мы рекомендуем дополнительно проконсультироваться со специалистом.'
    },
    {
      question: 'Какие вопросы можно задавать?',
      answer: 'Вы можете задавать любые вопросы — от повседневных советов до помощи в решении сложных задач. ИИ-помощник адаптируется под любую тему.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Sparkles" size={32} className="text-primary" />
            <span className="text-2xl font-bold text-primary">ИИ Помощник</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">Главная</a>
            <a href="#features" className="text-foreground hover:text-primary transition-colors">Возможности</a>
            <a href="#faq" className="text-foreground hover:text-primary transition-colors">FAQ</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">О сервисе</a>
          </nav>
          <Button variant="default">Начать общение</Button>
        </div>
      </header>

      <section id="home" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                Ваш личный ИИ-помощник
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Получайте мгновенные ответы на любые вопросы с помощью искусственного интеллекта. 
                Быстро, удобно и доступно 24/7
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
                  <Icon name="Bot" size={24} className="text-primary" />
                  Задайте ваш вопрос
                </CardTitle>
                <CardDescription>
                  ИИ-помощник готов помочь вам прямо сейчас
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Опишите ваш вопрос или ситуацию..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <Button 
                  onClick={handleAskQuestion} 
                  disabled={!question.trim() || isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Думаю...' : 'Получить ответ'}
                </Button>
                {answer && (
                  <div className="p-4 bg-muted rounded-lg animate-fade-in">
                    <div className="flex items-start gap-2">
                      <Icon name="Bot" size={20} className="text-primary mt-1" />
                      <p className="text-sm whitespace-pre-wrap">{answer}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Возможности помощника</h2>
            <p className="text-xl text-muted-foreground">
              Современные технологии ИИ для решения ваших задач
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon name={feature.icon} size={24} className="text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
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
              Ответы на популярные вопросы о сервисе
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
            Мы создали умного помощника на основе передовых технологий искусственного интеллекта, 
            чтобы сделать получение информации простым и удобным для каждого. 
            Наша миссия — помогать людям быстро находить ответы и решать повседневные задачи.
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
              <div className="text-4xl font-bold text-primary mb-2">&lt; 5 сек</div>
              <div className="text-muted-foreground">Скорость ответа</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Sparkles" size={28} className="text-primary" />
                <span className="text-xl font-bold">ИИ Помощник</span>
              </div>
              <p className="text-gray-400">
                Ваш надежный ИИ-помощник для решения любых вопросов
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Навигация</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-white transition-colors">Главная</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Возможности</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">О сервисе</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Контакты</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  <span>support@ai-assistant.ru</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  <span>+7 (800) 555-35-35</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 ИИ Помощник. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
