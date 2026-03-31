export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  category: string;
  explanation?: string;
  isMinisterial?: boolean;
  isChallenging?: boolean;
  isImportant?: boolean;
}

export interface ReportData {
  name: string;
  value: number;
  color: string;
}

export interface ScheduleItem {
  id: string;
  subject: string;
  time: string;
  day: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'schedule' | 'question' | 'achievement';
  read: boolean;
  createdAt: any;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'student' | 'admin';
  createdAt: any;
}

export const SUBJECTS = [
  { 
    id: 'math', 
    name: 'الرياضيات', 
    icon: '📐', 
    color: 'bg-indigo-500',
    chapters: ['الفصل الأول', 'الفصل الثاني', 'الفصل الثالث', 'الفصل الرابع', 'الفصل الخامس', 'الفصل السادس']
  },
  { 
    id: 'physics', 
    name: 'الفيزياء', 
    icon: '⚡', 
    color: 'bg-violet-500',
    chapters: ['الفصل الأول', 'الفصل الثاني', 'الفصل الثالث', 'الفصل الرابع', 'الفصل الخامس', 'الفصل السادس', 'الفصل السابع', 'الفصل الثامن']
  },
  { 
    id: 'chemistry', 
    name: 'الكيمياء', 
    icon: '🧪', 
    color: 'bg-cyan-500',
    chapters: ['الفصل الأول', 'الفصل الثاني', 'الفصل الثالث', 'الفصل الرابع', 'الفصل الخامس', 'الفصل السادس', 'الفصل السابع', 'الفصل الثامن']
  },
  { 
    id: 'biology', 
    name: 'الأحياء', 
    icon: '🧬', 
    color: 'bg-rose-500',
    chapters: ['الفصل الأول', 'الفصل الثاني', 'الفصل الثالث', 'الفصل الرابع', 'الفصل الخامس']
  },
  { 
    id: 'arabic', 
    name: 'اللغة العربية', 
    icon: '📚', 
    color: 'bg-orange-500',
    chapters: ['قواعد - الاستفهام', 'قواعد - النفي', 'قواعد - الاستثناء', 'قواعد - النداء', 'أدب - الجواهري', 'أدب - السياب', 'أدب - نازك الملائكة']
  },
  { 
    id: 'english', 
    name: 'الإنكليزية', 
    icon: '🔤', 
    color: 'bg-fuchsia-500',
    chapters: ['Grammar', 'Vocabulary', 'Spelling', 'Phrasal Verbs']
  },
];

