import { useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AppContext } from "../App";
import t from "../lib/tokens";
import alert from "../lib/alert";
const Header = () => {
  const { loggedIn, setLoggedIn, section, setSection } = useContext(AppContext);

  const checkLoggedIn = async () => {
    try {
      /** @API call */
      await axios.get("/api/user");
      setLoggedIn(true);
    } catch (e) {
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    if (loggedIn === null) checkLoggedIn();
  }, [loggedIn]);

  useEffect(() => {
    setSection(window.location.pathname);
  }, [section]);

  const logout = async () => {
    try {
      /** @API call */
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/logout`);
      setLoggedIn(false);
      setSection("/");
      alert(t.alert.success.auth.loggedOut, "success");
    } catch (e) {
      alert(t.alert.error.default, "error");
    }
  };

  return (
    <div className="header">
      <div className="header__left">
        <Link
          className="header__link header__link--home"
          to="/"
          onClick={() => {
            setSection("/");
          }}
        >
          Home
        </Link>
      </div>
      <div className="header__right">
        {section !== "/login" && !loggedIn && (
          <Link
            className="header__link header__link--login"
            to="/login"
            onClick={() => {
              setSection("/login");
            }}
          >
            Login
          </Link>
        )}

        {section !== "/profile" && loggedIn && (
          <Link
            to="/profile"
            className="header__link header__link--profile"
            onClick={() => {
              setSection("/profile");
            }}
          >
            Profile
          </Link>
        )}

        {loggedIn && (
          <Link
            className="header__link header__link--logout"
            to="/"
            onClick={() => {
              logout();
            }}
          >
            Logout
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
