# Topology Manager

A comprehensive network topology management application built with React, Vite, and Tailwind CSS v4. This application provides a complete solution for network discovery, device management, path analysis, and geotagging.

## Features

### 🏠 Dashboard
- Network overview with device statistics
- Real-time status monitoring
- Quick action buttons
- Recent events and activity feed

### 🔍 Network Discovery
- Multi-step discovery wizard
- Support for various seed device types (IP, range, subnet, cloud, virtual)
- Multi-hop expansion with configurable limits
- Credential management and priority ordering
- Auto-monitoring setup

### 🖥️ Device Management
- Comprehensive device list with filtering and sorting
- Detailed device information panels
- Interface management
- Monitor configuration
- Event and metrics tracking

### 🗺️ Network Visualization
- Interactive topology maps
- Geographic mapping with device overlays
- Geotagging manager for devices and sites
- Multiple map types (roadmap, satellite, hybrid, terrain)

### 🛣️ Path & Reachability Analysis
- Network path analysis between devices
- Reachability testing with continuous monitoring
- Path visualization with hop-by-hop details
- Failure point identification

### 🔗 LLDP/Link Ingestion
- Automatic link discovery using LLDP/CDP
- SNMP-based topology building
- Link confidence scoring
- Real-time link status monitoring

### ⚙️ Settings & Configuration
- Credential management (SNMP, SSH, WMI, Cloud APIs)
- Device role configuration
- Dependency management for alert suppression
- Schedule management for automated tasks

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **State Management**: React Hooks
- **Icons**: Unicode emojis for cross-platform compatibility

## Project Structure

```
src/
├── components/
│   ├── Analysis/           # Path and reachability analysis
│   ├── Dashboard/          # Main dashboard components
│   ├── Devices/            # Device management
│   ├── Discovery/          # Network discovery wizard
│   ├── Layout/             # Layout components (sidebar, header)
│   ├── Maps/               # Geographic mapping and geotagging
│   ├── Network/            # LLDP ingestion and link management
│   └── Settings/           # Configuration panels
├── data/
│   └── mockData.ts         # Comprehensive mock data
├── types/
│   └── index.ts            # TypeScript type definitions
└── App.tsx                 # Main application component
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd topology-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Network Discovery Flow

1. **Start Discovery**: Click the discovery button or navigate to Discover → New Scan
2. **Configure Scan**: 
   - Enter scan name and description
   - Add seed devices (IP addresses, ranges, subnets)
   - Configure expansion settings (max hops, device limits)
   - Select credentials for authentication
   - Set advanced options (timeout, retries, auto-monitoring)
3. **Review & Run**: Review configuration and start the scan
4. **Monitor Progress**: Watch real-time progress and results

### Device Management

1. **View Devices**: Navigate to My Network → Devices
2. **Filter & Search**: Use filters to find specific devices
3. **Device Details**: Click on any device to view detailed information
4. **Manage Interfaces**: View and configure device interfaces
5. **Monitor Status**: Track device health and performance

### Path Analysis

1. **Select Source & Target**: Choose devices for path analysis
2. **Configure Options**: Set analysis preferences (L2/L3, max hops)
3. **Run Analysis**: Execute path discovery
4. **Review Results**: View detailed path information and failure points

### Geotagging

1. **Open Geotagging Manager**: Navigate to Maps → Manage Locations
2. **Select Device/Site**: Choose item to geotag
3. **Enter Location**: Add address or coordinates
4. **Geocode**: Use geocoding to get precise coordinates
5. **Save**: Store location information

## Data Models

### Core Entities

- **Device**: Network devices with interfaces, credentials, and monitoring
- **Site**: Physical locations with geographic coordinates
- **Link**: Network connections between devices
- **Interface**: Device network interfaces with LLDP information
- **Credential**: Authentication credentials for various protocols
- **Monitor**: Health checks and performance monitoring
- **Event**: System events and alerts
- **Metric**: Performance and status metrics

### Discovery & Analysis

- **DiscoveryScan**: Network discovery configuration and results
- **PathQuery**: Network path analysis requests
- **ReachabilityQuery**: Reachability testing configuration
- **LLDPInfo**: Link Layer Discovery Protocol information

## Mock Data

The application includes comprehensive mock data for demonstration:

- 5 sample devices (Cisco, Dell, Fortinet)
- 3 geographic sites (San Francisco, NYC)
- Network links and interfaces
- Credentials for various protocols
- Discovery scans and analysis results
- Events and metrics

## Customization

### Adding New Device Types

1. Update the `Device` interface in `types/index.ts`
2. Add device icons in component files
3. Update mock data generation
4. Modify discovery logic if needed

### Adding New Credential Types

1. Extend the `Credential` type in `types/index.ts`
2. Update the credentials manager UI
3. Add validation logic
4. Update discovery integration

### Customizing UI Themes

The application uses Tailwind CSS v4 with a dark mode implementation. To customize:

1. Modify theme variables in `src/index.css`
2. Update component classes
3. Add custom CSS as needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Progress WhatsUp Gold and SolarWinds NPM
- Built with modern web technologies
- Designed for network administrators and IT professionals

## Support

For questions or issues, please create an issue in the repository or contact the development team.