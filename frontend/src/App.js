import "./App.css";
import { Router, Routes, Route } from "react-router-dom";
import Navbar from "./Base/NavBar";
import Home from "./MainPages/Home";
import About from "./MainPages/About";
import Contact from "./MainPages/Contact";
import Footer from "./Base/Footer";
import 'leaflet/dist/leaflet.css';
import Login from  "./Auth/Login";
import Register from "./Auth/Register";
import Categories from "./MainPages/Categories";
import Create from "./Admin/Create";
import Read from "./Admin/Read";
import Update from "./Admin/Update";
import AdminDoctorPanel from "./Admin/AdminDoctorPanel";
import ProtectedRoute from './Auth/ProtectedRoute';
import { UserContextProvider } from "./Auth/UserContext";
import AgjentPanel from "./Agjent/AgjentPanel"; 
import AgjentRoute from "./Auth/AgjentRoute";
import DoctorDashboard from "./Doctor/DoctorDashboard";
import DoctorSchedule from "./MainPages/DoctorSchedule";
import UserProfile from "./User/UserProfile";
import ReadOne from "./MainPages/ReadOne";
import FindDoctor from "./MainPages/FindDoctor";
import Booking from "./MainPages/Booking";
import AdminDoctorForm from "./Admin/AdminDoctorForm";

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
        <Route path="/categories" element={<Categories />} />
        <Route path="/finddoctor" element={<FindDoctor />} />
        <Route path="/profile" element={<UserProfile />} />
      <Route path="/admin/doctors" element={<AdminDoctorPanel />} />
<Route path="/admin/create" element={<AdminDoctorForm />} />
<Route path="/admin/update/:id" element={<AdminDoctorForm />} />
<Route path="/doctor-schedule/:id" element={<DoctorSchedule />} />
<Route path="/booking" element={<Booking />} />


        {/* protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['doctor', 'admin']} />}>
          <Route path="/doctor/doctorDashboard" element={<DoctorDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/adminDoctorPanel" element={<AdminDoctorPanel />} />
        </Route>
      </Routes>
      <Footer />
    </UserContextProvider>
  );
}

export default App;
