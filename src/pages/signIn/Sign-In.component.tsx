import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../../assets/svg/visibilityIcon.svg";

export function SignIn() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const { email, password } = formData;

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Willkommen zurück!</p>
        </header>

        <main>
          <form
            action="
          "
          >
            <input
              type="email"
              name="email"
              id="email"
              placeholder="E-Mail"
              value={email}
              onChange={onChange}
              className="emailInput"
            />

            <div className="passwordInputDiv">
              <input
                type={showPassword ? "text" : "password"}
                className="passwordInput"
                placeholder="Passwort"
                id="password"
                value={password}
                onChange={onChange}
              />

              <img
                src={visibilityIcon}
                alt={showPassword ? "Passwort verdecken" : "Passwort anzeigen"}
                className="showPassword"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            <Link to="/forgot-password" className="forgotPasswordLink">
              Forgot Password
            </Link>

            <div className="signInBar">
              <p className="signInText">Sign In</p>
              <button className="signInButton">
                <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
              </button>
            </div>
          </form>

          {/* <OAuth /> */}

          <Link to="/registrieren" className="registerLink">
            Noch kein Account? Registrieren Sie sich jetzt!
          </Link>
        </main>
      </div>
    </>
  );
}
