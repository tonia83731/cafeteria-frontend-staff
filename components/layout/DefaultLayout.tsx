import { Roboto, Noto_Sans_TC } from "next/font/google";
import { ReactNode } from "react";
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-roboto",
});

const noto_san = Noto_Sans_TC({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700", "900"],
  style: ["normal"],
  variable: "--font-noto-sans",
});
const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={`w-full h-full min-h-screen bg-white text-fern ${noto_san.variable} ${roboto.variable} font-noto_sans`}
    >
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
};

export default DefaultLayout;
