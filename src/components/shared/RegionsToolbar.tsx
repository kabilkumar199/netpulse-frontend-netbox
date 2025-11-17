import React from "react";
import { Settings } from "lucide-react";

const RegionsToolbar: React.FC = () => {
  return (
    <div className="bg-slate-800 p-4 rounded-xl mb-4">
      <div className="flex items-center gap-3 mb-3">
        <button className="text-sm border-b-2 border-transparent hover:border-emerald-400">
          Results (0)
        </button>
        <button className="text-sm border-b-2 border-transparent hover:border-emerald-400">
          Filters
        </button>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Quick search"
          className="bg-slate-700 text-sm text-white px-3 py-2 rounded-md w-64 outline-none"
        />
        <select className="bg-slate-700 text-sm px-3 py-2 rounded-md outline-none">
          <option>Filter</option>
        </select>

        {/* <div className="ml-auto">
          <button className="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-md flex items-center gap-2">
            <Settings size={14} /> Configure Table
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default RegionsToolbar;
