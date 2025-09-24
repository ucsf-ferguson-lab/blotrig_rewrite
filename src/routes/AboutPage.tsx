import { useNavigate } from "react-router-dom";

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to BlotRig!</h1>

      <div className="max-w-2xl mx-auto space-y-4">
        <p>
          Designed and built by _:{" "}
          <a
            href="https://www.f.edu"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600 hover:text-blue-800"
          >
            GitHub repository
          </a>
        </p>

        <p>
          This user-friendly interface is designed to facilitate appropriate
          counterbalancing and technical replication for western blot
          experimental design.
        </p>

        <p>
          Users upload a spreadsheet with their sample IDs and experimental
          groups assignments for each sample, and blotRig will do the rest!
        </p>

        <p>
          blotRig creates a map of your western blot gels that illustrates which
          lane each sample should be loaded into.
        </p>

        <p>
          The decision for each lane loading is based on two main principles:
          <ul className="list-disc pl-8">
            <li>
              Each western blot gel should hold a representative sample of each
              experimental group
            </li>
            <li>
              Samples from the same experimental group are not loaded in
              adjacent lanes whenever possible
            </li>
          </ul>
        </p>

        <p>
          This ensures that proper counterbalancing is achieved so that we can
          limit the chances that the inherent variability within and across
          western blot gels is confounded with the experimental groups that we
          are interested in experimentally testing.
        </p>
      </div>

      <button
        className="px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => navigate("/create")}
      >
        Get Started
      </button>
    </div>
  );
}
