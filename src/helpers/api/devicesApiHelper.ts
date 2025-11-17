import { apiSlice } from  '../../store/apiSlice';
import type { Device, Site, DiscoveryScan } from '../../types';

// Devices API endpoints
export const devicesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDevices: builder.query<Device[], { filters?: any; page?: number; limit?: number }>({
      query: ({ filters, page = 1, limit = 50 }) => ({
        url: '/devices',
        params: { ...filters, page, limit },
      }),
      providesTags: ['Device'],
    }),
    getDeviceById: builder.query<Device, string>({
      query: (id) => `/devices/${id}`,
      providesTags: (result, error, id) => [{ type: 'Device', id }],
    }),
    createDevice: builder.mutation<Device, Partial<Device>>({
      query: (device) => ({
        url: '/devices',
        method: 'POST',
        data: device,
      }),
      invalidatesTags: ['Device'],
    }),
    updateDevice: builder.mutation<Device, { id: string; data: Partial<Device> }>({
      query: ({ id, data }) => ({
        url: `/devices/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Device', id }],
    }),
    deleteDevice: builder.mutation<void, string>({
      query: (id) => ({
        url: `/devices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Device'],
    }),
  }),
});

// Discovery API endpoints
export const discoveryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getScans: builder.query<DiscoveryScan[], void>({
      query: () => '/discovery/scans',
      providesTags: ['DiscoveryScan'],
    }),
    getScanById: builder.query<DiscoveryScan, string>({
      query: (id) => `/discovery/scans/${id}`,
      providesTags: (result, error, id) => [{ type: 'DiscoveryScan', id }],
    }),
    createScan: builder.mutation<DiscoveryScan, Partial<DiscoveryScan>>({
      query: (scan) => ({
        url: '/discovery/scans',
        method: 'POST',
        data: scan,
      }),
      invalidatesTags: ['DiscoveryScan'],
    }),
    updateScan: builder.mutation<DiscoveryScan, { id: string; data: Partial<DiscoveryScan> }>({
      query: ({ id, data }) => ({
        url: `/discovery/scans/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'DiscoveryScan', id }],
    }),
  }),
});

// Sites API endpoints
export const sitesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSites: builder.query<Site[], void>({
      query: () => '/sites',
      providesTags: ['Site'],
    }),
    getSiteById: builder.query<Site, string>({
      query: (id) => `/sites/${id}`,
      providesTags: (result, error, id) => [{ type: 'Site', id }],
    }),
    createSite: builder.mutation<Site, Partial<Site>>({
      query: (site) => ({
        url: '/sites',
        method: 'POST',
        data: site,
      }),
      invalidatesTags: ['Site'],
    }),
    updateSite: builder.mutation<Site, { id: string; data: Partial<Site> }>({
      query: ({ id, data }) => ({
        url: `/sites/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Site', id }],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetDevicesQuery,
  useGetDeviceByIdQuery,
  useCreateDeviceMutation,
  useUpdateDeviceMutation,
  useDeleteDeviceMutation,
} = devicesApi;

export const {
  useGetScansQuery,
  useGetScanByIdQuery,
  useCreateScanMutation,
  useUpdateScanMutation,
} = discoveryApi;

export const {
  useGetSitesQuery,
  useGetSiteByIdQuery,
  useCreateSiteMutation,
  useUpdateSiteMutation,
} = sitesApi;
