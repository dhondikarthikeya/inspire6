import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SiteLayout from "./layout/SiteLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Admissions from "./pages/Admissions";
import Placement from "./pages/Placement";
import Gallery from "./pages/Gallery";
import Faculty from "./pages/Faculty";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/courses", element: <Courses /> },
      { path: "/admissions", element: <Admissions /> },
      { path: "/placement", element: <Placement /> },
      { path: "/gallery", element: <Gallery /> },
      { path: "/faculty", element: <Faculty /> },
      { path: "/contact", element: <Contact /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