export const MOCK_QUESTIONS: Record<string, Question[]> = {
  math: [
    { 
      id: 'm1', 
      text: 'باستخدام مبرهنة ديموافر أو التعميم، جد ناتج المقدار الآتي في أبسط صورة: (1 + i)⁸، موضحاً خطوات الحل الأساسية من إيجاد المقياس والسعة.', 
      options: ['8', '16', '32', '64'], 
      correctAnswer: 1, 
      category: 'الفصل الأول', 
      explanation: 'نحول العدد للصيغة القطبية: r = √2، θ = π/4. بتطبيق مبرهنة ديموافر: (√2)⁸ * (cos(8*π/4) + i sin(8*π/4)) = 16 * (cos(2π) + i sin(2π)) = 16(1 + 0i) = 16.', 
      isMinisterial: true 
    },
    { 
      id: 'm2', 
      text: 'إذا كان كل من (3x + 2yi) و (2 + i) هما عاملان لعدد مركب ناتجهما يساوي 11 + i، فجد قيمتي x, y الحقيقيتين اللتين تحققان المعادلة (3x + 2yi)(2 + i) = 11 + i.', 
      options: ['x=2, y=1', 'x=1, y=2', 'x=2, y=-1', 'x=-2, y=1'], 
      correctAnswer: 2, 
      category: 'الفصل الأول', 
      explanation: 'بفتح الأقواس: 6x + 3xi + 4yi - 2y = 11 + i. بمساواة الأجزاء الحقيقية: 6x - 2y = 11، والتخيلية: 3x + 4y = 1. بحل المعادلتين آنياً نجد x=2, y=-1.', 
      isMinisterial: true 
    },
    { 
      id: 'm3', 
      text: 'قطع ناقص معادلته القياسية هي x²/25 + y²/16 = 1. المطلوب هو إيجاد البعد بين بؤرتيه (البعد البؤري) وطول محوره الكبير، ثم اختر القيمة الصحيحة للبعد البؤري من الخيارات أدناه.', 
      options: ['3', '6', '4', '8'], 
      correctAnswer: 1, 
      category: 'الفصل الثاني', 
      explanation: 'بالمقارنة مع المعادلة القياسية: a²=25 (المحور الكبير 2a=10)، b²=16. نجد c² = a² - b² = 25 - 16 = 9. إذن c=3، والبعد البؤري 2c = 6 وحدات طول.', 
      isMinisterial: true 
    },
    { 
      id: 'm4', 
      text: 'لتكن الدالة f(x) معرفة بالقاعدة f(x) = sin²(x) + cos²(x). جد المشتقة الأولى لهذه الدالة بالنسبة لـ x، مستفيداً من المتطابقات المثلثية الشهيرة لتبسيط الدالة قبل الاشتقاق.', 
      options: ['1', '0', '2sin(x)', 'cos(2x)'], 
      correctAnswer: 1, 
      category: 'الفصل الثالث', 
      explanation: 'من المتطابقة الذهبية: sin²x + cos²x = 1 دائماً لكل قيم x. وبما أن f(x) = 1 (دالة ثابتة)، فإن مشتقتها f\'(x) تساوي دائماً صفر.', 
      isMinisterial: false 
    },
    { 
      id: 'm5', 
      text: 'باستخدام نتيجة مبرهنة القيمة المتوسطة (التفاضلات)، جد القيمة التقريبية للعدد √26، مقرباً الناتج لثلاث مراتب عشرية على الأقل، مع تحديد قيمة a و h والدالة المستخدمة.', 
      options: ['5.1', '5.01', '5.2', '5.09'], 
      correctAnswer: 3, 
      category: 'الفصل الثالث', 
      explanation: 'نفرض f(x)=√x، القيمة المعطاة b=26، القيمة القريبة a=25، إذن h=1. f(a)=5، f\'(x)=1/(2√x) => f\'(a)=1/10=0.1. التقريب: f(a+h) ≈ f(a) + hf\'(a) = 5 + 0.1 = 5.1.', 
      isMinisterial: true 
    },
    { 
      id: 'm6', 
      text: 'جد التكامل غير المحدد للدالة الخطية (2x + 3) بالنسبة للمتغير x، مع إضافة ثابت التكامل c في نهاية الحل، موضحاً قاعدة التكامل المستخدمة لكل حد.', 
      options: ['x² + 3x + c', '2x² + 3x + c', 'x² + c', '3x + c'], 
      correctAnswer: 0, 
      category: 'الفصل الرابع', 
      explanation: 'تكامل 2x هو 2 * (x²/2) = x². وتكامل الثابت 3 هو 3x. بجمعهما وإضافة الثابت c نحصل على x² + 3x + c.', 
      isMinisterial: false 
    },
    { 
      id: 'm7', 
      text: 'حل المعادلة التفاضلية الآتية من الرتبة الأولى والدرجة الأولى: dy/dx = cos(x)، بحيث تجد الحل العام للدالة y بدلالة x وثابت التكامل c.', 
      options: ['y = sin(x) + c', 'y = -sin(x) + c', 'y = cos(x) + c', 'y = tan(x) + c'], 
      correctAnswer: 0, 
      category: 'الفصل الخامس', 
      isMinisterial: true, 
      explanation: 'بفصل المتغيرات: dy = cos(x) dx. بتكامل الطرفين: ∫dy = ∫cos(x) dx. إذن y = sin(x) + c، لأن مشتقة sin(x) هي cos(x).' 
    },
    { 
      id: 'm8', 
      text: 'احسب مساحة المنطقة المحصورة بين منحنى الدالة y = x² ومحور السينات (x-axis) والمستقيمين x=0 و x=1، مستخدماً قوانين التكامل المحدد للمساحات المستوية.', 
      options: ['1/2', '1/3', '1/4', '1'], 
      correctAnswer: 1, 
      category: 'الفصل الرابع', 
      isMinisterial: true, 
      explanation: 'المساحة A = ∫[0 to 1] x² dx = [x³/3] من 0 إلى 1. بالتعويض: (1³/3) - (0³/3) = 1/3 وحدة مساحة مربعة.' 
    },
    { 
      id: 'm9', 
      text: 'في الفضاء الإحداثي ثنائي الأبعاد، إذا كان لدينا المتجه V الذي إحداثياته (3, 4)، فما هو طول هذا المتجه (المعيار)؟ استخدم قانون فيثاغورس لإيجاد المسافة من نقطة الأصل.', 
      options: ['5', '7', '1', '25'], 
      correctAnswer: 0, 
      category: 'الفصل السادس', 
      explanation: 'طول المتجه ||V|| = √(x² + y²) = √(3² + 4²) = √(9 + 16) = √25 = 5 وحدات طول.' 
    },
    { 
      id: 'm10', 
      text: 'وزاري: جد الصيغة القطبية (Trigonometric Form) للعدد المركب z = -1 - i، مبيناً قيمة المقياس r والقيمة الأساسية للسعة (Argument) مع تحديد الربع الذي يقع فيه العدد.', 
      options: ['√2(cos(3π/4) + i sin(3π/4))', '√2(cos(5π/4) + i sin(5π/4))', '2(cos(π/4) + i sin(π/4))', '√2(cos(7π/4) + i sin(7π/4))'], 
      correctAnswer: 1, 
      category: 'الفصل الأول', 
      explanation: 'r = √((-1)² + (-1)²) = √2. زاوية الإسناد هي π/4. بما أن x سالب و y سالب، فالعدد في الربع الثالث: θ = π + π/4 = 5π/4. الصيغة: √2(cos(5π/4) + i sin(5π/4)).', 
      isMinisterial: true 
    },
  ],
  physics: [
    { 
      id: 'p1', 
      text: 'في علم الكهربائية والمغناطيسية، ما هي الوحدة الدولية المستخدمة لقياس سعة المتسعة (Capacitance)، والتي تعبر عن كمية الشحنة المختزنة لكل وحدة فرق جهد؟', 
      options: ['كولوم', 'فاراد', 'فولت', 'أوم'], 
      correctAnswer: 1, 
      category: 'الفصل الأول', 
      explanation: 'الفاراد (Farad) هو وحدة قياس سعة المتسعة، حيث 1F = 1C/1V. وهي وحدة كبيرة جداً عملياً لذا نستخدم المايكروفاراد.', 
      isMinisterial: true 
    },
    { 
      id: 'p2', 
      text: 'متسعة مشحونة ومفصولة عن المصدر، ماذا يحدث لمقدار الطاقة الكهربائية المختزنة في مجالها الكهربائي إذا تمت مضاعفة فرق الجهد بين صفيحتيها إلى ضعفي ما كان عليه؟', 
      options: ['تتضاعف مرتين', 'تتضاعف 4 مرات', 'تقل للنصف', 'تبقى ثابتة'], 
      correctAnswer: 1, 
      category: 'الفصل الأول', 
      explanation: 'العلاقة هي PE = 1/2 C V². بما أن الطاقة تتناسب طردياً مع مربع فرق الجهد، فعند مضاعفة V (تصبح 2V)، تزداد الطاقة بمقدار (2)² أي 4 مرات.', 
      isMinisterial: true 
    },
    { 
      id: 'p3', 
      text: 'ما هو العامل الفيزيائي الرئيسي الذي يحدد مقدار معامل الحث الذاتي (L) لملف معين، مع مراعاة الشكل الهندسي وعدد اللفات والنفوذية المغناطيسية لقلب الملف؟', 
      options: ['التيار المنساب', 'الفولتية الموضوعة', 'عدد اللفات والشكل الهندسي', 'المقاومة الكهربائية'], 
      correctAnswer: 2, 
      category: 'الفصل الثاني', 
      explanation: 'معامل الحث الذاتي L يعتمد على العوامل الذاتية للملف: عدد اللفات، مساحة اللفة الواحدة، طول الملف، والنفوذية المغناطيسية للمادة في جوف الملف.', 
      isMinisterial: true 
    },
    { 
      id: 'p4', 
      text: 'عند ربط محث صرف (Pure Inductor) في دائرة تيار متناوب، فإن متجه الطور للفولتية يسبق متجه الطور للتيار بزاوية فرق طور مقدارها كم درجة؟', 
      options: ['0 درجة', '45 درجة', '90 درجة', '180 درجة'], 
      correctAnswer: 2, 
      category: 'الفصل الثالث', 
      explanation: 'في المحث الصرف، تظهر رادة حثية تقاوم التغير في التيار، مما يجعل الفولتية تسبق التيار بزاوية فرق طور مقدارها 90 درجة (π/2 راديان).', 
      isMinisterial: true 
    },
    { 
      id: 'p5', 
      text: 'في دائرة تيار متناوب متوالية الربط تحتوي على مقاومة ومحث ومتسعة (RLC)، ما هي الصيغة الرياضية الصحيحة لحساب تردد الرنين (Resonant Frequency) الذي تتساوى عنده الرادة الحثية مع الرادة السعوية؟', 
      options: ['f = 1 / (2π√LC)', 'f = 2π / √LC', 'f = √LC / 2π', 'f = 1 / √LC'], 
      correctAnswer: 0, 
      category: 'الفصل الثالث', 
      explanation: 'عند الرنين X_L = X_C، ومنها 2πfL = 1/(2πfC). بحل المعادلة لـ f نجد أن تردد الرنين f_r = 1 / (2π√LC).', 
      isMinisterial: true 
    },
    { 
      id: 'p6', 
      text: 'تعتبر الفيزياء الحديثة أن للضوء سلوكاً مزدوجاً. ما هي الظاهرة الفيزيائية المحددة التي قدمت دليلاً قاطعاً على السلوك الدقائقي (الجسيمي) للضوء، معارضةً بذلك النظرية الموجية الكلاسيكية؟', 
      options: ['تداخل الضوء', 'حيود الضوء', 'استقطاب الضوء', 'الظاهرة الكهروضوئية'], 
      correctAnswer: 3, 
      category: 'الفصل الخامس', 
      isMinisterial: true, 
      explanation: 'الظاهرة الكهروضوئية لا يمكن تفسيرها موجياً، حيث أثبت أينشتاين أن الضوء يتكون من حزم طاقة مركزة تسمى فوتونات، مما يثبت السلوك الدقائقي.' 
    },
    { 
      id: 'p7', 
      text: 'ينص مبدأ اللادقة (Uncertainty Principle) للعالم هايزنبرغ على أنه من المستحيل قياس موضع وزخم جسيم بدقة متناهية في آن واحد. ما هي الصيغة الرياضية لهذا المبدأ؟', 
      options: ['Δx Δp ≥ h/4π', 'E = mc²', 'F = ma', 'λ = h/p'], 
      correctAnswer: 0, 
      category: 'الفصل الخامس', 
      isMinisterial: true, 
      explanation: 'العلاقة Δx Δp ≥ h/4π تعني أن حاصل ضرب الخطأ في قياس الموضع والخطأ في قياس الزخم يجب أن يكون أكبر من أو يساوي قيمة ثابتة.' 
    },
    { 
      id: 'p8', 
      text: 'في الفيزياء النووية، ما هي الوحدة المستخدمة لقياس النشاط الإشعاعي لعينة معينة، والتي تعبر عن عدد التفككات النووية التي تحدث في الثانية الواحدة؟', 
      options: ['الجول', 'النيوتن', 'البكريل', 'التسلا'], 
      correctAnswer: 2, 
      category: 'الفصل الثامن', 
      isMinisterial: true, 
      explanation: 'البكريل (Bq) هو وحدة النشاط الإشعاعي في النظام الدولي، حيث 1Bq يساوي تفككاً واحداً في الثانية.' 
    },
    { 
      id: 'p9', 
      text: 'يعتمد عمل الكثير من الأجهزة الكهربائية على ظاهرة الحث الكهرومغناطيسي. ما هو الجهاز الذي وظيفته الأساسية تحويل الطاقة الميكانيكية الحركية إلى طاقة كهربائية؟', 
      options: ['المحرك الكهربائي', 'المولد الكهربائي', 'المحول الكهربائي', 'المتسعة الكهربائية'], 
      correctAnswer: 1, 
      category: 'الفصل الثاني', 
      isMinisterial: true, 
      explanation: 'المولد الكهربائي يعمل على تدوير ملف داخل مجال مغناطيسي لتوليد قوة دافعة كهربائية محتثة، محولاً بذلك الحركة إلى كهرباء.' 
    },
    { 
      id: 'p10', 
      text: 'وزاري: متسعة سعتها 2μF شحنت بوساطة مصدر لفرق جهد 100V ثم فصلت عنه، فإذا أدخل لوح من مادة عازلة كهربائياً ثابت عزلها k=2 بين صفيحتيها، فما مقدار فرق الجهد بين صفيحتيها بعد إدخال العازل؟', 
      options: ['100V', '50V', '200V', '25V'], 
      correctAnswer: 1, 
      category: 'الفصل الأول', 
      explanation: 'بما أن المتسعة فصلت عن المصدر، فإن الشحنة تبقى ثابتة. فرق الجهد بوجود العازل V_k يقل بنسبة ثابت العزل: V_k = V / k = 100 / 2 = 50V.', 
      isMinisterial: true 
    },
  ],
  chemistry: [
    { 
      id: 'c1', 
      text: 'في علم الثرموداينمك، ما هو المصطلح الذي يطلق على النظام الذي تكون حدوده تسمح بتبادل الطاقة فقط (على شكل حرارة أو شغل) ولا تسمح بتبادل المادة مع المحيط؟', 
      options: ['النظام المفتوح', 'النظام المغلق', 'النظام المعزول', 'النظام المتوازن'], 
      correctAnswer: 1, 
      category: 'الفصل الأول', 
      explanation: 'النظام المغلق يتبادل الطاقة مع المحيط ولكن كتلته (مادته) تبقى ثابتة داخل حدوده.', 
      isMinisterial: true 
    },
    { 
      id: 'c2', 
      text: 'عند حدوث تفاعل كيميائي باعث للحرارة (Exothermic Reaction) في ظروف قياسية، كيف تكون إشارة التغير في الانثالبي (ΔH) لهذا التفاعل عادةً؟', 
      options: ['موجبة دائماً', 'سالبة دائماً', 'تساوي صفراً', 'لا يمكن تحديد الإشارة'], 
      correctAnswer: 1, 
      category: 'الفصل الأول', 
      explanation: 'في التفاعلات الباعثة، تكون طاقة النواتج أقل من طاقة المتفاعلات، لذا يكون الفرق ΔH = H_p - H_r سالباً.', 
      isMinisterial: true 
    },
    { 
      id: 'c3', 
      text: 'ينص قانون فعل الكتلة (Law of Mass Action) على أن سرعة التفاعل الكيميائي في أي اتجاه تتناسب طردياً مع ماذا، عند ثبوت درجة الحرارة؟', 
      options: ['تراكيز المواد المتفاعلة مرفوعة لأسس', 'الطاقة الكلية للنظام', 'الضغط الكلي المسلط', 'حجم إناء التفاعل'], 
      correctAnswer: 0, 
      category: 'الفصل الثاني', 
      isMinisterial: true, 
      explanation: 'السرعة تتناسب مع حاصل ضرب التراكيز المولارية للمواد المتفاعلة، كل منها مرفوع لأس يمثل عدد مولاته في المعادلة الموزونة.' 
    },
    { 
      id: 'c4', 
      text: 'يعتبر الماء النقي مادة متعادلة كيميائياً عند درجة حرارة 25 مئوية. ما هي قيمة الرقم الهيدروجيني (pH) الدقيقة التي تمثل نقطة التعادل هذه؟', 
      options: ['0', '7', '14', '1'], 
      correctAnswer: 1, 
      category: 'الفصل الثالث', 
      isMinisterial: true, 
      explanation: 'في الماء النقي، تركيز أيونات الهيدروجين يساوي تركيز أيونات الهيدروكسيد (10^-7)، لذا pH = -log(10^-7) = 7.' 
    },
    { 
      id: 'c5', 
      text: 'تستخدم الخلايا الكهركيميائية في تطبيقات واسعة. ما هو نوع الخلية التي تعمل تلقائياً لتحويل الطاقة الناتجة عن تفاعل كيميائي إلى طاقة كهربائية؟', 
      options: ['الخلية الجلفانية (الفولتائية)', 'الخلية الإلكتروليتية', 'خلية التحليل الكهربائي', 'الخلية الجافة فقط'], 
      correctAnswer: 0, 
      category: 'الفصل الرابع', 
      isMinisterial: true, 
      explanation: 'الخلايا الجلفانية مثل بطارية السيارة تعمل بتفاعل كيميائي تلقائي لتوليد تيار كهربائي.' 
    },
    { 
      id: 'c6', 
      text: 'أثناء عملية التحليل الكهربائي للماء (Electrolysis of Water)، ما هو الغاز المحدد الذي يتجمع ويتحرر عند قطب الكاثود (القطب السالب)؟', 
      options: ['غاز الأكسجين', 'غاز الهيدروجين', 'غاز الكلور', 'غاز النيتروجين'], 
      correctAnswer: 1, 
      category: 'الفصل الرابع', 
      isMinisterial: true, 
      explanation: 'عند الكاثود تحدث عملية اختزال لأيونات الهيدروجين (أو الماء) فيتحرر غاز الهيدروجين H₂.' 
    },
    { 
      id: 'c7', 
      text: 'في الكيمياء التناسقية والعضوية، ما هو نوع التهجين (Hybridization) الذي تتخذه ذرة الكربون المركزية في جزيء الميثان (CH₄) ليعطي شكلاً هندسياً رباعي الأوجه منتظماً؟', 
      options: ['sp', 'sp²', 'sp³', 'dsp²'], 
      correctAnswer: 2, 
      category: 'الفصل الخامس', 
      isMinisterial: true, 
      explanation: 'ذرة الكربون تكون 4 أواصر تساهمية منفردة، مما يتطلب تهجين أوربيتال واحد من s مع ثلاثة من p لينتج sp³.' 
    },
    { 
      id: 'c8', 
      text: 'تتميز المركبات العضوية بوجود مجموعات وظيفية تحدد خواصها. ما هي المجموعة الوظيفية المميزة لعائلة الكحولات (Alcohols)؟', 
      options: ['مجموعة الكربوكسيل -COOH', 'مجموعة الهيدروكسيل -OH', 'مجموعة الألدهيد -CHO', 'مجموعة الكربونيل -CO-'], 
      correctAnswer: 1, 
      category: 'الفصل السادس', 
      isMinisterial: true, 
      explanation: 'الكحولات تمتاز بوجود مجموعة الهيدروكسيل المرتبطة بذرة كربون مشبعة.' 
    },
    { 
      id: 'c9', 
      text: 'للتمييز المخبري بين الألدهيدات والكيتونات، ما هو الكاشف الكيميائي الشهير الذي يتفاعل مع الألدهيدات ليعطي مرآة فضية لامعة على جدران الأنبوب؟', 
      options: ['كاشف تولن', 'كاشف لوكاس', 'محلول بندكت', 'محلول فهلنغ'], 
      correctAnswer: 0, 
      category: 'الفصل السادس', 
      isMinisterial: true, 
      explanation: 'كاشف تولن يحتوي على أيونات الفضة التي تختزلها الألدهيدات إلى فضة معدنية تترسب كمرآة.' 
    },
    { 
      id: 'c10', 
      text: 'وزاري: للتفاعل الانعكاسي الغازي H₂ + I₂ ⇌ 2HI، إذا كانت تراكيز المواد عند وصول التفاعل لحالة الاتزان هي [H₂]=[I₂]=0.1 mole/L و [HI]=0.2 mole/L، فما هي قيمة ثابت الاتزان Kc لهذا التفاعل؟', 
      options: ['2', '4', '0.5', '1'], 
      correctAnswer: 1, 
      category: 'الفصل الثاني', 
      explanation: 'Kc = [HI]² / ([H₂][I₂]) = (0.2)² / (0.1 * 0.1) = 0.04 / 0.01 = 4. الثابت ليس له وحدات.', 
      isMinisterial: true 
    },
  ],
  biology: [
    { 
      id: 'b1', 
      text: 'داخل الخلية الحقيقية النواة، ما هي العضية الخلوية الدقيقة المسؤولة بشكل مباشر عن عملية بناء وتخليق البروتينات الضرورية للخلية؟', 
      options: ['المايتوكوندريا', 'الرايبوسومات', 'جهاز كولجي', 'الجسيمات الحالة'], 
      correctAnswer: 1, 
      category: 'الفصل الأول', 
      explanation: 'الرايبوسومات هي حبيبات دقيقة توجد على الشبكة البلازمية الداخلية الخشنة أو حرة في السايتوبلازم، ووظيفتها بناء البروتين.', 
      isMinisterial: true 
    },
    { 
      id: 'b2', 
      text: 'أثناء دورة حياة الخلية وانقسامها، ما هو الطور المحدد الذي يحدث فيه تضاعف للحامض النووي (DNA) وتضاعف للكروموسومات استعداداً للانقسام؟', 
      options: ['الطور التمهيدي', 'الطور البيني', 'الطور الاستوائي', 'الطور الانفصالي'], 
      correctAnswer: 1, 
      category: 'الفصل الأول', 
      isMinisterial: true, 
      explanation: 'الطور البيني يسبق عملية الانقسام الفعلي وفيه تتضاعف المادة الوراثية وتخلق البروتينات وتنمو الخلية.' 
    },
    { 
      id: 'b3', 
      text: 'في دراسة الأنسجة الحيوانية، ما هو نوع النسيج الظهاري (الطلائي) الذي يبطن القصبة الهوائية (الرغامي) ويمتاز بوجود أهداب على سطحه الحر؟', 
      options: ['حرشفي بسيط', 'عمودي مطبق كاذب مهدب', 'مكعبي بسيط', 'انتقالي'], 
      correctAnswer: 1, 
      category: 'الفصل الثاني', 
      isMinisterial: true, 
      explanation: 'يسمى مطبقاً كاذباً لأن خلاياه تقع أنويتها في مستويات مختلفة مما يوحي بأنه مكون من عدة طبقات وهو في الحقيقة طبقة واحدة.' 
    },
    { 
      id: 'b4', 
      text: 'خلال المرحلة الجنينية المبكرة للإنسان، ما هي الأعضاء أو الأنسجة المسؤولة عن تكوين وإنتاج كريات الدم الحمراء قبل أن يتولى نخاع العظم هذه المهمة؟', 
      options: ['نخاع العظم الأحمر فقط', 'الكبد والطحال', 'القلب والأوعية', 'الرئتين'], 
      correctAnswer: 1, 
      category: 'الفصل الثالث', 
      isMinisterial: true, 
      explanation: 'في الأجنة، يقوم الكبد والطحال بتكوين خلايا الدم، وبعد الولادة ينحصر ذلك في نخاع العظم الأحمر.' 
    },
    { 
      id: 'b5', 
      text: 'في نظام فصائل الدم (ABO)، ما هي فصيلة الدم المحددة التي تمتاز بخلو سطح كريات الدم الحمراء فيها من أي مستضدات (Antigens) من نوع A أو B؟', 
      options: ['فصيلة الدم A', 'فصيلة الدم B', 'فصيلة الدم AB', 'فصيلة الدم O'], 
      correctAnswer: 3, 
      category: 'الفصل الثالث', 
      isMinisterial: true, 
      explanation: 'الفصيلة O لا تحتوي مستضدات على الكريات، لذا تعتبر واهباً عاماً، لكنها تحتوي أجساماً مضادة في البلازم.' 
    },
    { 
      id: 'b6', 
      text: 'بعد حدوث عملية التبويض في مبيض أنثى الإنسان، ما هو الهرمون الرئيسي الذي يفرزه "الجسم الأصفر" لتهيئة بطانة الرحم لاستقبال الجنين؟', 
      options: ['هرمون الأنسولين', 'هرمون البروجسترون', 'هرمون الثيروكسين', 'هرمون الأدرينالين'], 
      correctAnswer: 1, 
      category: 'الفصل الرابع', 
      isMinisterial: true, 
      explanation: 'البروجسترون يعمل على زيادة سمك بطانة الرحم وغزارة الأوعية الدموية فيها لتثبيت الحمل.' 
    },
    { 
      id: 'b7', 
      text: 'يتكون العمود الفقري للإنسان من عدة مناطق. ما هو العدد الدقيق للفقرات التي تشكل المنطقة العنقودية (العنقية) في أعلى العمود الفقري؟', 
      options: ['7 فقرات', '12 فقرة', '5 فقرات', '4 فقرات'], 
      correctAnswer: 0, 
      category: 'الفصل الخامس', 
      isMinisterial: true, 
      explanation: 'المنطقة العنقية تتكون من 7 فقرات، تليها الصدرية (12)، ثم القطنية (5)، ثم العجزية (5 ملتحمة) والعصعصية (4 ملتحمة).' 
    },
    { 
      id: 'b8', 
      text: 'في تشريح عين الإنسان، ما هو الجزء أو الطبقة الداخلية الحساسة للضوء والتي تحتوي على المستقبلات البصرية (العصي والمخاريط) المسؤولة عن الرؤية؟', 
      options: ['القرنية الشفافة', 'الشبكية', 'المشيمية', 'الصلبة'], 
      correctAnswer: 1, 
      category: 'الفصل الخامس', 
      isMinisterial: true, 
      explanation: 'الشبكية هي الطبقة الداخلية التي تستقبل الضوء وتحوله إلى نبضات عصبية تنتقل عبر العصب البصري للدماغ.' 
    },
    { 
      id: 'b9', 
      text: 'تتكاثر الكائنات الحية بطرق مختلفة. ما هو نوع التكاثر اللاجنسي الشائع الذي يحدث في حيوان البراميسيوم (Paramecium)؟', 
      options: ['الانشطار الثنائي العرضي', 'التبرعم', 'تكوين الأبواغ', 'التجزؤ'], 
      correctAnswer: 0, 
      category: 'الفصل الثالث', 
      isMinisterial: true, 
      explanation: 'البراميسيوم يتكاثر لاجنسياً بالانشطار الثنائي العرضي، وجنسياً بالاقتران أو الإخصاب الذاتي.' 
    },
    { 
      id: 'b10', 
      text: 'وزاري: في نهاية عملية الانقسام الاختزالي الأول (Meiosis I)، ما هي النتيجة الخلوية الدقيقة من حيث عدد الخلايا والمجموعة الكروموسومية؟', 
      options: ['خليتان متماثلتان تماماً للأم', 'أربع خلايا أحادية المجموعة', 'خليتان أحاديتا المجموعة الكروموسومية (1n)', 'خلية واحدة كبيرة جداً'], 
      correctAnswer: 2, 
      category: 'الفصل الأول', 
      explanation: 'الانقسام الاختزالي الأول يفصل الكروموسومات المتماثلة، مما ينتج خليتين تحتوي كل منهما على نصف العدد الأصلي (1n).', 
      isMinisterial: true 
    },
  ],
  arabic: [
    { 
      id: 'a1', 
      text: 'في أسلوب الاستفهام، ما هو نوع الاستفهام الوارد في جملة "أأنت فعلت هذا بآلهتنا يا إبراهيم؟" معللاً إجابتك بناءً على وجود أو غياب "أم" المعادلة؟', 
      options: ['استفهام تصديق', 'استفهام تصور', 'استفهام نفي', 'استفهام تعجب مجازي'], 
      correctAnswer: 0, 
      category: 'قواعد - الاستفهام', 
      explanation: 'الاستفهام بالهمزة بدون "أم" المعادلة هو استفهام تصديق، لأنه يجاب عنه بحرف جواب (نعم أو لا).', 
      isMinisterial: true 
    },
    { 
      id: 'a2', 
      text: 'من بين أدوات النفي في اللغة العربية، ما هي الأداة المحددة التي تفيد نفي الفعل في الزمن الحاضر (الحال) والمستقبل معاً وبدون قرينة زمنية؟', 
      options: ['لم (الجازمة)', 'لن (الناصبة)', 'لا (النافية غير العاملة)', 'ما (النافية)'], 
      correctAnswer: 2, 
      category: 'قواعد - النفي', 
      isMinisterial: true, 
      explanation: '"لا" النافية غير العاملة الداخلة على الفعل المضارع تنفي الحاضر والمستقبل، ولا تنفي أحدهما إلا بقرينة.' 
    },
    { 
      id: 'a3', 
      text: 'في جملة الاستثناء "حضر الطلابُ غيرَ واحدٍ"، ما هو الموقع الإعرابي الدقيق لكلمة "غير" وما هي الحركة الإعرابية التي تظهر عليها؟', 
      options: ['مبتدأ مؤخر', 'مستثنى منصوب وجوباً', 'فاعل مرفوع', 'مضاف إليه مجرور'], 
      correctAnswer: 1, 
      category: 'قواعد - الاستثناء', 
      isMinisterial: true, 
      explanation: 'بما أن الاستثناء تام مثبت، فإن "غير" تأخذ حكم المستثنى بـ "إلا" وهو وجوب النصب على الاستثناء.' 
    },
    { 
      id: 'a4', 
      text: 'عند قول المنادي "يا رجلاً خذ بيدي"، ما هو نوع المنادى هنا من حيث القصد وعدمه، وما هو حكمه الإعرابي (مبني أم معرب)؟', 
      options: ['منادى مضاف معرب', 'منادى شبيه بالمضاف', 'نكرة مقصودة مبنية', 'نكرة غير مقصودة معربة منصوبة'], 
      correctAnswer: 3, 
      category: 'قواعد - النداء', 
      isMinisterial: true, 
      explanation: 'المنادي هنا لا يقصد رجلاً بعينه (نكرة غير مقصودة)، لذا يكون حكمه النصب بالفتحة.' 
    },
    { 
      id: 'a5', 
      text: 'في تاريخ الأدب العربي الحديث، من هو الشاعر العراقي الفحل الذي لقب بـ "شاعر العرب الأكبر" وعُرف بقصائده الوطنية والسياسية القوية؟', 
      options: ['محمد مهدي الجواهري', 'بدر شاكر السياب', 'أبو الطيب المتنبي', 'أحمد شوقي'], 
      correctAnswer: 0, 
      category: 'أدب - الجواهري', 
      isMinisterial: true, 
      explanation: 'الجواهري هو لقب الشاعر محمد مهدي، ولقب بشاعر العرب الأكبر لمكانته الشعرية العالية واتصاله بالتراث.' 
    },
    { 
      id: 'a6', 
      text: 'شهدت خمسينيات القرن العشرين ثورة في شكل القصيدة العربية. ما هي المدرسة أو الحركة الشعرية التي كان السياب ونازك الملائكة من أبرز روادها؟', 
      options: ['مدرسة الديوان', 'مدرسة أبولو', 'حركة الشعر الحر (التفعيلة)', 'مدرسة المهجر'], 
      correctAnswer: 2, 
      category: 'أدب - السياب', 
      isMinisterial: true, 
      explanation: 'الشعر الحر يعتمد على وحدة التفعيلة بدلاً من وحدة البيت والقافية الموحدة، وبدأ بقصيدتي "الكوليرا" و"هل كان حباً".' 
    },
    { 
      id: 'a7', 
      text: 'تعتبر قصيدة "يا دجلة الخير" من عيون الشعر العربي الحديث للجواهري. ما هو المطلع الشهير لهذه القصيدة التي تعبر عن حنين الشاعر لوطنه؟', 
      options: ['حييتُ سفحكِ عن بعدٍ فحيني', 'أرقٌ على أرقٍ ومثلي يأرقُ', 'أمن تذكر جيران بذي سلم', 'أنشودة المطر تهمي'], 
      correctAnswer: 0, 
      category: 'أدب - الجواهري', 
      isMinisterial: true, 
      explanation: 'مطلعها: حييتُ سفحكِ عن بعدٍ فحيني .. يا دجلة الخير يا أم البساتينِ.' 
    },
    { 
      id: 'a8', 
      text: 'نازك الملائكة شاعرة وناقدة عراقية بارزة. ما هو الدور الريادي الذي اقترن اسمها به في تاريخ الأدب العربي المعاصر؟', 
      options: ['رائدة حركة الشعر الحر', 'خنساء العصر الحديث', 'شاعرة النيل والفرات', 'أميرة الشعراء العرب'], 
      correctAnswer: 0, 
      category: 'أدب - نازك الملائكة', 
      isMinisterial: true, 
      explanation: 'تعتبر نازك الملائكة مع السياب من أوائل من كتبوا شعر التفعيلة ونظروا له نقدياً في كتابها "قضايا الشعر المعاصر".' 
    },
    { 
      id: 'a9', 
      text: 'في قواعد اللغة، ما هو الإعراب الصحيح لأسماء الاستفهام الدالة على الذات (من، ما) إذا تلاها فعل متعدٍ قد استوفى مفعوله في الجملة؟', 
      options: ['تعرب في محل رفع مبتدأ', 'تعرب في محل نصب مفعول به', 'تعرب في محل رفع خبر مقدم', 'تعرب مضافاً إليه'], 
      correctAnswer: 0, 
      category: 'قواعد - الاستفهام', 
      isMinisterial: true, 
      explanation: 'إذا استوفى الفعل المتعدي مفعوله، لم يعد بحاجة لاسم الاستفهام ليكمل معناه، فيعرب اسم الاستفهام مبتدأ.' 
    },
    { 
      id: 'a10', 
      text: 'وزاري: حدد نوع "لا" الواردة في قوله تعالى: "لا يُحِبُّ اللَّهُ الْجَهْرَ بِالسُّوءِ مِنَ الْقَوْلِ"، مبيناً أثرها الإعرابي على الفعل المضارع بعدها.', 
      options: ['نافية للجنس عاملة', 'نافية غير عاملة', 'ناهية جازمة للفعل', 'زائدة للتوكيد'], 
      correctAnswer: 1, 
      category: 'قواعد - النفي', 
      explanation: '"لا" هنا تنفي حدوث الفعل ولا تجزمه، لذا هي نافية غير عاملة، والفعل "يحب" يبقى مرفوعاً.', 
      isMinisterial: true 
    },
  ],
  english: [
    { 
      id: 'e1', 
      text: 'In English vocabulary, which of the following words serves as the most accurate synonym for the adjective "Enormous", describing something of great size?', 
      options: ['Small', 'Huge', 'Tiny', 'Weak'], 
      correctAnswer: 1, 
      category: 'Vocabulary', 
      explanation: '"Huge" and "Enormous" both describe something very large in size or amount.', 
      isMinisterial: true 
    },
    { 
      id: 'e2', 
      text: 'When using the verb "to write" in the present perfect or past perfect tense, what is the correct past participle form that should be used?', 
      options: ['wrote', 'writing', 'written', 'writes'], 
      correctAnswer: 2, 
      category: 'Grammar', 
      isMinisterial: true, 
      explanation: 'The forms are: write (present), wrote (past), written (past participle).' 
    },
    { 
      id: 'e3', 
      text: 'Spelling can be tricky in English. Which of the following options provides the correct spelling for the verb meaning to get or accept something?', 
      options: ['Receive', 'Recieve', 'Receve', 'Reseive'], 
      correctAnswer: 0, 
      category: 'Spelling', 
      isMinisterial: true, 
      explanation: 'The rule is "i before e except after c". Since there is a "c", the "e" comes first: Receive.' 
    },
    { 
      id: 'e4', 
      text: 'Phrasal verbs are common in English. In the sentence "The car broke down on the highway," what is the specific meaning of the phrasal verb "break down"?', 
      options: ['To start suddenly', 'To stop working (mechanical)', 'To go very fast', 'To crash into something'], 
      correctAnswer: 1, 
      category: 'Phrasal Verbs', 
      isMinisterial: true, 
      explanation: '"Break down" means a machine or vehicle stops functioning correctly.' 
    },
    { 
      id: 'e5', 
      text: 'Complete the following conditional sentence using the correct form of the verb "to be": "If I _____ you, I would study much harder for the final exams."', 
      options: ['am', 'was', 'were', 'be'], 
      correctAnswer: 2, 
      category: 'Grammar', 
      isMinisterial: true, 
      explanation: 'In second conditional (unreal situations), we use "were" for all subjects (I, he, she, it).' 
    },
    { 
      id: 'e6', 
      text: 'Prefixes can change the meaning of a word. Which of the following prefixes is commonly added to a root word to give it the opposite or negative meaning (meaning "not")?', 
      options: ['Pre- (before)', 'Un- (not)', 'Re- (again)', 'Post- (after)'], 
      correctAnswer: 1, 
      category: 'Vocabulary', 
      isMinisterial: true, 
      explanation: 'Examples: Happy -> Unhappy, Kind -> Unkind. "Un-" means not.' 
    },
    { 
      id: 'e7', 
      text: 'In the context of personality traits, what is the most appropriate antonym (opposite) for the word "generous", which describes someone who gives freely?', 
      options: ['Kind', 'Mean', 'Selfish/Stingy', 'Happy'], 
      correctAnswer: 2, 
      category: 'Vocabulary', 
      isMinisterial: true, 
      explanation: 'A generous person gives to others; a selfish or stingy person keeps things for themselves.' 
    },
    { 
      id: 'e8', 
      text: 'Relative pronouns connect clauses. Choose the correct pronoun to complete this sentence: "The man ___ lives next door to my house is a famous doctor."', 
      options: ['which', 'who', 'whose', 'whom'], 
      correctAnswer: 1, 
      category: 'Grammar', 
      isMinisterial: true, 
      explanation: 'We use "who" for people when they are the subject of the relative clause.' 
    },
    { 
      id: 'e9', 
      text: 'Change the following active voice sentence into the correct passive voice form: "He opens the door every morning when he arrives at work."', 
      options: ['The door is opened.', 'The door was opened.', 'The door is opening.', 'The door will be opened.'], 
      correctAnswer: 0, 
      category: 'Grammar', 
      isMinisterial: true, 
      explanation: 'Present simple passive: am/is/are + past participle. "The door" is singular, so we use "is opened".' 
    },
    { 
      id: 'e10', 
      text: 'Ministerial: Select the grammatically correct option to complete the past event: "She _____ her car keys somewhere in the park yesterday afternoon."', 
      options: ['loses', 'lost', 'has lost', 'is losing'], 
      correctAnswer: 1, 
      category: 'Grammar', 
      explanation: 'The word "yesterday" indicates a finished time in the past, so we must use the Past Simple: "lost".', 
      isMinisterial: true 
    }
  ]
};


