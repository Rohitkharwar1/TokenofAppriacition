import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ onLogout }) => {
  const navigation = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({
    name: "",
    email: "",
    userType: "",
    wallet: 0,
  });

  const [isSidebar, setIsSidebar] = useState(true);
  const sideNavLink = [
    { id: 1, name: "Dashboard", path: "/dashboard" },
    { id: 2, name: "TOA", path: "/toa" },
    { id: 3, name: "Members", path: "/members" },
    { id: 4, name: "Teams", path: "/teams" },
  ];

  const toggleSidebar = () => {
    setIsSidebar(!isSidebar);
  };

  const getLocalStore = (key) => {
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
  };

  useEffect(() => {
    const fetchUserDetail = async () => {
      const userDetail = getLocalStore("user");
      await axios
        .get("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${userDetail.token}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setUser({
            name: res.data.data.name,
            userType: res.data.data.userType,
            email: res.data.data.email,
            wallet: res.data.data.wallet,
          });
          // window.localStorage.setItem("user", JSON.stringify(res.data.data));
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    };

    fetchUserDetail();
  }, []);

  return (
    <>
      <div
        className={`absolute top-2 ${
          isSidebar ? "left-2" : "left-[200px]"
        } p-2 w-12 h-12  flex items-center justify-center hover:bg-slate-300 bg-slate-200 rounded-full cursor-pointer z-20 transition-all duration-200 ease-linear`}
        onClick={toggleSidebar}
      >
        X
      </div>
      <div
        className={`bg-slate-100  h-screen flex-col flex justify-between p-2 absolute z-10 transition-all duration-200 ease-linear ${
          isSidebar ? "left-[-300px]" : "left-[0]"
        }`}
      >
        <div className="flex flex-col space-y-5 p-2 mt-5 w-[250px]">
          {sideNavLink.map((item) =>
            (location.pathname === "/toa" &&
              (item.path === "/dashboard" || item.path === "/")) ||
            location.pathname !== "/toa" ? (
              <NavLink
                to={item.path}
                key={item.id}
                className="p-4 hover:bg-slate-400/20 rounded-lg duration-200 ease-in-out transition-all"
              >
                {item.name}
              </NavLink>
            ) : null
          )}
        </div>
        <div className="flex flex-col space-y-5 p-2">
          <div className="flex flex-row items-center gap-x-6 ">
            <img
              src="https://placehold.co/400"
              alt=""
              width={60}
              height={60}
              className="rounded-full shadow-md border border-gray-600"
            />
            <div className="flex flex-col">
              <p className="text-lg font-semibold">{user?.name}</p>
              <p className="text-md">{user?.userType}</p>
              {user?.userType !== "member" && (
                <p className="text-sm">wallet : {user.wallet}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              onLogout();
              window.localStorage.removeItem("user");
              navigation("/", { replace: true });
              toast.success("You have logged out successfully!");
            }}
            className="p-4 bg-red-400/20 hover:bg-red-500 rounded-lg duration-200 ease-in-out transition-all hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
