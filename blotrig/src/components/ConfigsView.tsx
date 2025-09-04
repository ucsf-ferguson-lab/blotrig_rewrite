export function ConfigsView({
  lanes,
  replications,
  groupsCol,
  subjectsCol,
}: {
  lanes: number | "";
  replications: number | "";
  groupsCol: string;
  subjectsCol: string;
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
        Selected groups column: <span className="font-mono">{groupsCol}</span>
      </p>

      <p className="text-gray-700">
        Selected subjects column:{" "}
        <span className="font-mono">{subjectsCol}</span>
      </p>
    </div>
  );
}
