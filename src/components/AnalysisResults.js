import FormattedText from "@/components/FormattedText";

function scoreColor(score) {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-danger";
}

export default function AnalysisResults({ analysis }) {
  return (
    <div className="border border-border rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div
          className={`font-mono text-4xl font-semibold ${scoreColor(analysis.matchScore)}`}
        >
          {analysis.matchScore}
        </div>
        <div className="text-sm text-ink-secondary">
          / 100 match score
          <p className="mt-1">
            <FormattedText text={analysis.summary} />
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold mb-2 text-success">
            Matched skills
          </h3>
          {analysis.matchedSkills?.length ? (
            <ul className="space-y-1">
              {analysis.matchedSkills.map((skill, i) => (
                <li key={i} className="text-sm text-ink">
                  ✓ {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-secondary">None identified</p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2 text-danger">
            Missing skills
          </h3>
          {analysis.missingSkills?.length ? (
            <ul className="space-y-1">
              {analysis.missingSkills.map((skill, i) => (
                <li key={i} className="text-sm text-ink">
                  ✗ {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-secondary">None — great match!</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Suggestions</h3>
        {analysis.suggestions?.length ? (
          <ul className="space-y-2 list-disc list-inside">
            {analysis.suggestions.map((suggestion, i) => (
              <li key={i} className="text-sm text-ink">
                <FormattedText text={suggestion} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-secondary">No specific suggestions.</p>
        )}
      </div>
    </div>
  );
}
