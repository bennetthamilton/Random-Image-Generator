export default function UserDashboard({ user }: { user: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      
      {/* ---------- LEFT COLUMN ---------- */}
      <div className="flex flex-col gap-6">
        {/* Category Selector */}
        <div>
          <label className="text-sm font-medium">Category</label>
          <select className="w-full mt-2 border rounded p-2 bg-background">
            <option value="all">All Images</option>
            {/* Later: map user-created categories */}
          </select>
        </div>

        {/* Generate Button */}
        <button className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">
          Generate Random Image
        </button>

        {/* Upload Button */}
        <button className="border border-foreground/20 rounded px-4 py-2 hover:bg-foreground/10">
          Upload Image
        </button>
      </div>

      {/* ---------- RIGHT COLUMN ---------- */}
      <div className="flex flex-col gap-6">
        {/* Featured Image (generated) */}
        <div className="border rounded p-4 min-h-[250px] flex items-center justify-center bg-foreground/5">
          {/* Show placeholder until a random image is generated */}
          <span className="text-sm text-foreground/60">
            No image generated yet.
          </span>
        </div>

        {/* Gallery Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Your Gallery</h2>

          {/* Empty state for users with no images */}
          <div className="border rounded p-4 text-sm text-foreground/60">
            No images uploaded yet. Upload an image to get started!
          </div>

          {/* Later: replace with image grid */}
        </div>
      </div>
    </div>
  );
}