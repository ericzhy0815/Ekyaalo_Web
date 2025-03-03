// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux"; // Import Provider
import { store } from "./redux/store"; // Import store
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Cases from "./pages/Cases";
import CaseDetail from "./pages/CaseDetail";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/cases/:id" element={<CaseDetail />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
