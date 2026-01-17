import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";

function SkillsTable() {
  return (
    <>
      <div className="flex items-center gap-2 border-b border-gray-600 pb-2">
        <h2 className="text-lg font-semibold">Skill</h2>
        <button className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <Table>
        <TableCaption>A list of your skills.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Rank</TableHead>
            <TableHead className="text-center">Title</TableHead>
            <TableHead className="text-center">LvL</TableHead>
            <TableHead className="text-center">XP</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="cursor-pointer hover:bg-gray-100 transition-colors">
            <TableCell className="mt-0.5 font-medium inline-flex items-center justify-center w-8 h-8 bg-purple-700 text-white rounded">S</TableCell>
            <TableCell className="text-center">Skating</TableCell>
            <TableCell className="text-center">9</TableCell>
            <TableCell className="text-center">140/900</TableCell>
            <TableCell className="text-right">actions</TableCell>
          </TableRow>
          <TableRow className="cursor-pointer hover:bg-gray-100 transition-colors">
            <TableCell className="mt-0.5 font-medium inline-flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded">A</TableCell>
            <TableCell className="text-center">Coding</TableCell>
            <TableCell className="text-center">17</TableCell>
            <TableCell className="text-center">775/4400</TableCell>
            <TableCell className="text-right">actions</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}

export default SkillsTable;
