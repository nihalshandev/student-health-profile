import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import fontawesome from "@fortawesome/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHospitalUser,
  faTrash,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

import "./student.css";
import Navbar from "../Navbar/Navbar";
fontawesome.library.add(faHospitalUser, faTrash, faPenToSquare);

function Student() {
  const { uniq_id } = useParams();
  const navigate = useNavigate();

  const [studentPersonalInfo, setStudentPersonalInfo] = useState({
    uniq_id: uniq_id,
    fullName: "Not Specified",
    mobile: "Not Specified",
    dob: "Not Specified",
    gender: "Not Specified",
    address: "Not Specified",
    class: "Not Specified",
    division: "Not Specified",
    guardian: "Not Specified",
    "guardian-phone": "Not Specified",
  });
  const [studentHealthProfile, setStudentHealthProfile] = useState({
    uniq_id: uniq_id,
    height: "",
    weight: "",
    "blood-group": "Not Specified",
    vision: "Not Specified",
    hearing: "Not Specified",
    "currently-doctor": false,
    "allergies-select": false,
    allergies: "Not Specified",
    "chronic-select": false,
    "chronic-illnesses": "Not Specified",
    "mental-health": "Not Specified",
    "family-medical-record": "Not Specified",
    "previous-medical-condition": "Not Specified",
    current_health_status: "Nor Specified",
  });
  const [dob, setDob] = useState(new Date());
  const [vaccinationDetails, setVaccinationDetails] = useState([]);
  const [imageExt, setImageExt] = useState("jpeg");
  const [isPhoto, setIsPhoto] = useState(false);
  useEffect(() => {
    try {
      axios.get(`http://localhost:3000/get-student/${uniq_id}`).then((res) => {
        console.log(res.data);
        if (res.data) {
          setStudentPersonalInfo(res.data);
          setDob(new Date(res.data.dob));
        }
      });
      axios
        .get(`http://localhost:3000/get-student-health/${uniq_id}`)
        .then((res) => {
          console.log(res.data);
          if (res.data) {
            setStudentHealthProfile(res.data);
          }
        });
      axios
        .get(`http://localhost:3000/get-student-vaccinationdetails/${uniq_id}`)
        .then((res) => {
          if (res.data) {
            setVaccinationDetails(res.data.vaccination);
            console.log(res.data.vaccination);
          }
        });
      axios
        .get(`http://localhost:3000/get-image-info/${uniq_id}`)
        .then((res) => {
          if (res.data) {
            const imageExt = res.data.type.split("/")[1];
            setImageExt(imageExt);
            setIsPhoto(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
      throw new Error("Error while fetching student data");
    }
  }, []);

  const deleteStudent = () => {
    if (
      window.confirm(
        "Deleting student will delete all data of this student. Are you sure want to delete ?"
      )
    ) {
      axios
        .delete(`http://localhost:3000/delete-student/${uniq_id}`)
        .then((res) => {
          console.log(res);
          navigate("/");
        })
        .catch((err) => console.log(err));

      axios
        .delete(`http://localhost:3000/delete-photo/${uniq_id}/${imageExt}`)
        .then((res) => {
          if (res.data) {
            setIsPhoto(true);
          }
        });
    } else {
      window.location.reload();
    }
  };

  return (
    <div>
      <div className="bg-gray-100">
        <Navbar />
        {/* End of Navbar */}
        <div className="container mx-auto my-5 p-5">
          <div className="md:flex no-wrap md:-mx-2 ">
            {/* Left Side */}
            <div className="w-full md:w-3/12 md:mx-2">
              {/* Profile Card */}
              <div className="bg-white p-3 border-t-4 border-green-400">
                <div className="flex justify-between">
                  <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                    {studentPersonalInfo.fullName}
                  </h1>
                  <div>
                    <FontAwesomeIcon
                      icon="fa-pen-to-square"
                      className="mt-2 mx-2 text-blue-600 cursor-pointer border border-blue-700 py-1 px-3 rounded-md active:bg-blue-500 active:text-white active:border-2"
                      onClick={() => navigate(`/edit/${uniq_id}`)}
                    />
                    <FontAwesomeIcon
                      icon="fa-trash"
                      className="mt-2 text-red-500 cursor-pointer border border-red-500 py-1 px-3 rounded-md active:bg-red-400 active:text-white active:border-2"
                      onClick={deleteStudent}
                    />
                  </div>
                </div>
                <h3 className="text-gray-600 font-lg text-semibold leading-6">
                  Born On{" "}
                  {`${dob.getDate()}-${
                    dob.getMonth() + 1
                  }-${dob.getFullYear()}`}
                </h3>
                <h3 className="text-md text-gray-500 hover:text-gray-600 leading-6">
                  Class: {studentPersonalInfo.class} -{" "}
                  {studentPersonalInfo.division}
                </h3>
                <span className="text-sm text-gray-500 hover:text-gray-600 leading-6">
                  <div>
                    Address - {studentPersonalInfo.address} <br />
                  </div>
                  <div>
                    Emergency Number - +91
                    {studentPersonalInfo["guardian-phone"]}
                  </div>
                </span>
                <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                  <li className="flex items-center py-3">
                    <span>Height</span>
                    <span className="ml-auto">
                      {studentHealthProfile.height ? `${studentHealthProfile.height} cm` : "Not Specified"}
                    </span>
                  </li>
                  <li className="flex items-center py-3">
                    <span>Weight</span>
                    <span className="ml-auto">
                      {studentHealthProfile.weight ? `${studentHealthProfile.weight} kg` : "Not Specified"}
                    </span>
                  </li>
                  <li className="flex items-center py-3">
                    <span>Blood Group</span>
                    <span className="ml-auto">
                      {studentHealthProfile["blood-group"]}
                    </span>
                  </li>
                </ul>
              </div>
              {/* End of profile card */}
              <div className="my-4" />
              {/* Friends card */}
              <div className="bg-white p-3 hover:shadow">
                <div className="text-center my-2">
                  {isPhoto ? (
                    <img
                      className="h-48 w-40 rounded-md mx-auto"
                      src={`http://localhost:3000/uploads/${uniq_id}.${imageExt}`}
                      alt="Profile"
                    />
                  ) : (
                    <svg
                      className="h-48 w-36 text-gray-300 mx-auto"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </div>
                <div className="text-gray-900 text-lg">
                  Current Health Status
                </div>
                <div className="text-gray-600 text-md">
                  {studentHealthProfile.current_health_status}
                </div>
              </div>
              {/* End of friends card */}
            </div>
            {/* Right Side */}
            <div className="w-full md:w-9/12 mx-2 h-64">
              {/* Profile tab */}
              {/* About Section */}
              <div className="bg-white p-3 shadow-sm rounded-sm">
                <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                  <span className="text-green-500">
                    <svg
                      className="h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  <span className="tracking-wide">Personal Information</span>
                </div>
                <div className="text-gray-700">
                  <div className="grid md:grid-cols-2 text-sm">
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">First Name</div>
                      <div className="px-4 py-2">
                        {studentPersonalInfo.fullName}
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">
                        Date Of Birth
                      </div>
                      <div className="px-4 py-2">{`${dob.getDate()}-${
                        dob.getMonth() + 1
                      }-${dob.getFullYear()}`}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Gender</div>
                      <div className="px-4 py-2">
                        {studentPersonalInfo.gender}
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Contact No.</div>
                      <div className="px-4 py-2">
                        +91 {studentPersonalInfo.mobile}
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">
                        Current Address
                      </div>
                      <div className="px-4 py-2">
                        {studentPersonalInfo.address}
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">
                        Class and Division
                      </div>
                      <div className="px-4 py-2">
                        {`${studentPersonalInfo.class} - ${studentPersonalInfo.division}`}
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">
                        Guardian Name
                      </div>
                      <div className="px-4 py-2">
                        {studentPersonalInfo.guardian}
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">
                        Guardian Mobile
                      </div>
                      <div className="px-4 py-2">
                        {`+91 ${studentPersonalInfo["guardian-phone"]}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* End of about section */}
              <div className="my-4" />
              {/* Health Profile*/}
              <div>
                <div className="bg-white p-3 shadow-sm rounded-sm">
                  <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                    <span className="text-green-500">
                      <FontAwesomeIcon icon="fa-hospital-user" />
                    </span>
                    <span className="tracking-wide">Health Information</span>
                  </div>
                  <div className="text-gray-700">
                    <div className="grid md:grid-cols-2 text-sm">
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Height</div>
                        <div className="px-4 py-2">
                          {studentHealthProfile.height ? `${studentHealthProfile.height} cm` : "Not Specified"}
                        </div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Weight</div>
                        <div className="px-4 py-2">
                          {studentHealthProfile.weight ? `${studentHealthProfile.weight} kg` : "Not Specified"}
                        </div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">
                          Blood Group
                        </div>
                        <div className="px-4 py-2">
                          {studentHealthProfile["blood-group"]}
                        </div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Hearing</div>
                        <div className="px-4 py-2">
                          {studentHealthProfile.hearing}
                        </div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Vision</div>
                        <div className="px-4 py-2">
                          {studentHealthProfile.vision}
                        </div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">
                          Currently consulting a doctor
                        </div>
                        <div className="px-4 py-2">
                          {studentHealthProfile["currently-doctor"]
                            ? "Yes"
                            : "No"}
                        </div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Allergies</div>
                        <div className="px-4 py-2">
                          {!studentHealthProfile["allergies-select"]
                            ? "No"
                            : studentHealthProfile.allergies}
                        </div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">
                          Chronic Illnesses
                        </div>
                        <div className="px-4 py-2">
                          {!studentHealthProfile["chronic-select"]
                            ? "No"
                            : studentHealthProfile["chronic-illnesses"]}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End of Health Profile */}
              </div>
              {/* Experience and education */}
              <div className="bg-white p-3 shadow-sm rounded-sm">
                <div className="grid grid-cols-2">
                  <div>
                    <ul className="list-inside space-y-2">
                      <li>
                        <div className="text-gray-700">Mental Health</div>
                        <div className="text-gray-500 text-md">
                          {studentHealthProfile["mental-health"]}
                        </div>
                      </li>
                      <li>
                        <div className="text-gray-700">
                          Family Medical Record
                        </div>
                        <div className="text-gray-500 text-md">
                          {studentHealthProfile["family-medical-record"]}
                        </div>
                      </li>
                      <li>
                        <div className="text-gray-700">
                          Previous Medical Condition
                        </div>
                        <div className="text-gray-500 text-md">
                          {studentHealthProfile["previous-medical-condition"]}
                        </div>
                      </li>
                    </ul>
                  </div>
                  {vaccinationDetails != 0 &&
                  vaccinationDetails[0].vaccination != "" ? (
                    <div>
                      <ul className="list-inside space-y-2">
                        <li>
                          <div className="flex flex-col">
                            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                              <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                                <div className="overflow-hidden">
                                  <table className="min-w-full">
                                    <thead className="bg-white border-b">
                                      <tr>
                                        <th
                                          scope="col"
                                          className="text-sm font-semibold text-gray-900 px-6 py-4 text-left"
                                        >
                                          Vaccination
                                        </th>
                                        <th
                                          scope="col"
                                          className="text-sm font-semibold text-gray-900 px-6 py-4 text-left"
                                        >
                                          Date
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {vaccinationDetails &&
                                        vaccinationDetails.map(
                                          (vaccine, index) => {
                                            const vaccinationDate = new Date(
                                              vaccine["vaccination-date"]
                                            );
                                            const vaccination_day =
                                              vaccinationDate.getDate();
                                            const vaccination_month =
                                              vaccinationDate.getMonth() + 1;
                                            const vaccination_year =
                                              vaccinationDate.getFullYear();
                                            return (
                                              <tr
                                                className={`${
                                                  index % 2 == 0
                                                    ? "bg-gray-100"
                                                    : "bg-white"
                                                } border-b`}
                                                key={vaccine.vaccination_count}
                                              >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                  {vaccine.vaccination}
                                                </td>
                                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                  {`${vaccination_day}-${vaccination_month}-${vaccination_year}`}
                                                </td>
                                              </tr>
                                            );
                                          }
                                        )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
              {/* End of Experience and education grid */}
              {/* End of profile tab */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Student;
