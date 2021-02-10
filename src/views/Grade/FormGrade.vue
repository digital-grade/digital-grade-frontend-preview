<template>
  <div class="content">
    <b-field grouped position="is-left">
      <b-icon icon="list" custom-size="3x" class="content-icon"></b-icon>
      <h1 class="content-title">Grades</h1>
    </b-field>

    <br />
    <br />

    <template v-if="!isLoading">
      <div class="level table-search">
        <div class="level-left">
          <h2>Course: {{ course }}</h2>
          <h2>Class: {{ classes }}</h2>
        </div>
        <div class="level-right">
          <b-button type="is-primary" @click="onSaveClicked">Save</b-button>
        </div>
      </div>
      
      <b-table
        v-if="!isLoading"
        :data="gradeData ? gradeData : []"
        :total="
          gradeData && gradeData.length ? gradeData.length : 0
        "
      >
        <!-- For student name -->
        <b-table-column field="name" label="Name" v-slot="props" width="5%">
          {{ props.row.name }}
        </b-table-column>

        <!-- For grade -->
        <b-table-column
          field="grade"
          label="Grade"
          v-slot="props"
          width="10%"
        >
          <b-input v-model="props.row.grade"></b-input>
        </b-table-column>
      </b-table>
    </template>
    <template v-else>
      <Loading :is-loading="isLoading" />
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { showToast } from '@/services/util'

export default {
  name: "form-grade",
  data() {
    return {
      gradeData: [],
      course: "",
      classes: "",
      isLoading: false,
    };
  },
  async created() {
    this.isLoading = true
    const responseSchedule = await this.fetchSchedule(
      this.$route.params.scheduleId
    );

    this.course = responseSchedule.data.course.name
    this.classes = responseSchedule.data.class.name

    const responseGrade = await this.fetchGradesBySchedule(this.$route.params.scheduleId);

    let gradeData = []
    responseGrade.data.map(grade => {
      gradeData.push({
        studentNis: grade.nis,
        classId: grade.classId,
        name: grade.name,
        grade: grade.grade
      })
    })

    this.gradeData = gradeData

    this.isLoading = false
  },
  computed: {
    ...mapGetters({
      grades: "grade/getGrades",
    }),
  },
  methods: {
    ...mapActions({
      fetchGradesBySchedule: "grade/fetchGradesBySchedule",
      saveGradesBySchedule: "grade/saveGradesBySchedule",
      fetchSchedule: "schedule/fetchSchedule",
    }),
    async onSaveClicked() {
      let data = {
        id: this.$route.params.scheduleId,
        grades: this.gradeData
      }

      try {
        await this.saveGradesBySchedule(data)

        showToast('Save Grade Success', 'is-success', 'is-bottom')

        this.$router.push({ name: "Teacher.Preview.Schedule" })
      } catch (err) {
        showToast(err, 'is-danger', 'is-bottom')
      }
    },
  },
};
</script>
