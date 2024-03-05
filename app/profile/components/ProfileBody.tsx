import React from "react";

const ProfileBody = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full py-[1.5rem] px-[4%] flex gap-[2rem] justify-start md:justify-center md:flex-row flex-col box-border h-full flex-1 overflow-scroll bg-bDefault">
      {children}
    </div>
  );
};

export default ProfileBody;
