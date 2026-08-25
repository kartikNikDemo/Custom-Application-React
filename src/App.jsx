import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./Component/BaseComponent/ProtectedRoute"; // Add this new component
import ModuleSetup from "./Component/SettingComponent/ModuleSetup/ModuleSetup";
import ModuleList from "./Features/Module/List/moduleList";
import CreateData from "./Features/Module/Create/CreateData";
import EditData from "./Features/Module/Edit/EditData";
import ModuleOverview from "./Features/Module/Preview/ModuleOverview";
import PublicForm from "./Features/Public/PublicForm";
import EmployeeList from "./Component/Modules/Employee/EmployeeList";
import CreateEmployee from "./Component/Modules/Employee/CreateEmployee";
import UpdateEmployee from "./Component/Modules/Employee/UpdateEmployee";
import EmployeeOverview from "./Component/Modules/Employee/EmployeeOverview";
import 'flowbite';

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute> <Dashboard /> </ProtectedRoute>
        }
        />
        <Route path="/moduleSetup" element={
          <ProtectedRoute> <ModuleSetup /> </ProtectedRoute>
        }
        />
        <Route path="/employee" element={
          <ProtectedRoute> <EmployeeList /> </ProtectedRoute>
        }
        />
        <Route path="/employee/create" element={
          <ProtectedRoute> <CreateEmployee /> </ProtectedRoute>
        }
        />
        <Route path="/employee/:employeeId/edit" element={
          <ProtectedRoute> <UpdateEmployee /> </ProtectedRoute>
        }
        />
        <Route path="/employee/:employeeId/overview" element={
          <ProtectedRoute> <EmployeeOverview /> </ProtectedRoute>
        }
        />

        {/* Dynamic Module Route */}
        <Route
          path="/:moduleKey/:moduleId"
          element={
            <ProtectedRoute>
              <ModuleList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:moduleKey/:moduleId/create"
          element={
            <ProtectedRoute>
              <CreateData />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:moduleKey/:moduleId/:recordId/edit"
          element={
            <ProtectedRoute>
              <EditData />
            </ProtectedRoute>
          }
        />

        <Route
          path="/:moduleKey/:moduleId/:recordId/preview"
          element={
            <ProtectedRoute>
              <ModuleOverview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/:moduleKey/:moduleId/:companyId/publicForm"
          element={<PublicForm />}
        />
      </Routes>
    </Router>
  );
};

export default App;
