export const mockSessionAuth = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  status: "authenticated",
  data: {
    user: {
      name: "test",
      image: {
        src: "/img.jpg",
        height: 24,
        width: 24,
        blurDataURL: "data:image/png;base64,imagedata",
      },
    },
  },
};

export const mockSessionUnAuth = {
  ...mockSessionAuth,
  status: "unauthenticated",
};
