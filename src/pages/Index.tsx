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
  const [showTemplates, setShowTemplates] = useState(false);

  const templates = [
    {
      title: "Аренда земли",
      icon: "FileText",
      template: `Ситуация: [заключение договора аренды/спор по договору]

Участок:
- Назначение: [сельхозназначение/под строительство/другое]
- Площадь: [га или м²]
- Категория земли: [земли сельхозназначения/населенных пунктов/другое]

Текущая ситуация:
- [оформление договора/расторжение/изменение условий]
- [сроки аренды]
- [размер арендной платы]

Вопрос: [порядок оформления/права и обязанности/споры]`
    },
    {
      title: "Покупка земли",
      icon: "Landmark",
      template: `Участок:
- Назначение: [ИЖС/садоводство/сельхоз]
- Площадь: [м² или га]
- Местоположение: [регион, населенный пункт]

Сделка:
- Продавец: [частное лицо/организация/государство]
- Обременения: [есть/нет, какие]
- Документы на руках: [перечислить]

Вопрос: [порядок покупки/проверка документов/регистрация права]`
    },
    {
      title: "Межевание",
      icon: "MapPin",
      template: `Участок:
- Кадастровый номер: [если есть]
- Площадь: [м² или га]
- Границы: [установлены/не установлены]

Проблема:
- [нужно провести межевание]
- [спор о границах с соседями]
- [ошибки в кадастре]

Документы: [какие есть]

Вопрос: [процедура межевания/разрешение споров/исправление ошибок]`
    },
    {
      title: "Наследование земли",
      icon: "Home",
      template: `Наследодатель: [дата смерти]

Земельный участок:
- Назначение: [дача/огород/ИЖС/сельхоз]
- Документы: [свидетельство о праве/договор/другое]

Наследники:
- [количество, очередь наследования]
- [согласие между наследниками: есть/нет]

Вопрос: [оформление наследства/раздел участка/налоги]`
    },
    {
      title: "Смена назначения",
      icon: "RefreshCw",
      template: `Участок:
- Текущее назначение: [сельхоз/садоводство/другое]
- Желаемое назначение: [ИЖС/коммерческое/другое]
- Категория земли: [текущая]

Цель изменения: [строительство дома/бизнес/другое]

Документы: [какие есть]

Вопрос: [процедура изменения/требования/сроки]`
    },
    {
      title: "Участки для фермеров",
      icon: "Tractor",
      template: `Фермерское хозяйство: [зарегистрировано/планируется]

Земля:
- Назначение: [сельхозназначение]
- Площадь: [требуется, га]
- Регион: [где планируется]

Вопрос:
- [как получить землю]
- [льготы для фермеров]
- [требования к КФХ]
- [субсидии и поддержка]`
    },
    {
      title: "Споры с соседями",
      icon: "Users",
      template: `Участок: [ваше назначение, площадь]

Суть конфликта:
- [застройка на границе]
- [использование вашей земли]
- [нарушение прав]
- [другое]

Действия соседа: [подробное описание]

Доказательства: [фото/документы/свидетели]

Вопрос: [как защитить права/досудебное урегулирование/иск в суд]`
    },
    {
      title: "Приватизация земли",
      icon: "Key",
      template: `Участок:
- Использование: [садовый/дачный/ИЖС]
- Срок пользования: [с какого года]
- Документы: [какие есть на руках]

Текущее право: [аренда/бессрочное пользование/другое]

Строения на участке: [есть/нет, какие]

Вопрос: [процедура приватизации/документы/сроки/стоимость]`
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
      icon: "Sprout",
      title: "Аренда и покупка земли",
      description:
        "Оформление договоров аренды, покупка участков, проверка документов, сопровождение сделок",
    },
    {
      icon: "MapPin",
      title: "Межевание и кадастр",
      description:
        "Установление границ, межевые споры, кадастровый учет, исправление ошибок в документах",
    },
    {
      icon: "Home",
      title: "Право собственности",
      description: "Регистрация права, приватизация, наследование земельных участков",
    },
    {
      icon: "RefreshCw",
      title: "Изменение назначения",
      description: "Перевод земли из одной категории в другую, смена вида разрешенного использования",
    },
    {
      icon: "Tractor",
      title: "КФХ и сельхозземли",
      description: "Оформление фермерских хозяйств, аренда сельхозземель, субсидии и льготы",
    },
    {
      icon: "Scale",
      title: "Земельные споры",
      description: "Споры о границах, незаконное использование, защита прав на землю в суде",
    },
  ];

  const faqItems = [
    {
      question: 'Как работает ИИ "Земельный юрист"?',
      answer:
        "ИИ использует технологию RAG - находит нужные статьи Земельного кодекса РФ, законов о собственности, постановлений Пленума Верховного Суда, затем формирует понятный ответ с указанием конкретных норм права.",
    },
    {
      question: "Какие вопросы можно задавать?",
      answer:
        "Вопросы по земельному праву: аренда и покупка земли, межевание, регистрация права, споры с соседями, изменение назначения, приватизация, фермерские хозяйства, наследование участков.",
    },
    {
      question: "Бесплатно ли пользоваться?",
      answer:
        "Да, сервис полностью бесплатный. Можно задавать неограниченное количество вопросов, работает 24/7.",
    },
    {
      question: "Насколько точны ответы?",
      answer:
        "Ответы основаны на актуальном Земельном кодексе РФ и законах о земле. Для судебных дел и сложных сделок рекомендуем консультацию с практикующим земельным юристом.",
    },
    {
      question: "Заменяет ли ИИ юриста?",
      answer:
        "Нет. ИИ помогает разобраться в ситуации и понять свои права, но не заменяет профессионального юриста в суде, при сделках или для представительства интересов.",
    },
    {
      question: "Как быстро приходит ответ?",
      answer:
        "Обычно 5-15 секунд. ИИ анализирует вопрос, ищет нужные статьи Земельного кодекса и формирует понятный ответ практически мгновенно.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      <header className="border-b border-green-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="Sprout" className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-green-900">Земельный юрист</h1>
              <p className="text-xs text-green-700">ИИ-ассистент по земельному праву</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50">
            <Icon name="Phone" className="mr-2" size={16} />
            Связаться с юристом
          </Button>
        </div>
      </header>

      <section className="py-16 bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
            <Icon name="Sparkles" size={20} />
            <span className="text-sm font-medium">Работает на YandexGPT 4</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Бесплатные юридические консультации
            <br />
            <span className="text-green-200">по земельному праву</span>
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-3xl mx-auto">
            ИИ-ассистент даст ответ за 10 секунд на основе Земельного кодекса РФ и актуальной судебной практики
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
              <Icon name="CheckCircle" size={18} />
              <span>Бесплатно 24/7</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
              <Icon name="BookOpen" size={18} />
              <span>Актуальный ЗК РФ</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
              <Icon name="Shield" size={18} />
              <span>Со ссылками на статьи</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        <Card className="max-w-4xl mx-auto shadow-2xl border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b border-green-100">
            <CardTitle className="flex items-center gap-2 text-2xl text-green-900">
              <Icon name="MessageSquare" size={28} />
              Задайте вопрос земельному юристу
            </CardTitle>
            <CardDescription className="text-green-700">
              Опишите вашу ситуацию подробно, чтобы получить точный ответ со ссылками на законы
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex gap-2 mb-4">
              <Button
                onClick={() => setShowTemplates(!showTemplates)}
                variant="outline"
                size="sm"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <Icon name="FileText" className="mr-2" size={16} />
                {showTemplates ? "Скрыть шаблоны" : "Показать шаблоны вопросов"}
              </Button>
            </div>

            {showTemplates && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-green-50 rounded-lg border border-green-200 animate-fade-in">
                {templates.map((template) => (
                  <button
                    key={template.title}
                    onClick={() => useTemplate(template.template)}
                    className="flex items-center gap-3 p-3 bg-white border border-green-200 rounded-lg hover:bg-green-50 hover:border-green-400 transition-all text-left group"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                      <Icon name={template.icon} className="text-green-700 group-hover:text-white" size={20} />
                    </div>
                    <span className="font-medium text-green-900">{template.title}</span>
                  </button>
                ))}
              </div>
            )}

            <Textarea
              placeholder="Например: Как оформить аренду земельного участка для строительства дома? Какие документы нужны и каков порядок действий?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[120px] border-green-200 focus:border-green-400 focus:ring-green-400"
            />
            <Button
              onClick={handleAskQuestion}
              disabled={isLoading || !question.trim()}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader" className="mr-2 animate-spin" size={20} />
                  Анализирую земельное законодательство...
                </>
              ) : (
                <>
                  <Icon name="Send" className="mr-2" size={20} />
                  Получить консультацию
                </>
              )}
            </Button>

            {answer && (
              <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-white rounded-lg border-2 border-green-200 animate-fade-in shadow-md">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Scale" className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-green-900 mb-2">Юридическая консультация</h3>
                    <div className="prose max-w-none text-green-900 whitespace-pre-wrap leading-relaxed">
                      {answer}
                    </div>
                  </div>
                </div>

                {sources.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-green-200">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <Icon name="BookOpen" size={18} />
                      Источники и законодательные акты:
                    </h4>
                    <div className="space-y-2">
                      {sources.map((source, idx) => (
                        <a
                          key={idx}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 p-3 bg-white hover:bg-green-50 border border-green-200 rounded-lg transition-all group"
                        >
                          <Icon name="ExternalLink" className="text-green-600 mt-1 group-hover:text-green-700" size={16} />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-green-900 text-sm">
                              {source.code}
                            </div>
                            <div className="text-green-700 text-xs mt-1 line-clamp-2">
                              {source.article}
                            </div>
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
      </section>

      <section className="py-16 bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-green-900">Направления консультаций</h2>
            <p className="text-green-700 max-w-2xl mx-auto">
              ИИ-ассистент поможет разобраться в любых вопросах земельного права
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <Card
                key={idx}
                className="hover:shadow-xl transition-all border-green-200 hover:border-green-400 bg-white group"
              >
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Icon name={service.icon} className="text-white" size={28} />
                  </div>
                  <CardTitle className="text-xl text-green-900">{service.title}</CardTitle>
                  <CardDescription className="text-green-700 leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-green-900">
            Часто задаваемые вопросы
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="border border-green-200 rounded-lg px-6 bg-white hover:bg-green-50 transition-colors"
              >
                <AccordionTrigger className="text-left hover:no-underline text-green-900 font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-green-700 leading-relaxed pt-2">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-green-800 to-green-900 text-white py-12 border-t border-green-700">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Icon name="Sprout" className="text-white" size={24} />
                </div>
                <span className="font-bold text-xl">Земельный юрист</span>
              </div>
              <p className="text-green-200 text-sm leading-relaxed">
                Бесплатные юридические консультации по земельному праву на базе искусственного интеллекта и Земельного кодекса РФ
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-green-100">О сервисе</h4>
              <ul className="space-y-2 text-sm text-green-200">
                <li className="flex items-center gap-2">
                  <Icon name="CheckCircle" size={16} />
                  Работает 24/7 без выходных
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="CheckCircle" size={16} />
                  Полностью бесплатно
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="CheckCircle" size={16} />
                  Актуальное законодательство
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="CheckCircle" size={16} />
                  Ссылки на источники
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-green-100">Контакты</h4>
              <p className="text-sm text-green-200 mb-4">
                Для сложных дел и судебного представительства рекомендуем консультацию с практикующим юристом
              </p>
              <Button variant="outline" className="border-green-400 text-green-100 hover:bg-white/10">
                <Icon name="Phone" className="mr-2" size={16} />
                Связаться с юристом
              </Button>
            </div>
          </div>
          <div className="border-t border-green-700 mt-8 pt-8 text-center text-sm text-green-300">
            © 2024 Земельный юрист ИИ. Информационный сервис. Не является юридической фирмой.
          </div>
        </div>
      </footer>
    </div>
  );
}
