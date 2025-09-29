import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Dashboard from "./Pages/Dashboard";
import Header from "./Components/Header"; 
import Sidebar from "./Components/Sidebar"; // make sure Dashboard is imported!


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      exact:true,
      element: (

      <>
      <section className="main">
        <Header />
        <div className="contentMain flex">
          <div className="sidebarWrapper w-[18%]">
            <Sidebar />
          </div>
          
          <div className="contentRight p-5 w-[80%]">
            <Dashboard/>

          </div>

          

        </div>
     

      </section>
      </>
      ),
      
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
