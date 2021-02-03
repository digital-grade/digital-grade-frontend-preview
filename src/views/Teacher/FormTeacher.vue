<template>
  <div class="content">
    <b-field grouped position="is-left">
      <b-icon icon="users" custom-size="3x" class="content-icon"></b-icon>
      <h1 class="content-title">Teachers</h1>
    </b-field>

    <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSaveClicked)">
        <div class="columns is-multiline">
          <!-- For NIP -->
          <div class="column is-3 key">NIP <span class="required">*</span></div>
          <div class="column is-9">
            <ValidationProvider rules="required" v-slot="{ errors }">
              <b-input
                type="text"
                placeholder="NIP"
                v-model="data.nip"
                style="width: 90%"
                expanded
                :disabled="$route.name == 'Teacher.Edit'"
              ></b-input>

              <div class="notif notif-required has-text-danger">{{ errors[0] }}</div>
            </ValidationProvider>
          </div>
          <!-- End for NIP -->

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

          <!-- For phone number -->
          <div class="column is-3 key">
            Phone Number <span class="required">*</span>
          </div>
          <div class="column is-9">
            <ValidationProvider name="phoneNumber" rules="required" v-slot="{ errors }">
              <b-input
                type="text"
                placeholder="Phone Number"
                v-model="data.phoneNumber"
                style="width: 90%"
                expanded
              ></b-input>

              <div class="notif notif-required has-text-danger">{{ errors[0] }}</div>
            </ValidationProvider>
          </div>
          <!-- End for phone number -->

          <!-- For place of birth -->
          <div class="column is-3 key">
            Place Of Birth <span class="required">*</span>
          </div>
          <div class="column is-9">
            <ValidationProvider name="placeOfBirth" rules="required" v-slot="{ errors }">
              <b-input
                type="text"
                placeholder="Place Of Birth"
                v-model="data.placeOfBirth"
                style="width: 90%"
                expanded
              ></b-input>

              <div class="notif notif-required has-text-danger">{{ errors[0] }}</div>
            </ValidationProvider>
          </div>
          <!-- End for place of birth -->

          <!-- For date of birth -->
          <div class="column is-3 key">
            Date Of Birth <span class="required">*</span>
          </div>
          <div class="column is-9">
            <ValidationProvider name="dateOfBirth" rules="required" v-slot="{ errors }">
              <b-datepicker
                type="text"
                placeholder="Date Of Birth"
                v-model="data.dateOfBirth"
                style="width: 90%"
                expanded
              ></b-datepicker>

              <div class="notif notif-required has-text-danger">{{ errors[0] }}</div>
            </ValidationProvider>
          </div>
          <!-- End for date of birth -->

          <!-- For gender -->
          <div class="column is-3 key">
            Gender <span class="required">*</span>
          </div>
          <div class="column is-9">
            <ValidationProvider name="gender" rules="required" v-slot="{ errors }">
              <b-select
                type="text"
                placeholder="Gender"
                v-model="data.gender"
                style="width: 90%"
                expanded
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </b-select>

              <div class="notif notif-required has-text-danger">{{ errors[0] }}</div>
            </ValidationProvider>
          </div>
          <!-- End for gender -->

          <!-- For address -->
          <div class="column is-3 key">
            Address <span class="required">*</span>
          </div>
          <div class="column is-9">
            <ValidationProvider name="address" rules="required" v-slot="{ errors }">
              <b-input
                type="textarea"
                placeholder="Address"
                v-model="data.address"
                style="width: 90%"
                expanded
                rows="3"
              ></b-input>

              <div class="notif notif-required has-text-danger">{{ errors[0] }}</div>
            </ValidationProvider>
          </div>
          <!-- End for address -->

          <!-- For blood type -->
          <div class="column is-3 key">
            Blood Type <span class="required">*</span>
          </div>
          <div class="column is-9">
            <ValidationProvider name="bloodType" rules="required" v-slot="{ errors }">
              <b-input
                type="text"
                placeholder="Blood Type"
                v-model="data.bloodType"
                style="width: 90%"
                expanded
              ></b-input>

              <div class="notif notif-required has-text-danger">{{ errors[0] }}</div>
            </ValidationProvider>
          </div>
          <!-- End for blood type -->

          <!-- For email -->
          <div class="column is-3 key">
            Email <span class="required">*</span>
          </div>
          <div class="column is-9">
            <ValidationProvider name="email" rules="required|email" v-slot="{ errors }">
              <b-input
                type="text"
                placeholder="Email"
                v-model="data.email"
                style="width: 90%"
                expanded
              ></b-input>

              <div class="notif notif-required has-text-danger">{{ errors[0] }}</div>
            </ValidationProvider>
          </div>
          <!-- End for email -->

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
import { formatDate, showToast } from '@/services/util'

export default {
  name: "form-teacher",
  data() {
    return {
      data: {
        nip: null,
        name: null,
        email: null,
        phoneNumber: null,
        address: null,
        bloodType: null,
        placeOfBirth: null,
        dateOfBirth: null,
        gender: null,
        profilePictureUrl: null,
      },
    };
  },
  async created() {
    if (this.$route.name == 'Teacher.Edit') {
      const response = await this.fetchTeacher(this.$route.params.nip)

      response.data.dateOfBirth = new Date(response.data.dateOfBirth)

      this.data = response.data
    }
  },
  methods: {
    ...mapActions({
      fetchTeacher: 'teacher/fetchTeacher',
      createTeacher: 'teacher/createTeacher',
      updateTeacher: 'teacher/updateTeacher',
    }),

    async onSaveClicked() {
      let data = {
        nip: this.data.nip,
        name: this.data.name,
        email: this.data.email,
        phone_number: this.data.phoneNumber,
        address: this.data.address,
        blood_type: this.data.bloodType,
        place_of_birth: this.data.placeOfBirth,
        date_of_birth: this.data.dateOfBirth != null ? formatDate(this.data.dateOfBirth) : null,
        gender: this.data.gender,
        profile_picture_url: this.data.profilePictureUrl,
      }

      try {
        if (this.$route.name == "Teacher.Create") {
          await this.createTeacher(data)
        } else {
          await this.updateTeacher(data)
        }

        showToast('Create Teacher Success', 'is-success', 'is-bottom')

        this.$router.push("/teacher")
      } catch (err) {
        showToast(err.response.data.message, 'is-danger', 'is-bottom')
      }
    },
  },
};
</script>
