export default function HomePage() {
  return (
    <div className="flex items-center justify-center h-screen p-4">
      <div className="w-11/12 max-w-7xl border rounded-lg shadow-lg">
        <header className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-semibold">Main</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors">
              Main
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors">
              Rewards
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors">
              Help
            </button>
          </div>
        </header>
        <main className="p-4">
          <div className="character w-2/3">
            <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute inset-0 bg-blue-500 rounded-full"
                style={{ width: `${(720 / 1850) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-800">
                720/1850 exp.
              </div>
            </div>
          </div>
          <div className="skills w-2/3 mt-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Skill</h2>
              <button className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
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
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-5 gap-4 bg-gray-100 px-4 py-2 text-sm font-medium border-b">
                <div>Rank</div>
                <div>title</div>
                <div>LvL</div>
                <div>XP</div>
                <div>Action</div>
              </div>
              <div className="grid grid-cols-5 gap-4 px-4 py-3 text-sm items-center border-b">
                <div>
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-orange-500 text-white font-bold rounded">
                    S
                  </span>
                </div>
                <div>Skating</div>
                <div>9</div>
                <div>140/900</div>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
