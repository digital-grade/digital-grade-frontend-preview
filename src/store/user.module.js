import ApiService from '@/services/common/api.service'

const user = {
  namespaced: true,
  state: () => ({
    user: null,
    latestAttendance: null,
  }),
  getters: {
    getUserInfo(state) {
      return state.user
    },
  },
  actions: {
    loadUserFromToken(context) {
      return new Promise((resolve, reject) => {
        ApiService.init()
        ApiService.get(`/api/token/user/detail`).then(
          response => {
            context.commit('setUser', response.data)

            resolve(response)
          },
          error => {
            reject(error)
          }
        )
      })
    },
  },
  mutations: {
    setUser(state, data) {
      state.user = data
    },
  },
}

export default user