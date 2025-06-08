import { JSX } from "@emotion/react/jsx-runtime";
import logo from "../../public/gps.png"

export const useBranding = (): { logo: JSX.Element; title: string } => {
  const branding = {
    logo: <img src={logo} alt="KST logo" />,
    title: "GPS-трекер",
  };
  return branding;
};
