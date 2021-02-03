import ApiService from '@/services/common/api.service'

const course = {
  namespaced: true,
  state: () => ({
    errors: null,
    courses: null,
    isLoading: false,
  }),
  getters: {
    // For get courses
    getCourses(state) {
      return state.courses
    }
  },
  actions: {
    // For get courses
    fetchCourses(context, content) {
      return new Promise((resolve, reject) => {
        ApiService.init()
        context.commit('setLoading', true)
        ApiService.get(`/api/course`, {
          perPage: content.perPage,
          page: content.page,
          sortField: content.sortField,
          sortOrder: content.sortOrder,
          search: content.search,
          status: content.status,
        }).then(
          response => {
            if (response.status === 200) {
              context.commit('setCourses', response.data)
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

    // For fetch course by id
    fetchCourse(context, id) {
      return new Promise((resolve, reject) => {
        ApiService.init()
        ApiService.get(`/api/course/${id}/show`, {}).then(
          response => {
            resolve(response)
          },
          error => {
            reject(error)
          }
        )
      })
    },

    // For create course
    createCourse(context, form) {
      return new Promise((resolve, reject) => {
        context.commit('setLoading', true)
        ApiService.init()
        ApiService.post(`/api/course`, form, true).then(
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

    // For update course
    updateCourse(context, form) {
      return new Promise((resolve, reject) => {
        context.commit('setLoading', true)
        ApiService.init()
        ApiService.put(`/api/course/${form.id}/update`, form, true).then(
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

    // For delete course
    deleteCourse(context, id) {
      return new Promise((resolve, reject) => {
        context.commit('setLoading', true)
        ApiService.init()
        ApiService.delete(`/api/course/${id}/delete`, {}, true).then(
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

    // For search course by name
    searchCourseByName(context, content) {
      return new Promise((resolve, reject) => {
        ApiService.init()
        ApiService.get(`/api/course/search-course-by-name`, {
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

    // For set courses
    setCourses(state, data) {
      state.courses = data
    },
  }
}

export default course