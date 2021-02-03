import ApiService from '@/services/common/api.service'

const teacher = {
  namespaced: true,
  state: () => ({
    errors: null,
    teachers: null,
    isLoading: false,
  }),
  getters: {
    // For get teachers
    getTeachers(state) {
      return state.teachers
    }
  },
  actions: {
    // For get teacher
    fetchTeachers(context, content) {
      return new Promise((resolve, reject) => {
        ApiService.init()
        context.commit('setLoading', true)
        ApiService.get(`/api/teacher`, {
          perPage: content.perPage,
          page: content.page,
          sortField: content.sortField,
          sortOrder: content.sortOrder,
          search: content.search,
          status: content.status,
        }).then(
          response => {
            if (response.status === 200) {
              context.commit('setTeachers', response.data)
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

    // For fetch teacher by nip
    fetchTeacher(context, nip) {
      return new Promise((resolve, reject) => {
        ApiService.init()
        ApiService.get(`/api/teacher/${nip}/show`, {}).then(
          response => {
            resolve(response)
          },
          error => {
            reject(error)
          }
        )
      })
    },

    // For create teacher
    createTeacher(context, form) {
      return new Promise((resolve, reject) => {
        context.commit('setLoading', true)
        ApiService.init()
        ApiService.post(`/api/teacher`, form, true).then(
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

    // For update teacher
    updateTeacher(context, form) {
      return new Promise((resolve, reject) => {
        context.commit('setLoading', true)
        ApiService.init()
        ApiService.put(`/api/teacher/${form.nip}/update`, form, true).then(
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

    // For delete teacher
    deleteTeacher(context, nip) {
      return new Promise((resolve, reject) => {
        context.commit('setLoading', true)
        ApiService.init()
        ApiService.delete(`/api/teacher/${nip}/delete`, {}, true).then(
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

    // For search teacher by name
    searchTeacherByName(context, content) {
      return new Promise((resolve, reject) => {
        ApiService.init()
        ApiService.get(`/api/teacher/search-teacher-by-name`, {
          search: content.search,
        }).then(
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

    // For set teachers
    setTeachers(state, data) {
      state.teachers = data
    },
  }
}

export default teacher