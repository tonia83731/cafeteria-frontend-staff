import { useState } from "react";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import { clientFetch } from "@/lib/fetch";
import StaffDefaultInput from "../input/DefaultInput";

const StaffSigninForm = () => {
  const router = useRouter();
  const [body, setBody] = useState({
    email: "",
    password: "",
  });
  const handleInputChanage = (e: any) => {
    const { name, value } = e.target;

    setBody((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await clientFetch("/admin/login", {
        method: "POST",
        body,
      });

      // console.log(response);
      const { success, data } = response;

      if (success) {
        console.log("Login successful!");
        setCookie("adminToken", data.token, {
          maxAge: 3 * 24 * 60 * 60,
          path: "/",
        });
        router.push("/dashboard");
      } else {
        console.log("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Error occurred during fetch:", error);
    }
  };
  return (
    <form className="flex flex-col gap-6" onSubmit={handleFormSubmit}>
      <div className="flex flex-col gap-4">
        <StaffDefaultInput
          label="電子郵件"
          id="email"
          type="email"
          name="email"
          placeholder="staff@example.com"
          value={body.email}
          onInputChange={handleInputChanage}
        />
        <StaffDefaultInput
          label="密碼"
          id="password"
          type="password"
          name="password"
          placeholder="********"
          value={body.password}
          onInputChange={handleInputChanage}
        />
      </div>
      <button
        type="submit"
        className="w-full py-1.5 rounded-lg text-center bg-apricot text-white shadow-sm"
      >
        Sign In
      </button>
    </form>
  );
};

export default StaffSigninForm;
