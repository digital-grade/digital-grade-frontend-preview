<template>
  <div class="content">
    <b-field grouped position="is-left">
      <b-icon icon="book" custom-size="3x" class="content-icon"></b-icon>
      <h1 class="content-title">School Years</h1>
    </b-field>

    <template v-if="!isLoading">
      <div class="level">
        <div class="level-left"></div>
        <div class="level-right">
          <b-button
            type="is-primary"
            class="btn-create"
            @click="createSchoolYearPopup"
          >
            Create New
          </b-button>
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
        :data="schoolYears && schoolYears.data ? schoolYears.data : []"
        :current-page.sync="currentPage"
        paginated
        backend-pagination
        :total="schoolYears.meta && schoolYears.meta.total ? schoolYears.meta.total : 0"
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
            {{ props.index + schoolYears.meta.from }}
          </span>
        </b-table-column>

        <!-- For school year -->
        <b-table-column
          field="start_year"
          label="School Year"
          sortable
          v-slot="props"
          width="20%"
        >
          {{ props.row.startYear }}/{{ props.row.endYear }}
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
  name: 'school-year',
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
      schoolYears: "schoolYear/getSchoolYears",
    }),
  },
  async created() {
    await this.loadSchoolYears(
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
      fetchSchoolYears: 'schoolYear/fetchSchoolYears',
      createSchoolYearData: 'schoolYear/createSchoolYear',
    }),

    // For search school year
    searchSchoolYear: debounce(function(value) {
      if (value) {
        this.search = value
        this.loadSchoolYears(
          this.perPage,
          this.page,
          this.sortField,
          this.sortOrder,
          this.search
        )
      } else {
        this.search = null
        this.loadSchoolYears(
          this.perPage,
          this.page,
          this.sortField,
          this.sortOrder,
          this.search
        )
      }
    }, 500),

    // For load school years
    async loadSchoolYears(
      perPage,
      page,
      sortField,
      sortOrder,
      search
    ) {
      let data = {
        perPage: perPage,
        page: page,
        sortField: sortField,
        sortOrder: sortOrder,
        search: search
      }

      this.isLoading = true
      try {
        await this.fetchSchoolYears(data)
      } catch (err) {
        showToast(err, 'is-danger', 'is-bottom')
      }
      this.isLoading = false
    },

    // For create new school year popup
    createSchoolYearPopup() {
      this.$buefy.dialog.confirm({
        title: "Create School Year",
        message: `Are you sure want to create new school year?`,
        cancelText: "No, cancel it!",
        confirmText: "Yes, create it!",
        type: "is-primary",
        onConfirm: () => this.createSchoolYear()
      });
    },

    // For create school year
    async createSchoolYear() {
      this.isLoading = true;

      try {
        await this.createSchoolYearData()

        showToast('Create School Year Success', 'is-success', 'is-bottom')
      } catch (err) {
        showToast(err, 'is-danger', 'is-bottom')
      }

      this.loadSchoolYears(
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
      this.loadSchoolYears(
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
      this.loadSchoolYears(
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
      this.loadSchoolYears(
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
      this.searchSchoolYear(val)
    },
  },
};
</script>
