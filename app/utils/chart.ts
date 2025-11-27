import {
	Chart,
	type ChartData,
	type ChartOptions,
	type ChartType,
	type UpdateMode,
	type DefaultDataPoint,
} from "chart.js/auto";

export function toRawIfProxy<T>(obj: T) {
	return isProxy(obj) ? toRaw(obj) : obj;
}

export function setOptions<
	TType extends ChartType = ChartType,
	TData = DefaultDataPoint<TType>,
	TLabel = unknown
>(chart: Chart<TType, TData, TLabel>, nextOptions: ChartOptions<TType>) {
	const options = chart.options;

	if (options && nextOptions) {
		Object.assign(options, nextOptions);
	}
}



// Format Labels (Example)
export function formatLabel(value, index) {
	return index % 5 === 0 ? value : "";
}
