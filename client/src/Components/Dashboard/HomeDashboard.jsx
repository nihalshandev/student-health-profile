import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Image from "./Image";

function HomeDashboard() {
  // const [studentsInfo, setStudentsInfo] = useState([]);
  const [studentsPersonalInfo, setStudentsPersonalInfo] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/get-all-students")
      .then((res) => {
        setStudentsPersonalInfo(res.data);
      })
      .catch((err) => console.log(err));

  }, []);
  studentsPersonalInfo.map((personalInfo) => {
    console.log(personalInfo);
  });
  return (
    <div>
      {studentsPersonalInfo != 0 ? null : (
        <div className="text-center mt-10 text-2xl">
          <h1>Can't find any student</h1>
          <button
            onClick={() => navigate("/add")}
            className={`inline-flex mt-3 justify-center rounded-md border border-indigo-600 bg-transparent py-2 px-4 text-sm font-medium text-gray-700 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
          >
            Add New Student
          </button>
        </div>
      )}
      <div className="p-5 grid lg:grid-cols-6 sm:grid-cols-4 gap-4 ">
        {studentsPersonalInfo
          ? studentsPersonalInfo.map((personalInfo) => (
              <div
                className="px-4 lg:col-span-1 sm:col-span-4 md:col-span-3 pt-4 w-60 bg-white border border-gray-200 rounded-lg shadow"
                key={personalInfo.uniq_id}
              >
                <Image personalInfo={personalInfo} />

                <div className="px-5 pb-5 -ml-4">
                  <h5 className="text-lg text-gray-900">
                    {personalInfo.fullName}
                  </h5>
                  <p className="text-sm text-gray-700">
                    Class - {`${personalInfo.class} - ${personalInfo.division}`}
                  </p>
                  <p className="text-sm text-gray-700">
                    Mobile - +91 {personalInfo.mobile}
                  </p>
                  {/* <div className="flex items-center mt-2.5 mb-5"></div> */}
                  <div className="flex items-center justify-between">
                    <button
                      className="bg-green-500 text-white active:bg-green-700 font-bold text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mt-1  ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => navigate(`/edit/${personalInfo.uniq_id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-blue-700 text-white active:bg-blue-900 font-bold text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mt-1  ease-linear transition-all duration-150"
                      type="button"
                      onClick={() =>
                        navigate(`/student/${personalInfo.uniq_id}`)
                      }
                    >
                      More info
                    </button>
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default HomeDashboard;
