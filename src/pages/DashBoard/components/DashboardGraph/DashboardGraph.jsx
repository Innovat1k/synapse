import { ReactFlowProvider } from "@xyflow/react";
import { GraphContent } from "./GraphContent";

export const DashboardGraph = (props) => (
  <div
    className={`relative w-full overflow-hidden transition-all duration-500 ${
      props.isCompact ? "h-80 rounded-xl border border-slate-800/60" : "h-full"
    }`}
  >
    <ReactFlowProvider>
      <GraphContent {...props} />
    </ReactFlowProvider>
  </div>
);
