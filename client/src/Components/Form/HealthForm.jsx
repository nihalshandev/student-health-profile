import "./form.css";
import "react-datepicker/dist/react-datepicker.css";
import PersonalInfo from "./PersonalInfo";
import HealthProfile from "./HealthProfile";
import uniqid from "uniqid";
import { useParams } from "react-router-dom";

function HealthForm({ isEditPage }) {
  const {uniq_Id} = useParams();
  const _id = !isEditPage ? uniqid() : uniq_Id;
  return (
    <div className="parent-form">
      <div className="justify-center">
        <div>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Health Profile
                </h3>
              </div>
            </div>
            <HealthProfile uniq_id={_id} isEditPage={isEditPage}/>
          </div>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200"></div>
          </div>
        </div>
        <PersonalInfo uniq_id={_id} isEditPage={isEditPage} />
      </div>
    </div>
  );
}

export default HealthForm;
