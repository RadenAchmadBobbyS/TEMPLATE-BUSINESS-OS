import { getAllWebsites } from "@/core/admin/actions";
import { format } from "date-fns";
import { Globe, User, ExternalLink } from "lucide-react";
import { Badge } from "@/shared/ui/badge";

export default async function AdminWebsitesPage() {
  const websites = await getAllWebsites();

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Global Websites</h2>
        <p className="text-muted-foreground mt-1">Monitor all websites hosted on the platform.</p>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Website</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Workspace Owner</th>
                <th className="px-6 py-4 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {websites.map((website) => {
                const owner = website.workspace.members[0]?.user;
                return (
                  <tr key={website.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {website.name}
                            <a href={`https://${website.id}.businessos.app`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">{website.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={website.status === "PUBLISHED" ? "default" : "secondary"} className={website.status === "PUBLISHED" ? "bg-green-500/10 text-green-600 border-green-500/20" : ""}>
                        {website.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm">{owner?.name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">{owner?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {format(new Date(website.createdAt), "MMM d, yyyy")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
