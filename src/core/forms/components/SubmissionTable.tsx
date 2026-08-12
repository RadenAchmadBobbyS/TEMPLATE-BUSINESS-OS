"use client";

import { formatDistanceToNow } from "date-fns";
import { Download, Table as TableIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";

export function SubmissionTable({ form, submissions }: { form: any, submissions: any[] }) {
  const fields = form.fields as any[];
  
  const handleExportCSV = () => {
    if (submissions.length === 0) return;

    // Headers
    const headers = ["Date", ...fields.map(f => f.label)];
    
    // Rows
    const rows = submissions.map(sub => {
      const data = sub.data as Record<string, any>;
      const row = [new Date(sub.createdAt).toISOString()];
      
      fields.forEach(f => {
        let val = data[f.id] || "";
        // Basic escaping for CSV
        if (typeof val === 'string') {
          val = val.replace(/"/g, '""');
          if (val.search(/("|,|\n)/g) >= 0) {
            val = `"${val}"`;
          }
        }
        row.push(val);
      });
      return row;
    });

    // Combine
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    // Download trigger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${form.name.replace(/\s+/g, '_').toLowerCase()}_submissions.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Submissions Data</h3>
        <Button onClick={handleExportCSV} disabled={submissions.length === 0} variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      {submissions.length === 0 ? (
        <EmptyState 
          title="No submissions yet" 
          description={`Your form is live, but no one has submitted data yet.`}
        />
      ) : (
        <div className="border rounded-lg bg-card overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                {fields.map(f => (
                  <th key={f.id} className="px-6 py-3 font-medium">{f.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {submissions.map(sub => {
                const data = sub.data as Record<string, any>;
                return (
                  <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true })}
                    </td>
                    {fields.map(f => (
                      <td key={f.id} className="px-6 py-4 truncate max-w-[200px]">
                        {String(data[f.id] || "-")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
