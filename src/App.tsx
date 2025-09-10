function App() {
  return (
    <div className="max-w-[800px] mx-auto p-4 flex flex-col gap-4">
      <button className="self-end bg-gray-200 text-gray-600 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-plus-icon lucide-plus text-gray-400"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        Add job
      </button>
      <div className="border border-gray-300 rounded-md flex justify-between items-start gap-2">
        <div className="flex flex-col gap-2  py-4 pl-4 grow">
          <div className="flex gap-4 items-center">
            <div className="text-lg font-semibold text-gray-900">Acme Inc.</div>
            <div className="text-white bg-green-500 rounded-md px-2">
              Active
            </div>
          </div>
          <div className="text-gray-500 text-sm">01/01/2025</div>
        </div>
        <button className="text-gray-400 p-1.5 rounded-sm hover:bg-gray-100 m-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-pencil-icon lucide-pencil"
          >
            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
            <path d="m15 5 4 4" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default App;
