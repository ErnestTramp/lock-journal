import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import Header from "./components/Header";
import Inputs from "./components/Inputs";
import Analytics from "./components/Analytics";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { auth } from "./Firebase";
import LockedHome from "./components/LockedHome";

function App() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setIsLogged(true);
      } else {
        // User is signed out
        setIsLogged(false);
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  });

  if (isLogged) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Header />
        <div className="appWrapper">
          <Inputs></Inputs>
          <Analytics></Analytics>
        </div>
        <Toaster />
      </ThemeProvider>
    );
  } else {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Header />
        <LockedHome />
        <Toaster />
      </ThemeProvider>
    );
  }
}

export default App;
