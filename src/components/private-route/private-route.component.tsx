import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../../hooks";
import { Spinner } from "../spinner";

export function PrivateRoute() {
  const { loggedIn, checkingStatus } = useAuthStatus();

  if (checkingStatus) {
    console.log("Checking Status....");
    return <Spinner />;
  }

  return loggedIn ? <Outlet /> : <Navigate to="/anmelden" />;
}
