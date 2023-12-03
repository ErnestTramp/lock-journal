import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import Header from "./components/Header";
import Inputs from "./components/Inputs";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header />
      <div className="appWrapper">
        <Inputs></Inputs>
      </div>
    </ThemeProvider>
  );
}

export default App;
