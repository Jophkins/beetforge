import { Pencil, Trash } from "lucide-react";

import { Checkbox } from "@/src/components/ui/checkbox";

function TasksTable() {
  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-600 pb-2">
        <h2 className="text-lg font-semibold">Goals for: Skating</h2>
        <span className="mt-0.5 font-medium inline-flex items-center justify-center w-12 h-6 bg-purple-700 text-white rounded-2xl">S</span>
      </div>
      <div className="p-2">
        <h2 className="text-sm">
          What I want to achieve: describe your goal in detail.
        </h2>
        <div className="flex items-center m-2">
          <span className="mr-3">
            Lvl: 9
          </span>
          <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden flex-1 min-w-0">
            <div
              className="absolute inset-0 bg-yellow-300 rounded-full"
              style={{ width: `${(440 / 5800) * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-800">
              440/5800 exp.
            </div>
          </div>
        </div>
      </div>
      <div className="p-2 border rounded-md border-gray-200 flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-purple-950/30 text-white rounded-md p-2 border-l-4 border-purple-800">
          <Checkbox />
          <span>Skating 100km</span>
          <div className="ml-auto flex gap-1">
            <Pencil className="w-4 h-4" />
            <Trash className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-center gap-2 bg-purple-950/30 text-white rounded-md p-2 border-l-4 border-purple-800">
          <Checkbox />
          <span>Master Ollie</span>
          <div className="ml-auto flex gap-1">
            <Pencil className="w-4 h-4" />
            <Trash className="w-4 h-4" />
          </div>
        </div>
      </div>
    </>
  );
}

export default TasksTable;
