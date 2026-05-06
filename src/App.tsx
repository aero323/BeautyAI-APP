/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MockAuthProvider, useMockAuth } from "./context/MockAuthContext";
import MobileLayout from "./components/layout/MobileLayout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { AIPractice } from "./pages/AIPractice";
import { AIPracticeChat } from "./pages/AIPracticeChat";
import { AIPracticeResult } from "./pages/AIPracticeResult";
import { ScriptPractice } from "./pages/ScriptPractice";
import { ScriptPracticeResult } from "./pages/ScriptPracticeResult";
import { SentenceReading } from "./pages/SentenceReading";
import { Course } from "./pages/Course";
import { ExamList } from "./pages/ExamList";
import { ExamIntro } from "./pages/ExamIntro";
import { ExamProcess } from "./pages/ExamProcess";
import { ExamResult } from "./pages/ExamResult";
import { AIQuestion } from "./pages/AIQuestion";
import { Profile } from "./pages/Profile";
import { TaskList } from "./pages/TaskList";
import { PracticeTaskDetail } from "./pages/PracticeTaskDetail";
import { StudyTaskDetail } from "./pages/StudyTaskDetail";

export default function App() {
  return (
    <MockAuthProvider>
      <AppRoutes />
    </MockAuthProvider>
  );
}

function AppRoutes() {
  const { user } = useMockAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MobileLayout />}>
          <Route index element={<Home />} />
          <Route path="practice" element={<AIPractice />} />
          <Route path="practice/chat/:id" element={<AIPracticeChat />} />
          <Route path="practice/result/:id" element={<AIPracticeResult />} />
          <Route path="script/:id" element={<ScriptPractice />} />
          <Route path="script/result/:id" element={<ScriptPracticeResult />} />
          <Route path="reading" element={<SentenceReading />} />
          <Route path="course" element={<Course />} />
          <Route path="exam" element={<ExamList />} />
          <Route path="exam/intro/:id" element={<ExamIntro />} />
          <Route path="exam/run/:id" element={<ExamProcess />} />
          <Route path="exam/result/:id" element={<ExamResult />} />
          <Route path="qa" element={<AIQuestion />} />
          <Route path="profile" element={<Profile />} />
          <Route path="tasks" element={<TaskList />} />
          <Route path="tasks/study/:missionId" element={<StudyTaskDetail />} />
          <Route path="tasks/practice/:missionId" element={<PracticeTaskDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
