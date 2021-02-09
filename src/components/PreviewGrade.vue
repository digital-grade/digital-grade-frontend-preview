<template>
  <div class="modal-card">
    <div class="modal-card-head">
      <p class="modal-card-title">GRADE</p>
    </div>

    <section class="modal-card-body">
      <b-field grouped position="is-right">
        <b-button type="is-primary" @click="downloadFile">Download Raport</b-button>
      </b-field>

      <b-table
        :data="grades"
      >
        <b-table-column label="No" v-slot="props">
          {{ props.index + 1 }}
        </b-table-column>

        <b-table-column label="Course" v-slot="props">
          {{ props.row.course }}
        </b-table-column>

        <b-table-column label="Grade" v-slot="props">
          {{ props.row.grade }}
        </b-table-column>

        <b-table-column label="Status" v-slot="props">
          {{ props.row.status }}
        </b-table-column>
      </b-table>
    </section>

    <!-- For Footer -->
    <footer class="modal-card-foot">
      <button
        class="button is-danger"
        type="button"
        @click="$parent.close()"
      >
        Close
      </button>
    </footer>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { showToast } from '@/services/util'

export default {
  props: {
    classId: {
      default: () => {}
    },
    nis: {
      default: () => {}
    },
    semester: {
      default: () => {}
    }
  },
  data() {
    return {
      grades: [],
    }
  },
  mounted() {
    console.log("asd")
    this.getGradesData()
  },
  methods: {
    ...mapActions({
      fetchGradeByClass: 'grade/fetchGradesByClass',
      printRaport: 'grade/printRaport',
    }),

    async getGradesData() {
      let data = {
        classId: this.classId,
        nis: this.nis,
        semester: this.semester,
      }

      const response = await this.fetchGradeByClass(data)

      this.grades = response.data
    },

    // For download file
    async downloadFile() {
      let data = {
        classId: this.classId,
        nis: this.nis,
        semester: this.semester,
        name: 'Laporan Pembelajaran',
      }

      try {
        await this.printRaport(data)
      } catch (err) {
        showToast(err, 'is-danger', 'is-bottom')
      }
    },
  }
}
</script>
