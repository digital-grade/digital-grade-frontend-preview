<template>
  <div class="content">
    <b-field grouped position="is-left">
      <b-icon
        icon="calendar-alt"
        custom-size="3x"
        class="content-icon"
      ></b-icon>
      <h1 class="content-title">Schedules</h1>
    </b-field>

    <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSaveClicked)">
        <div class="columns is-multiline">
          <!-- For teacher -->
          <div class="column is-3 key">
            Teacher <span class="required">*</span>
          </div>
          <div class="column is-9">
            <ValidationProvider
              name="teacher"
              rules="required"
              v-slot="{ errors }"
            >
              <b-taginput
                :data="teacherList"
                :loading="isFetchingTeacher"
                maxtags="1"
                autocomplete
                field="name"
                placeholder="Type and select teacher..."
                v-model="data.teacher"
                style="width: 90%"
                expanded
                @typing="filterTeacherByName"
              ></b-taginput>

              <div class="notif notif-required has-text-danger">
                {{ errors[0] }}
              </div>
            </ValidationProvider>
          </div>
          <!-- End for class -->

          <!-- For class -->
          <div class="column is-3 key">
            Class <span class="required">*</span>
          </div>
          <div class="column is-9">
            <ValidationProvider
              name="class"
              rules="required"
              v-slot="{ errors }"
            >
              <b-taginput
                :data="classList"
                :loading="isFetchingClass"
                maxtags="1"
                autocomplete
                field="name"
                placeholder="Type and select class..."
                v-model="data.class"
                style="width: 90%"
                expanded
                @typing="filterClassByName"
              ></b-taginput>

              <div class="notif notif-required has-text-danger">
                {{ errors[0] }}
              </div>
            </ValidationProvider>
          </div>
          <!-- End for class -->

          <!-- For course -->
          <div class="column is-3 key">
            Course <span class="required">*</span>
          </div>
          <div class="column is-9">
            <ValidationProvider
              name="course"
              rules="required"
              v-slot="{ errors }"
            >
              <b-taginput
                :data="courseList"
                :loading="isFetchingCourse"
                maxtags="1"
                autocomplete
                field="name"
                placeholder="Type and select course..."
                v-model="data.course"
                style="width: 90%"
                expanded
                @typing="filterCourseByName"
              ></b-taginput>

              <div class="notif notif-required has-text-danger">
                {{ errors[0] }}
              </div>
            </ValidationProvider>
          </div>
          <!-- End for class -->

          <!-- For school year -->
          <div class="column is-3 key">
            School Year <span class="required">*</span>
          </div>
          <div class="column is-9">
            <ValidationProvider
              name="schoolYear"
              rules="required"
              v-slot="{ errors }"
            >
              <b-select
                placeholder="School Year"
                v-model="data.schoolYear"
                style="width: 90%"
                expanded
              >
                <option
                  v-for="(schoolYear, index) in schoolYearList"
                  :key="index"
                  :value="schoolYear.id"
                >
                  {{ schoolYear.startYear }}/{{ schoolYear.endYear }} semester {{ schoolYear.semester }}
                </option>
              </b-select>

              <div class="notif notif-required has-text-danger">
                {{ errors[0] }}
              </div>
            </ValidationProvider>
          </div>
          <!-- End for day -->

          <!-- For day -->
          <div class="column is-3 key">Day <span class="required">*</span></div>
          <div class="column is-9">
            <ValidationProvider name="day" rules="required" v-slot="{ errors }">
              <b-select
                placeholder="Day"
                v-model="data.day"
                style="width: 90%"
                expanded
              >
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
                <!-- <option value="sunday">Sunday</option> -->
              </b-select>

              <div class="notif notif-required has-text-danger">
                {{ errors[0] }}
              </div>
            </ValidationProvider>
          </div>
          <!-- End for day -->

          <!-- For start time -->
          <div class="column is-3 key">
            Start Time <span class="required">*</span>
          </div>
          <div class="column is-9">
            <ValidationProvider
              name="startTime"
              rules="required"
              v-slot="{ errors }"
            >
              <b-timepicker
                v-model="data.startTime"
                placeholder="Select start time"
                icon="clock"
              ></b-timepicker>

              <div class="notif notif-required has-text-danger">
                {{ errors[0] }}
              </div>
            </ValidationProvider>
          </div>
          <!-- End for start time -->

          <!-- For end time -->
          <div class="column is-3 key">
            End Time <span class="required">*</span>
          </div>
          <div class="column is-9">
            <ValidationProvider
              name="endTime"
              rules="required"
              v-slot="{ errors }"
            >
              <b-timepicker
                v-model="data.endTime"
                placeholder="Select end time"
                icon="clock"
              ></b-timepicker>

              <div class="notif notif-required has-text-danger">
                {{ errors[0] }}
              </div>
            </ValidationProvider>
          </div>
          <!-- End for end time -->

          <div class="column" style="text-align: right; padding-right: 100px">
            <b-button type="is-primary" native-type="submit" icon-left="save">
              Save
            </b-button>
          </div>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { showToast } from "@/services/util";
