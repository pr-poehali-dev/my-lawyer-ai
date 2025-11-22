import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Icon from "@/components/ui/icon";

export default function Index() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<
    Array<{ code: string; article: string; title?: string; url: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [history, setHistory] = useState<Array<{question: string; answer: string; timestamp: number}>>([]);

  const templates = [
    {
      title: "Развод и расторжение брака",
      icon: "Users",
      template: `Ситуация: [развод через ЗАГС/суд]

Состояние брака: [женаты, дата регистрации]
Наличие детей: [количество, возраст несовершеннолетних]
Согласие супруга: [есть/нет]

Вопросы для решения:
- [раздел имущества/алименты/с кем останутся дети]
- [другие спорные моменты]

Документы: [свидетельство о браке/рождении детей]

Что хочу узнать: [порядок развода/документы/сроки]`
    },
    {
      title: "Алименты и содержание",
      icon: "Heart",
      template: `Ситуация: [взыскание алиментов/изменение размера]

На кого алименты: [ребенок/супруг/родитель]
Возраст: [если ребенок]
Занятость плательщика: [работает официально/неофициально/не работает]

Текущая ситуация:
- [платит или нет, какую сумму]
- [есть ли задолженность]

Доходы плательщика: [известны/неизвестны]

Вопрос: [как взыскать/увеличить/уменьшить]`
    },
    {
      title: "Раздел имущества супругов",
      icon: "Home",
      template: `Состояние брака: [в браке/разведены/разводимся]

Имущество для раздела:
- Недвижимость: [квартира/дом/дача]
- Транспорт: [автомобиль, другое]
- Финансы: [вклады/долги]
- Другое: [укажите]

Когда приобретено: [в браке/до брака]
На кого оформлено: [муж/жена]
Есть ли брачный договор: [да/нет]

Вопрос: [как делится имущество/доли]`
    },
    {
      title: "Определение места жительства ребенка",
      icon: "Baby",
      template: `Дети: [количество, возраст каждого]

Текущая ситуация:
- С кем живут сейчас: [мать/отец/другие]
- Кто заботится: [кто занимается воспитанием]

Условия проживания:
- У матери: [жилье, доход, график работы]
- У отца: [жилье, доход, график работы]

Мнение ребенка: [если старше 10 лет]

Вопрос: [порядок определения/права второго родителя]`
    },
    {
      title: "Лишение родительских прав",
      icon: "ShieldAlert",
      template: `Ребенок: [возраст]
Отношение: [мать/отец]

Основания для лишения:
- [уклонение от обязанностей]
- [злоупотребление правами]
- [жестокое обращение]
- [алкоголизм/наркомания]
- [другое]

Доказательства:
- [документы/свидетели/заключения]

Вопрос: [процедура/последствия/как восстановить]`
    },
    {
      title: "Пенсии и пособия",
      icon: "Wallet",
      template: `Вид выплаты: [пенсия/пособие/компенсация]

Ситуация:
- Возраст: [ваш возраст]
- Стаж: [трудовой/страховой]
- Основание: [по возрасту/инвалидность/потеря кормильца]

Проблема:
- [отказали в назначении]
- [маленький размер выплаты]
- [задержка выплаты]
- [перерасчет]

Документы: [какие есть]

Вопрос: [как получить/увеличить/оспорить отказ]`
    },
    {
      title: "Льготы и социальная поддержка",
      icon: "Gift",
      template: `Категория: [пенсионер/инвалид/многодетная семья/другое]

Текущие льготы: [какие получаете]

Вопрос о льготах:
- [какие положены]
- [как оформить]
- [почему отказали]

Документы: [какие есть]
Регион: [ваш регион]

Что нужно узнать: [конкретный вопрос]`
    },
    {
      title: "Материнский капитал",
      icon: "BadgeDollarSign",
      template: `Дети: [количество, год рождения]

Сертификат: [получен/не получен]
Остаток средств: [если известно]

Цель использования:
- [улучшение жилищных условий]
- [образование детей]
- [пенсия матери]
- [другое]

Вопрос: [как получить/использовать/на что можно потратить]`
    }
  ];

  const useTemplate = (template: string) => {
    setQuestion(template);
    setShowTemplates(false);
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer("");
    setSources([]);

    try {
      const response = await fetch(
        "https://functions.poehali.dev/34de8437-f9f6-4a45-a537-2b1cb7ea60ca",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: question.trim() }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setAnswer(data.answer);
        setSources(data.sources || []);
        
        const newHistory = [
          { question: question.trim(), answer: data.answer, timestamp: Date.now() },
          ...history.slice(0, 9)
        ];
        setHistory(newHistory);
        localStorage.setItem('legal_history', JSON.stringify(newHistory));
      } else {
        setAnswer(`Ошибка: ${data.error || "Не удалось получить ответ"}`);
      }
    } catch (error) {
      setAnswer("Ошибка соединения. Пожалуйста, попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  const services = [
    {
      icon: "Users",
      title: "Развод и раздел имущества",
      description:
        "Консультации по расторжению брака, разделу совместно нажитого имущества, долгов",
    },
    {
      icon: "Heart",
      title: "Алименты и содержание",
      description:
        "Взыскание алиментов на детей, родителей, изменение размера выплат, задолженность",
    },
    {
      icon: "Baby",
      title: "Права и интересы детей",
      description: "Определение места жительства ребенка, порядок общения, усыновление",
    },
    {
      icon: "ShieldAlert",
      title: "Родительские права",
      description: "Лишение и ограничение родительских прав, восстановление в правах",
    },
    {
      icon: "Wallet",
      title: "Пенсии и выплаты",
      description: "Назначение пенсий, перерасчет, оспаривание отказов ПФР и СФР",
    },
    {
      icon: "Gift",
      title: "Льготы и господдержка",
      description: "Социальные льготы, материнский капитал, пособия, компенсации",
    },
  ];

  const faqItems = [
    {
      question: 'Как работает ИИ "Семейный юрист"?',
      answer:
        "ИИ использует технологию RAG - находит нужные статьи Семейного кодекса РФ, законов о пенсиях, пособиях, постановлений Пленума Верховного Суда, затем формирует понятный ответ с указанием конкретных норм.",
    },
    {
      question: "Какие вопросы можно задавать?",
      answer:
        "Вопросы по семейному праву (развод, алименты, раздел имущества, права на детей, опека) и социальному обеспечению (пенсии, льготы, пособия, материнский капитал).",
    },
    {
      question: "Бесплатно ли пользоваться?",
      answer:
        "Да, сервис полностью бесплатный. Можно задавать неограниченное количество вопросов, работает 24/7.",
    },
    {
      question: "Насколько точны ответы?",
      answer:
        "Ответы основаны на актуальном Семейном кодексе РФ и законах о соцобеспечении. Для судебных дел и сложных случаев рекомендуем консультацию с практикующим юристом.",
    },
    {
      question: "Заменяет ли ИИ юриста?",
      answer:
        "Нет. ИИ помогает разобраться в ситуации и понять свои права, но не заменяет профессионального юриста в суде или для представительства интересов.",
    },
    {
      question: "Как быстро приходит ответ?",
      answer:
        "Обычно 5-15 секунд. ИИ анализирует вопрос, ищет нужные статьи и формирует понятный ответ практически мгновенно.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Scale" size={38} className="text-primary" />
<span className="text-2xl font-bold text-primary">Семейный юрист</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#home"
              className="text-foreground hover:text-primary transition-colors"
            >
              Главная
            </a>
            <a
              href="#services"
              className="text-foreground hover:text-primary transition-colors"
            >
              Направления
            </a>
            <a
              href="/lawyers"
              className="text-foreground hover:text-primary transition-colors"
            >
              Юристы
            </a>
            <a
              href="#faq"
              className="text-foreground hover:text-primary transition-colors"
            >
              FAQ
            </a>
            <a
              href="#about"
              className="text-foreground hover:text-primary transition-colors"
            >
              О сервисе
            </a>
          </nav>
          <Button variant="default">Задать вопрос</Button>
        </div>
      </header>

      <section id="home" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                Семейный юрист и
                <span className="text-primary"> социальное обеспечение</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Бесплатные консультации по семейным спорам, алиментам, пенсиям и льготам
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="gap-2">
                  <Icon name="MessageSquare" size={20} />
                  Задать вопрос
                </Button>
                <Button size="lg" variant="outline">
                  Узнать больше
                </Button>
              </div>
            </div>
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Sparkles" size={24} className="text-primary" />
                  ИИ-консультант по семейному праву
                </CardTitle>
                <CardDescription>
                  Помощь в решении семейных споров и вопросов социального обеспечения
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="gap-2"
                  >
                    <Icon name="FileText" size={16} />
                    {showTemplates ? "Скрыть шаблоны" : "Использовать шаблон"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="gap-2"
                  >
                    <Icon name={isFullScreen ? "Minimize2" : "Maximize2"} size={16} />
                    {isFullScreen ? "Свернуть" : "Развернуть"}
                  </Button>
                </div>

                {showTemplates && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 animate-fade-in">
                    {templates.map((tmpl, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() => useTemplate(tmpl.template)}
                        className="justify-start gap-2 h-auto py-3 px-3 hover:bg-primary/10 hover:border-primary/40 transition-all"
                      >
                        <Icon name={tmpl.icon as any} size={18} className="flex-shrink-0 text-primary" />
                        <span className="text-xs font-medium text-left">{tmpl.title}</span>
                      </Button>
                    ))}
                  </div>
                )}

                <Textarea
                  placeholder="Опишите вашу юридическую ситуацию или выберите шаблон выше..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={6}
                  className={`resize-none transition-all ${
                    isFullScreen ? "min-h-[400px]" : "min-h-[150px]"
                  }`}
                />
                <Button
                  onClick={handleAskQuestion}
                  disabled={!question.trim() || isLoading}
                  className="w-full gap-2"
                >
                  {isLoading && (
                    <Icon name="Loader2" size={16} className="animate-spin" />
                  )}
                  {isLoading
                    ? "Анализирую законодательство..."
                    : "Получить консультацию"}
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
                        <Icon
                          name="Scale"
                          size={24}
                          className="text-primary mt-1 flex-shrink-0"
                        />
                        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {answer}
                        </div>
                      </div>
                    </div>

                    {sources.length > 0 && (
                      <div className="p-4 bg-accent/30 rounded-lg border border-accent">
                        <div className="flex items-center gap-2 mb-3">
                          <Icon
                            name="BookOpen"
                            size={18}
                            className="text-primary"
                          />
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
                              <Icon
                                name="ExternalLink"
                                size={14}
                                className="mt-0.5 flex-shrink-0 text-muted-foreground group-hover:text-primary"
                              />
                              <div>
                                <span className="font-medium">
                                  {source.code} Статья {source.article}
                                </span>
                                {source.title && (
                                  <span className="text-muted-foreground">
                                    {" "}
                                    - {source.title}
                                  </span>
                                )}
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
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Специализация
            </h2>
            <p className="text-xl text-muted-foreground">
              Экспертная помощь в семейных делах и социальном обеспечении
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon
                      name={service.icon}
                      size={24}
                      className="text-primary"
                    />
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
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Частые вопросы
            </h2>
            <p className="text-xl text-muted-foreground">
              Ответы на популярные вопросы о сервисе
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-lg px-6 border"
              >
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
            "Семейный юрист" — специализированный ИИ-консультант по семейному праву и социальному обеспечению.
            Поможем разобраться в разводе, алиментах, разделе имущества, правах на детей, пенсиях и льготах.
            Работает 24/7 бесплатно.
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
                <Icon name="Scale" size={40} className="text-primary" />
                <span className="text-xl font-bold">Семейный юрист</span>
              </div>
              <p className="text-gray-500">
                ИИ-консультант по семейному праву и социальному обеспечению
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Навигация</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#home"
                    className="hover:text-white transition-colors"
                  >
                    Главная
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-white transition-colors"
                  >
                    Направления
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="hover:text-white transition-colors"
                  >
                    О сервисе
                  </a>
                </li>
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
            <p>© 2025 Семейный юрист. Консультации по семейному праву и соцобеспечению.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}