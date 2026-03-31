import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  BarChart3, 
  Calendar, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  BrainCircuit,
  GraduationCap,
  Trophy,
  Home,
  Play,
  AlertCircle,
  XCircle,
  Bell,
  Plus,
  Trash2,
  X,
  Settings2,
  Zap,
  ArrowLeft,
  ArrowRight,
  Award,
  Star,
  Flag,
  Loader2,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Search,
  TrendingUp,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  updateDoc,
  deleteDoc,
  arrayUnion,
  limit
} from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';
import { cn } from './lib/utils';
import { 
  MOCK_QUESTIONS, 
  MOCK_PIE_DATA, 
  MOCK_SCHEDULE, 
  MOCK_ACHIEVEMENTS,
  SUBJECTS,
  Question,
  Achievement
} from './types';
import { fetchMinisterialQuestions, toggleQuestionMarking } from './services/questionService';

type Screen = 'home' | 'questions' | 'reports' | 'schedule' | 'achievements' | 'ministerial';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'schedule' | 'question' | 'achievement';
  read: boolean;
  createdAt: any;
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subjectId: string;
  createdBy: string;
  members: string[];
  createdAt: any;
}

interface Message {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: any;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [isMinisterialMode, setIsMinisterialMode] = useState(false);
  const [schedule, setSchedule] = useState(MOCK_SCHEDULE);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        } else {
          const newProfile = {
            uid: currentUser.uid,
            name: currentUser.displayName || 'طالب جديد',
            email: currentUser.email,
            role: 'student',
            createdAt: new Date().toISOString()
          };
          await setDoc(doc(db, 'users', currentUser.uid), newProfile);
          setUserProfile(newProfile);
        }
      } else {
        setUserProfile(null);
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Real-time notifications
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      setNotifications(newNotifications);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleSwitch = () => {
      setActiveScreen('ministerial');
      setSelectedSubject(null);
      setSelectedChapter(null);
      setIsMinisterialMode(false);
    };
    window.addEventListener('switch-to-ministerial', handleSwitch);
    return () => window.removeEventListener('switch-to-ministerial', handleSwitch);
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setActiveScreen('home');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#f8faff] dark:bg-slate-950 transition-colors duration-300">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-600 dark:text-slate-400 font-bold">جاري التحميل...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} darkMode={darkMode} />;
  }

  const activeSubject = selectedSubject ? SUBJECTS.find(s => s.id === selectedSubject) : null;
  const activeSubjectName = activeSubject?.name || '';

  return (
    <div className={cn("flex h-screen font-sans overflow-hidden transition-colors duration-300", darkMode && "dark")} dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 flex flex-col shadow-sm z-10 transition-colors duration-300">
        <div className="p-6 flex items-center gap-3 border-b border-slate-50 dark:border-slate-800">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">المراجعة الذكية</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavItem 
            icon={<Home className="w-5 h-5" />} 
            label="الرئيسية" 
            active={activeScreen === 'home'} 
            onClick={() => {
              setActiveScreen('home');
              setSelectedSubject(null);
              setSelectedChapter(null);
            }} 
          />
          <NavItem 
            icon={<BookOpen className="w-5 h-5" />} 
            label="الأسئلة" 
            active={activeScreen === 'questions'} 
            onClick={() => {
              if (!selectedSubject) setSelectedSubject('math'); // Default to math if none selected
              setActiveScreen('questions');
            }} 
          />
          <NavItem 
            icon={<Award className="w-5 h-5" />} 
            label="الأسئلة الوزارية" 
            active={activeScreen === 'ministerial'} 
            onClick={() => {
              setActiveScreen('ministerial');
              setSelectedSubject(null);
              setSelectedChapter(null);
            }} 
          />
          <NavItem 
            icon={<BarChart3 className="w-5 h-5" />} 
            label="التقارير" 
            active={activeScreen === 'reports'} 
            onClick={() => setActiveScreen('reports')} 
          />
          <NavItem 
            icon={<Calendar className="w-5 h-5" />} 
            label="الجدول الذكي" 
            active={activeScreen === 'schedule'} 
            onClick={() => setActiveScreen('schedule')} 
          />
          <NavItem 
            icon={<Trophy className="w-5 h-5" />} 
            label="الإنجازات" 
            active={activeScreen === 'achievements'} 
            onClick={() => setActiveScreen('achievements')} 
          />
          
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setDarkMode(!darkMode);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 shadow-sm transition-colors overflow-hidden pointer-events-none">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={darkMode ? 'sun' : 'moon'}
                  initial={{ y: 20, opacity: 0, rotate: -45 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -20, opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.2 }}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </div>
            <span className="font-bold text-sm pointer-events-none">{darkMode ? 'الوضع المضيء' : 'الوضع الليلي'}</span>
          </button>
          <button 
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
          >
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 shadow-sm transition-colors">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm">تسجيل الخروج</span>
          </button>
        </nav>

        <div className="p-6 border-t border-slate-50 dark:border-slate-800">
          <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-2xl flex items-center gap-3 border border-indigo-50 dark:border-indigo-900/30">
            <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-full">
              <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">المستوى الدراسي</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">السادس العلمي</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[#f8faff] dark:bg-slate-950 transition-colors duration-300">
        <header className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-8 py-4 flex justify-between items-center z-20 transition-colors duration-300">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {activeScreen === 'home' && 'لوحة التحكم'}
            {activeScreen === 'questions' && `بنك الأسئلة - ${activeSubjectName}${selectedChapter ? ` (${selectedChapter})` : ''}`}
            {activeScreen === 'ministerial' && `الأسئلة الوزارية - ${selectedSubject ? activeSubjectName : 'اختر المادة'}`}
            {activeScreen === 'reports' && 'تقارير الأداء'}
            {activeScreen === 'schedule' && 'الجدول الدراسي'}
            {activeScreen === 'achievements' && 'سجل الإنجازات'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">التنبيهات</h3>
                      <button className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">تحديد الكل كمقروء</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                          <p className="text-sm">لا توجد تنبيهات حالياً</p>
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={cn("p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer", !n.read && "bg-indigo-50/30 dark:bg-indigo-900/10")}>
                            <div className="flex gap-3">
                              <div className={cn("p-2 rounded-xl", 
                                n.type === 'schedule' ? "bg-blue-100 text-blue-600" : 
                                n.type === 'achievement' ? "bg-amber-100 text-amber-600" : 
                                "bg-indigo-100 text-indigo-600"
                              )}>
                                {n.type === 'schedule' ? <Calendar className="w-4 h-4" /> : 
                                 n.type === 'achievement' ? <Trophy className="w-4 h-4" /> : 
                                 <AlertCircle className="w-4 h-4" />}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{n.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{n.body}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="text-left">
              <p className="text-xs text-slate-400 dark:text-slate-500">مرحباً بك،</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{userProfile?.name || user?.displayName || 'طالب'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-900 shadow-sm overflow-hidden">
              <img src={user?.photoURL || "https://picsum.photos/seed/student/100/100"} alt="Avatar" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {activeScreen === 'home' && (
              <HomeScreen 
                onSelectSubject={(id) => {
                  setSelectedSubject(id);
                  setSelectedChapter(null);
                  setIsMinisterialMode(false);
                  setActiveScreen('questions');
                }} 
              />
            )}
            {activeScreen === 'ministerial' && !selectedSubject && (
              <MinisterialQuestionsScreen 
                onSelectSubject={(id) => {
                  setSelectedSubject(id);
                  setIsMinisterialMode(true);
                }} 
              />
            )}
            {activeScreen === 'ministerial' && selectedSubject && (
              <QuestionsScreen 
                subjectId={selectedSubject} 
                chapter={null}
                isMinisterialOnly={true}
                userId={user?.uid}
                onBack={() => setSelectedSubject(null)}
              />
            )}
            {activeScreen === 'questions' && selectedSubject && !selectedChapter && (
              <ChaptersScreen 
                subjectId={selectedSubject} 
                onSelectChapter={(chapter) => setSelectedChapter(chapter)} 
                onBack={() => {
                  setSelectedSubject(null);
                  setActiveScreen('home');
                }}
              />
            )}
            {activeScreen === 'questions' && selectedSubject && selectedChapter && (
              <QuestionsScreen 
                subjectId={selectedSubject} 
                chapter={selectedChapter}
                userId={user?.uid}
                onBack={() => setSelectedChapter(null)}
              />
            )}
            {activeScreen === 'reports' && <ReportsScreen userId={user?.uid} />}
            {activeScreen === 'schedule' && (
              <ScheduleScreen 
                userId={user?.uid}
                onStudyNow={(subjectName) => {
                  const subject = SUBJECTS.find(s => s.name === subjectName);
                  if (subject) {
                    setSelectedSubject(subject.id);
                    setSelectedChapter(null);
                    setActiveScreen('questions');
                  }
                }}
              />
            )}
            {activeScreen === 'achievements' && <AchievementsScreen />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function LoginScreen({ onLogin, darkMode }: { onLogin: () => void, darkMode: boolean }) {
  return (
    <div className={cn("h-screen w-screen flex items-center justify-center bg-[#f8faff] dark:bg-slate-950 transition-colors duration-300", darkMode && "dark")} dir="rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl max-w-md w-full text-center space-y-8"
      >
        <div className="space-y-4">
          <div className="bg-indigo-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-200 dark:shadow-indigo-900/30">
            <BrainCircuit className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">المراجعة الذكية</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">مرحباً بك في منصتك التعليمية المتكاملة</p>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 text-right space-y-2">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              مميزات المنصة
            </h3>
            <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
              <li>• بنك أسئلة شامل لجميع المواد</li>
              <li>• أسئلة وزارية محدثة باستمرار</li>
              <li>• تقارير أداء ذكية وجدول دراسي</li>
            </ul>
          </div>

          <button 
            onClick={onLogin}
            className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 p-4 rounded-2xl flex items-center justify-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all group shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
            <span className="font-bold text-slate-700 dark:text-slate-200">الدخول باستخدام جوجل</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500">
          بتسجيل الدخول، أنت توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا
        </p>
      </motion.div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
        active 
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20" 
          : "text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
      )}
    >
      {icon}
      <span className="font-bold text-sm">{label}</span>
    </button>
  );
}

function HomeScreen({ onSelectSubject }: { onSelectSubject: (id: string) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      <div className="text-center space-y-4">
        <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">اختر المادة للمراجعة</h3>
        <p className="text-slate-500 dark:text-slate-400">حدد المادة التي ترغب في مراجعتها اليوم للبدء في الاختبارات</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {SUBJECTS.map((subject) => (
          <button 
            key={subject.id}
            onClick={() => onSelectSubject(subject.id)}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col items-center gap-4"
          >
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner", subject.color)}>
              {subject.icon}
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{subject.name}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-4 pt-8">
        <button 
          onClick={() => onSelectSubject('math')}
          className="group relative px-12 py-6 bg-indigo-600 text-white rounded-full font-bold text-xl shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/20 hover:bg-indigo-700 transition-all flex items-center gap-4 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <Play className="w-6 h-6 fill-current" />
          ابدأ المراجعة الآن
        </button>
        <button 
          onClick={() => {
            // This will be handled by the parent to switch to ministerial screen
            window.dispatchEvent(new CustomEvent('switch-to-ministerial'));
          }}
          className="group relative px-12 py-6 bg-amber-500 text-white rounded-full font-bold text-xl shadow-2xl shadow-amber-200 dark:shadow-amber-900/20 hover:bg-amber-600 transition-all flex items-center gap-4 overflow-hidden"
        >
          <Award className="w-6 h-6" />
          الأسئلة الوزارية
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="space-y-2">
          <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">إحصائيات سريعة</h4>
          <p className="text-slate-500 dark:text-slate-400">لقد أنجزت 75% من أهدافك لهذا الأسبوع</p>
        </div>
        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">12</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">اختبارات</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">85</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">إجابات صحيحة</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MinisterialQuestionsScreen({ onSelectSubject }: { onSelectSubject: (id: string) => void }) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [markedQuestions, setMarkedQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Fetch all ministerial questions to get counts and marked ones
      const allMinisterial = await fetchMinisterialQuestions();
      
      const newCounts: Record<string, number> = {};
      SUBJECTS.forEach(s => {
        newCounts[s.id] = allMinisterial.filter(q => 
          Object.keys(MOCK_QUESTIONS).find(key => 
            MOCK_QUESTIONS[key].some(mq => mq.id === q.id) && key === s.id
          )
        ).length;
      });
      
      // Filter marked questions
      const marked = allMinisterial.filter(q => q.isImportant || q.isChallenging);
      
      setCounts(newCounts);
      setMarkedQuestions(marked);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 font-bold">جاري تحميل البيانات الوزارية...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/20 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <Award className="w-10 h-10 text-amber-600 dark:text-amber-400" />
        </div>
        <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">بنك الأسئلة الوزارية</h3>
        <p className="text-slate-500 dark:text-slate-400">مجموعة مختارة من الأسئلة الوزارية لجميع المواد لتعزيز استعدادك للامتحانات</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {SUBJECTS.map((subject) => {
          const ministerialCount = counts[subject.id] || 0;
          return (
            <button 
              key={subject.id}
              onClick={() => onSelectSubject(subject.id)}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-center gap-4 relative overflow-hidden"
            >
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner transition-transform group-hover:scale-110", subject.color)}>
                {subject.icon}
              </div>
              <div className="text-center">
                <span className="font-bold text-slate-800 dark:text-slate-100 block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{subject.name}</span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full mt-2 inline-block">
                  {ministerialCount} سؤال وزاري
                </span>
              </div>
              <div className="absolute -top-2 -right-2 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
                <Award className="w-12 h-12 text-amber-600 dark:text-amber-400" />
              </div>
            </button>
          );
        })}
      </div>

      {markedQuestions.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-current" />
              الأسئلة المميزة
            </h4>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{markedQuestions.length} سؤال</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {markedQuestions.map(q => (
              <div key={q.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-lg">
                    {q.category}
                  </span>
                  <div className="flex gap-1">
                    {q.isImportant && <Star className="w-4 h-4 text-amber-500 fill-current" />}
                    {q.isChallenging && <Flag className="w-4 h-4 text-red-500 fill-current" />}
                  </div>
                </div>
                <p className="text-sm text-slate-700 font-medium line-clamp-2">{q.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 flex items-center gap-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <BrainCircuit className="w-8 h-8 text-indigo-600" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-800">لماذا الأسئلة الوزارية؟</h4>
          <p className="text-slate-600 text-sm mt-1 leading-relaxed">
            تعتبر الأسئلة الوزارية للسنوات السابقة هي المفتاح لفهم نمط الامتحانات الرسمية والتركيز على المواضيع الأكثر تكراراً وأهمية.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ChaptersScreen({ 
  subjectId, 
  onSelectChapter, 
  onBack 
}: { 
  subjectId: string, 
  onSelectChapter: (c: string) => void, 
  onBack: () => void 
}) {
  const subject = SUBJECTS.find(s => s.id === subjectId);
  if (!subject) return null;

  const allQuestions = MOCK_QUESTIONS[subjectId] || [];

  const getChapterQuestionCount = (chapterName: string) => {
    return allQuestions.filter(q => q.category === chapterName).length;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">فصول مادة {subject.name}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">اختر الفصل للمراجعة</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subject.chapters?.map((chapter) => {
          const count = getChapterQuestionCount(chapter);
          return (
            <div 
              key={chapter}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col gap-6 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                    {subject.chapters?.indexOf(chapter)! + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{chapter}</h4>
                    <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">
                      {count > 0 ? 'تمارين متوفرة' : 'قريباً'}
                    </span>
                  </div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                  متاح الآن
                </div>
              </div>

              {count > 0 && (
                <div className="flex items-center gap-3 pt-4 border-t border-slate-50 dark:border-slate-800">
                  <button 
                    onClick={() => onSelectChapter(chapter)}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    ابدأ المراجعة
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function QuestionsScreen({ 
  subjectId, 
  chapter, 
  onBack,
  userId,
  isMinisterialOnly = false
}: { 
  subjectId: string, 
  chapter: string | null, 
  onBack: () => void,
  userId?: string,
  isMinisterialOnly?: boolean
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [isAnswered, setIsAnswered] = useState<boolean[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(isMinisterialOnly);
  const [fetchedQuestions, setFetchedQuestions] = useState<Question[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [limit, setLimit] = useState<number | null>(null);
  const [limitInput, setLimitInput] = useState<string>("");
  
  const allQuestions = MOCK_QUESTIONS[subjectId] || [];
  const questions = useMemo(() => {
    let available = isMinisterialOnly ? fetchedQuestions : allQuestions.filter(q => q.category === chapter);
    
    // Shuffle the available questions to ensure variety and no repetition in the same order
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    
    if (!isStarted || limit === null) return shuffled;
    return shuffled.slice(0, limit);
  }, [subjectId, chapter, allQuestions, isMinisterialOnly, fetchedQuestions, isStarted, limit]);

  useEffect(() => {
    if (isMinisterialOnly) {
      setIsLoading(true);
      fetchMinisterialQuestions(subjectId, userId).then(data => {
        setFetchedQuestions(data);
        setIsLoading(false);
      });
    }
  }, [isMinisterialOnly, subjectId, userId]);

  useEffect(() => {
    setUserAnswers(new Array(questions.length).fill(null));
    setIsAnswered(new Array(questions.length).fill(false));
    setCurrentIdx(0);
    setShowResults(false);
  }, [questions]);

  const question = questions[currentIdx];

  const handleToggleMark = async (type: 'isChallenging' | 'isImportant') => {
    if (!question) return;
    await toggleQuestionMarking(userId, question.id, type);
    
    // Update local state to reflect change immediately
    const updatedQuestions = [...questions];
    updatedQuestions[currentIdx] = {
      ...question,
      [type]: !question[type]
    };
    if (isMinisterialOnly) {
      setFetchedQuestions(updatedQuestions);
    }
    // Note: for non-ministerial, we'd need to update MOCK_QUESTIONS or use a state for all questions
  };

  const handleOptionSelect = (idx: number) => {
    if (isAnswered[currentIdx]) return;
    const newAnswers = [...userAnswers];
    newAnswers[currentIdx] = idx;
    setUserAnswers(newAnswers);
  };

  const handleCheck = () => {
    if (userAnswers[currentIdx] !== null) {
      const newAnswered = [...isAnswered];
      newAnswered[currentIdx] = true;
      setIsAnswered(newAnswered);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  useEffect(() => {
    if (showResults && userId && questions.length > 0) {
      const correctCount = questions.reduce((acc, q, idx) => 
        acc + (userAnswers[idx] === q.correctAnswer ? 1 : 0), 0
      );
      const score = Math.round((correctCount / questions.length) * 100);
      
      const saveResult = async () => {
        try {
          await addDoc(collection(db, 'users', userId, 'quizResults'), {
            userId,
            subjectId,
            chapter: chapter || 'وزاري',
            score,
            totalQuestions: questions.length,
            correctAnswers: correctCount,
            isMinisterial: isMinisterialOnly,
            createdAt: new Date().toISOString()
          });
        } catch (error) {
          console.error("Error saving quiz result:", error);
        }
      };
      saveResult();
    }
  }, [showResults, userId, questions, userAnswers, subjectId, chapter, isMinisterialOnly]);

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-40 gap-6"
      >
        <div className="bg-indigo-50 p-6 rounded-full animate-spin">
          <Loader2 className="w-12 h-12 text-indigo-600" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-slate-800">جاري جلب الأسئلة الوزارية...</h3>
          <p className="text-slate-500">يرجى الانتظار قليلاً، نقوم بالاتصال بقاعدة البيانات.</p>
        </div>
      </motion.div>
    );
  }

  if (questions.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 gap-6"
      >
        <div className="bg-orange-50 p-6 rounded-full">
          <AlertCircle className="w-12 h-12 text-orange-500" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-slate-800">عذراً، لا توجد أسئلة حالياً</h3>
          <p className="text-slate-500">جاري العمل على إضافة أسئلة لهذا الفصل قريباً.</p>
        </div>
        <button 
          onClick={onBack}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          العودة للفصول
        </button>
      </motion.div>
    );
  }

  if (!isStarted) {
    const maxQuestions = questions.length;
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl max-w-md mx-auto space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mx-auto">
            <Settings2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">إعداد المراجعة</h3>
          <p className="text-slate-500 dark:text-slate-400">
            {isMinisterialOnly ? 'الأسئلة الوزارية' : `الفصل: ${chapter}`}
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 text-right">
              عدد الأسئلة (المتوفر: {maxQuestions})
            </label>
            <input 
              type="number"
              min="1"
              max={maxQuestions}
              value={limitInput}
              onChange={(e) => setLimitInput(e.target.value)}
              placeholder={`أدخل عدداً بين 1 و ${maxQuestions}`}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-center font-bold text-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
          اترك الحقل فارغاً للإجابة على جميع الأسئلة
        </p>

        <div className="flex gap-4 pt-4">
          <button 
            onClick={onBack}
            className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            إلغاء
          </button>
          <button 
            onClick={() => {
              const val = parseInt(limitInput);
              if (limitInput === "") {
                setLimit(null);
                setIsStarted(true);
              } else if (!isNaN(val) && val > 0 && val <= maxQuestions) {
                setLimit(val);
                setIsStarted(true);
              } else if (!isNaN(val) && val > maxQuestions) {
                setLimit(maxQuestions);
                setIsStarted(true);
              }
            }}
            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            ابدأ الآن
          </button>
        </div>
      </motion.div>
    );
  }

  if (showResults) {
    const correctCount = questions.reduce((acc, q, idx) => 
      acc + (userAnswers[idx] === q.correctAnswer ? 1 : 0), 0
    );
    const percentage = Math.round((correctCount / questions.length) * 100);

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl text-center space-y-8"
      >
        <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto">
          <Trophy className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">أحسنت! لقد أكملت المراجعة</h3>
          <p className="text-slate-500 dark:text-slate-400">إليك ملخص أدائك في {isMinisterialOnly ? 'الأسئلة الوزارية' : chapter}</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mb-1">الأسئلة</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{questions.length}</p>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-1">صحيحة</p>
            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{correctCount}</p>
          </div>
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-1">النسبة</p>
            <p className="text-xl font-bold text-indigo-700 dark:text-indigo-300">{percentage}%</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => {
              setCurrentIdx(0);
              setShowResults(false);
              setUserAnswers(new Array(questions.length).fill(null));
              setIsAnswered(new Array(questions.length).fill(false));
            }}
            className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            إعادة المحاولة
          </button>
          <button 
            onClick={onBack}
            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20"
          >
            {isMinisterialOnly ? 'العودة للمواد' : 'العودة للفصول'}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6"
    >
      {/* Progress Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors">
              <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            </button>
            <h4 className="font-bold text-slate-700 dark:text-slate-200">{isMinisterialOnly ? 'الأسئلة الوزارية' : chapter}</h4>
          </div>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-lg">
            {currentIdx + 1} / {questions.length}
          </span>
        </div>
        <div className="relative h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full" 
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                {currentIdx + 1}
              </span>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">سؤال</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
            {question.text}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, idx) => {
            const isCorrect = idx === question.correctAnswer;
            const isSelected = idx === userAnswers[currentIdx];
            const answered = isAnswered[currentIdx];
            
            let variant = "border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10";
            if (answered) {
              if (isCorrect) variant = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300";
              else if (isSelected) variant = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300";
              else variant = "opacity-50 border-slate-100 dark:border-slate-800";
            } else if (isSelected) {
              variant = "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300";
            }

            return (
              <button
                key={idx}
                disabled={answered}
                onClick={() => handleOptionSelect(idx)}
                className={cn(
                  "p-5 rounded-2xl border-2 text-right transition-all flex items-center justify-between group",
                  variant
                )}
              >
                <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors",
                      isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                    )}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
                {answered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                {answered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
              </button>
            );
          })}
        </div>

        {isAnswered[currentIdx] && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800"
          >
            <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              شرح الإجابة:
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {question.explanation}
            </p>
          </motion.div>
        )}

        <div className="flex justify-between items-center pt-6 border-t border-slate-50 dark:border-slate-800">
          <button 
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="flex items-center gap-2 px-6 py-3 text-slate-400 dark:text-slate-500 font-bold hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-30 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
            السابق
          </button>
          
          {!isAnswered[currentIdx] ? (
            <button 
              onClick={handleCheck}
              disabled={userAnswers[currentIdx] === null}
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              تأكيد الإجابة
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="flex items-center gap-2 px-10 py-4 bg-slate-800 dark:bg-slate-700 text-white rounded-2xl font-bold hover:bg-slate-900 dark:hover:bg-slate-600 transition-all"
            >
              {currentIdx === questions.length - 1 ? 'إنهاء المراجعة' : 'السؤال التالي'}
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ReportsScreen({ userId }: { userId?: string }) {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const q = query(
      collection(db, 'users', userId, 'quizResults'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newResults = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResults(newResults);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [userId]);

  const PERFORMANCE_DATA = useMemo(() => {
    if (results.length === 0) return [
      { name: 'الأسبوع 1', score: 0 },
      { name: 'الأسبوع 2', score: 0 },
      { name: 'الأسبوع 3', score: 0 },
    ];
    
    // Group by week or just show last 10 results for simplicity
    return results.slice(0, 10).reverse().map((r, idx) => ({
      name: `اختبار ${results.length - results.indexOf(r)}`,
      score: r.score
    }));
  }, [results]);

  const SUBJECT_PERFORMANCE = useMemo(() => {
    const subjects = SUBJECTS.map(s => {
      const subjectResults = results.filter(r => r.subjectId === s.id);
      if (subjectResults.length === 0) return { subject: s.name, score: 0, trend: 'neutral' };
      
      const avgScore = Math.round(subjectResults.reduce((acc, r) => acc + r.score, 0) / subjectResults.length);
      return { subject: s.name, score: avgScore, trend: 'up' };
    });
    return subjects;
  }, [results]);

  const weakestSubject = useMemo(() => {
    const validSubjects = SUBJECT_PERFORMANCE.filter(s => s.score > 0);
    if (validSubjects.length === 0) return { subject: 'لا توجد بيانات', score: 0 };
    return validSubjects.reduce((prev, current) => (prev.score < current.score) ? prev : current);
  }, [SUBJECT_PERFORMANCE]);

  const avgImprovement = useMemo(() => {
    if (results.length < 2) return 0;
    const latest = results[0].score;
    const previous = results[1].score;
    return latest - previous;
  }, [results]);

  if (isLoading && userId) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-bold">جاري تحميل التقارير...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-2xl">
            <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">معدل التحسن</p>
            <p className={cn("text-xl font-bold", avgImprovement >= 0 ? "text-emerald-600" : "text-red-600")}>
              {avgImprovement > 0 ? `+${avgImprovement}%` : `${avgImprovement}%`}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-2xl">
            <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">أعلى مادة</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {SUBJECT_PERFORMANCE.reduce((prev, current) => (prev.score > current.score) ? prev : current).subject}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-2xl">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">تحتاج تركيز</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{weakestSubject.subject}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Improvement Chart */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">تطور الأداء عبر الزمن</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PERFORMANCE_DATA}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">تحليل المواد</h3>
          <div className="space-y-6">
            {SUBJECT_PERFORMANCE.map((item) => (
              <div key={item.subject} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.subject}</span>
                    {item.trend === 'up' ? <ArrowUpRight className="w-4 h-4 text-emerald-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
                  </div>
                  <span className={cn("text-xs font-bold", item.score > 80 ? "text-emerald-600" : item.score > 60 ? "text-amber-600" : "text-red-600")}>
                    {item.score}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-1000", item.score > 80 ? "bg-emerald-500" : item.score > 60 ? "bg-amber-500" : "bg-red-500")} 
                    style={{ width: `${item.score}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/30 space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-xl">
                <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="font-bold text-indigo-800 dark:text-indigo-200">استمر في التقدم</h4>
            </div>
            <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
              أداؤك العام في تحسن مستمر! حافظ على هذا النشاط وقم بمراجعة المواد التي أكملتها بانتظام لضمان تثبيت المعلومات.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function WeaknessItem({ subject, progress }: { subject: string, progress: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium">
        <span className="text-slate-700 dark:text-slate-300">{subject}</span>
        <span className="text-red-500">تحتاج مراجعة</span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-red-400 rounded-full" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function PlanCard({ day, task }: { day: string, task: string }) {
  return (
    <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-50 dark:border-indigo-900/30">
      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">{day}</span>
      <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 font-medium">{task}</p>
    </div>
  );
}

function ScheduleScreen({ 
  userId,
  onStudyNow 
}: { 
  userId?: string,
  onStudyNow: (subject: string) => void
}) {
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const [schedule, setSchedule] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ subject: 'الرياضيات', time: '', day: 'الأحد' });

  useEffect(() => {
    if (!userId) {
      setSchedule(MOCK_SCHEDULE);
      setIsLoading(false);
      return;
    }
    const q = query(
      collection(db, 'users', userId, 'schedule'),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newSchedule = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSchedule(newSchedule);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [userId]);

  const currentDayIndex = new Date().getDay();
  const currentDayName = days[currentDayIndex];
  const currentHour = new Date().getHours();

  const handleAdd = async () => {
    if (!newItem.time) return;
    if (!userId) {
      const item = {
        id: Math.random().toString(36).substr(2, 9),
        ...newItem
      };
      setSchedule([...schedule, item]);
      setIsModalOpen(false);
      setNewItem({ subject: 'الرياضيات', time: '', day: 'الأحد' });
      return;
    }

    try {
      await addDoc(collection(db, 'users', userId, 'schedule'), {
        userId,
        ...newItem,
        createdAt: new Date().toISOString()
      });
      setIsModalOpen(false);
      setNewItem({ subject: 'الرياضيات', time: '', day: 'الأحد' });
    } catch (error) {
      console.error("Error adding schedule item:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!userId) {
      setSchedule(schedule.filter(item => item.id !== id));
      return;
    }
    try {
      await deleteDoc(doc(db, 'users', userId, 'schedule', id));
    } catch (error) {
      console.error("Error deleting schedule item:", error);
    }
  };

  const generateSmartSchedule = async () => {
    const suggested = SUBJECTS.map((s, index) => ({
      subject: s.name,
      time: index % 2 === 0 ? '08:00 - 10:00' : '11:00 - 01:00',
      day: days[index % days.length],
      createdAt: new Date().toISOString()
    }));

    if (!userId) {
      setSchedule(suggested.map(s => ({ ...s, id: Math.random().toString(36).substr(2, 9) })));
      return;
    }

    try {
      for (const item of suggested) {
        await addDoc(collection(db, 'users', userId, 'schedule'), {
          userId,
          ...item
        });
      }
    } catch (error) {
      console.error("Error generating smart schedule:", error);
    }
  };

  if (isLoading && userId) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-bold">جاري تحميل الجدول...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">التقويم الأسبوعي</h3>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={generateSmartSchedule}
              className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl text-sm font-bold hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all"
            >
              <Zap className="w-4 h-4" />
              توليد جدول ذكي
            </button>
            <button 
              onClick={async () => {
                if (!userId) {
                  setSchedule([]);
                  return;
                }
                for (const item of schedule) {
                  await deleteDoc(doc(db, 'users', userId, 'schedule', item.id));
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              مسح الكل
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              إضافة موعد
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {days.map(day => (
            <div key={day} className={cn("space-y-4", day === currentDayName && "relative")}>
              {day === currentDayName && (
                <div className="absolute -right-4 top-0 bottom-0 w-1 bg-indigo-600 rounded-full" />
              )}
              <div className="flex items-center justify-between">
                <h4 className={cn("font-bold text-lg", day === currentDayName ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500")}>
                  {day}
                  {day === currentDayName && <span className="mr-2 text-xs bg-indigo-100 dark:bg-indigo-900/40 px-2 py-1 rounded-full">اليوم</span>}
                </h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schedule.filter(item => item.day === day).length === 0 ? (
                  <div className="col-span-full py-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-300 dark:text-slate-600">
                    <p className="text-sm">لا توجد مواعيد دراسية</p>
                  </div>
                ) : (
                  schedule.filter(item => item.day === day).map(item => (
                    <motion.div 
                      key={item.id}
                      whileHover={{ y: -2 }}
                      className={cn(
                        "p-4 rounded-2xl border transition-all group relative",
                        day === currentDayName ? "bg-indigo-50/30 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/20" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                      )}
                    >
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="absolute top-2 left-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm">
                          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{item.subject}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs font-medium">{item.time}</span>
                        </div>
                        <button 
                          onClick={() => onStudyNow(item.subject)}
                          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          ابدأ الآن
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl z-10 overflow-hidden border border-slate-100 dark:border-slate-800"
            >
              <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">إضافة موعد دراسي</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">المادة</label>
                  <select 
                    value={newItem.subject}
                    onChange={(e) => setNewItem({...newItem, subject: e.target.value})}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                  >
                    {SUBJECTS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">اليوم</label>
                  <select 
                    value={newItem.day}
                    onChange={(e) => setNewItem({...newItem, day: e.target.value})}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                  >
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">الوقت</label>
                  <input 
                    type="text"
                    placeholder="مثال: 08:00 - 10:00"
                    value={newItem.time}
                    onChange={(e) => setNewItem({...newItem, time: e.target.value})}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <button 
                  onClick={handleAdd}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all mt-4 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20"
                >
                  حفظ الموعد
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AchievementsScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {MOCK_ACHIEVEMENTS.map((achievement) => (
        <div 
          key={achievement.id}
          className={cn(
            "bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center gap-4 transition-all",
            !achievement.unlocked && "opacity-50 grayscale"
          )}
        >
          <div className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-inner",
            achievement.unlocked ? "bg-yellow-50 dark:bg-yellow-900/20" : "bg-slate-50 dark:bg-slate-800"
          )}>
            {achievement.icon}
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">{achievement.title}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{achievement.description}</p>
          </div>
          {achievement.unlocked ? (
            <span className="px-4 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold">تم الإنجاز</span>
          ) : (
            <span className="px-4 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full text-xs font-bold">قيد التقدم</span>
          )}
        </div>
      ))}
    </motion.div>
  );
}
