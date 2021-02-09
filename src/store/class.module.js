import ApiService from '@/services/common/api.service'

const classes = {
  namespaced: true,
  state: () => ({
    errors: null,
    class: null,
    isLoading: false,
  }),
  getters: {
    // For get classes
    getClasses(state) {
      return state.class
    }
  },
  actions: {
    // For fetch classes
    fetchClasses(context, content) {
      return new Promise((resolve, reject) => {
        ApiService.init()
        context.commit('setLoading', true)
        ApiService.get(`/api/class`, {
          perPage: content.perPage,
          page: content.page,
          sortField: content.sortField,
          sortOrder: content.sortOrder,
          search: content.search,
          status: content.status,
        }).then(
          response => {
            if (response.status === 200) {
              context.commit('setClass', response.data)
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

    // For fetch classes by student
    fetchClassesByStudent(context, content) {
      return new Promise((resolve, reject) => {
        ApiService.init()
        context.commit('setLoading', true)
        ApiService.get(`/api/class/${content.nis}/get-class-by-nis`, {
          perPage: content.perPage,
          page: content.page,
          sortField: content.sortField,
          sortOrder: content.sortOrder,
          search: content.search,
          status: content.status,
        }).then(
          response => {
            if (response.status === 200) {
              context.commit('setClass', response.data)
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

    // For fetch class by id
    fetchClass(context, id) {
      return new Promise((resolve, reject) => {
        ApiService.init()
        ApiService.get(`/api/class/${id}/show`, {}).then(
          response => {
            resolve(response)
          },
          error => {
            reject(error)
          }
        )
      })
    },

    // For create class
    createClass(context, form) {
      return new Promise((resolve, reject) => {
        context.commit('setLoading', true)
        ApiService.init()
        ApiService.post(`/api/class`, form, true).then(
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

    // For update class
    updateClass(context, form) {
      return new Promise((resolve, reject) => {
        context.commit('setLoading', true)
        ApiService.init()
        ApiService.put(`/api/class/${form.id}/update`, form, true).then(
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

    // For delete class
    deleteClass(context, id) {
      return new Promise((resolve, reject) => {
        context.commit('setLoading', true)
        ApiService.init()
        ApiService.delete(`/api/class/${id}/delete`, {}, true).then(
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

    // For search class by name
    searchClassByName(context, content) {
      return new Promise((resolve, reject) => {
        ApiService.init()
        ApiService.get(`/api/class/search-class-by-name`, {
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

    // For set Class
    setClass(state, data) {
      state.class = data
    },
  }
}

export default classes