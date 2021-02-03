<template>
  <div class="content">
    <b-field grouped position="is-left">
      <b-icon icon="graduation-cap" custom-size="3x" class="content-icon"></b-icon>
      <h1 class="content-title">Class</h1>
    </b-field>

    <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSaveClicked)">
        <div class="columns is-multiline">
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

<script>import { mapActions } from 'vuex'
import { showToast } from '@/services/util'

export default {
  name: "form-class",
  data() {
    return {
      data: {
        id: null,
        name: null,
      },
    };
  },
  async created() {
    if (this.$route.name == 'Class.Edit') {
      const response = await this.fetchClass(this.$route.params.classId)

      this.data = response.data
    }
  },
  methods: {
    ...mapActions({
      fetchClass: 'classes/fetchClass',
      createClass: 'classes/createClass',
      updateClass: 'classes/updateClass',
    }),

    async onSaveClicked() {
      let data = {
        id: this.data.id,
        name: this.data.name,
      }

      try {
        if (this.$route.name == "Class.Create") {
          await this.createClass(data)
        } else {
          await this.updateClass(data)
        }

        showToast('Create Class Success', 'is-success', 'is-bottom')

        this.$router.push("/class")
      } catch (err) {
        showToast(err.response.data.message, 'is-danger', 'is-bottom')
      }
    },
  },
};
</script>
