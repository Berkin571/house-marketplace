import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../../assets/svg/visibilityIcon.svg";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db, initializeAuth } from "../../firebase.config";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

export function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    timestamp?: any;
  }>({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const auth = initializeAuth;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      updateProfile(auth.currentUser!, {
        displayName: name,
      });

      const formDataCopy = { ...formData };
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);

      navigate("/");
    } catch (error) {
      toast.error("Ups. Die Datenbank ist aktuell nicht erreichbar!");
    }
  };
  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Willkommen zurück!</p>
        </header>

        <main>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              value={name}
              onChange={onChange}
              className="nameInput"
            />

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

            <div className="signUpBar">
              <p className="signUpText">Sign In</p>
              <button className="signUpButton" type="submit">
                <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
              </button>
            </div>
          </form>

          {/* <OAuth /> */}

          <Link to="/anmelden" className="registerLink">
            Du hast bereits ein Account? Melde dich an.
          </Link>
        </main>
      </div>
    </>
  );
}
