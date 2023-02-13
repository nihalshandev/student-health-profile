import { useEffect } from "react";
import { Routes, Route, useLocation, useParams } from "react-router-dom";
import Student from "./Components/Dashboard/Student";
import HealthForm from "./Components/Form/HealthForm";
import Home from "./Home";
import './index.css';

function App() {
  return (
    <>
        <Routes>
          <Route exact path="/" element={<Home />}/>
          <Route path="/add" element={<HealthForm isEditPage={false}/>} />
          <Route path="/student/:uniq_id" element={<Student/>} />
          <Route path="/edit/:uniq_Id" element={<HealthForm isEditPage />}/>
        </Routes>
    </>
  );
}

export default App;
