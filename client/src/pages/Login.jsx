import { useDispatch } from "react-redux";
import { setUserDetails } from "../app/resources/counter";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// eslint-disable-next-line react/prop-types
const Login = ({ onLogin, isLoggedIn, setIsLoggedIn }) => {
  // const { count } = useSelector((state) => state.counter);
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const [userInput, setUserInput] = useState({
    email: "rohit3@gmail.com",
    password: "admin",
  });

  const getLocalStore = (key) => {
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
  };

  useEffect(() => {
    const user = getLocalStore("user");
    console.log(user);
    if (user !== null || user !== undefined) {
      setIsLoggedIn(true);
      navigation("/dashboard");
    }
    if (user === null) {
      navigation("/");
      setIsLoggedIn(false);
    }
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleLogin = async () => {
    console.log(userInput);
    await axios
      .post("/api/users/login", userInput)
      .then((res) => {
        console.log(res);
        if (res.data.status === 200) {
          dispatch(setUserDetails({ user: res.data.data }));
          window.localStorage.setItem("user", JSON.stringify(res.data.data));
          toast.success("Logged successfully " + res.data?.data.name);
          onLogin();
          navigation("/dashboard");
        }
      })
      .catch((err) => {
        // console.log(err.response.data.message);
        toast.error(err.response.data.message);
      });
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          /> */}
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm ">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={userInput.email}
                  onChange={handleOnChange}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-3 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={userInput.password}
                  onChange={handleOnChange}
                  required
                  className="block w-full rounded-md border-0 py-3 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                // onClick={() => dispatch(incre())}
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
