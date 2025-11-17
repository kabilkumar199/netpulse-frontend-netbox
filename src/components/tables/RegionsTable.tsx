import React from "react";
import type { Region } from "../../pages/Organization/Regions";

interface Props {
  regions: Region[];
}

const RegionsTable: React.FC<Props> = ({ regions }) => {
  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-700 uppercase text-xs text-slate-300">
          <tr>
            <th className="px-4 py-3 w-10">
              <input type="checkbox" className="accent-emerald-500" />
            </th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Sites</th>
            <th className="px-4 py-3">Description</th>
          </tr>
        </thead>
        <tbody>
          {regions.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-6 text-slate-400">
                — No regions found —
              </td>
            </tr>
          ) : (
            regions.map((region) => (
              <tr
                key={region.id}
                className="border-t border-slate-700 hover:bg-slate-700/40"
              >
                <td className="px-4 py-3">
                  <input type="checkbox" className="accent-emerald-500" />
                </td>
                <td className="px-4 py-3">{region.name}</td>
                <td className="px-4 py-3">{region.sites}</td>
                <td className="px-4 py-3">{region.description}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RegionsTable;
