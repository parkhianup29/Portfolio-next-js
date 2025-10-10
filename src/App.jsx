import Navbar from "./components/Navbar";
import About from "./components/About";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import ChatBox from "./components/Chatbox";
import HashLoader from "react-spinners/HashLoader";
import { Analytics } from '@vercel/analytics/next';

import { useState, useEffect } from "react";

const override = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "5rem",
  borderColor: "red",
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  return (
    <>
      {loading ? (
        <div className="flex h-screen justify-center items-center bg-[#00040f]">
          <HashLoader
            color="#0891b2"
            loading={loading}
            cssOverride={override}
            size={90}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div>
          <Navbar></Navbar>
          <About></About>
          <ChatBox></ChatBox>
          <Experience></Experience>
          <Education></Education>
          <Projects></Projects>
          <Contact></Contact>
        </div>
      )}
      <Analytics />
    </>
  );
};
export default App;
