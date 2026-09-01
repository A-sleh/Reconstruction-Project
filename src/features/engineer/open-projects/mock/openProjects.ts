import { EngineeringDiscipline, ProjectScale } from "../api/types";
import type { OpenProject } from "../api/types";

export const MOCK_OPEN_PROJECTS: OpenProject[] = [
  {
    id: 301,
    title: "برج السكني فخمة — حلب الجديدة",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    region: "حلب — حي الم称赞",
    requiredSpecialties: [
      EngineeringDiscipline.Structural,
      EngineeringDiscipline.Architectural,
    ],
    overview:
      "برج سكني فخم من ١٢ طابقًا يتضمن شقق سكنية ومرافق تجارية في الطابق الأرضي. مرحلة التصميم المعماري على وشك الاكتمال، نبحث عن مهندسين للإشراف على التنفيذ.",
    highLevelDeliverables: [
      "الإشراف على أعمال الهيكل الإنشائي والتشطيبات",
      "مراجعة مخططات التنفيذ والمطابقة للمواصفات",
      "تنسيق فرق العمل ومتابعة جدول التنفيذ",
    ],
    requiredSkills: [
      "AutoCAD / Revit",
      "إدارة فرق التنفيذ",
      "قراءة المخططات الإنشائية",
    ],
    scale: ProjectScale.Enterprise,
    durationWeeks: 78,
    applicationDeadline: "2026-09-15T23:59:00.000Z",
    status: "Open",
    postedAt: "2026-08-20T10:00:00.000Z",
  },
  {
    id: 302,
    title: "مشروع كسب السياحي — وحدات فاخرة",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    region: "طرطوس — كسب",
    requiredSpecialties: [
      EngineeringDiscipline.Civil,
      EngineeringDiscipline.ProjectManagement,
    ],
    overview:
      "منتجع سياحي على شاطئ كسب يتضمن ٤٠ وحدة فاخرة مع مسابح ومناطق ترفيهية. خبرة في مشاريع الضيافة مطلوبة للإشراف على الأعمال البنية التحتية والتشطيبات.",
    highLevelDeliverables: [
      "إدارة الأعمال البنية التحتية",
      "إشراف على أعمال التشطيبات الفندقية",
      "تنسيق مقاولي البِنى التحتية",
    ],
    requiredSkills: [
      "إدارة المشاريع السياحية",
      "أعمال البنية التحتية",
      "الرقابة على الجودة",
    ],
    scale: ProjectScale.Enterprise,
    durationWeeks: 65,
    applicationDeadline: "2026-09-05T23:59:00.000Z",
    status: "ClosingSoon",
    postedAt: "2026-08-10T14:30:00.000Z",
  },
  {
    id: 303,
    title: "مجمع تجاري — الشام",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    region: "دمشق — برزة",
    requiredSpecialties: [
      EngineeringDiscipline.Electrical,
      EngineeringDiscipline.Mechanical,
    ],
    overview:
      "مجمع تجاري من ٦ طوابق يتضمن محلات ومكاتب ومسجد. مرحلة الكهرباء والميكانيكا من المشروع، نبحث عن مهندسين متخصصين للإشراف على التوريدات والتركيب.",
    highLevelDeliverables: [
      "إشراف على أعمال الكهرباء العامة وال弱电",
      "متابعة تركيب التكييف والميكانيكا",
      "اختبار الأنظمة قبل التسليم",
    ],
    requiredSkills: [
      "أنظمة الكهرباء التجارية",
      "تكييف مركزي",
      "اختبار الأنظمة",
    ],
    scale: ProjectScale.Mid,
    durationWeeks: 32,
    applicationDeadline: "2026-09-20T23:59:00.000Z",
    status: "Open",
    postedAt: "2026-08-22T09:00:00.000Z",
  },
  {
    id: 304,
    title: "برج تجاري — حلب القديمة",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?w=800&q=80",
    region: "حلب —وسط المدينة",
    requiredSpecialties: [
      EngineeringDiscipline.Structural,
      EngineeringDiscipline.Geotechnical,
    ],
    overview:
      "برج تجاري ١٥ طابقًا في قلب حلب. مرحلة الأساسات والهيكل الإنشائي. نبحث عن مهندسين ذوي خبرة في المباني الشاهقة والتربة.",
    highLevelDeliverables: [
      "إشراف على أعمال الأساسات الخرسانية",
      "مراقبة تربة الموقع وموثوقية الأحمال",
      "تنسيق أعمال الهيكل الإنشائي",
    ],
    requiredSkills: [
      "ạnh design",
      " Geotechnical analysis",
      " drilled shafts",
    ],
    scale: ProjectScale.Enterprise,
    durationWeeks: 91,
    applicationDeadline: "2026-10-01T23:59:00.000Z",
    status: "Open",
    postedAt: "2026-08-25T11:00:00.000Z",
  },
  {
    id: 305,
    title: "فيلا سكنية مودرن — السفح",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    region: "دمascus — السفح",
    requiredSpecialties: [
      EngineeringDiscipline.Architectural,
      EngineeringDiscipline.Structural,
    ],
    overview:
      "فيلا سكنية حديثة بتصميم مودرن مع حديقة خاصة. مرحلة التصميم الداخلي والتشطيبات. نبحث عن مهندس معماري للإشراف على التنفيذ وضبط التفاصيل.",
    highLevelDeliverables: [
      "إشراف على أعمال التشطيبات الداخلية",
      "متابعة التنفيذ حسب المخططات المعمارية",
      "تنسيق المقاولين المحليين",
    ],
    requiredSkills: [
      "تصميم داخلي",
      "إشراف تشطيبات",
      " Revit",
    ],
    scale: ProjectScale.Small,
    durationWeeks: 16,
    applicationDeadline: "2026-09-10T23:59:00.000Z",
    status: "Open",
    postedAt: "2026-08-27T16:00:00.000Z",
  },
  {
    id: 306,
    title: "مستشفى تعليمي — حماة",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&q=80",
    region: "حماة —وسط المدينة",
    requiredSpecialties: [
      EngineeringDiscipline.Mechanical,
      EngineeringDiscipline.Electrical,
      EngineeringDiscipline.ProjectManagement,
    ],
    overview:
      "مستشفى تعليمي ٢٠٠ سرير يتضمن غرف عمليات ومختبرات. مرحلة التجهيزات الطبية والأنظمة الميكانيكية. خبرة مشاريع صحية مطلوبة.",
    highLevelDeliverables: [
      "إشراع على تركيب أنظمة التهوية والتكييف الطبي",
      "متابعة الأنظمة الكهربائية والطوارئ",
      "تنسيق مع الجهة الصحيةPURE",
    ],
    requiredSkills: [
      "أنظمة صحية",
      "HVAC طبي",
      "إدارة مشاريع صحية",
    ],
    scale: ProjectScale.Mid,
    durationWeeks: 48,
    applicationDeadline: "2026-09-25T23:59:00.000Z",
    status: "Open",
    postedAt: "2026-08-15T08:00:00.000Z",
  },
  {
    id: 307,
    title: "مشروع إسكان اجتماعي — درعا",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&q=80",
    region: "درعا —	instal",
    requiredSpecialties: [
      EngineeringDiscipline.Civil,
      EngineeringDiscipline.Surveying,
    ],
    overview:
      "مشروع إسكان اجتماعي يتضمن ١٢٠ وحدة سكنية مع بنية تحتية كاملة. مرحلة المسح والتخطيط. نبحث عن مهندسين للإشراف على أعمال البنية التحتية.",
    highLevelDeliverables: [
      "مسح الموقع وتطبيقات الأراضي",
      "إشراع على أعمال البنية التحتية (طرق، صرف، مياه)",
      "متابعة أعمال الحفر والتسوية",
    ],
    requiredSkills: [
      "Total Station",
      "بنية تحتية",
      "تخطيط عمراني",
    ],
    scale: ProjectScale.Mid,
    durationWeeks: 52,
    applicationDeadline: "2026-10-05T23:59:00.000Z",
    status: "Open",
    postedAt: "2026-08-28T13:00:00.000Z",
  },
  {
    id: 308,
    title: "عمارة سكنية — الإخاء",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&q=80",
    region: "حلب — الإخاء",
    requiredSpecialties: [EngineeringDiscipline.Structural],
    overview:
      "عمارة سكنية ٨ طوابق في حي الإخاء. مرحلة الهيكل الإنشائي. مهندس إنشائي للإشراف على أعمال الخرسانة المسلحة.",
    highLevelDeliverables: [
      "إشراع على أعمال الخرسانة المسلحة",
      "ware houses",
      " Site quality control",
    ],
    requiredSkills: [
      "خرسانة مسلحة",
      "قراءة مخططات إنشائية",
      "رقابة جودة الموقع",
    ],
    scale: ProjectScale.Small,
    durationWeeks: 24,
    applicationDeadline: "2026-09-18T23:59:00.000Z",
    status: "ClosingSoon",
    postedAt: "2026-08-12T10:00:00.000Z",
  },
  {
    id: 309,
    title: "مبنى إداري — التضامن",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800&q=80",
    region: "دمشق — التضامن",
    requiredSpecialties: [
      EngineeringDiscipline.Electrical,
      EngineeringDiscipline.Architectural,
    ],
    overview:
      "مبنى إداري حديث من ٥ طوابق. مرحلة التشطيبات الداخلية. نبحث عن مهندس كهرباء للإشراف على الأعمال الكهربائية والتصميم الداخلي.",
    highLevelDeliverables: [
      "إشراع على أعمال الكهرباء والإنارة",
      "متابعة التصميم الداخلي والتشطيبات",
      "اختبار الأنظمة الكهربائية",
    ],
    requiredSkills: [
      "أنظمة كهربائية",
      "تصميم داخلي",
      "_PLC basics",
    ],
    scale: ProjectScale.Small,
    durationWeeks: 12,
    applicationDeadline: "2026-09-08T23:59:00.000Z",
    status: "ClosingSoon",
    postedAt: "2026-08-05T15:00:00.000Z",
  },
  {
    id: 310,
    title: "مجمع سكني — الشهداء",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&q=80",
    region: "حمص — الشهداء",
    requiredSpecialties: [
      EngineeringDiscipline.ProjectManagement,
      EngineeringDiscipline.Civil,
    ],
    overview:
      "مجمع سكني متكامل من ٤ مبانٍ (٦ طوابق لكل مبنى). مرحلة التخطيط والبدء في التنفيذ. مدير مشروع للتنسيق العام.",
    highLevelDeliverables: [
      "تنسيق جميع مقاولي المشروع",
      "متابعة الجدول الزمني والميزانية",
      "إعداد التقارير الدورية للمستثمر",
    ],
    requiredSkills: [
      "MS Project",
      "إدارة الميزانية",
      "تنسيق مقاولين",
    ],
    scale: ProjectScale.Mid,
    durationWeeks: 60,
    applicationDeadline: "2026-10-15T23:59:00.000Z",
    status: "Open",
    postedAt: "2026-08-29T09:00:00.000Z",
  },
  {
    id: 311,
    title: "محكمة جديدة — حلب",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1486325212027-f10a6e3d0428?w=800&q=80",
    region: "حلب — New Damascus",
    requiredSpecialties: [
      EngineeringDiscipline.Architectural,
      EngineeringDiscipline.ProjectManagement,
    ],
    overview:
      "مبنى محكمة حديث يتضمن قاعات جلسات ومكاتب إدارية. مرحلة التصميم النهائي. معماري للإشراف على تفاصيل التنفيذ.",
    highLevelDeliverables: [
      "إشراع على تفاصيل التنفيذ المعماري",
      "متابعة المواد والخامات",
      "تنسيق مع جهة التصميم",
    ],
    requiredSkills: [
      "تصميم مباني إدارية",
      " детали التنفيذ",
      "مدير site",
    ],
    scale: ProjectScale.Mid,
    durationWeeks: 40,
    applicationDeadline: "2026-09-28T23:59:00.000Z",
    status: "Open",
    postedAt: "2026-08-26T12:00:00.000Z",
  },
  {
    id: 312,
    title: "مبنى تعليمي — اليرموك",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    region: "دمشق — اليرموك",
    requiredSpecialties: [
      EngineeringDiscipline.Mechanical,
      EngineeringDiscipline.Civil,
    ],
    overview:
      "مبنى تعليمي من ٤ طوابق يتضمن فصول دراسية ومخازن. مرحلة التهوية والتكييف. مهندس ميكانيكا للإشراف على الأنظمة.",
    highLevelDeliverables: [
      "إشراع على تركيب نظام التكييف المركزي",
      "متابعة أعمال السباكة والصرف",
      "اختبار الأنظمة قبل التسليم",
    ],
    requiredSkills: [
      "HVAC",
      "سباكة",
      "اختبار أنظمة",
    ],
    scale: ProjectScale.Small,
    durationWeeks: 20,
    applicationDeadline: "2026-09-12T23:59:00.000Z",
    status: "Open",
    postedAt: "2026-08-24T17:00:00.000Z",
  },
];
