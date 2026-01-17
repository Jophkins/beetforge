function Header() {
  return (
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
  );
}

export default Header;
