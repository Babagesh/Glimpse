import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Home from './pages/home'
import App from './App';
import Login from "./pages/login"
import Glimpses from "./pages/glimpses"
import './App.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/login",
    element: <App/>,
  },
  {
    path: "/test",
    element: <Login/>,
  },
  {
    path: "/glimpses",
    element: <Glimpses />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
