interface NoResultsMessageProps {
  clearFilters: () => void;
  applyFilters: () => void;
}

export default function NoResultsMessage({
  clearFilters,
  applyFilters,
}: NoResultsMessageProps) {
  return (
    <div className="p-4 text-center">
      <h3 className="text-xl font-semibold mb-2">No results found</h3>
      <p className="mb-4">
        No consumption corresponds to the selected filters.
      </p>
      <button
        onClick={() => {
          clearFilters();
          applyFilters();
        }}
        className="bg-primary text-white px-4 py-2 rounded-md"
      >
        Show all consumptions
      </button>
    </div>
  );
}
