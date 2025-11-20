export default function MyProfilePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <p className="text-gray-900">User Name</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address{" "}
                <span className="text-blue-600 text-xs">Change</span>
              </label>
              <p className="text-gray-900">dem*******@gmail.com</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile <span className="text-blue-600 text-xs">Change</span>
              </label>
              <p className="text-gray-900">+977 984*****76</p>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 mb-4">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Receive marketing emails</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Receive marketing SMS</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birthday
              </label>
              <p className="text-gray-900">2001-02-11</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <p className="text-gray-900">male</p>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm">
              EDIT PROFILE
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm">
              CHANGE PASSWORD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
