// types/charts.ts
export type ChartType = 'line' | 'bar' | 'pie' | 'number';

export type TimeRange = '24h' | '7d' | '30d' | '90d' | 'all';

export type Granularity = 'hour' | 'day' | 'week' | 'month';

export type GroupByDimension =
	| 'country'
	| 'browser'
	| 'device'
	| 'os'
	| 'referrer_domain'
	| 'source'
	| 'medium'
	| 'campaign';

export interface Chart {
	id: string;
	projectId: string;
	name: string;
	description?: string;
	chartType: ChartType;
	eventTypes: string[]; // e.g., ["signup", "login"]
	groupBy?: GroupByDimension | null;
	timeRange: TimeRange;
	granularity: Granularity;
	position: number;
	width: string;
	createdAt: string;
	updatedAt: string;
}