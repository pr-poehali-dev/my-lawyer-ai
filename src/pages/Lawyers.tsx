import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Icon from "@/components/ui/icon";

export default function Lawyers() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    issue: "",
    details: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Заявка отправлена:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        issue: "",
        details: "",
      });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const lawyers = [
    {
      name: "Елена Иванова",
      specialty: "Семейное право",
      experience: "12 лет",
      cases: "500+",
      description: "Специалист по бракоразводным процессам и разделу имущества",
      icon: "Users",
    },
    {
      name: "Михаил Петров",
      specialty: "Алименты и опека",
      experience: "8 лет",
      cases: "350+",
      description: "Эксперт по вопросам алиментов и определения места жительства детей",
      icon: "Heart",
    },
    {
      name: "Анна Сидорова",
      specialty: "Социальное обеспечение",
      experience: "10 лет",
      cases: "600+",
      description: "Помогу с пенсиями, льготами и материнским капиталом",
      icon: "Wallet",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Icon name="Scale" size={38} className="text-primary" />
            <span className="text-2xl font-bold text-primary">Семейный юрист</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              Главная
            </a>
            <a
              href="/#services"
              className="text-foreground hover:text-primary transition-colors"
            >
              Направления
            </a>
            <a
              href="/lawyers"
              className="text-primary font-semibold"
            >
              Юристы
            </a>
            <a
              href="/#faq"
              className="text-foreground hover:text-primary transition-colors"
            >
              FAQ
            </a>
          </nav>
          <Button variant="default" onClick={() => window.location.href = "/"}>
            Задать вопрос ИИ
          </Button>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Консультация с реальным юристом
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Если ваша ситуация требует профессионального представительства в суде 
              или детальной юридической экспертизы, наши специалисты готовы помочь
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {lawyers.map((lawyer, index) => (
              <Card key={index} className="hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Icon
                      name={lawyer.icon}
                      size={32}
                      className="text-primary"
                    />
                  </div>
                  <CardTitle className="text-center text-2xl">{lawyer.name}</CardTitle>
                  <CardDescription className="text-center text-base">
                    {lawyer.specialty}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">{lawyer.description}</p>
                  <div className="flex justify-around pt-4 border-t">
                    <div>
                      <div className="font-bold text-primary">{lawyer.experience}</div>
                      <div className="text-xs text-muted-foreground">опыта</div>
                    </div>
                    <div>
                      <div className="font-bold text-primary">{lawyer.cases}</div>
                      <div className="text-xs text-muted-foreground">дел</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="max-w-3xl mx-auto shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">Оставить заявку</CardTitle>
              <CardDescription className="text-base">
                Заполните форму, и наш юрист свяжется с вами в течение рабочего дня
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="CheckCircle2" size={48} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Заявка отправлена!</h3>
                  <p className="text-muted-foreground">
                    Мы свяжемся с вами в ближайшее время
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ваше имя *</label>
                    <Input
                      name="name"
                      placeholder="Иван Иванов"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Телефон *</label>
                      <Input
                        name="phone"
                        type="tel"
                        placeholder="+7 (999) 123-45-67"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Направление *</label>
                    <select
                      name="issue"
                      className="w-full p-2 border rounded-md"
                      value={formData.issue}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Выберите направление</option>
                      <option value="divorce">Развод</option>
                      <option value="alimony">Алименты</option>
                      <option value="property">Раздел имущества</option>
                      <option value="custody">Определение места жительства ребенка</option>
                      <option value="parental_rights">Лишение родительских прав</option>
                      <option value="pension">Пенсии и пособия</option>
                      <option value="benefits">Льготы</option>
                      <option value="maternity">Материнский капитал</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Описание ситуации *</label>
                    <Textarea
                      name="details"
                      placeholder="Опишите вашу ситуацию подробно..."
                      value={formData.details}
                      onChange={handleChange}
                      rows={6}
                      required
                      className="resize-none"
                    />
                  </div>

                  <Button type="submit" className="w-full gap-2" size="lg">
                    <Icon name="Send" size={20} />
                    Отправить заявку
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Clock" size={32} className="text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Быстрый ответ</h3>
              <p className="text-muted-foreground text-sm">
                Ответим в течение рабочего дня
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Shield" size={32} className="text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Конфиденциально</h3>
              <p className="text-muted-foreground text-sm">
                Ваши данные под защитой
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Award" size={32} className="text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Опытные юристы</h3>
              <p className="text-muted-foreground text-sm">
                Специалисты с 8+ летним стажем
              </p>
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
                  <a href="/" className="hover:text-white transition-colors">
                    Главная
                  </a>
                </li>
                <li>
                  <a href="/#services" className="hover:text-white transition-colors">
                    Направления
                  </a>
                </li>
                <li>
                  <a href="/lawyers" className="hover:text-white transition-colors">
                    Юристы
                  </a>
                </li>
                <li>
                  <a href="/#faq" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Контакты</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  <span>support@family-lawyer.ru</span>
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
