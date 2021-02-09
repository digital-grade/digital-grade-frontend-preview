<template>
  <div class="content">
    <b-field grouped position="is-left">
      <b-icon icon="users" custom-size="3x" class="content-icon"></b-icon>
      <h1 class="content-title">Students</h1>
    </b-field>

    <template v-if="!isLoading">
      <div class="level">
        <div class="level-left"></div>
        <div class="level-right">
          <router-link to="/student/create">
            <b-button
              type="is-primary"
              class="btn-create"
            >
              Create New
            </b-button>
          </router-link>
        </div>
      </div>

      <div class="level table-search">
        <div class="level-left">
          <b-field>
            <b-input
              v-model="search"
              placeholder="Search..."
              type="search"
              icon="search"
            ></b-input>
          </b-field>
        </div>
        <div class="level-right">
          <b-select v-model="perPage" @input="onPerPageChange">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </b-select>
        </div>
      </div>

      <b-table
        v-if="!isLoading"
        :data="students && students.data ? students.data : []"
        :current-page.sync="currentPage"
        paginated
        backend-pagination
        :total="students.meta && students.meta.total ? students.meta.total : 0"
        :per-page="perPage"
        @page-change="onPageChange"
        aria-next-label="Next page"
        aria-previous-label="Previous page"
        aria-page-label="Page"
        aria-current-label="Current page"
        backend-sorting
        :default-sort-direction="defaultSortOrder"
        :default-sort="[sortField, sortOrder]"
        @sort="onSort"
        detail-key="id"
      >
        <!-- For No -->
        <b-table-column
          field="no"
          label="No"
          sortable
          v-slot="props"
          width="1%"
        >
          {{ props.index + students.meta.from }}
        </b-table-column>

        <!-- For NIS -->
        <b-table-column
          field="nis"
          label="NIS"
          sortable
          v-slot="props"
          width="10%"
        >
          {{ props.row.nis }}
        </b-table-column>

        <!-- For name -->
        <b-table-column
          field="name"
          label="Name"
          sortable
          v-slot="props"
          width="10%"
        >
          {{ props.row.name }}
        </b-table-column>

        <!-- For class -->
        <!--<b-table-column
          field="class"
          label="Class"
          sortable
          v-slot="props"
          width="5%"
        >
          {{ props.row.class }}
        </b-table-column> -->

        <!-- For email -->
        <b-table-column
          field="email"
          label="Email"
          sortable
          v-slot="props"
          width="10%"
        >
          {{ props.row.email }}
        </b-table-column>

        <!-- For phone number -->
        <b-table-column
          field="phone_number"
          label="Phone Number"
          sortable
          v-slot="props"
          width="10%"
        >
          {{ props.row.phoneNumber }}
        </b-table-column>

        <!-- For date of birth -->
        <b-table-column
          field="date_of_birth"
          label="Date of Birth"
          sortable
          v-slot="props"
          width="10%"
        >
          {{ props.row.placeOfBirth }}, {{ formatDate(props.row.dateOfBirth) }}
        </b-table-column>

        <!-- For action -->
        <b-table-column
          label="Action"
          v-slot="props"
          width="10%"
        >
          <!-- For Login as Student -->
          <router-link :to="'/student/preview/' + props.row.nis" target="_blank">
            <b-button
              type="is-primary is-small has-text-weight-bold"
              icon-left="eye"
              title="Login as student"
            ></b-button>
          </router-link>

          <router-link :to="'/student/edit/' + props.row.nis">
            <b-button
              style="margin-left: 10px"
              type="is-primary is-small has-text-weight-bold"
              icon-left="edit"
            ></b-button>
          </router-link>

          <b-button
            style="margin-left: 10px"
            type="is-danger is-small has-text-weight-bold"
            @click="deletePopup(props.row.nis)"
            icon-left="trash"
          ></b-button>
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
import { formatDate, showToast } from '@/services/util'
import Loading from "@/components/Loading";
import debounce from 'lodash/debounce'

export default {
  name: 'student',
  components: {
    Loading,
  },
  data() {
    return {
      isLoading: false,

      // isLoadingTable: false,
      isPaginated: true,
      isPaginationSimple: false,
      paginationPosition: "bottom",
      defaultSortDirection: "asc",
      defaultSortOrder: "desc",
      sortIcon: "arrow-up",
      sortIconSize: "is-small",
      currentPage: 1,
      perPage: 10,
      activeTab: 0,
      sortField: "created_at",
      sortOrder: "desc",
      page: 1,
      search: null,
    };
  },
  computed: {
    ...mapGetters({
      students: "student/getStudents",
    }),
  },
  async created() {
    await this.loadStudents(
      this.perPage,
      this.page,
      this.sortField,
      this.sortOrder,
      this.search,
      this.status
    )
  },
  methods: {
    ...mapActions({
      fetchStudents: 'student/fetchStudents',
      deleteStudentData: 'student/deleteStudent',
    }),

    // For search student
    searchStudent: debounce(function(value) {
      if (value) {
        this.search = value
        this.loadStudents(
          this.perPage,
          this.page,
          this.sortField,
          this.sortOrder,
          this.search
        )
      } else {
        this.search = null
        this.loadStudents(
          this.perPage,
          this.page,
          this.sortField,
          this.sortOrder,
          this.search
        )
      }
    }, 500),

    // For format date
    formatDate(date) {
      return formatDate(date, "DD MMM YYYY")
    },

    // For load students
    async loadStudents(
      perPage,
      page,
      sortField,
      sortOrder,
      search,
      status
    ) {
      let data = {
        perPage: perPage,
        page: page,
        sortField: sortField,
        sortOrder: sortOrder,
        search: search,
        status: status,
      }

      this.isLoading = true
      try {
        await this.fetchStudents(data)
      } catch (err) {
        showToast(err, 'is-danger', 'is-bottom')
      }
      this.isLoading = false
    },

    // For delete popup
    deletePopup(id) {
      this.$buefy.dialog.confirm({
        title: "Delete Student",
        message: `Are you sure want to delete this student?`,
        cancelText: "No, cancel it!",
        confirmText: "Yes, delete it!",
        type: "is-primary",
        onConfirm: () => this.deleteStudent(id)
      });
    },

    // For delete student
    async deleteStudent(id) {
      this.isLoading = true;

      try {
        await this.deleteStudentData(id)

        showToast('Delete Student Success', 'is-success', 'is-bottom')
      } catch (err) {
        showToast(err, 'is-danger', 'is-bottom')
      }

      this.loadStudents(
        this.perPage,
        this.page,
        this.sortField,
        this.sortOrder,
        this.search,
        this.status
      )

      this.isLoading = false
    },

    // For Page Change
    onPageChange(page) {
      this.currentPage = page
      this.page = page
      this.loadStudents(
        this.perPage,
        this.page,
        this.sortField,
        this.sortOrder,
        this.search,
        this.status
      )
    },

    // For Sorting Data
    onSort(field, order) {
      this.sortField = field
      this.sortOrder = order
      this.loadStudents(
        this.perPage,
        this.page,
        this.sortField,
        this.sortOrder,
        this.search,
        this.status
      )
    },

    // For per page change
    onPerPageChange(value) {
      this.perPage = value
      this.loadStudents(
        this.perPage,
        this.page,
        this.sortField,
        this.sortOrder,
        this.search,
        this.status
      )
    },
  },
  watch: {
    search: function(val) {
      this.searchStudent(val)
    },
  },
};
</script>
