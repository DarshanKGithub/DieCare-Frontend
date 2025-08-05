"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Swal from "sweetalert2";
import UserTable from "../pages/UserTable";
import UserModal from "../pages/UserModel";
import { FaSpinner, FaSignOutAlt } from "react-icons/fa";

export default function AdminDashboard() {
  const [hodUsers, setHodUsers] = useState([]);
  const [employeeUsers, setEmployeeUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [qualityUsers, setQualityUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  const [userRole, setUserRole] = useState("hod");

  function SkeletonCard() {
    return (
      <div className="animate-pulse bg-gray-100 rounded-lg p-6 mb-4 shadow">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirecting to login");
      router.push("/");
      return;
    }

    // Validate token
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== "admin") {
        console.log("Non-admin role detected:", payload.role);
        localStorage.removeItem("token");
        router.push("/");
        return;
      }
    } catch (error) {
      console.error("Invalid token format:", error);
      localStorage.removeItem("token");
      router.push("/");
      return;
    }

    // Prevent redirect loop
    if (pathname === "/" && token) {
      console.log("Redirecting from / to /adminDashboard");
      router.push("/adminDashboard");
      return;
    }

    const fetchUsers = async (role, setUsers) => {
      try {
        console.log(`Fetching ${role} users...`);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users?role=${role}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log(`Fetched ${role} users data:`, data);

        // Check if data needs to be accessed differently (e.g., data.users)
        setUsers(data.users || data); // Try both variations
      } catch (error) {
        console.error(`Error fetching ${role} users:`, error);
      }
    };
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchUsers("hod", setHodUsers),
        fetchUsers("employee", setEmployeeUsers),
        fetchUsers("quality", setQualityUsers),
      ]);
      setLoading(false);
    };

    fetchData();
  }, [router, pathname]);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1e40af",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        router.push("/");
        Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: "You have been logged out successfully!",
          confirmButtonColor: "#1e40af",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleOpenModal = (mode, role, user = null) => {
    setModalMode(mode);
    setUserRole(role);
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const handleSaveUser = async (userData) => {
    const token = localStorage.getItem("token");
    const url =
      modalMode === "add"
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/users/register`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userData.id}`;
    const method = modalMode === "add" ? "POST" : "PUT";

    if (modalMode === "edit" && !userData.password) {
      delete userData.password;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${modalMode} user`);
      }

      const updatedUser = await response.json();

      // Determine which state to update based on role
      let targetStateSetter;
      switch (userData.role) {
        case "hod":
          targetStateSetter = setHodUsers;
          break;
        case "employee":
          targetStateSetter = setEmployeeUsers;
          break;
        case "quality":
          targetStateSetter = setQualityUsers;
          break;
        default:
          throw new Error("Invalid user role");
      }

      if (modalMode === "add") {
        targetStateSetter((prev) => [...prev, updatedUser.user]);
      } else {
        targetStateSetter((prev) =>
          prev.map((u) => (u.id === updatedUser.user.id ? updatedUser.user : u))
        );
      }

      handleCloseModal();
      Swal.fire({
        icon: "success",
        title: `User ${modalMode === "add" ? "Added" : "Updated"}`,
        text: `User ${modalMode === "add" ? "added" : "updated"} successfully!`,
        confirmButtonColor: "#1e40af",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(`[${modalMode.toUpperCase()} USER ERROR] ${error.message}`);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error ${modalMode === "add" ? "adding" : "updating"} user: ${
          error.message
        }`,
        confirmButtonColor: "#1e40af",
      });
    }
  };
  const handleDeleteUser = async (userId, role) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this user?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1e40af",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem("token");
      try {
        console.log(`Deleting user ${userId} with role ${role}`);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete user");
        }

        const targetStateSetter =
          role === "hod" ? setHodUsers : setEmployeeUsers;
        targetStateSetter((prev) => prev.filter((user) => user.id !== userId));
        Swal.fire({
          icon: "success",
          title: "User Deleted",
          text: "User deleted successfully!",
          confirmButtonColor: "#1e40af",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error(`[DELETE USER ERROR] ${error.message}`);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Error deleting user: ${error.message}`,
          confirmButtonColor: "#1e40af",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-blue-900 to-gray-700">
      <header className="bg-gray-900/90 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl text-white font-semibold tracking-tight">
              DieCare
            </span>
          </div>
          <div className="flex justify-center">
            <span className="text-white text-2xl font-bold">Admin Portal</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2 bg-blue-800 rounded-lg hover:bg-blue-900 hover:shadow-xl transition duration-300 transform hover:scale-105"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            {loading && (
              <FaSpinner className="animate-spin text-xl text-blue-600" />
            )}
          </div>
          {loading ? (
            <div className="space-y-8">
              {[...Array(2)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              <UserTable
                title="HOD Users"
                users={hodUsers || []}
                onAdd={() => handleOpenModal("add", "hod")}
                onEdit={(user) => handleOpenModal("edit", user.role, user)}
                onDelete={(userId) => handleDeleteUser(userId, "hod")}
              />
              <UserTable
                title="Employee Users"
                users={employeeUsers || []}
                onAdd={() => handleOpenModal("add", "employee")}
                onEdit={(user) => handleOpenModal("edit", user.role, user)}
                onDelete={(userId) => handleDeleteUser(userId, "employee")}
              />
              <UserTable
                title="Quality Users"
                users={qualityUsers || []}
                onAdd={() => handleOpenModal("add", "quality")}
                onEdit={(user) => handleOpenModal("edit", user.role, user)}
                onDelete={(userId) => handleDeleteUser(userId, "quality")}
              />
            </div>
          )}
        </div>
        <footer className="mt-8 text-center text-sm text-gray-400">
          © 2025 DieCare Engineering IT Department. All rights reserved.
        </footer>
      </main>
      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
          user={currentUser}
          mode={modalMode}
          role={userRole}
        />
      )}
    </div>
  );
}
