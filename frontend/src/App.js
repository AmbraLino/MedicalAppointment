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
import AdminPanel from "./Admin/AdminPanel";
import ProtectedRoute from './Auth/ProtectedRoute';
import { UserContextProvider } from "./Auth/UserContext";
import AgjentPanel from "./Agjent/AgjentPanel"; 
import AgjentRoute from "./Auth/AgjentRoute";
import DoctorDashboard from "./Doctor/DoctorDashboard";
import DoctorSchedule from "./MainPages/DoctorSchedule";
import UserProfile from "./User/UserProfile";
import ReadOne from "./MainPages/ReadOne";
// import Department from "./MainPages/Department";
import FindDoctor from "./MainPages/FindDoctor";
import Booking from "./MainPages/Booking";
function App() {
  return (
    <>
    <UserContextProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/readOne/:id" element={<ReadOne />} />
        {/* <Route path="/agjent" element={<Agjent />} /> */}
       {/* <Route path="/doctorDashboard" element={<DoctorDashboard />} /> */}
        <Route path="/create" element={<Create />} />
        <Route path="/read/:id" element={<Read />} />
        <Route path="/finddoctor" element={<FindDoctor />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/doctor-schedule/:id" element={<DoctorSchedule />} />
        <Route path="/updateProduct/:id" element={<Update />} />
        <Route path="/profile" element={<UserProfile />} />
        {/* <Route path="/department" element={<Department/>} /> */}
        {/* <Route
          path="/adminPanel"
          element={
            <ProtectedRoute adminOnly>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
<Route path="/agjentPanel" element={
  <AgjentRoute>
    <AgjentPanel />
  </AgjentRoute>
} /> */}
<Route element={<ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']} />}>
           {/* Këtu mund të shtosh faqe që kërkojnë vetëm login të thjeshtë */}
        </Route>

        {/* Rrugët vetëm për Doktorët */}
       <Route element={<ProtectedRoute allowedRoles={['doctor', 'admin']} />}>
          <Route path="/doctorDashboard" element={<DoctorDashboard />} />
        </Route>

        {/* Rrugët vetëm për Adminët */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/adminPanel" element={<AdminPanel />} />
        </Route>
      </Routes>
      <Footer />
      </UserContextProvider>
    </>
  );
}

export default App;
