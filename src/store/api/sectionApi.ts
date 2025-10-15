import { baseApi } from './baseApi'

export interface Section {
  _id: string
  name: string
  courseClass: {
    _id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateSectionRequest {
  name: string
  courseClass: string
}

export interface UpdateSectionRequest {
  name?: string
  courseClass?: string
}

export const sectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSections: builder.query<Section[], void>({
      query: () => '/sections',
      providesTags: ['Section'],
    }),
    getSectionById: builder.query<Section, string>({
      query: (id) => `/sections/${id}`,
      providesTags: (result, error, id) => [{ type: 'Section', id }],
    }),
    createSection: builder.mutation<Section, CreateSectionRequest>({
      query: (data) => ({
        url: '/sections',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Section'],
    }),
    updateSection: builder.mutation<Section, { id: string; data: UpdateSectionRequest }>({
      query: ({ id, data }) => ({
        url: `/sections/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Section', id }, 'Section'],
    }),
    deleteSection: builder.mutation<void, string>({
      query: (id) => ({
        url: `/sections/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Section'],
    }),
  }),
})

export const {
  useGetSectionsQuery,
  useGetSectionByIdQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} = sectionApi
