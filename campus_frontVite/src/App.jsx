import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🔹 Authentication & Dashboard Components
import LoginPage from "./Components/LoginComponent/LoginPage";
import AdminMenu from "./Components/LoginComponent/AdminMenu";
import SigninPage from "./Components/LoginComponent/SignupPage";
import SingleStudentDetails from "./Components/LoginComponent/SingleStudentDetails";
import StudentMenu from "./Components/StudentMenu";  // ✅ Corrected path

// 🔹 Item Components
import LostItemSubmit from "./Components/ItemComponent/LostItemSubmit";
import LostItemReport from "./Components/ItemComponent/LostItemReport";
import FoundItemSubmission from "./Components/ItemComponent/FoundItemSubmission";
import FoundItemReport from "./Components/ItemComponent/FoundItemReport";
import LostItemTrack from "./Components/ItemComponent/LostItemTrack";
import MarkAsFound from "./Components/ItemComponent/MarkAsFound";

// 🔹 Other Components
import Personal from "./Components/LoginComponent/Personal";
import StudentList from "./Components/LoginComponent/StudentList";
import DeleteStudentList from "./Components/LoginComponent/DeleteStudentList";
import ChatRoom from "./Components/ChatRoom";  // ✅ ChatRoom import

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔹 Authentication Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/Register" element={<SigninPage />} />
        <Route path="/AdminMenu" element={<AdminMenu />} />

        {/* 🔹 Student Dashboard Routes */}
        <Route path="/StudentMenu" element={<StudentMenu />}>
          <Route path="LostSubmit" element={<LostItemSubmit />} />
          <Route path="LostReport" element={<LostItemReport />} />
          <Route path="LostItemTrack" element={<LostItemTrack />} />
          <Route path="FoundSubmit" element={<FoundItemSubmission />} />
          <Route path="FoundReport" element={<FoundItemReport />} />
          <Route path="Personal" element={<Personal />} />
          <Route path="ChatRoom" element={<ChatRoom />} />
        </Route>

        {/* 🔹 Admin Report Routes (Added for AdminDashboard links) */}
        <Route path="/LostReport" element={<LostItemReport />} />
        <Route path="/FoundReport" element={<FoundItemReport />} />

        {/* 🔹 Miscellaneous Routes */}
        <Route path="/SingleStudentDetail" element={<SingleStudentDetails />} />
        <Route path="/Students" element={<StudentList />} />
        <Route path="/DeleteStudentList" element={<DeleteStudentList />} />
        <Route path="/mark-found/:id" element={<MarkAsFound />} />
      </Routes>
    </Router>
  );
}

export default App;
