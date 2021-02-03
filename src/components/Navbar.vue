<template>
  <div>
    <b-navbar
      :fixed-top="true"
      :shadow="true"
      type="is-navbar"
    >
      <template slot="brand">
        <b-navbar-item>
          <div style="cursor: pointer" v-on:click="$emit('toggle-sidebar')">
            <b-icon icon="bars" size="is-medium" type="is-white"></b-icon>
          </div>
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="router-link" :to="{ path: '/' }" style="padding: 0">
          <img src="@/assets/images/logo-white.png" alt="Digital Grade" />
        </b-navbar-item>
      </template>
      <template slot="end">
        <div class="level">
          <div class="level-left">
            <p class="navbar-detail">
              <span class="navbar-detail__name">Admin</span>
              <br />
              <span class="navbar-detail__class">
                Admin
              </span>
            </p>
          </div>
          <div class="level-right">
            <div
              class="navbar-profile"
            >
              <div class="navbar-profile__image">
                <!-- <template v-if="user != null"> -->
                  <!-- <template v-if="user.profilePictureUrl == null"> -->
                    <b-image
                      :src="require('@/assets/images/photo-profile-empty.png')"
                      alt="Profile"
                      ratio="1by1"
                      :responsive="true"
                    ></b-image>
                  <!-- </template> -->
                  <!-- <template v-else>
                    <b-image
                      :src="getUrlPhoto(user.profilePictureUrl)"
                      alt="Profile"
                      ratio="1by1"
                      :responsive="true"
                    ></b-image>
                  </template> -->
                <!-- </template> -->
              </div>
            </div>
          </div>
        </div>
      </template>
    </b-navbar>
  </div>
</template>

<script>
// import { mapGetters } from "vuex";

// export default {
//   computed: {
//     ...mapGetters({
//       user: "user/getUserInfo",
//     }),
//   },
//   methods: {
//     getUrlPhoto(photo) {
//       return process.env.VUE_APP_API_URL + photo
//     }
//   },
// };
</script>