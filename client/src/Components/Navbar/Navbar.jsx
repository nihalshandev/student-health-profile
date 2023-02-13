import lk_logo from "/lk-logo.png";
import {useNavigate} from 'react-router-dom'

export default function Navbar() {
    const navigate = useNavigate();
  return (
    <div className="w-full text-white bg-[#4a76a8]">
      <div className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
        <div className="p-4 flex flex-row items-center justify-between w-full">
          <a
            href="#"
            className="text-lg font-semibold tracking-widest uppercase rounded-lg focus:outline-none focus:shadow-outline"
          >
            Lk Health
          </a>
          <nav className="flex-col flex-grow pb-4 md:pb-0 hidden md:flex md:justify-end md:flex-row">
            <div className="relative">
              <button onClick={()=> navigate("/")} className="mx-3 ">Home</button>
              <button onClick={()=> navigate("/add")} className="mx-3">Add Student</button>
              <img className="inline h-6 rounded-full mx-3" src={lk_logo} />
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
