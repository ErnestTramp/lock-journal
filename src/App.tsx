import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import Header from "./components/Header";
import Inputs from "./components/Inputs";
import Analytics from "./components/Analytics";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header />
      <div className="appWrapper">
        <Inputs></Inputs>
        <Analytics></Analytics>
      </div>
    </ThemeProvider>
  );
}

export default App;
