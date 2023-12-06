import "@/css/LockedHome.css";
import { FaLock } from "react-icons/fa";

export default function LockedHome() {
  return (
    <div className="w-full h-[58vh] flex items-center justify-center flex-col text-center">
      <FaLock className="fa-lock" />
      <div className="text">
        <h1>Please login!</h1>
        <p>
          It is free to use our app, you do need to sign in with google at the
          top there to get access though :D
        </p>
      </div>
    </div>
  );
}
