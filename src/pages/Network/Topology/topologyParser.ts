import { LldpResponse, G6GraphData, G6Node, G6Edge } from '../types/topology';

// SVG icon as data URI for network devices
const ROUTER_ICON = 'data:image/svg+xml,%3Csvg width="256" height="256" viewBox="-102.4 -102.4 1228.80 1228.80" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M77 403.4v228.5c1.5 93.7 195.7 183.5 435 183.5s433.4-89.8 435-183.5V403.4H77z" fill="%231B9BDB"/%3E%3Cpath d="M947 402.7c0 99.4-194.8 194-435 194s-435-94.6-435-194 194.8-180 435-180 435 80.5 435 180z" fill="%233ED6FF"/%3E%3Cpath d="M474.1 311.4H503l0.1 63.2h29.5l-0.7-63.2h28.9l-43.7-75.1zM533 417.2h-29.9l0.1 73.9h-30.6l46.2 75.2 45.5-75.2h-30.6zM654.5 380.9l-1.4-30-72.1 45 76.4 45.1-1.4-30h126.2l-2.6-30.1zM381.1 380.9h-125l-2.3 30.1H380l-1.1 30 75.9-45.1-72.5-45z" fill="%23FFFFFF"/%3E%3C/svg%3E';

export function transformLldpToG6(lldpData: LldpResponse): G6GraphData {
  const nodes: G6Node[] = [];
  const edges: G6Edge[] = [];

  // Transform nodes
  Object.entries(lldpData.nodes).forEach(([ipAddress, nodeData]) => {
    const status = nodeData.device.status;
    
    // Determine node color based on status
    const nodeColor = status === 'Reachable' ? '#52c41a' : '#ff4d4f';
    
    nodes.push({
      id: ipAddress,
      label: ipAddress,
      type: 'image',
      img: ROUTER_ICON,
      size: [170, 170],
      style: {
        fill: nodeColor,
        stroke: nodeColor,
      },
      deviceInfo: nodeData,
    });
  });

  // Transform edges
  Object.entries(lldpData.edges).forEach(([_edgeId, edgeData]) => {
    edges.push({
      source: edgeData.source,
      target: edgeData.target,
      label: edgeData.label || '',
      type: 'line',
      style: {
        stroke: '#999',
        lineWidth: 2,
      },
    });
  });

  return { nodes, edges };
}

export function getNodeTooltipContent(nodeData: any): string {
  const deviceInfo = nodeData.deviceInfo;
  if (!deviceInfo) return `<strong>ID:</strong> ${nodeData.id}`;

  const systemInfo = deviceInfo['System Information'];
  const device = deviceInfo.device;

  return `
    <div style="max-width: 300px;">
      <h4 style="margin: 0 0 8px 0; border-bottom: 1px solid #eee; padding-bottom: 4px;">
        ${nodeData.id}
      </h4>
      <div style="font-size: 12px;">
        <p style="margin: 4px 0;"><strong>Product:</strong> ${systemInfo['Product Name']}</p>
        <p style="margin: 4px 0;"><strong>Vendor:</strong> ${systemInfo['Vendor']}</p>
        <p style="margin: 4px 0;"><strong>Platform:</strong> ${systemInfo['Platform Name']}</p>
        <p style="margin: 4px 0;"><strong>Serial Number:</strong> ${systemInfo['Serial Number']}</p>
        <p style="margin: 4px 0;"><strong>MAC:</strong> ${systemInfo['MAC']}</p>
        <p style="margin: 4px 0;"><strong>Status:</strong> 
          <span style="color: ${device.status === 'Reachable' ? '#52c41a' : '#ff4d4f'}">
            ${device.status}
          </span>
        </p>
      </div>
    </div>
  `;
}

