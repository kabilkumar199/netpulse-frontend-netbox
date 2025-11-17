import React, { useState } from "react";
import { RefreshCw } from "lucide-react";

interface Region {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent?: string;
  tags?: string[];
  comments?: string;
}

interface AddRegionProps {
  onAddRegion?: (region: Region) => void;
}

// Mock parent region options
const mockRegions = [
  { id: 1, name: "North America" },
  { id: 2, name: "Europe" },
  { id: 3, name: "Asia Pacific" },
];

const AddRegion: React.FC<AddRegionProps> = ({ onAddRegion }) => {
  const [formData, setFormData] = useState<Region>({
    id: Date.now(),
    name: "",
    slug: "",
    description: "",
    parent: "",
    tags: [],
    comments: "",
  });

  const [regions, setRegions] = useState<Region[]>([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateSlug = () => {
    if (formData.name) {
      const slug = formData.name.toLowerCase().replace(/\s+/g, "-");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };
  const handleCreate = () => {
    // Validation
    if (!formData.name || !formData.slug) {
      alert("Name and Slug are required!");
      return;
    }

    // Pass the new region to the parent (RegionsPage)
    if (onAddRegion) {
      onAddRegion(formData);
    } else {
      // Fallback for local state (if not used in modal)
      setRegions((prev) => [...prev, formData]);
      alert(`✅ Region "${formData.name}" added successfully!`);
    }

    // Reset form
    setFormData({
      id: Date.now(),
      name: "",
      slug: "",
      description: "",
      parent: "",
      tags: [],
      comments: "",
    });
  };

  const handleCreateAndAddAnother = () => {
    handleCreate();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-900 text-gray-100 rounded-xl ">
      <h1 className="text-2xl font-semibold mb-6">Add Region</h1>

      <div className="space-y-5">
        {/* Parent */}
        <div>
          <label className="block text-sm font-medium mb-1">Parent</label>
          <select
            name="parent"
            value={formData.parent}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
          >
            <option value="">-------</option>
            {mockRegions.map((region) => (
              <option key={region.id} value={region.name}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1 text-red-400">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Region Name"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium mb-1 text-red-400">
            Slug *
          </label>
          <div className="flex items-center">
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="URL-friendly shorthand"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-l-lg px-3 py-2"
            />
            <button
              onClick={handleGenerateSlug}
              type="button"
              className="bg-slate-700 hover:bg-slate-600 border border-slate-700 rounded-r-lg px-3 py-2 flex items-center"
            >
              <RefreshCw size={16} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            URL-friendly unique shorthand
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags?.join(", ")}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                tags: e.target.value.split(",").map((tag) => tag.trim()),
              }))
            }
            placeholder="Comma separated tags"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
          />
        </div>

        {/* Comments */}
        <div>
          <label className="block text-sm font-medium mb-2">Comments</label>
          <textarea
            name="comments"
            rows={4}
            value={formData.comments}
            onChange={handleChange}
            placeholder="Add comments here..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end items-center gap-3 pt-4">
          <button
            onClick={() => console.log("Cancelled")}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg"
          >
            Create
          </button>
          <button
            onClick={handleCreateAndAddAnother}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg"
          >
            Create & Add Another
          </button>
        </div>
      </div>

      {/* Mock data preview */}
      {regions.length > 0 && (
        <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg p-4">
          <h2 className="font-semibold mb-3 text-gray-200">
            Mock Regions List
          </h2>
          <ul className="space-y-2">
            {regions.map((r) => (
              <li
                key={r.id}
                className="border border-slate-700 rounded-md p-3 bg-slate-900"
              >
                <p className="text-sm font-medium text-emerald-400">{r.name}</p>
                <p className="text-xs text-gray-400">Slug: {r.slug}</p>
                {r.description && (
                  <p className="text-xs text-gray-400 mt-1">{r.description}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddRegion;
