// server/utils/chartQueryBuilder.ts
import type { Chart, TimeRange, Granularity } from '~/types/chart';

export class ChartQueryBuilder {
	private projectId: string;

	constructor(projectId: string) {
		this.projectId = projectId;
	}

	buildQuery(chart: Chart): string {
		const { eventTypes, groupBy, timeRange, granularity, chartType } = chart;

		// For number charts (single metric), no time series needed
		if (chartType === 'number') {
			return this.buildNumberQuery(eventTypes, timeRange);
		}

		// For time series charts
		if (!groupBy) {
			return this.buildTimeSeriesQuery(eventTypes, timeRange, granularity);
		}

		// For grouped charts (pie, bar by dimension)
		return this.buildGroupedQuery(eventTypes, groupBy, timeRange);
	}

	private buildNumberQuery(eventTypes: string[], timeRange: TimeRange): string {
		const typeCondition = this.buildTypeCondition(eventTypes);
		const timeCondition = this.buildTimeCondition(timeRange);

		return `
      SELECT COUNT(*) as value
      FROM analytics
      WHERE project_id = '${this.projectId}'
        AND ${typeCondition}
        ${timeCondition}
    `.trim();
	}

	private buildTimeSeriesQuery(
		eventTypes: string[],
		timeRange: TimeRange,
		granularity: Granularity
	): string {
		const typeCondition = this.buildTypeCondition(eventTypes);
		const timeCondition = this.buildTimeCondition(timeRange);
		const timeBucket = this.getTimeBucket(granularity);

		// Build a column for each event type
		const eventColumns = eventTypes.map(eventType => 
			`COUNT(*) FILTER (WHERE type = '${eventType}') as "${eventType}"`
		).join(',\n        ');

		return `
      SELECT 
        ${timeBucket} as date,
        ${eventColumns}
      FROM analytics
      WHERE project_id = '${this.projectId}'
        AND ${typeCondition}
        ${timeCondition}
      GROUP BY date
      ORDER BY date ASC
    `.trim();
	}

	private buildGroupedQuery(
		eventTypes: string[],
		groupBy: string,
		timeRange: TimeRange
	): string {
		const typeCondition = this.buildTypeCondition(eventTypes);
		const timeCondition = this.buildTimeCondition(timeRange);

		return `
      SELECT 
        ${groupBy} as label,
        COUNT(*) as value
      FROM analytics
      WHERE project_id = '${this.projectId}'
        AND ${typeCondition}
        AND ${groupBy} IS NOT NULL
        ${timeCondition}
      GROUP BY ${groupBy}
      ORDER BY value DESC
      LIMIT 10
    `.trim();
	}

	private buildTypeCondition(eventTypes: string[]): string {
		if (eventTypes.length === 0) {
			return "type IS NOT NULL";
		}

		if (eventTypes.length === 1) {
			return `type = '${eventTypes[0]}'`;
		}

		const types = eventTypes.map(t => `'${t}'`).join(', ');
		return `type IN (${types})`;
	}

	private buildTimeCondition(timeRange: TimeRange): string {
		if (timeRange === 'all') {
			return '';
		}

		const interval = this.parseTimeRange(timeRange);
		return `AND timestamp >= CURRENT_TIMESTAMP - INTERVAL '${interval}'`;
	}

	private parseTimeRange(timeRange: TimeRange): string {
		const map: Record<TimeRange, string> = {
			'24h': '24 hours',
			'7d': '7 days',
			'30d': '30 days',
			'90d': '90 days',
			'all': ''
		};
		return map[timeRange] || '7 days';
	}

	private getTimeBucket(granularity: Granularity): string {
		const map: Record<Granularity, string> = {
			hour: "date_trunc('hour', timestamp)",
			day: "date_trunc('day', timestamp)",
			week: "date_trunc('week', timestamp)",
			month: "date_trunc('month', timestamp)"
		};
		return map[granularity];
	}
}