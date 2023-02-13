import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import fontawesome from "@fortawesome/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSquareMinus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

fontawesome.library.add(faPlus, faSquareMinus);

function HealthProfile({ uniq_id, isEditPage }) {
  const [startDate, setStartDate] = useState(new Date());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [vaccinationId, setVaccinationId] = useState("");
  const [healthProfile, setHealthProfile] = useState({
    uniq_id: uniq_id,
    height: "",
    weight: "",
    "blood-group": "O+",
    vision: "",
    hearing: "",
    "currently-doctor": false,
    "allergies-select": false,
    allergies: "",
    "chronic-select": false,
    "chronic-illnesses": "",
    "mental-health": "",
    "family-medical-record": "",
    "previous-medical-condition": "",
    current_health_status: "",
  });

  const [vaccinationDetails, setVaccinationDetails] = useState([
    {
      uniq_id: uniq_id,
      vaccination_count: 0,
      vaccination: "",
      "vaccination-date": new Date(),
    },
  ]);

  useEffect(() => {
    if (isEditPage) {
      axios
        .get(`http://localhost:3000/get-student-health/${uniq_id}`)
        .then((res) => {
          // console.log(res.data);
          if (res.data) {
            setHealthProfile(res.data);
          }
        });
      axios
        .get(`http://localhost:3000/get-student-vaccinationdetails/${uniq_id}`)
        .then((res) => {
          console.log(res.data);
          if (res.data) {
            if (res.data.length != 0) {
              setVaccinationId(res.data._id);
              const newVaccinationDetails = [...res.data.vaccination];
              newVaccinationDetails.map((vaccine) => {
                vaccine["vaccination-date"] = new Date(
                  vaccine["vaccination-date"]
                );
              });
              console.log("New vaccination", newVaccinationDetails);
              setVaccinationDetails(newVaccinationDetails);
            }
          }
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHealthProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(healthProfile);
    console.log(vaccinationDetails);

    try {
      axios
        .post("http://localhost:3000/health-profile", healthProfile)
        .then((res) => {
          console.log(res);
          setIsSubmitted(true);
        });
    } catch (error) {
      console.log(error);
      throw new Error("Error submitting health profile client-side");
    }
    try {
      console.log(vaccinationDetails);
      axios
        .post("http://localhost:3000/vaccination-details", vaccinationDetails)
        .then((res) => console.log(res));
    } catch (error) {
      console.log(error);
      throw new Error(
        "Error while submitting vaccination details - client-side"
      );
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    console.log(healthProfile);
    console.log("vaccination details before updating", vaccinationDetails);

    try {
      axios
        .put(
          `http://localhost:3000/update-health-profile/${uniq_id}`,
          healthProfile
        )
        .then((res) => {
          console.log(res);
          setIsSubmitted(true);
        });
    } catch (error) {
      console.log(error);
      throw new Error("Error submitting health profile client-side");
    }
    if (vaccinationId) {
      try {
        console.log(vaccinationDetails);
        axios
          .put(
            `http://localhost:3000/update-vaccination-details/${vaccinationId}`,
            vaccinationDetails
          )
          .then((res) => console.log(res));
      } catch (error) {
        console.log(error);
        throw new Error(
          "Error while submitting vaccination details - client-side"
        );
      }
    } else {
      try {
        console.log(vaccinationDetails);
        axios
          .post("http://localhost:3000/vaccination-details", vaccinationDetails)
          .then((res) => console.log(res));
      } catch (error) {
        console.log(error);
        throw new Error(
          "Error while submitting vaccination details - client-side"
        );
      }
    }
  };

  return (
    <div className="col-span-2">
      <div className="mt-5 md:col-span-2 md:mt-0">
        <form>
          <input value={healthProfile.uniq_id} className="hidden" readOnly />
          <div className="shadow sm:overflow-hidden sm:rounded-md">
            <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Physical status
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-2">
                  <label
                    htmlFor="height"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    id="height"
                    onChange={handleChange}
                    value={healthProfile.height}
                    autoComplete="height"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="weight"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    id="weight"
                    onChange={handleChange}
                    value={healthProfile.weight}
                    autoComplete="weight"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="blood-group"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Blood Group
                  </label>
                  <select
                    id="blood-group"
                    name="blood-group"
                    value={healthProfile["blood-group"]}
                    onChange={handleChange}
                    autoComplete="blood-group"
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="vision"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Vision
                  </label>
                  <input
                    type="text"
                    name="vision"
                    id="vision"
                    value={healthProfile.vision}
                    onChange={handleChange}
                    autoComplete="vision"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="hearing"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Hearing
                  </label>
                  <input
                    type="text"
                    name="hearing"
                    id="hearing"
                    value={healthProfile.hearing}
                    onChange={handleChange}
                    autoComplete="hearing"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Medical Record
                  </label>
                </div>
              </div>
              <div className="mt-1">
                <label
                  htmlFor="current-health"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Health Status
                </label>
                <textarea
                  id="current_health"
                  name="current_health_status"
                  value={healthProfile.current_health_status}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Current health status"
                ></textarea>
              </div>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-3 sm:col-span-3">
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                      Is the student currently consulting a doctor?
                    </span>
                    <select
                      id="currently-doctor"
                      name="currently-doctor"
                      autoComplete="currently-doctor"
                      onChange={handleChange}
                      value={healthProfile["currently-doctor"]}
                      className="block w-full px-4 lg:px-2 m flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-6 sm:col-span-3">
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                      Dose the Student have any allergies?
                    </span>
                    <select
                      id="allergies-select"
                      name="allergies-select"
                      autoComplete="allergies-select"
                      onChange={handleChange}
                      value={healthProfile["allergies-select"]}
                      className="block w-full px-4 lg:px-2 m flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </select>
                  </div>
                </div>
                {healthProfile["allergies-select"] ? (
                  <div className="col-span-6 sm:col-span-3 -mt-5">
                    <label
                      htmlFor="allergies"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Type of Allergies
                    </label>
                    <input
                      type="text"
                      name="allergies"
                      value={healthProfile.allergies}
                      onChange={handleChange}
                      id="allergies"
                      autoComplete="allergies"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm "
                    />
                  </div>
                ) : null}
              </div>
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-6 sm:col-span-4">
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                      Dose the Student have any Chronic Illnesses?
                    </span>
                    <select
                      id="chronic-select"
                      name="chronic-select"
                      autoComplete="chronic-select"
                      value={healthProfile["chronic-select"]}
                      onChange={handleChange}
                      className="block w-full px-4 lg:px-2 m flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </select>
                  </div>
                </div>
                {healthProfile["chronic-select"] ? (
                  <div className="col-span-6 sm:col-span-2 -mt-5">
                    <label
                      htmlFor="chronic-illnesses"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Chronic Illnesses
                    </label>
                    <input
                      type="text"
                      name="chronic-illnesses"
                      id="chronic-illnesses"
                      autoComplete="chronic-illnesses"
                      value={healthProfile["chronic-illnesses"]}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm "
                    />
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-4 inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                      <table className="min-w-full text-center">
                        <thead className="border-b bg-gray-800">
                          <tr>
                            <th
                              scope="col"
                              className="text-sm font-medium text-white px-6 py-4"
                            >
                              Vaccination
                            </th>
                            <th
                              scope="col"
                              className="text-sm font-medium text-white px-6 py-4"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="text-sm font-medium text-white px-6 py-4"
                            >
                              <FontAwesomeIcon
                                icon="fa-solid fa-plus"
                                className="cursor-pointer text-blue-600 text-lg"
                                onClick={() => {
                                  console.log(vaccinationDetails);
                                  if (vaccinationDetails != 0) {
                                    setVaccinationDetails((prev) => [
                                      ...prev,
                                      {
                                        uniq_id: uniq_id,
                                        vaccination: "",
                                        vaccination_count:
                                          Number(
                                            prev[prev.length - 1]
                                              .vaccination_count
                                          ) + 1,
                                        "vaccination-date": new Date(),
                                      },
                                    ]);
                                  } else {
                                    setVaccinationDetails([
                                      {
                                        uniq_id: uniq_id,
                                        vaccination: "",
                                        vaccination_count: 0,
                                        "vaccination-date": new Date(),
                                      },
                                    ]);
                                  }

                                  console.log(vaccinationDetails);
                                }}
                              />
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {vaccinationDetails.map((vaccine, index) => (
                            <tr
                              className="bg-white border-b"
                              key={vaccine.vaccination_count}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                <input
                                  value={vaccine.uniq_id}
                                  className="hidden"
                                  readOnly
                                />
                                <input
                                  type="text"
                                  className="block
                                      form-control
                                      px-3
                                      w-full
                                      text-base
                                      py-1.5
                                      text-gray-700
                                      font-normal
                                      border border-solid border-gray-300
                                      bg-white bg-clip-padding
                                      transition
                                      rounded
                                      m-0
                                      ease-in-out
                                      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                  name="vaccination"
                                  value={vaccine.vaccination}
                                  onChange={(e) => {
                                    const newVaccination = [
                                      ...vaccinationDetails,
                                    ];
                                    newVaccination[index].vaccination =
                                      e.target.value;
                                    setVaccinationDetails(newVaccination);
                                  }}
                                />
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                <DatePicker
                                  showIcon
                                  selected={
                                    vaccine["vaccination-date"]
                                      ? vaccine["vaccination-date"]
                                      : startDate
                                  }
                                  onChange={(date) => {
                                    const newVaccination = [
                                      ...vaccinationDetails,
                                    ];
                                    newVaccination[index]["vaccination-date"] =
                                      date;
                                    setVaccinationDetails(newVaccination);
                                  }}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  type="text"
                                  dateFormat="dd-MM-yyyy"
                                  name="vaccination-date"
                                  id="vaccination-date"
                                  autoComplete="vaccination-date"
                                  value={vaccinationDetails["vaccination-date"]}
                                />
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                <FontAwesomeIcon
                                  icon="fa-square-minus"
                                  className="cursor-pointer text-gray-400 text-lg"
                                  onClick={() => {
                                    const newVaccinationState = [
                                      ...vaccinationDetails,
                                    ];
                                    if (newVaccinationState.length > 1) {
                                      newVaccinationState.splice(index, 1);
                                    }
                                    console.log(
                                      "Delete button press vaccination state",
                                      newVaccinationState
                                    );
                                    setVaccinationDetails(newVaccinationState);
                                  }}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-1">
                <label
                  htmlFor="mental-health"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mental Health
                </label>
                <textarea
                  id="mental-health"
                  name="mental-health"
                  value={healthProfile["mental-health"]}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Description about mental health."
                ></textarea>
              </div>

              <div className="mt-1">
                <label
                  htmlFor="family-medical-record"
                  className="block text-sm font-medium text-gray-700"
                >
                  Family Medical Record
                </label>
                <textarea
                  id="family-medical-record"
                  name="family-medical-record"
                  value={healthProfile["family-medical-record"]}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Other patients in family, relation to the student, patient's doctor/hospital"
                ></textarea>
              </div>

              <div>
                <div className="mt-1">
                  <label
                    htmlFor="previous-medical-condition"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Previous Medical Condition
                  </label>
                  <textarea
                    id="previous-medical-condition"
                    name="previous-medical-condition"
                    value={healthProfile["previous-medical-condition"]}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Describe here, if the student had previous medical problem"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
              <button
                type="submit"
                onClick={!isEditPage ? handleSubmit : handleUpdate}
                disabled={isSubmitted}
                className={`inline-flex disabled:bg-gray-400 ml-3 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HealthProfile;
