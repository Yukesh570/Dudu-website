export default function ProfilePage() {
  return (
    <div className="lg:col-span-3">
      {/* Personal Profile Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Personal Profile | EDT</h2>
        </div>
        <div className="space-y-3">
          <p className="font-medium">User Name</p>
          <p className="text-gray-600">email@gmail.com</p>
          <div className="space-y-2 mt-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Receive marketing SMS</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Receive marketing emails</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Address Book | Add</h2>
        </div>
        <div className="space-y-4">
          <p className="text-gray-600">Save your shipping address here.</p>
          <p className="text-gray-600">Save your billing address here.</p>
        </div>
      </div>
    </div>
  );
}