export const MOCK_PIE_DATA: ReportData[] = [
  { name: 'إجابات صحيحة', value: 65, color: '#10b981' },
  { name: 'إجابات خاطئة', value: 35, color: '#ef4444' },
];

export const MOCK_SCHEDULE: ScheduleItem[] = [
  { id: '1', subject: 'الرياضيات', time: '08:00 - 10:00', day: 'الأحد' },
  { id: '2', subject: 'الفيزياء', time: '11:00 - 01:00', day: 'الأحد' },
  { id: '3', subject: 'الكيمياء', time: '08:00 - 10:00', day: 'الاثنين' },
  { id: '4', subject: 'الأحياء', time: '10:30 - 12:30', day: 'الاثنين' },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'بطل الرياضيات', description: 'أكملت مراجعة الفصل الأول (الأعداد المركبة)', icon: '🏆', unlocked: true },
  { id: '2', title: 'المثابر اليومي', description: 'مراجعة يومية لمدة أسبوع كامل', icon: '🔥', unlocked: true },
  { id: '3', title: 'عبقري الفيزياء', description: 'حل مسائل ربط المتسعات بنجاح', icon: '🧠', unlocked: false },
  { id: '4', title: 'القارئ النهم', description: 'أنهيت مراجعة الأدب (الجواهري والسياب)', icon: '📖', unlocked: false },
];
