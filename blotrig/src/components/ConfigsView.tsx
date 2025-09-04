export function ConfigsView({
  lanes,
  replications,
  selectedCol,
}: {
  lanes: number | "";
  replications: number | "";
  selectedCol: string;
}) {
  return (
    <div className="grow overflow-auto">
      <h3 className="text-lg font-semibold mb-4">Gel Configurations</h3>
      <p className="text-gray-700">
        Number of lanes per gel: <span className="font-mono">{lanes}</span>
      </p>
      <p className="text-gray-700">
        Replications:{" "}
        <span className="font-mono">{replications || "Not set"}</span>
      </p>
      <p className="text-gray-700">
        Selected CSV column: <span className="font-mono">{selectedCol}</span>
      </p>
    </div>
  );
}
