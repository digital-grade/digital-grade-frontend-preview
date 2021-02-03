<template>
  <div class="content">
    <b-field grouped position="is-left">
      <b-icon icon="book" custom-size="3x" class="content-icon"></b-icon>
      <h1 class="content-title">Courses</h1>
    </b-field>

    <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSaveClicked)">
        <div class="columns is-multiline">
          <!-- For code -->
          <div class="column is-3 key">
            Code <span class="required">*</span>
          </div>
          <div class="column is-9">
            <ValidationProvider name="code" rules="required" v-slot="{ errors }">
              <b-input
                type="text"
                placeholder="Code"
                v-model="data.code"
                style="width: 90%"
                expanded
              ></b-input>

              <div class="notif notif-required has-text-danger">{{ errors[0] }}</div>
            </ValidationProvider>
          </div>
          <!-- End for name -->

          <!-- For name -->
          <div class="column is-3 key">
            Name <span class="required">*</span>
          </div>
          <div class="column is-9">
            <ValidationProvider name="name" rules="required" v-slot="{ errors }">
              <b-input
                type="text"
                placeholder="Name"
                v-model="data.name"
                style="width: 90%"
                expanded
              ></b-input>

              <div class="notif notif-required has-text-danger">{{ errors[0] }}</div>
            </ValidationProvider>
          </div>
          <!-- End for name -->

          <div class="column" style="text-align: right; padding-right: 100px">
            <b-button
              type="is-primary"
              native-type="submit"
              icon-left="save"
            >
              Save
            </b-button>
          </div>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { showToast } from '@/services/util'

export default {
  name: "form-course",
  data() {
    return {
      data: {
        id: null,
        name: null,
        code: null,
      },
    };
  },
  async created() {
    if (this.$route.name == 'Course.Edit') {
      const response = await this.fetchCourse(this.$route.params.courseId)

      this.data = response.data
    }
  },
  methods: {
    ...mapActions({
      fetchCourse: 'course/fetchCourse',
      createCourse: 'course/createCourse',
      updateCourse: 'course/updateCourse',
    }),

    async onSaveClicked() {
      let data = {
        id: this.data.id,
        name: this.data.name,
        code: this.data.code,
      }

      try {
        if (this.$route.name == "Course.Create") {
          await this.createCourse(data)
        } else {
          await this.updateCourse(data)
        }

        showToast('Create Course Success', 'is-success', 'is-bottom')

        this.$router.push("/course")
      } catch (err) {
        showToast(err.response.data.message, 'is-danger', 'is-bottom')
      }
    },
  },
};
</script>
