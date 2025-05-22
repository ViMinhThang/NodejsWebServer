import React, { createContext, useState } from "react";
import {
  Route,
  Routes,
  BrowserRouter as Router,
} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Header from "./components/Header";
import type { Video } from "./hook/useVideo";

interface AppContextType {
  loggedIn: boolean | null;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>;
  section: string;
  setSection: React.Dispatch<React.SetStateAction<string>>;
  videos: Video[];
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
}



export const AppContext = createContext<AppContextType>({
  loggedIn: null,
  setLoggedIn: () => { },
  section: "/",
  setSection: () => { },
  videos: [],
  setVideos: () => { },
});

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [section, setSection] = useState<string>("/");
  const [videos, setVideos] = useState<Video[]>([]);


  return (
    <AppContext.Provider
      value={{ loggedIn, setLoggedIn, section, setSection, videos, setVideos }}
    >
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}
export default App;