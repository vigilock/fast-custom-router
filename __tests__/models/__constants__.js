export const routesTeapot = {
  teapot: {
    path: '/teapot',
    methods: {
      get: {
        controller: 'getTeapot',
        response_code: 200,
      },
    },
  },
}
