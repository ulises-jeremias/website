function record(level, message, failures, warnings) {
  (level === 'error' ? failures : warnings).push(message);
}

export function inspectLighthouseThresholds(config, route, result) {
  const failures = [];
  const warnings = [];
  const skippedCategories = new Set(config.routeOverrides?.[route]?.skipCategories ?? []);

  if (result.runtimeError) {
    const code = result.runtimeError.code ? ` ${result.runtimeError.code}` : '';
    const message = result.runtimeError.message ? `: ${result.runtimeError.message}` : '';
    failures.push(`${route} Lighthouse runtime error${code}${message}`);
  }

  for (const [id, threshold] of Object.entries(config.categories)) {
    if (skippedCategories.has(id)) continue;
    const score = result.categories?.[id]?.score;
    if (typeof score !== 'number') {
      record(threshold.level, `${route} ${id} did not return a numeric score`, failures, warnings);
    } else if (score < threshold.minScore) {
      record(
        threshold.level,
        `${route} ${id} score ${score.toFixed(2)} is below ${threshold.minScore.toFixed(2)}`,
        failures,
        warnings,
      );
    }
  }

  for (const [id, threshold] of Object.entries(config.audits)) {
    const value = result.audits?.[id]?.numericValue;
    if (typeof value !== 'number') {
      record(threshold.level, `${route} ${id} did not return a numeric value`, failures, warnings);
    } else if (value > threshold.maxNumericValue) {
      record(
        threshold.level,
        `${route} ${id} ${Math.round(value)} exceeds ${threshold.maxNumericValue}`,
        failures,
        warnings,
      );
    }
  }

  return { failures, warnings };
}
