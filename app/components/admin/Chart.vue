<script setup lang="ts">
import {
    Chart,
    type ChartData,
    type ChartOptions,
    type ChartType,
    type UpdateMode,
} from "chart.js/auto";

const props = defineProps<{
    chartId?: string;
    title?: string;
    description?: string;
    type: ChartType;
    data: ChartData;
    options: ChartOptions;
    plugins?: [];
    updateMode: UpdateMode;
    selected: boolean;
    id: string | number;
    height?: number; // Add height prop
}>();

const customLegendPlugin = {
    id: "customLegend",
    afterUpdate: (chart: any) => {
        const legendContainer = document.getElementById(
            `custom-legend-${props.chartId}`
        );
        if (!legendContainer) return;
        legendContainer.innerHTML = "";

        chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
            let lastValue = 0;
            let lastValueLabel = "";
            let type = "";
            let showValues = true;

            switch (chart.config.options.customLegend?.type) {
                case "average":
                    type = "Average";
                    lastValue = calculateAverage(dataset.data);
                    lastValueLabel =
                        chart.data.labels[0] +
                        " - " +
                        chart.data.labels[chart.data.labels.length - 1];
                    break;
                case "total":
                    type = "Total";
                    lastValue = calculateSum(dataset.data);
                    lastValueLabel =
                        chart.data.labels[0] +
                        " - " +
                        chart.data.labels[chart.data.labels.length - 1];
                    break;
                case "current":
                    type = "";
                    lastValue = calculateCurrent(dataset.data);
                    lastValueLabel =
                        chart.data.labels[chart.data.labels.length - 1];
                    break;
                case "none":
                    showValues = false;
                    break;
            }

            const color = dataset.borderColor;
            const visibility = chart.isDatasetVisible(datasetIndex);
            const opacityStyle = !visibility ? "opacity: 0.3;" : "";

            const legendItem = document.createElement("div");
            legendItem.classList.add("custom-legend-item");
            if (!visibility) {
                legendItem.classList.add("hidden-series");
            }

            legendItem.addEventListener("click", () => {
                const isVisible = chart.isDatasetVisible(datasetIndex);
                chart.setDatasetVisibility(datasetIndex, !isVisible);
                chart.update();
            });

            legendItem.innerHTML = `
                ${
                    showValues
                        ? `
                <div style="display: flex; gap: 4px; align-items: flex-end; margin-bottom: 4px;">
                    <div style="font-size: 18px; font-weight: 800; ${opacityStyle}">${lastValue}</div>
                    <span style="margin-left: 4px; color: #64748b; font-size: 11px; ${opacityStyle}">${lastValueLabel}</span>
                </div>`
                        : ""
                }

                <div style="display: flex; gap: 2px; align-items: center;">
                    <div class="custom-legend-color-box" style="background-color: ${color}; border-radius: 4px; display: inline-block; ${opacityStyle}"></div>
                    <span style="color: #64748b; font-size: 12px; display: inline-block; ${opacityStyle}">${type} ${
                dataset.label
            }</span>
                </div>
            `;

            legendContainer.appendChild(legendItem);
        });
    },
};

const legendMargin = {
    id: "LegendMargin",
    beforeInit(chart: any, legend: any, options: any) {
        const fitValue = chart.legend.fit;

        chart.legend.fit = function fit() {
            fitValue.bind(chart.legend)();
            return (this.height += 10);
        };
    },
};

const canvasRef = ref<HTMLCanvasElement | null>(null);
const chartRef = shallowRef<Chart | null>(null);
const panelRef = ref<HTMLElement | null>(null);

const renderChart = () => {
    if (!canvasRef.value) return;

    const { type, data, options, plugins } = props;

    chartRef.value = new Chart(canvasRef.value, {
        type,
        data: data,
        options: {
            ...options,
            maintainAspectRatio: false, // IMPORTANT: Let container control height
        },
        plugins: [legendMargin, customLegendPlugin],
    });
};

