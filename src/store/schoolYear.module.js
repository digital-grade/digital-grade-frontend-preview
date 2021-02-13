import ApiService from '@/services/common/api.service'

const schoolYear = {
  namespaced: true,
  state: () => ({
    errors: null,
    schoolYears: null,
    isLoading: false,
  }),
  getters: {
    // For get school years
    getSchoolYears(state) {
      return state.schoolYears
    }
  },
  actions: {
    // For get school years
    fetchSchoolYears(context, content) {
      return new Promise((resolve, reject) => {
        ApiService.init()
        context.commit('setLoading', true)
        ApiService.get(`/api/school-year`, {
          perPage: content.perPage,
          page: content.page,
          sortField: content.sortField,
          sortOrder: content.sortOrder,
          search: content.search,
          status: content.status,
        }).then(
          response => {
            if (response.status === 200) {
              context.commit('setSchoolYears', response.data)
              context.commit('setLoading', false)
              resolve(response)
            }
          },
          error => {
            context.commit('setLoading', false)
            reject(error)
          }
        )
      })
    },

    // For fetch school year by id
    fetchSchoolYear(context, id) {
      return new Promise((resolve, reject) => {
        ApiService.init()
        ApiService.get(`/api/school-year/${id}/show`, {}).then(
          response => {
            resolve(response)
          },
          error => {
            reject(error)
          }
        )
      })
    },

    // For create school year
    createSchoolYear(context, form) {
      return new Promise((resolve, reject) => {
        context.commit('setLoading', true)
        ApiService.init()
        ApiService.post(`/api/school-year`, form, true).then(
          response => {
            context.commit('setLoading', false)
            resolve(response)
          },
          error => {
            reject(error)
          }
        )
      })
    },

    // For get school year
    getSchoolYear() {
      return new Promise((resolve, reject) => {
        ApiService.init()
        ApiService.get(`/api/school-year/get-school-year`, {}).then(
          response => {
            if (response.status === 200) {
              resolve(response)
              return response
            }
          },
          error => {
            reject(error)
          }
        )
      })
    },
  },
  mutations: {
    // For set loading
    setLoading(state, data) {
      state.isLoading = data
    },

    // For set school years
    setSchoolYears(state, data) {
      state.schoolYears = data
    },
  }
}

export default schoolYear