// import debounce from 'lodash/debounce';

export default {
  name: "form-student",
  data() {
    return {
      data: {
        id: null,
        teacher: [],
        class: [],
        course: [],
        schoolYear: null,
        day: null,
        startTime: null,
        endTime: null,
      },
      classList: [],
      isFetchingClass: false,
      teacherList: [],
      isFetchingTeacher: false,
      courseList: [],
      isFetchingCourse: false,
      schoolYearList: [],
    };
  },
  async created() {
    this.getSchoolYear();

    if (this.$route.name == "Schedule.Edit") {
      const response = await this.fetchSchedule(this.$route.params.scheduleId);

      let startTime =
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate() +
        " " +
        response.data.startTime;
      let endTime =
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate() +
        " " +
        response.data.endTime;

      response.data.startTime = new Date(startTime);
      response.data.endTime = new Date(endTime);

      response.data.class = [response.data.class];
      response.data.teacher = [response.data.teacher];
      response.data.course = [response.data.course];
      response.data.schoolYear = response.data.schoolYear.id;

      this.data = response.data;
    }
  },
  methods: {
    ...mapActions({
      fetchSchedule: "schedule/fetchSchedule",
      createSchedule: "schedule/createSchedule",
      updateSchedule: "schedule/updateSchedule",
      searchClassByName: "classes/searchClassByName",
      searchTeacherByName: "teacher/searchTeacherByName",
      searchCourseByName: "course/searchCourseByName",
      getAllSchoolYear: "schoolYear/getSchoolYear",
    }),

    async onSaveClicked() {
      let data = {
        id: this.data.id,
        class: this.data.class,
        teacher: this.data.teacher,
        course: this.data.course,
        school_year: this.data.schoolYear,
        email: this.data.email,
        day: this.data.day,
        start_time:
          new Date(this.data.startTime).getHours() +
          ":" +
          new Date(this.data.startTime).getMinutes() +
          ":" +
          new Date(this.data.startTime).getSeconds(),
        end_time:
          new Date(this.data.endTime).getHours() +
          ":" +
          new Date(this.data.endTime).getMinutes() +
          ":" +
          new Date(this.data.endTime).getSeconds(),
      };

      try {
        if (this.$route.name == "Schedule.Create") {
          await this.createSchedule(data);
        } else {
          await this.updateSchedule(data);
        }

        showToast("Create Schedule Success", "is-success", "is-bottom");

        this.$router.push("/schedule");
      } catch (err) {
        showToast(err.response.data.message, "is-danger", "is-bottom");
      }
    },

    async filterTeacherByName(event) {
      let data = {
        search: event,
      };

      this.teacherList = [];

      const response = await this.searchTeacherByName(data);

      this.teacherList = response.data;
    },

    async filterClassByName(event) {
      let data = {
        search: event,
      };

      this.classList = [];

      const response = await this.searchClassByName(data);

      this.classList = response.data;
    },

    async filterCourseByName(event) {
      let data = {
        search: event,
      };

      this.courseList = [];

      const response = await this.searchCourseByName(data);

      this.courseList = response.data;
    },

    async getSchoolYear() {
      this.schoolYearList = [];

      const response = await this.getAllSchoolYear();

      this.schoolYearList = response.data;
    },
  },
};
</script>