const update = (chart: Chart) => {
    chart.update(props.updateMode);
};

const destroyChart = () => {
    const chart = toRaw(chartRef.value);

    if (chart) {
        chart.destroy();
        chartRef.value = null;
    }
};

onMounted(() => {
    renderChart();

    if (!canvasRef.value) return;

    const moveHandler = (event: MouseEvent) => {
        const tooltipEl = document.querySelector(
            ".custom-tooltip"
        ) as HTMLElement;
        if (!tooltipEl) return;

        tooltipEl.style.left = `${event.clientX + 10}px`;
        tooltipEl.style.top = `${event.clientY}px`;
    };

    canvasRef.value.addEventListener("mousemove", moveHandler);

    onBeforeUnmount(() => {
        canvasRef.value?.removeEventListener("mousemove", moveHandler);
        destroyChart();
    });
});

watch(
    [() => props.options, () => props.data],
    ([nextOptionsProxy, nextDataProxy], [prevOptionsProxy, prevDataProxy]) => {
        const chart = toRaw(chartRef.value);
        if (!chart) {
            return;
        }

        let shouldUpdate = false;

        if (nextOptionsProxy) {
            const nextOptions = toRawIfProxy(nextOptionsProxy);
            const prevOptions = toRawIfProxy(prevOptionsProxy);

            if (nextOptions && nextOptions !== prevOptions) {
                setOptions(chart, nextOptions);
                shouldUpdate = true;
            }
        }

        if (nextDataProxy) {
            const nextData = toRawIfProxy(nextDataProxy);
            const prevData = toRawIfProxy(prevDataProxy);

            if (nextData && nextData !== prevData) {
                chart.config.data = nextData;
                shouldUpdate = true;
            }
        }

        if (shouldUpdate) {
            nextTick(() => {
                update(chart);
            });
        }
    },
    { deep: true, immediate: false }
);

watch([() => props.type], () => {
    const chart = toRaw(chartRef.value);
    if (!chart) {
        return;
    }

    chart!.config.type = props.type;
    update(chart);
});

defineExpose({ update, destroyChart });
</script>

<template>
    <!-- <Panel ref="panelRef" class="p-4"> -->
    <div ref="panelRef" class="p-4">
        <!-- <div class="text-xl/6 font-semibold text-stone-950 dark:text-dark-100">
            {{ title }}
        </div>
        <div
            class="text-sm/6 text-stone-600 dark:text-dark-400"
            v-if="description"
        >
            {{ description }}
        </div> -->

        <div
            ref="element"
            :id="`custom-legend-${props.chartId || props.id}`"
            class="custom-legend no-scrollbar"
        ></div>

        <!-- FIXED: Wrap canvas in container with fixed height -->
        <div :style="{ height: `${height || 400}px`, position: 'relative' }">
            <canvas ref="canvasRef"></canvas>
        </div>
    </div>

    <!-- </Panel> -->
</template>

<style>
.custom-tooltip {
    background: rgb(17, 24, 39);
    border-radius: 5px;
    color: white;
    opacity: 1;
    padding: 14px;
    pointer-events: none;
    position: absolute;
    transition: all 0.2s ease;
    white-space: nowrap;
    z-index: 9999;
}
.custom-tooltip span {
    display: block;
}

.custom-legend {
    display: flex;
    gap: 20px;
    overflow-x: auto;
    align-items: flex-start;
    margin-top: 10px;
    line-height: 1.2;
}
.custom-legend-item {
    align-items: center;
    margin-bottom: 1.25rem;
    margin-top: 0.625rem;
    cursor: pointer;
    color: #0c0a09;
}

.dark .custom-legend-item {
    color: var(--dark-100, #f5f5f4);
}
.custom-legend-color-box {
    width: 12px;
    height: 12px;
    margin-right: 5px;
}
.hidden-series > span {
    opacity: 0.5;
}
</style>
