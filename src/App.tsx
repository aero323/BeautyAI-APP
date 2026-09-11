import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import MobileLayout from "./components/layout/MobileLayout";
import { CargoProvider, useCargo } from "./cargo/CargoContext";
import { MockAuthProvider, useMockAuth } from "./context/MockAuthContext";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { TaskList } from "./pages/TaskList";
import { CollectionTaskDetail } from "./pages/CollectionTaskDetail";
import { CollectionTaskSuccess } from "./pages/CollectionTaskSuccess";
import { DailyCheckinPage } from "./pages/DailyCheckinPage";

const CargoLogin = lazy(() => import("./pages/CargoLogin").then(module => ({ default: module.CargoLogin })));
const CargoHome = lazy(() => import("./pages/CargoHome").then(module => ({ default: module.CargoHome })));
const CargoAssistant = lazy(() => import("./pages/CargoAssistant").then(module => ({ default: module.CargoAssistant })));
const CargoLearning = lazy(() => import("./pages/CargoLearning").then(module => ({ default: module.CargoLearning })));
const CargoResourcePreview = lazy(() => import("./pages/CargoResourcePreview").then(module => ({ default: module.CargoResourcePreview })));
const CargoPracticeHub = lazy(() => import("./pages/CargoPracticeHub").then(module => ({ default: module.CargoPracticeHub })));
const CargoPractice = lazy(() => import("./pages/CargoPractice").then(module => ({ default: module.CargoPractice })));
const CargoExamHub = lazy(() => import("./pages/CargoExamHub").then(module => ({ default: module.CargoExamHub })));
const CargoProfile = lazy(() => import("./pages/CargoProfile").then(module => ({ default: module.CargoProfile })));
const CargoNotifications = lazy(() => import("./pages/CargoNotifications").then(module => ({ default: module.CargoNotifications })));
const CargoPlanDetail = lazy(() => import("./pages/CargoPlanDetail").then(module => ({ default: module.CargoPlanDetail })));
const CargoCourseDetail = lazy(() => import("./pages/CargoCourseDetail").then(module => ({ default: module.CargoCourseDetail })));
const CargoExam = lazy(() => import("./pages/CargoExam").then(module => ({ default: module.CargoExam })));
const CargoKnowledgeDetail = lazy(() => import("./pages/CargoKnowledgeDetail").then(module => ({ default: module.CargoKnowledgeDetail })));
const CargoVideo = lazy(() => import("./pages/CargoVideo").then(module => ({ default: module.CargoVideo })));
const CargoPoints = lazy(() => import("./pages/CargoPoints").then(module => ({ default: module.CargoPoints })));
const CargoRankings = lazy(() => import("./pages/CargoRankings").then(module => ({ default: module.CargoRankings })));
const CargoBusinessAction = lazy(() => import("./pages/CargoBusinessAction").then(module => ({ default: module.CargoBusinessAction })));
const CargoEventDetail = lazy(() => import("./pages/CargoEventDetail").then(module => ({ default: module.CargoEventDetail })));

export default function App() {
  return (
    <BrowserRouter>
      <MockAuthProvider>
        <CargoProvider>
          <Suspense fallback={<LoadingScreen />}>
            <CargoRoutes />
          </Suspense>
        </CargoProvider>
      </MockAuthProvider>
    </BrowserRouter>
  );
}

function CargoRoutes() {
  const { user } = useCargo();
  if (!user) return <Routes>
    <Route path="beauty" element={<BeautyHomeEntry />} />
    <Route path="beauty/tasks" element={<BeautyTaskEntry />} />
    <Route path="tasks" element={<BeautyTaskEntry />} />
    <Route path="tasks/collection/:missionId" element={<BeautyCollectionEntry />} />
    <Route path="tasks/collection/:missionId/success" element={<BeautyCollectionSuccessEntry />} />
    <Route path="daily-checkin" element={<BeautyDailyCheckinEntry />} />
    <Route path="*" element={<CargoLogin />} />
  </Routes>;
  return (
    <Routes>
      <Route path="/" element={<MobileLayout />}>
        <Route index element={<CargoHome />} />
        <Route path="beauty" element={<BeautyHomeEntry />} />
        <Route path="beauty/tasks" element={<BeautyTaskEntry />} />
        <Route path="assistant" element={<CargoAssistant />} />
        <Route path="assistant/session/:id" element={<CargoAssistant />} />
        <Route path="learning" element={<CargoLearning />} />
        <Route path="learning/resource/:id" element={<CargoResourcePreview />} />
        <Route path="practice" element={<CargoPracticeHub />} />
        <Route path="practice/:id" element={<CargoPractice />} />
        <Route path="exam" element={<CargoExamHub />} />
        <Route path="tasks" element={<BeautyTaskEntry />} />
        <Route path="tasks/collection/:missionId" element={<BeautyCollectionEntry />} />
        <Route path="tasks/collection/:missionId/success" element={<BeautyCollectionSuccessEntry />} />
        <Route path="daily-checkin" element={<BeautyDailyCheckinEntry />} />
        <Route path="profile" element={<CargoProfile />} />
        <Route path="notifications" element={<CargoNotifications />} />
        <Route path="plans/:id" element={<CargoPlanDetail />} />
        <Route path="course/:id" element={<CargoCourseDetail />} />
        <Route path="exam/:id" element={<CargoExam />} />
        <Route path="knowledge/:id" element={<CargoKnowledgeDetail />} />
        <Route path="video/:id" element={<CargoVideo />} />
        <Route path="points" element={<CargoPoints />} />
        <Route path="rankings" element={<CargoRankings />} />
        <Route path="events/:id" element={<CargoEventDetail />} />
        <Route path="business-action/:code" element={<CargoBusinessAction />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function BeautyHomeEntry() { return <BeautyHomeRouter />; }
function BeautyTaskEntry() { return <BeautyTaskRouter />; }
function BeautyCollectionEntry() { return <BeautyCollectionRouter page="detail" />; }
function BeautyCollectionSuccessEntry() { return <BeautyCollectionRouter page="success" />; }
function BeautyDailyCheckinEntry() { const { user } = useMockAuth(); return <BeautyMobileShell>{user ? <DailyCheckinPage /> : <Login />}</BeautyMobileShell>; }
function BeautyHomeRouter() {
  const { user } = useMockAuth();
  return <BeautyMobileShell>{user ? <Home /> : <Login />}</BeautyMobileShell>;
}
function BeautyTaskRouter() {
  const { user } = useMockAuth();
  return <BeautyMobileShell>{user ? <TaskList /> : <Login />}</BeautyMobileShell>;
}
function BeautyCollectionRouter({ page }: { page: "detail" | "success" }) {
  const { user } = useMockAuth();
  return <BeautyMobileShell>{user ? (page === "detail" ? <CollectionTaskDetail /> : <CollectionTaskSuccess />) : <Login />}</BeautyMobileShell>;
}

function BeautyMobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#eef0f3] sm:flex sm:items-center sm:justify-center sm:py-4">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[420px] flex-col overflow-hidden bg-background shadow-2xl sm:min-h-[calc(100vh-2rem)] sm:rounded-[32px] sm:border sm:border-pink-100">
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return <div className="flex min-h-screen items-center justify-center bg-background text-primary"><LoaderCircle size={30} className="animate-spin" /></div>;
}
