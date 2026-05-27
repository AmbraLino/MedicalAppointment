import "./App.css";
import { Router, Routes, Route } from "react-router-dom";
import Navbar from "./Base/NavBar";
import Home from "./MainPages/Home";
import About from "./MainPages/About";
import Contact from "./MainPages/Contact";
import Footer from "./Base/Footer";
import Login from  "./Auth/Login";
import Register from "./Auth/Register";
import Create from "./Admin/Create";
import Update from "./Admin/Update";
import AdminDoctorPanel from "./Admin/AdminDoctorPanel";
import ProtectedRoute from './Auth/ProtectedRoute';
import { UserContextProvider } from "./Auth/UserContext";
import DoctorDashboard from "./Doctor/DoctorDashboard";
import DoctorSchedule from "./MainPages/DoctorSchedule";
import UserProfile from "./User/UserProfile";
import FindDoctor from "./MainPages/FindDoctor";
import Booking from "./MainPages/Booking";
import AdminDoctorForm from "./Admin/AdminDoctorForm";
import AdminUpdateDoctor from "./Admin/AdminUpdateDoctor";
import DepartmentDetails from "./MainPages/DepartmentDetails";
import AdminDepartmentPanel from "./Admin/AdminDepartmentPanel"; 
import AdminCreateDepartment from "./Admin/AdminCreateDepartment";
import AdminEditDepartment from "./Admin/AdminEditDepartment";
import ReviewModal from "./MainPages/ReviewModal";
import Reviews from "./MainPages/Reviews";
function App() {
  return (
    <UserContextProvider>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/finddoctor" element={<FindDoctor />} />
        <Route path="/profile" element={<UserProfile />} />
      <Route path="/admin/doctors" element={<AdminDoctorPanel />} />
<Route path="/admin/create" element={<AdminDoctorForm />} />
{/* <Route path="/admin/update/:id" element={<AdminDoctorForm />} /> */}
<Route path="/doctor-schedule/:id" element={<DoctorSchedule />} />
<Route path="/booking" element={<Booking />} />
<Route path="/department/:id" element={<DepartmentDetails />} />
<Route path="/admin/departments" element={<AdminDepartmentPanel />} />
<Route path="/admin/departments/create" element={<AdminCreateDepartment />} />
<Route path="/admin/departments/edit/:id" element={<AdminEditDepartment />} />
<Route path="/reviews" element={<Reviews />} />
<Route path="/review" element={<ReviewModal />} />
        {/* protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['doctor', 'admin']} />}>
          <Route path="/doctor/doctorDashboard" element={<DoctorDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/adminDoctorPanel" element={<AdminDoctorPanel />} />
        </Route>
        <Route path="/admin/update/:id" element={<AdminUpdateDoctor />} />
      </Routes>
      <Footer />
    </UserContextProvider>
  );
}

export default App;
