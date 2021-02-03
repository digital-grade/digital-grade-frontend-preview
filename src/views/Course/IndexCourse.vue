<template>
  <div class="content">
    <b-field grouped position="is-left">
      <b-icon icon="book" custom-size="3x" class="content-icon"></b-icon>
      <h1 class="content-title">Courses</h1>
    </b-field>

    <template v-if="!isLoading">
      <div class="level">
        <div class="level-left"></div>
        <div class="level-right">
          <router-link to="/course/create">
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
        :data="courses && courses.data ? courses.data : []"
        :current-page.sync="currentPage"
        paginated
        backend-pagination
        :total="courses.meta && courses.meta.total ? courses.meta.total : 0"
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
          <span class="table-full-name">
            {{ props.index + courses.meta.from }}
          </span>
        </b-table-column>

        <!-- For code -->
        <b-table-column
          field="code"
          label="Code"
          sortable
          v-slot="props"
          width="10%"
        >
          {{ props.row.code }}
        </b-table-column>

        <!-- For name -->
        <b-table-column
          field="name"
          label="Name"
          sortable
          v-slot="props"
          width="40%"
        >
          {{ props.row.name }}
        </b-table-column>

        <!-- For action -->
        <b-table-column
          label="Action"
          v-slot="props"
          width="10%"
        >
          <router-link :to="'/course/edit/' + props.row.id">
            <b-button
              type="is-primary is-small has-text-weight-bold"
              icon-left="edit"
            ></b-button>
          </router-link>
          <b-button
            style="margin-left: 10px"
            type="is-danger is-small has-text-weight-bold"
            @click="deletePopup(props.row.id)"
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
import { showToast } from '@/services/util'
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
      sortField: "id",
      sortOrder: "desc",
      page: 1,
      search: null,
    };
  },
  computed: {
    ...mapGetters({
      courses: "course/getCourses",
    }),
  },
  async created() {
    await this.loadCourses(
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
      fetchCourses: 'course/fetchCourses',
      deleteCourseData: 'course/deleteCourse',
    }),

    // For search course
    searchCourse: debounce(function(value) {
      if (value) {
        this.search = value
        this.loadCourses(
          this.perPage,
          this.page,
          this.sortField,
          this.sortOrder,
          this.search
        )
      } else {
        this.search = null
        this.loadCourses(
          this.perPage,
          this.page,
          this.sortField,
          this.sortOrder,
          this.search
        )
      }
    }, 500),

    // For load courses
    async loadCourses(
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
        await this.fetchCourses(data)
      } catch (err) {
        showToast(err, 'is-danger', 'is-bottom')
      }
      this.isLoading = false
    },

    // For delete popup
    deletePopup(id) {
      this.$buefy.dialog.confirm({
        title: "Delete Course",
        message: `Are you sure want to delete this course?`,
        cancelText: "No, cancel it!",
        confirmText: "Yes, delete it!",
        type: "is-primary",
        onConfirm: () => this.deleteCourse(id)
      });
    },

    // For delete course
    async deleteCourse(id) {
      this.isLoading = true;

      try {
        await this.deleteCourseData(id)

        showToast('Delete Course Success', 'is-success', 'is-bottom')
      } catch (err) {
        showToast(err, 'is-danger', 'is-bottom')
      }

      this.loadCourses(
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
      this.loadCourses(
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
      this.loadCourses(
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
      this.loadCourses(
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
      this.searchCourse(val)
    },
  },
};
</script>
