import React, { useEffect, useRef, useState } from "react";
import G6 from "@antv/g6";
 import insertCss from "insert-css";
import chroma from "chroma-js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { RefreshCw, ZoomIn, ZoomOut, Maximize2, Download } from "lucide-react";
import type { LldpResponse } from "../../../types/topology";
import { transformLldpToG6, getNodeTooltipContent } from "./topologyParser";

(insertCss as any)(`
  .g6-component-tooltip {
    background-color: rgba(255, 255, 255, 0.95);
    padding: 10px 15px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 10px;
    border-radius: 6px;
    border: 1px solid #e8e8e8;
    max-width: 350px;
  }
`);

interface TopologyViewProps {
  data?: LldpResponse;
  onRefresh?: () => void;
}

const animateCfg = { duration: 200, easing: "easeCubic" };

export default function TopologyView({ data, onRefresh }: TopologyViewProps) {
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [graphReady, setGraphReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.scrollWidth || 1200;
    const height = container.scrollHeight || 800;

    if (!graphRef.current) {
      // Create toolbar
      const toolbar = new G6.ToolBar({
        position: { x: width - 150, y: 10 },
        getContent: () => `
          <ul class='g6-component-toolbar' style='display:flex; gap: 8px; list-style:none; padding:0; margin:0;'>
            <li code='zoomOut' style='cursor:pointer; padding:8px; background:#f0f0f0; border-radius:4px;'> 
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </li>
            <li code='zoomIn' style='cursor:pointer; padding:8px; background:#f0f0f0; border-radius:4px;'> 
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
              </svg> 
            </li>
            <li code='autoZoom' style='cursor:pointer; padding:8px; background:#f0f0f0; border-radius:4px;'>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
            </li>
          </ul>`,
        handleClick: (code: string, graph: any) => {
          switch (code) {
            case "zoomOut":
              graph.zoom(1.2, undefined, true, animateCfg);
              break;
            case "zoomIn":
              graph.zoom(0.8, undefined, true, animateCfg);
              break;
            case "autoZoom":
              graph.fitView(20, undefined, true, animateCfg);
              break;
          }
        },
      });

      graphRef.current = new G6.Graph({
        container: container,
        width,
        height,
        linkCenter: true,
        pixelRatio: 2,
        fitView: true,
        plugins: [toolbar],
        layout: {
          type: "force",
          nodeSpacing: 200,
          linkDistance: 300,
          animate: true,
          preventOverlap: true,
          nodeSize: 200,
          workerEnabled: true,
        },
        defaultNode: {
          type: "image",
          size: [170, 170],
          style: {
            fill: "#DEE9FF",
            stroke: "#5B8FF9",
          },
          labelCfg: {
            style: {
              fontSize: 14,
              fill: "#e8e8e8",
            },
            position: "bottom",
            offset: 10,
          },
        },
        modes: {
          default: [
            "drag-canvas",
            "zoom-canvas",
            "drag-node",
            "brush-select",
            "click-select",
          ],
        },
        defaultEdge: {
          type: "line",
          labelCfg: {
            autoRotate: true,
            style: {
              fontSize: 12,
              fill: "#999",
              background: {
                fill: "#ffffff",
                stroke: "#FDFEFF",
                padding: [2, 2, 2, 2],
                radius: 4,
              },
              fillOpacity: 0,
              strokeOpacity: 0,
            },
          },
          style: {
            stroke: "#999",
            lineWidth: 2,
            opacity: 0.6,
            endArrow: {
              path: G6.Arrow.triangle(10, 12, 12),
              d: 12,
              fill: "#999",
            },
          },
        },
        nodeStateStyles: {
          highlight: {
            opacity: 1,
          },
          dark: {
            opacity: 0.2,
          },
        },
        edgeStateStyles: {
          highlight: {
            stroke: "#1890ff",
            opacity: 1,
            lineWidth: 3,
          },
          dark: {
            opacity: 0.1,
          },
        },
      });

      // Render graph data
      if (data) {
        const g6Data = transformLldpToG6(data);

        // Add random colors to edges
        const edgeColors = g6Data.edges.map(() => chroma.random().hex());
        const coloredEdges = g6Data.edges.map((edge, index) => ({
          ...edge,
          style: {
            ...edge.style,
            stroke: edgeColors[index],
          },
        }));

        graphRef.current.data({
          nodes: g6Data.nodes,
          edges: coloredEdges,
        });
        graphRef.current.render();
        setGraphReady(true);
      }

      // Clear all states
      function clearAllStats() {
        graphRef.current.setAutoPaint(false);
        graphRef.current.getNodes().forEach((node: any) => {
          graphRef.current.clearItemStates(node);
        });
        graphRef.current.getEdges().forEach((edge: any) => {
          graphRef.current.clearItemStates(edge);
        });
        graphRef.current.getEdges().forEach((edge: any) => {
          const labelElement = edge
            .getContainer()
            .findAll(
              (element: any) => element.get("className") === "edge-label"
            );
          if (labelElement) {
            labelElement.forEach((label: any) => {
              label.attr("fillOpacity", 0);
              label.attr("stroke-opacity", 0.1);
            });
          }
        });
        graphRef.current.paint();
        graphRef.current.setAutoPaint(true);
      }

      // Node hover events
      graphRef.current.on("node:mouseenter", (e: any) => {
        const item = e.item;
        const connectedNodes = new Set();
        const connectedEdges = new Set();

        graphRef.current.getEdges().forEach((edge: any) => {
          if (edge.getSource() === item || edge.getTarget() === item) {
            connectedEdges.add(edge);
            if (edge.getSource() === item) {
              connectedNodes.add(edge.getTarget());
            } else {
              connectedNodes.add(edge.getSource());
            }
          }
        });

        graphRef.current.getNodes().forEach((node: any) => {
          if (node === item || connectedNodes.has(node)) {
            graphRef.current.setItemState(node, "dark", false);
            graphRef.current.setItemState(node, "highlight", true);
            const labelElements = node
              .getContainer()
              .findAll(
                (element: any) => element.get("className") === "node-label"
              );
            if (labelElements) {
              labelElements.forEach((label: any) => {
                label.attr("fillOpacity", 1);
                label.attr("stroke-opacity", 1);
              });
            }
          } else {
            graphRef.current.setItemState(node, "dark", true);
            const labelElements = node
              .getContainer()
              .findAll(
                (element: any) => element.get("className") === "node-label"
              );
            if (labelElements) {
              labelElements.forEach((label: any) => {
                label.attr("fillOpacity", 0);
                label.attr("stroke-opacity", 0);
              });
            }
          }
        });

        graphRef.current.getEdges().forEach((edge: any) => {
          if (connectedEdges.has(edge)) {
            graphRef.current.setItemState(edge, "dark", false);
            graphRef.current.setItemState(edge, "highlight", true);
            edge.toFront();
            const labelElement = edge
              .getContainer()
              .findAll(
                (element: any) => element.get("className") === "edge-label"
              );
            if (labelElement) {
              labelElement.forEach((label: any) => {
                label.attr("fillOpacity", 1);
                label.attr("stroke-opacity", 1);
              });
            }
          } else {
            graphRef.current.setItemState(edge, "dark", true);
            const labelElement = edge
              .getContainer()
              .findAll(
                (element: any) => element.get("className") === "edge-label"
              );
            if (labelElement) {
              labelElement.forEach((label: any) => {
                label.attr("fillOpacity", 0);
                label.attr("stroke-opacity", 0);
              });
            }
          }
        });

        graphRef.current.paint();
      });

      graphRef.current.on("node:mouseleave", clearAllStats);
      graphRef.current.on("canvas:click", clearAllStats);

      // Create tooltip elements
      const nodeTooltipElement = document.createElement("div");
      nodeTooltipElement.className = "custom-node-tooltip";
      nodeTooltipElement.style.position = "absolute";
      nodeTooltipElement.style.padding = "10px 15px";
      nodeTooltipElement.style.boxShadow = "rgba(0, 0, 0, 0.2) 0px 2px 10px";
      nodeTooltipElement.style.backgroundColor = "rgba(31, 41, 55, 0.95)";
      nodeTooltipElement.style.color = "#e8e8e8";
      nodeTooltipElement.style.border = "1px solid #4b5563";
      nodeTooltipElement.style.borderRadius = "8px";
      nodeTooltipElement.style.zIndex = "9999";
      nodeTooltipElement.style.display = "none";
      document.body.appendChild(nodeTooltipElement);

      const edgeTooltipElement = document.createElement("div");
      edgeTooltipElement.className = "custom-edge-tooltip";
      edgeTooltipElement.style.position = "absolute";
      edgeTooltipElement.style.padding = "8px 12px";
      edgeTooltipElement.style.boxShadow = "rgba(0, 0, 0, 0.2) 0px 2px 10px";
      edgeTooltipElement.style.backgroundColor = "rgba(31, 41, 55, 0.95)";
      edgeTooltipElement.style.color = "#e8e8e8";
      edgeTooltipElement.style.border = "1px solid #4b5563";
      edgeTooltipElement.style.borderRadius = "8px";
      edgeTooltipElement.style.zIndex = "9999";
      edgeTooltipElement.style.display = "none";
      document.body.appendChild(edgeTooltipElement);

      graphRef.current.on("node:mouseenter", (ev: any) => {
        const node = ev.item;
        if (node && node.getModel()) {
          const nodeModel = node.getModel();
          nodeTooltipElement.innerHTML = getNodeTooltipContent(nodeModel);
          nodeTooltipElement.style.left = `${ev.clientX + 20}px`;
          nodeTooltipElement.style.top = `${ev.clientY + 20}px`;
          nodeTooltipElement.style.display = "block";
        }
      });

      graphRef.current.on("node:mouseleave", () => {
        nodeTooltipElement.style.display = "none";
      });

      graphRef.current.on("edge:mouseenter", (ev: any) => {
        const edge = ev.item;
        if (edge && edge.getModel()) {
          const sourceNodeID = edge.getSource().getModel().id;
          const targetNodeID = edge.getTarget().getModel().id;
          const edgeLabel = edge.getModel().label || "";
          const edgeContent = `
            <div style="font-size: 12px;">
              <strong>From:</strong> ${sourceNodeID}<br/>
              <strong>To:</strong> ${targetNodeID}${
            edgeLabel ? `<br/><strong>Interface:</strong> ${edgeLabel}` : ""
          }
            </div>
          `;
          edgeTooltipElement.innerHTML = edgeContent;
          edgeTooltipElement.style.left = `${ev.clientX + 20}px`;
          edgeTooltipElement.style.top = `${ev.clientY + 20}px`;
          edgeTooltipElement.style.display = "block";
        }
      });

      graphRef.current.on("edge:mouseleave", () => {
        edgeTooltipElement.style.display = "none";
      });
    }

    if (typeof window !== "undefined") {
      window.onresize = () => {
        if (!graphRef.current || graphRef.current.get("destroyed")) return;
        if (!container || !container.scrollWidth || !container.scrollHeight)
          return;
        graphRef.current.changeSize(
          container.scrollWidth,
          container.scrollHeight
        );
      };
    }

    return () => {
      graphRef.current?.destroy();
      graphRef.current = null;
    };
  }, [data]);

  const handleZoomIn = () => {
    if (graphRef.current) {
      graphRef.current.zoom(1.2, undefined, true, animateCfg);
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current) {
      graphRef.current.zoom(0.8, undefined, true, animateCfg);
    }
  };

  const handleFitView = () => {
    if (graphRef.current) {
      graphRef.current.fitView(20, undefined, true, animateCfg);
    }
  };

  const handleDownloadPDF = () => {
    if (graphRef.current) {
      const graphContainer = graphRef.current.get("container");
      html2canvas(graphContainer).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "pt",
          format: [canvas.width, canvas.height],
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("topology.pdf");
      });
    }
  };

  return (
    <div className="relative w-full h-screen bg-gray-900">
      <div ref={containerRef} className="w-full h-full" />

      {/* Bottom Center Toolbar */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center gap-2 bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-3 shadow-lg border border-gray-700">
          <button
            onClick={onRefresh}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            title="Refresh Topology"
          >
            <RefreshCw className="w-5 h-5 text-gray-300" />
          </button>
          <div className="w-px h-6 bg-gray-700" />
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5 text-gray-300" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5 text-gray-300" />
          </button>
          <button
            onClick={handleFitView}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            title="Fit to View"
          >
            <Maximize2 className="w-5 h-5 text-gray-300" />
          </button>
          <div className="w-px h-6 bg-gray-700" />
          <button
            onClick={handleDownloadPDF}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            title="Download PDF"
          >
            <Download className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
