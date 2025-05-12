
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/auth-context.tsx'
import { NotificationProvider } from './context/notification-context.tsx'
import { TimetableProvider } from './context/timetable-context.tsx'

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <NotificationProvider>
      <TimetableProvider>
        <App />
      </TimetableProvider>
    </NotificationProvider>
  </AuthProvider>
);
