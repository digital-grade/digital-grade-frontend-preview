import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'

const ApiService = {
  init() {
    axios.defaults.baseURL = process.env.VUE_APP_API_URL
  },

  get(resource, params) {
    return axios.get(`${resource}`, {
      params:
        params !== undefined ? snakecaseKeys(params, { deep: true }) : params,
      transformResponse: [
        data => {
          return camelcaseKeys(JSON.parse(data), { deep: true })
        },
      ],
    })
  },

  getFile(resource, params) {
    return axios.get(`${resource}`, {
      params:
        params !== undefined ? snakecaseKeys(params, { deep: true }) : params,
      responseType: 'blob',
    })
  },

  post(resource, params, noSnakeCase, context, keycontext) {
    return axios.post(
      `${resource}`,
      !noSnakeCase ? snakecaseKeys(params, { deep: true }) : params,
      {
        onUploadProgress: uploadEvent => {
          let percentage = Math.round(
            (uploadEvent.loaded / uploadEvent.total) * 100
          )
          if (context != null && keycontext != null) {
            context.commit(keycontext, percentage)
          }
        },
        transformResponse: [
          data => {
            if (data) {
              return camelcaseKeys(JSON.parse(data), { deep: true })
            }
          },
        ],
      }
    )
  },

  update(resource, slug, params) {
    return axios.put(`${resource}/${slug}`, params)
  },

  put(resource, params, noSnakeCase) {
    return axios.put(
      `${resource}`,
      !noSnakeCase ? snakecaseKeys(params, { deep: true }) : params,
      {
        transformResponse: [
          data => {
            if (data) {
              return camelcaseKeys(JSON.parse(data), { deep: true })
            }
          },
        ],
      }
    )
  },

  delete(resource, params) {
    return axios.delete(resource, {
      params: params ? snakecaseKeys(params, { deep: true }) : null,
      transformResponse: [
        data => {
          if (data) {
            return camelcaseKeys(JSON.parse(data), { deep: true })
          }
        },
      ],
    })
  },
}

export default ApiService
