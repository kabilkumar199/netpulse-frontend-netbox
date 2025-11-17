# Redux Toolkit & Axios Setup

This project uses Redux Toolkit for state management and Axios for API calls with interceptors.

## Project Structure

```
src/
├── store/
│   ├── store.ts              # Redux store configuration
│   ├── apiSlice.ts           # RTK Query API slice
│   ├── hooks.ts              # Typed Redux hooks
│   ├── slices/
│   │   ├── devicesSlice.ts   # Devices state management
│   │   ├── discoverySlice.ts # Discovery scans state
│   │   ├── uiSlice.ts        # UI state (sidebar, theme, etc.)
│   │   └── authSlice.ts      # Authentication state
│   └── api/
│       └── devicesApi.ts     # Example API endpoints
├── services/
│   └── api.ts                # Axios instance with interceptors
```

## Usage

### Using Redux State in Components

```tsx
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setDevices, setSelectedDevice } from '../store/slices/devicesSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const devices = useAppSelector((state) => state.devices.devices);
  const selectedDevice = useAppSelector((state) => state.devices.selectedDevice);

  const handleSelectDevice = (device: Device) => {
    dispatch(setSelectedDevice(device));
  };

  return <div>...</div>;
}
```

### Using RTK Query API Endpoints

```tsx
import { useGetDevicesQuery, useCreateDeviceMutation } from '../store/api/devicesApi';

function DevicesList() {
  const { data: devices, isLoading, error } = useGetDevicesQuery({});
  const [createDevice, { isLoading: isCreating }] = useCreateDeviceMutation();

  const handleCreate = async () => {
    try {
      await createDevice({ hostname: 'device1', vendor: 'Cisco' }).unwrap();
      // Success - cache will be automatically invalidated
    } catch (err) {
      // Handle error
    }
  };

  return <div>...</div>;
}
```

### Using Axios Directly

```tsx
import axiosInstance from '../services/api';

async function fetchCustomData() {
  try {
    const response = await axiosInstance.get('/custom-endpoint');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
  }
}
```

## Axios Interceptors

The Axios instance includes:
- **Request Interceptor**: Automatically adds auth token from localStorage
- **Response Interceptor**: Handles token refresh on 401 errors, logs request duration

## Environment Variables

Set your API base URL in `.env`:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

## Redux Store Structure

- `devices`: Device management state
- `discovery`: Discovery scans state
- `ui`: UI state (sidebar, theme, notifications)
- `auth`: Authentication state
- `api`: RTK Query cache (automatically managed)
