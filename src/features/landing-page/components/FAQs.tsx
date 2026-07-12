"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import {
  ScrollFadeIn,
  StaggerContainer,
  StaggerItem,
  ExpandCollapse,
} from "@/components/animations";
import Button from "@/components/inputs/Button";
import { Link } from "react-router-dom";

const FAQs = () => {
  const { i18n } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question:
        i18n.language === "ar"
          ? "كيف يمكنني التسجيل في المنصة؟"
          : "How can I register on the platform?",
      answer:
        i18n.language === "ar"
          ? "يمكنك التسجيل بسهولة من خلال النقر على زر 'إنشاء حساب' وملء البيانات المطلوبة. سيتم التحقق من حسابك خلال 24 ساعة."
          : "You can register easily by clicking the 'Create Account' button and filling in the required information. Your account will be verified within 24 hours.",
    },
    {
      question:
        i18n.language === "ar"
          ? "هل المنصة آمنة وموثوقة؟"
          : "Is the platform safe and reliable?",
      answer:
        i18n.language === "ar"
          ? "نعم، نستخدم أحدث تقنيات الأمان لحماية بياناتك ومعاملاتك. جميع الأطراف يتم التحقق منها قبل الانضمام للمنصة."
          : "Yes, we use the latest security technologies to protect your data and transactions. All parties are verified before joining the platform.",
    },
    {
      question:
        i18n.language === "ar"
          ? "ما هي تكاليف استخدام المنصة؟"
          : "What are the costs of using the platform?",
      answer:
        i18n.language === "ar"
          ? "التسجيل مجاني لجميع الأطراف. نتقاضى عمولة رمزية فقط عند إتمام الصفقات الناجحة."
          : "Registration is free for all parties. We only charge a symbolic commission upon successful deals.",
    },
    {
      question:
        i18n.language === "ar"
          ? "كيف يمكنني العثور على مشاريع مناسبة؟"
          : "How can I find suitable projects?",
      answer:
        i18n.language === "ar"
          ? "استخدم أدوات البحث المتقدمة في المنصة مع الفلاتر حسب الموقع، الميزانية، والنوع للعثور على أفضل الفرص."
          : "Use the advanced search tools on the platform with filters by location, budget, and type to find the best opportunities.",
    },
    {
      question:
        i18n.language === "ar"
          ? "هل يمكنني التواصل مباشرة مع الأطراف الأخرى؟"
          : "Can I communicate directly with other parties?",
      answer:
        i18n.language === "ar"
          ? "نعم، المنصة توفر نظام مراسلة آمن يتيح التواصل المباشر بين جميع الأطراف المعنية بالمشروع."
          : "Yes, the platform provides a secure messaging system that allows direct communication between all project stakeholders.",
    },
    {
      question:
        i18n.language === "ar"
          ? "كيف يتم حماية حقوقي كمستثمر؟"
          : "How are my rights protected as an investor?",
      answer:
        i18n.language === "ar"
          ? "لدينا نظام ضمان شامل يشمل عقود قانونية، وسيط محايد، ومتابعة دورية للمشاريع لضمان حقوق جميع الأطراف."
          : "We have a comprehensive guarantee system that includes legal contracts, neutral mediation, and periodic project follow-up to ensure the rights of all parties.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="bg-canvas-elevated scroll-mt-24 py-24 bg-gray-300/10"
    >
      <div className="max-w-4xl mx-auto px-4">
        <ScrollFadeIn>
          <div className="text-center mb-16">
            <h2 className="text-display-lg font-bold text-ink-primary text-center mb-4">
              {i18n.language === "ar"
                ? "الأسئلة الشائعة"
                : "Frequently Asked Questions"}
            </h2>
            <p className="text-body text-ink-secondary">
              {i18n.language === "ar"
                ? "إجابات على الأسئلة الأكثر شيوعاً حول منصتنا"
                : "Answers to the most common questions about our platform"}
            </p>
          </div>
        </ScrollFadeIn>

        <StaggerContainer className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <StaggerItem
              key={index}
              className="bg-white border border-gray-300 rounded-md overflow-hidden"
            >
              <motion.button
                className="w-full p-6 flex justify-between items-center gap-3 text-left"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-subtitle font-medium text-ink-primary">
                  {faq.question}
                </h3>
                <motion.span
                  className="shrink-0"
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Plus className="w-5 h-5 text-ink-primary" />
                </motion.span>
              </motion.button>
              <AnimatePresence>
                {openIndex === index && (
                  <ExpandCollapse isOpen={true}>
                    <div className="px-6 pb-6">
                      <p className="text-body text-ink-secondary leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </ExpandCollapse>
                )}
              </AnimatePresence>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollFadeIn delay={0.8} className="text-center mt-12">
          <p className="text-body text-ink-secondary mb-4">
            {i18n.language === "ar"
              ? "لم تجد إجابة لسؤالك؟"
              : "Didn't find an answer to your question?"}
          </p>
          <Link to="#contact">
            <Button className="bg-primary text-white rounded-tl-2xl rounded-br-2xl hover:bg-primary hover:opacity-65">
              {i18n.language === "ar" ? "تواصل مع الدعم" : "Contact Support"}
            </Button>
          </Link>
        </ScrollFadeIn>
      </div>
    </section>
  );
};

export default FAQs;
