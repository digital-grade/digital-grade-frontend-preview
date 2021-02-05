import ApiService from '@/services/common/api.service'

const grade = {
  namespaced: true,
  state: () => ({
    errors: null,
    grade: null,
    isLoading: false,
  }),
  getters: {
    // For get grades
    getGrades(state) {
      return state.Class
    }
  },
  actions: {
    // For fetch grade by class
    fetchGradesByClass(context, classId) {
      return new Promise((resolve, reject) => {
        ApiService.init()
        context.commit('setLoading', true)
        ApiService.get(`/api/grade/${classId}/get-data`, {}).then(
          response => {
            if (response.status === 200) {
              context.commit('setGrade', response.data)
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

    // For save grade by class
    saveGradesByClass(context, form) {
      return new Promise((resolve, reject) => {
        context.commit('setLoading', true)
        ApiService.init()
        ApiService.post(`/api/grade/save-data`, form, true).then(
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
  },
  mutations: {
    // For set loading
    setLoading(state, data) {
      state.isLoading = data
    },

    // For set grade
    setGrade(state, data) {
      state.grade = data
    },
  }
}

export default grade