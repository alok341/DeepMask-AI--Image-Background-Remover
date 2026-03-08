import { Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext";
import Footer from "./components/Footer";
import MenuBar from "./components/MenuBar";
import Home from "./pages/Home";
import ImageTool from "./pages/ImageTool";
import PricingPage from "./pages/PricingPage";  // Import the PricingPage
import { Toaster } from "react-hot-toast";
import UserSyncHandler from "./components/UserSyncHandler";

const App = () => {
  return (
    <AppContextProvider>
      <div>
        <MenuBar />
        <UserSyncHandler />
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tool" element={<ImageTool />} />
          <Route path="/pricing" element={<PricingPage />} />  {/* Add this line */}
        </Routes>
        <Footer />
      </div>
    </AppContextProvider>
  );
};

export default App;
