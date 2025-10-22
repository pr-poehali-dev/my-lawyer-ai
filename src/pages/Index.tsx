import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAskQuestion = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAnswer('Спасибо за ваш вопрос! Это демо-версия AI-консультанта. В полной версии здесь будет профессиональная юридическая консультация на основе российского законодательства.');
      setIsLoading(false);
    }, 1500);
  };

  const services = [
    {
      icon: 'Scale',
      title: 'Гражданское право',
      description: 'Консультации по гражданским спорам, защита ваших прав и интересов'
    },
    {
      icon: 'Briefcase',
      title: 'Корпоративное право',
      description: 'Юридическое сопровождение бизнеса, договоры, регистрация компаний'
    },
    {
      icon: 'Home',
      title: 'Недвижимость',
      description: 'Сделки с недвижимостью, оформление документов, споры'
    },
    {
      icon: 'Users',
      title: 'Семейное право',
      description: 'Разводы, алименты, раздел имущества, опека'
    },
    {
      icon: 'FileText',
      title: 'Трудовое право',
      description: 'Защита трудовых прав, споры с работодателем, контракты'
    },
    {
      icon: 'ShieldCheck',
      title: 'Уголовное право',
      description: 'Защита в уголовных делах, представительство в суде'
    }
  ];

  const faqItems = [
    {
      question: 'Как работает AI-консультант?',
      answer: 'Наш AI-консультант обучен на базе российского законодательства и дает первичные консультации по юридическим вопросам. Для сложных случаев мы рекомендуем личную консультацию с юристом.'
    },
    {
      question: 'Сколько стоит консультация?',
      answer: 'AI-консультант предоставляет бесплатные базовые ответы. Профессиональная консультация с юристом стоит от 3000 рублей в зависимости от сложности вопроса.'
    },
    {
      question: 'Как быстро я получу ответ?',
      answer: 'AI-консультант отвечает мгновенно. Для записи на личную консультацию с юристом обычно требуется 1-2 рабочих дня.'
    },
    {
      question: 'Какие гарантии вы предоставляете?',
      answer: 'Мы гарантируем конфиденциальность, профессионализм и соблюдение адвокатской этики. Все консультации проводятся опытными юристами с практикой от 5 лет.'
    },
    {
      question: 'Можно ли получить консультацию онлайн?',
      answer: 'Да, мы проводим консультации онлайн через видеосвязь, телефон или в чате. Также возможны личные встречи в офисе.'
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
            <a href="#services" className="text-foreground hover:text-primary transition-colors">Услуги</a>
            <a href="#faq" className="text-foreground hover:text-primary transition-colors">FAQ</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">О компании</a>
            <a href="#contacts" className="text-foreground hover:text-primary transition-colors">Контакты</a>
          </nav>
          <Button variant="default">Консультация</Button>
        </div>
      </header>

      <section id="home" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                AI-консультант по российскому законодательству
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Получите мгновенные ответы на юридические вопросы от искусственного интеллекта, 
                обученного на базе российского законодательства
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
                  Задайте ваш вопрос
                </CardTitle>
                <CardDescription>
                  AI-консультант ответит на основе российского законодательства
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
                  className="w-full"
                >
                  {isLoading ? 'Анализирую...' : 'Получить консультацию'}
                </Button>
                {answer && (
                  <div className="p-4 bg-muted rounded-lg animate-fade-in">
                    <div className="flex items-start gap-2">
                      <Icon name="Bot" size={20} className="text-primary mt-1" />
                      <p className="text-sm">{answer}</p>
                    </div>
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
            <h2 className="text-4xl font-bold text-foreground mb-4">Юридические услуги</h2>
            <p className="text-xl text-muted-foreground">
              Профессиональная помощь по всем направлениям права
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
              Ответы на популярные вопросы о наших услугах
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">{item.question}</span>
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
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-foreground mb-4">О компании</h2>
          </div>
          <div className="prose prose-lg mx-auto text-muted-foreground">
            <p className="text-center text-lg">
              «Мой юрист» — это инновационная юридическая компания, которая объединяет 
              традиционный профессионализм с современными технологиями искусственного интеллекта. 
              Наша команда опытных юристов использует AI для предоставления быстрых и точных 
              консультаций по российскому законодательству.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12 not-prose">
              <Card>
                <CardHeader className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">15+</div>
                  <CardTitle>Лет опыта</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">5000+</div>
                  <CardTitle>Довольных клиентов</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">98%</div>
                  <CardTitle>Выигранных дел</CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="contacts" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-primary/5">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Контакты</h2>
            <p className="text-xl text-muted-foreground">
              Свяжитесь с нами для получения консультации
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Наши контакты</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Icon name="Phone" size={20} className="text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Телефон</p>
                    <p className="text-muted-foreground">+7 (495) 123-45-67</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Mail" size={20} className="text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-muted-foreground">info@moi-yurist.ru</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="MapPin" size={20} className="text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Адрес</p>
                    <p className="text-muted-foreground">Москва, ул. Тверская, д. 1</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Напишите нам</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Ваше имя" />
                <Input type="email" placeholder="Email" />
                <Textarea placeholder="Сообщение" rows={4} />
                <Button className="w-full">Отправить</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground py-8 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon name="Scale" size={28} />
            <span className="text-xl font-bold">Мой юрист</span>
          </div>
          <p className="text-sm opacity-90">© 2024 Мой юрист. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
