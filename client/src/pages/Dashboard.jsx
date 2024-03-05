import { useEffect, useState } from "react";
import AddToken from "../components/AddToken";
import Sidebar from "../components/Sidebar";

const Dashboard = ({ onLogout }) => {
  // smg-mg-mb
  const [role, setRole] = useState("smg");
  //   const { role } = useSelector(state => state.auth/user);

  const getLocalStore = (key) => {
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
  };

  useEffect(() => {
    const userDetail = getLocalStore("user");
    if (userDetail) {
      setRole(userDetail?.userType);
    }
  }, []);

  return (
    <div className="flex flex-row w-screen">
      <Sidebar onLogout={onLogout} />
      <div className="bg-slate-300/30 flex-[3] h-screen">
        <div className="flex flex-col w-full items-center justify-center">
          {/* add token */}

          {role !== "member" && <AddToken />}

          {/*  */}
          <div className="w-full grid grid-cols-2 gap-4 mt-16 text-lg font-medium p-4 items-center justify-center border-[4px] bg-slate-300/30">
            {Array.from({ length: 4 }).map((item, index) => (
              <div
                key={index}
                className="w-full h-[200px] bg-slate-500 rounded-md"
              >
                {index}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-blue-600 flex-1 h-screen"></div>
    </div>
  );
};

export default Dashboard;
