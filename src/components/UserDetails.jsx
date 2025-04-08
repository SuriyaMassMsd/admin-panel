import React from "react";

const UserDetails = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const { age, email, profilePicture, username, isActive } = userData;
  const defImg =
    "https://imgs.search.brave.com/wTGFv276tv4aDjxtxOQJKFik7yI3PdFq6OpafOk7YCI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMubGlmZS5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMTkv/MTAvMTUxNTMyMjgv/MTE1MjA5Ni1lMTU3/MTE1MzU0NzMzMi5q/cGc";
  return (
    <div>
      <div className="flex justify-start items-center space-x-[60px]">
        <div className="w-64 h-64  mt-[50px] relative ">
          <div
            className={`w-5 border-[3px] border-black h-5 top-3 right-12 ${isActive ? "bg-lime-400" : "bg-red-500"} rounded-full absolute z-20 shadow-md animate-pulse`}
          ></div>
          <div className="overflow-hidden rounded-full w-full h-full">
            <img
              src={profilePicture ? profilePicture : defImg}
              alt={username}
              className="w-full h-full object-cover object-top scale-150  z-0"
            />
          </div>
        </div>
        <div>
          <h1 className="text-[50px]">
            {username
              ? username ||
                email.split("@")[0].substring(0, 12) +
                  (email.split("@")[0].length > 12 ? "..." : "")
              : username || email.split("@")[0]}
          </h1>
          <p className="opacity-65">{email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
