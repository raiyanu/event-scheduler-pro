import { createPortal } from "react-dom";
import { useGridStackContext } from "./grid-stack-context";
import { useGridStackRenderContext } from "./grid-stack-render-context";
import { GridStackWidgetContext } from "./grid-stack-widget-context";
import { GridStackWidget } from "gridstack";
import { ComponentType, useEffect } from "react";
import { useSelector } from "react-redux";

// eslint-disable-next-line @typescript-eslint/no-explicit-any

function parseWeightMetaToComponentData(meta: GridStackWidget) {
	let error = null;
	let name = "";
	let props = {};
	try {
		if (meta.content) {
			const result = JSON.parse(meta.content) as {
				name: string;
				props: object;
			};
			name = result.name;
			props = result.props;
		}
	} catch (e) {
		error = e;
	}
	return {
		name,
		props,
		error,
	};
}

export function GridStackRender(props: { componentMap }) {
	const { _rawWidgetMetaMap } = useGridStackContext();
	const { getWidgetContainer } = useGridStackRenderContext();
	const tasks = useSelector((state: any) => state.TASK.tasks);
	const { addWidget } = useGridStackContext();

	useEffect(() => {
		tasks.forEach((task: any) => {
			addWidget((id) => ({
				w: 2,
				h: 2,
				x: 0,
				y: 0,
				content: JSON.stringify({
					name: "Text",
					props: { content: task.title },
				}),
			}));
		});
	}, [tasks]);
	return (
		<>
			{Array.from(_rawWidgetMetaMap.value.entries()).map(([id, meta]) => {
				const componentData = parseWeightMetaToComponentData(meta);

				const WidgetComponent = props.componentMap[componentData.name];

				const widgetContainer = getWidgetContainer(id);

				if (!widgetContainer) {
					throw new Error(`Widget container not found for id: ${id}`);
				}

				return (
					<GridStackWidgetContext.Provider key={id} value={{ widget: { id } }}>
						{createPortal(
							<WidgetComponent {...componentData.props} />,
							widgetContainer
						)}
					</GridStackWidgetContext.Provider>
				);
			})}
		</>
	);
}
