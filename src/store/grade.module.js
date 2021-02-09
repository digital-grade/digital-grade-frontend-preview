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
    // For fetch grade by schedule
    fetchGradesBySchedule(context, classId) {
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

    // For save grade by schedule
    saveGradesBySchedule(context, form) {
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

    // For fetch grade by class
    fetchGradesByClass(context, content) {
      return new Promise((resolve, reject) => {
        ApiService.init()
        context.commit('setLoading', true)
        ApiService.get(`/api/grade/${content.classId}/get-grade-by-class`, content).then(
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

    // For prnt raport
    async printRaport(context, content) {
      var resultCode = null
      ApiService.init()
      await ApiService.getFile(`/api/grade/${content.classId}/print-raport`, content)
        .then(response => {
          if (response != undefined) {
            var fileURL = window.URL.createObjectURL(new Blob([response.data]))
            var fileLink = document.createElement('a')

            fileLink.href = fileURL
            fileLink.setAttribute('download', content.name + '.pdf')
            document.body.appendChild(fileLink)

            fileLink.click()
            resultCode = 200
          }
        })
        .catch(() => {
          resultCode = 400
        })

      return resultCode
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