"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { createDepartment, deleteDepartment, listDepartments } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * PUBLIC_INTERFACE
 * Admin Departments management with create and delete.
 */
export default function DepartmentsTable() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "departments"],
    queryFn: listDepartments,
    initialData: [],
  });

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  async function onCreate() {
    await createDepartment({ name });
    await qc.invalidateQueries({ queryKey: ["admin", "departments"] });
    setOpen(false);
    setName("");
  }

  async function onDelete(id: string) {
    await deleteDepartment(id);
    await qc.invalidateQueries({ queryKey: ["admin", "departments"] });
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">Departments</h3>
        <Button onClick={() => setOpen(true)}>New Department</Button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-gray-600">
            <tr>
              <th className="px-2 py-2">Name</th>
              <th className="px-2 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="px-2 py-2">{d.name}</td>
                <td className="px-2 py-2 text-right">
                  <Button variant="danger" onClick={() => onDelete(d.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={2} className="px-2 py-6 text-center text-gray-500">
                  No departments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create Department">
        <div className="space-y-3">
          <Input placeholder="Department name" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="pt-2">
            <Button onClick={onCreate}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
