import React from "react";
import { useState } from "react";

import CompanyVision from "./views/CompanyVision";
import Revenue from "./views/Revenue";
import Profitability from "./views/Profitability";
import Projects from "./views/Projects";
import CustomerHappiness from "./views/CustomerHappiness";
import Risks from "./views/Risks";
import HumanCapital from "./views/HumanCapital";

import "../styles/base.css";
import "../styles/vision.css";

export default function Shell() {
  const [screen, setScreen] = useState("company-vision");

 const renderScreen = ({ setScreen }) => {
   switch (screen) {
     case "company-vision":
       return <CompanyVision setScreen={setScreen} />;
     case "revenue":
       return <Revenue />;
     case "profitability":
       return <Profitability />;
     case "projects":
       return <Projects />;
     case "customer-happiness":
       return <CustomerHappiness />;  
     case "risks":
       return <Risks />;
     case "human-capital":
       return <HumanCapital />;
     default:
       return <CompanyVision setScreen={setScreen} />;
   }
 };


  return (
    <div className="page">
      <header>
        <h1>Enterprise Accountability</h1>

      </header>

      <main id="screen-container">
        {renderScreen({
          setScreen,   // ?? pass the setter to children
        })}
      </main>


      <footer>
        Enterprise Accountability · Automation.ai
      </footer>
    </div>
  );
}
