import {  useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Uploader from "./Uploader";
import { AppContext } from "../App";
import Videos from "./Videos";
const Home = () => {
  const { loggedIn } = useContext(AppContext);
  const navigate = useNavigate();


  useEffect(() => {
    if (loggedIn === false) {
      navigate("/login");
    }
  }, [loggedIn]);


  return (
    <div className="posts-container">
      <Uploader />
      <Videos />
    </div>
  );
};

export default Home;
