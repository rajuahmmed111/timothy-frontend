import { authApi } from "../services/authApi";

// {{baseUrl}}/users/update
// Adds profile update mutation and exports its hook.
export const profileApiExtended = authApi.injectEndpoints({
  endpoints: (builder) => ({
    updateMyProfile: builder.mutation({
      query: (body) => ({
        url: "/users/update",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
    uploadProfileImage: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("profileImage", file);
        return {
          url: "/users/profile-img-update",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Profile"],
    }),
  }),
  overrideExisting: false,
});

export const { useUpdateMyProfileMutation, useUploadProfileImageMutation } = profileApiExtended;