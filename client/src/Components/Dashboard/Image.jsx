import { useEffect, useState } from "react";
import axios from "axios";

function Image({ personalInfo }) {
  const [imageExt, setImageExt] = useState("jpeg");
  const [isPhoto, setIsPhoto] = useState(false);
  useEffect(() => {
    axios
      .get(`http://localhost:3000/get-image-info/${personalInfo.uniq_id}`)
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
  }, []);

  return (
    <div>
      {isPhoto ? (
        <img
          className="h-48 w-40 rounded-md mx-auto"
          src={`http://localhost:3000/uploads/${personalInfo.uniq_id}.${imageExt}`}
          alt="student image"
        />
      ) : (
        <svg
          className="h-full w-full text-gray-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </div>
  );
}

export default Image;
