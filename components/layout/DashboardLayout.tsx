import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import DefaultLayout from "./DefaultLayout";
import StaffHeader from "../header/StaffHeader";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <DefaultLayout>
      <StaffHeader />
      <div className="pt-[150px] pb-6 flex flex-col gap-6 w-11/12 xl:w-full mx-auto max-w-[1200px]">
        {children}
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop
          closeOnClick
          draggable={false}
          pauseOnHover
        />
      </div>
    </DefaultLayout>
  );
};

export default DashboardLayout;
