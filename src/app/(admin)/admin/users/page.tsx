import { getAllUsers } from "@/core/admin/actions";
import { UserTable } from "@/core/admin/components/UserTable";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground mt-1">View all registered users and manage account access.</p>
      </div>

      <UserTable users={users} />
    </div>
  );
}
