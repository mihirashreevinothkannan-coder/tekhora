import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

const Hero = lazy(() => import('../pages/Hero'));
const Setup = lazy(() => import('../pages/Setup'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const FoodEntry = lazy(() => import('../pages/FoodEntry'));
const Analytics = lazy(() => import('../pages/Analytics'));
const WorkoutPlan = lazy(() => import('../pages/WorkoutPlan'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Hero />
  },
  {
    path: '/setup',
    element: <Setup />
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'log',
        element: <FoodEntry />
      },
      {
        path: 'analytics',
        element: <Analytics />
      },
      {
        path: 'workout',
        element: <WorkoutPlan />
      }
    ]
  }
]);
