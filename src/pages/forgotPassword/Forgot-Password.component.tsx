import { useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../../assets/svg/keyboardArrowRightIcon.svg";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

export function ForgotPassword() {
  const [email, setEmail] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email wurde gesendet.");
    } catch (error) {
      toast.error("Email konnte nicht gesendet werden.");
    }
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Passwort vergessen</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="emailInput"
            placeholder="Email"
            id="email"
            value={email}
            onChange={onChange}
          />

          <Link className="forgotPasswordLink" to="/anmelden">
            Anmelden
          </Link>

          <div className="signInBar">
            <div className="signInText">Passwort zurücksetzen</div>
            <button className="signInButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
