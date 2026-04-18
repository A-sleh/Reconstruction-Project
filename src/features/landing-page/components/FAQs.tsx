"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { ScrollFadeIn, StaggerContainer, StaggerItem, ExpandCollapse, AnimatedButton } from "@/components/animations";
import { motion } from "motion/react";
import { FaPlus } from "react-icons/fa6";

const FAQs = () => {
  const { i18n } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: i18n.language === 'ar' ? "كيف يمكنني التسجيل في المنصة؟" : "How can I register on the platform?",
      answer: i18n.language === 'ar'
        ? "يمكنك التسجيل بسهولة من خلال النقر على زر 'إنشاء حساب' وملء البيانات المطلوبة. سيتم التحقق من حسابك خلال 24 ساعة."
        : "You can register easily by clicking the 'Create Account' button and filling in the required information. Your account will be verified within 24 hours."
    },
    {
      question: i18n.language === 'ar' ? "هل المنصة آمنة وموثوقة؟" : "Is the platform safe and reliable?",
      answer: i18n.language === 'ar'
        ? "نعم، نستخدم أحدث تقنيات الأمان لحماية بياناتك ومعاملاتك. جميع الأطراف يتم التحقق منها قبل الانضمام للمنصة."
        : "Yes, we use the latest security technologies to protect your data and transactions. All parties are verified before joining the platform."
    },
    {
      question: i18n.language === 'ar' ? "ما هي تكاليف استخدام المنصة؟" : "What are the costs of using the platform?",
      answer: i18n.language === 'ar'
        ? "التسجيل مجاني لجميع الأطراف. نتقاضى عمولة رمزية فقط عند إتمام الصفقات الناجحة."
        : "Registration is free for all parties. We only charge a symbolic commission upon successful deals."
    },
    {
      question: i18n.language === 'ar' ? "كيف يمكنني العثور على مشاريع مناسبة؟" : "How can I find suitable projects?",
      answer: i18n.language === 'ar'
        ? "استخدم أدوات البحث المتقدمة في المنصة مع الفلاتر حسب الموقع، الميزانية، والنوع للعثور على أفضل الفرص."
        : "Use the advanced search tools on the platform with filters by location, budget, and type to find the best opportunities."
    },
    {
      question: i18n.language === 'ar' ? "هل يمكنني التواصل مباشرة مع الأطراف الأخرى؟" : "Can I communicate directly with other parties?",
      answer: i18n.language === 'ar'
        ? "نعم، المنصة توفر نظام مراسلة آمن يتيح التواصل المباشر بين جميع الأطراف المعنية بالمشروع."
        : "Yes, the platform provides a secure messaging system that allows direct communication between all project stakeholders."
    },
    {
      question: i18n.language === 'ar' ? "كيف يتم حماية حقوقي كمستثمر؟" : "How are my rights protected as an investor?",
      answer: i18n.language === 'ar'
        ? "لدينا نظام ضمان شامل يشمل عقود قانونية، وسيط محايد، ومتابعة دورية للمشاريع لضمان حقوق جميع الأطراف."
        : "We have a comprehensive guarantee system that includes legal contracts, neutral mediation, and periodic project follow-up to ensure the rights of all parties."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="scroll-mt-24 py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <ScrollFadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              {i18n.language === 'ar' ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
            </h2>
            <p className="text-lg text-gray-600">
              {i18n.language === 'ar'
                ? "إجابات على الأسئلة الأكثر شيوعاً حول منصتنا"
                : "Answers to the most common questions about our platform"
              }
            </p>
          </div>
        </ScrollFadeIn>

        <StaggerContainer className="space-y-4">
          {faqs.map((faq, index) => (
            <StaggerItem key={index} className="bg-white rounded-lg shadow-md">
              <motion.button
                className={`w-full p-6 px-4 focus:outline-none ${i18n.language === 'ar' ? " text-right" : " text-left"}`}
                onClick={() => toggleFAQ(index)}
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
              >
                <div className="flex justify-between items-center gap-2">
                  <h3 className="text-lg font-semibold text-primary pr-4">
                    {faq.question}
                  </h3>
                  <motion.span
                    animate={{ rotate: openIndex === index ? 135 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaPlus size={20} />
                  </motion.span>
                </div>
              </motion.button>
              <AnimatePresence>
                {openIndex === index && (
                  <ExpandCollapse isOpen={true}>
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </ExpandCollapse>
                )}
              </AnimatePresence>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollFadeIn delay={0.8} className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-4">
            {i18n.language === 'ar'
              ? "لم تجد إجابة لسؤالك؟"
              : "Didn't find an answer to your question?"
            }
          </p>
          <AnimatedButton className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors">
            {i18n.language === 'ar' ? "تواصل مع الدعم" : "Contact Support"}
          </AnimatedButton>
        </ScrollFadeIn>
      </div>
    </section>
  );
};

export default FAQs;
