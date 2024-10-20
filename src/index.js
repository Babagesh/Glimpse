import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Home from './pages/home'
//import App from './App';
import Login from "./pages/login"
import SignUp from "./pages/signup"
import Glimpses from "./pages/glimpses"
import Map from "./pages/map"
import Existing from "./pages/existing"
import New from "./pages/new"
import Future from "./pages/future"
import About from "./pages/about"
import OurPurpose from "./pages/ourpurpose"
import './App.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/map",
    element: <Map/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/signup",
    element: <SignUp/>,
  },
  {
    path: "/glimpses",
    element: <Glimpses />,
  },
  {
    path: "/existing",
    element: <Existing />
  },
  {
    path: "/new",
    element: <New />
  },
  {
    path: "/future",
    element: <Future />
  },
  {
    path: "/about",
    element: <About />
  },
  {
    path: "/ourpurpose",
    element: <OurPurpose />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
