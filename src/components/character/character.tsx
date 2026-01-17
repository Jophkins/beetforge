function Character() {
  return (
    <>
      <div className="flex justify-between">
        <span className="text-lg font-medium ml-2">
          Siri
        </span>
        <span className="text-lg text-center font-medium ml-2">
          Level: 10
        </span>
      </div>
      <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute inset-0 bg-blue-500 rounded-full"
          style={{ width: `${(720 / 1850) * 100}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-800">
          720/1850 exp.
        </div>
      </div>
    </>
  );
}

export default Character;
