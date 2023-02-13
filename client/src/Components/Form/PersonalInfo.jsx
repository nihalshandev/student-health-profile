import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function PersonalInfo({ uniq_id, isEditPage }) {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const [personalInfo, setPersonalInfo] = useState({
    uniq_id: uniq_id,
    fullName: "",
    mobile: "",
    dob: "",
    gender: "Male",
    address: "",
    class: "10",
    division: "A",
    guardian: "",
    "guardian-phone": "",
  });

  useEffect(() => {
    if (isEditPage) {
      axios.get(`http://localhost:3000/get-student/${uniq_id}`).then((res) => {
        console.log(res.data);
        if (res.data) {
          const newPersonalInfo = res.data;
          newPersonalInfo.dob = new Date(newPersonalInfo.dob);
          console.log(newPersonalInfo);
          setPersonalInfo(newPersonalInfo);
        }
      });
      axios
        .get(`http://localhost:3000/get-image-info/${uniq_id}`)
        .then((res) => {
          if (res.data) {
            const imageInfo = res.data;
            const ext = imageInfo.type.split("/")[1];
            setImageUrl(`http://localhost:3000/uploads/${uniq_id}.${ext}`);
            setSelectedPhoto(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(personalInfo);
    console.log(selectedPhoto);
    const formData = new FormData();
    formData.append("file", selectedPhoto);
    formData.append("filename", selectedPhoto);
    const { fullName, mobile, address, guardian, dob } = personalInfo;

    if ((fullName && mobile, address, guardian, dob)) {
      try {
        axios
          .post("http://localhost:3000/add-personal-info", personalInfo)
          .then((res) => {
            console.log(res);
            setIsSubmitted(true);
          });
        if (selectedPhoto) {
          axios
            .post(`http://localhost:3000/upload/${uniq_id}`, formData)
            .then((res) => {
              console.log(res);
            });
        }
      } catch (error) {
        console.log(error);
        throw new Error(
          "Error while submitting personal info form client-side"
        );
      }
    } else {
      window.alert("Please fill the '*' fields");
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", selectedPhoto);
    formData.append("filename", selectedPhoto.name);

    const { fullName, mobile, address, guardian, dob } = personalInfo;
    if ((fullName && mobile, address, guardian, dob)) {
      try {
        axios
          .put(
            `http://localhost:3000/update-personal-info/${uniq_id}`,
            personalInfo
          )
          .then((res) => {
            console.log(res);
            setIsSubmitted(true);
          });
        if (selectedPhoto) {
          axios
            .put(`http://localhost:3000/update-photo/${uniq_id}`, formData)
            .then((res) => console.log(res));
        }
      } catch (error) {
        console.log(error);
        throw new Error("Error while updating personal info form client-side");
      }
      console.log(personalInfo);
    } else {
      window.alert("Please fill the '*' fields");
    }
  };

  return (
    <div>
      <div className="mt-10 sm:mt-0">
        <div className="sm:grid sm:grid-cols-3 sm:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Student Information
              </h3>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <form>
              <input value={personalInfo.uniq_id} className="hidden" readOnly />
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="fulName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full name <i className="text-xl w-4 text-red-500">*</i>
                      </label>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="fullName"
                        id="fullName"
                        value={personalInfo.fullName}
                        autoComplete="given-name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="mobile"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mobile Number{" "}
                        <i className="text-xl w-4 text-red-500">*</i>
                      </label>
                      <input
                        type="tel"
                        onChange={handleChange}
                        name="mobile"
                        id="mobile"
                        value={personalInfo.mobile}
                        autoComplete="mobile-number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-2">
                      <label
                        htmlFor="dob"
                        className="block text-sm font-medium text-gray-700 -mt-2"
                      >
                        Date of Birth{" "}
                        <i className="text-xl w-4 text-red-500">*</i>
                      </label>
                      <DatePicker
                        showIcon
                        selected={
                          personalInfo.dob ? personalInfo.dob : startDate
                        }
                        onChange={(date) => {
                          const dob = date;
                          setStartDate(date);
                          setPersonalInfo((prev) => ({
                            ...prev,
                            dob,
                          }));
                        }}
                        dateFormat="dd-MM-yyyy"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        type="text"
                        name="dob"
                        id="dob"
                        autoComplete="date-of-birth"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="gender"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        autoComplete="gender-name"
                        onChange={handleChange}
                        value={personalInfo.gender}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address <i className="text-xl w-4 text-red-500">*</i>
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        autoComplete="address"
                        onChange={handleChange}
                        value={personalInfo.address}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <label
                        htmlFor="class"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Class
                      </label>
                      <select
                        id="class"
                        name="class"
                        autoComplete="class"
                        onChange={handleChange}
                        value={personalInfo.class}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                      </select>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <label
                        htmlFor="division"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Division
                      </label>
                      <select
                        id="division"
                        name="division"
                        autoComplete="division"
                        onChange={handleChange}
                        value={personalInfo.division}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="G">G</option>
                        <option value="H">H</option>
                        <option value="I">I</option>
                        <option value="J">J</option>
                        <option value="K">K</option>
                        <option value="L">L</option>
                      </select>
                    </div>

                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label
                        htmlFor="guardian"
                        className="block text-sm font-medium text-gray-700 -mt-2"
                      >
                        Guardian <i className="text-xl w-4 text-red-500">*</i>
                      </label>
                      <input
                        type="text"
                        name="guardian"
                        id="guardian"
                        value={personalInfo.guardian}
                        onChange={handleChange}
                        autoComplete="guardian"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label
                        htmlFor="guardian-phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="guardian-phone"
                        id="guardian-phone"
                        onChange={handleChange}
                        value={personalInfo["guardian-phone"]}
                        autoComplete="guardian-phone"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Photo
                      </label>
                      <div className="mt-1 flex items-center">
                        <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                          {selectedPhoto ? (
                            <div>
                              <img src={imageUrl} />
                            </div>
                          ) : (
                            <svg
                              className="h-full w-full text-gray-300"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          )}
                        </span>
                        <button
                          type="button"
                          className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          <input
                            type="file"
                            id="photo"
                            name="photo"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setSelectedPhoto(file);
                                setImageUrl(URL.createObjectURL(file));
                                console.log(file);
                              }
                            }}
                          />
                          <label htmlFor="photo" className="cursor-pointer ">
                            Change
                          </label>
                        </button>
                      </div>
                      <div className="relative left-10 mt-2">
                        <p className="text-xs ml-3">
                          {selectedPhoto ? selectedPhoto.name : null}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  {isSubmitted ? (
                    <button
                      onClick={() => navigate("/add")}
                      className={`inline-flex mr-3 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                      Add New Student
                    </button>
                  ) : null}
                  <button
                    onClick={() => navigate("/")}
                    className={`inline-flex mr-3  justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    Go to Homepage
                  </button>
                  <button
                    type="submit"
                    onClick={!isEditPage ? handleSubmit : handleUpdate}
                    disabled={isSubmitted}
                    className={`1inline-flex disabled:bg-gray-400 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;
