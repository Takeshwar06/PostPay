import React, { useState, useEffect } from "react";
import { ArrowRight, Loader, Printer } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, useOutletContext } from "react-router-dom";
import axiosPrivate from "../../utils/axiosPrivate";
import { getErrorMessage } from "../../utils/getErrorMessage";

export default function Users({  }) {
    const [users,setUsers] = useState([]);

    useEffect(()=>{
      const fetchUsers = async () => {
        try {
          const response = await axiosPrivate.get("/api/v1/users");
          console.log(response.data);
          setUsers(response.data?.data);
        } catch (error) {
          console.log("Error fetching posts:", error);
        }
      };
  
      fetchUsers();
    },[])
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <table className="w-full border-collapse border border-gray-200 bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border border-gray-300">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
              />
            </th>
            <th className="p-2 text-left border border-gray-300">User</th>
            <th className="p-2 text-left border border-gray-300">Mobile No</th>
            <th className="p-2 text-left border border-gray-300">Email</th>
            <th className="p-2 text-left border border-gray-300">Role</th>
            <th className="p-2 text-left border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <TableContentRow key={user._id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
const TableContentRow = ({ user }) => {
  const [userRole, setUserRole] = useState(user.role);
  const [loadingRoleUpdate, setLoadingRoleUpdate] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = async (e) => {
    const newRole = e.target.value;
    setUserRole(newRole);
    setLoadingRoleUpdate(true);

    try {
      await axiosPrivate.patch(`/api/v1/users/role/${user._id}`, {
        role: newRole,
      });
      toast.success("User role updated successfully!");
    } catch (error) {
      console.log("Error while updating user role: ", error);
      const { message } = getErrorMessage(error);
      toast.error(message);
      setUserRole(user.role); // revert back if failed
    } finally {
      setLoadingRoleUpdate(false);
    }
  };

  return (
    <tr className="border border-gray-300">
      <td className="p-2 text-center">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-blue-600"
        />
      </td>
      <td className="p-2 text-left">{user.name}</td>
      <td className="p-2 text-left">{user.phone}</td>
      <td className="p-2 text-left">{user.email}</td>
      <td className="p-2 text-left">
        <select
          value={userRole}
          onChange={handleRoleChange}
          className="border border-gray-300 rounded p-2 w-full"
          disabled={loadingRoleUpdate}
        >
          {loadingRoleUpdate ? (
            <option>Loading...</option>
          ) : (
            ["User", "Account","Admin"].map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))
          )}
        </select>
      </td>
      <td className="p-2 flex space-x-2">
        <button >
          <ArrowRight color="green" />
        </button>
      </td>
    </tr>
  );
};
