function scoreColor(score) {
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

export default function AnalysisResults({ analysis }) {
  return (
    <div className="border border-neutral-200 rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div
          className={`text-4xl font-semibold ${scoreColor(analysis.matchScore)}`}
        >
          {analysis.matchScore}
        </div>
        <div className="text-sm text-neutral-500">
          / 100 match score
          <p className="mt-1">{analysis.summary}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold mb-2 text-green-700">
            Matched skills
          </h3>
          {analysis.matchedSkills?.length ? (
            <ul className="space-y-1">
              {analysis.matchedSkills.map((skill, i) => (
                <li key={i} className="text-sm text-neutral-700">
                  ✓ {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-400">None identified</p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2 text-red-700">
            Missing skills
          </h3>
          {analysis.missingSkills?.length ? (
            <ul className="space-y-1">
              {analysis.missingSkills.map((skill, i) => (
                <li key={i} className="text-sm text-neutral-700">
                  ✗ {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-400">None — great match!</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Suggestions</h3>
        {analysis.suggestions?.length ? (
          <ul className="space-y-2 list-disc list-inside">
            {analysis.suggestions.map((suggestion, i) => (
              <li key={i} className="text-sm text-neutral-700">
                {suggestion}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-400">No specific suggestions.</p>
        )}
      </div>
    </div>
  );
}
