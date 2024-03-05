import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddToken = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [reason, setReason] = useState("");
  const [userList, setUserList] = useState(null);
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const user = getLocalStore("user");
    await axios
      .get("/api/users?userType=all", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        if (res.data.status === 200) {
          console.log(res.data.data);
          setUserList(res.data.data.users);
        }
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleClick = () => {
    console.log("Selected User:", selectedUser);
    console.log("Reason:", reason);
  };

  const getLocalStore = (key) => {
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
  };

  const generateToken = async () => {
    const userDetail = getLocalStore("user");
    try {
      const res = await axios.post(
        "/api/token",
        {
          recipient: selectedUser,
          reason: reason,
          points: 10,
        },
        {
          headers: {
            Authorization: `Bearer ${userDetail.token}`,
          },
        }
      );
      console.log(res.data);
      toast.success("Token Generated successfully ");
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message);
    }
  };

  return (
    <>
      <div className="flex flex-row w-5/6 md:w-6/6 items-center justify-center mt-10 space-x-3 p-4 bg-slate-300/30 rounded-lg">
        <div className="w-full">
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Select Member
          </label>
          <div className="mt-2">
            <select
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-md border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 py-3 px-2"
              value={selectedUser}
              onChange={handleUserChange}
            >
              <option value="">Select a member</option>
              {userList?.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.userType})
                </option>
              ))}
            </select>
          </div>
        </div>{" "}
        <div className="w-full">
          <label
            htmlFor="reason"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Reason
          </label>
          <div className="mt-2">
            <input
              id="reason"
              name="reason"
              type="text"
              autoComplete="off"
              required
              className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 py-3 px-2"
              value={reason}
              onChange={handleReasonChange}
            />
          </div>
        </div>
        <div className="pt-7 w-2/6">
          <button
            onClick={generateToken}
            className="flex w-full justify-center rounded-md bg-indigo-600 py-3 px-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Generate Toa
          </button>
        </div>
      </div>
    </>
  );
};

export default AddToken;
