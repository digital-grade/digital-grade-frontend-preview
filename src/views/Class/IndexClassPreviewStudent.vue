<template>
  <div class="content">
    <b-field grouped position="is-left">
      <b-icon icon="graduation-cap" custom-size="3x" class="content-icon"></b-icon>
      <h1 class="content-title">Class</h1>
    </b-field>

    <template v-if="!isLoading">
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
        :data="classes && classes.data ? classes.data : []"
        :current-page.sync="currentPage"
        paginated
        backend-pagination
        :total="classes.meta && classes.meta.total ? classes.meta.total : 0"
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
            {{ props.index + classes.meta.from }}
          </span>
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
          <!-- For detail class -->
          <router-link :to="'/student/preview/class/' + $route.params.nis + '/schedule/' + props.row.id">
            <b-button
              type="is-primary is-small has-text-weight-bold"
              title="Schedule"
              icon-left="clock"
            ></b-button>
          </router-link>
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
      classes: "classes/getClasses",
    }),
  },
  async created() {
    await this.loadClasses(
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
      fetchClasses: 'classes/fetchClassesByStudent',
    }),

    // For search class
    searchClass: debounce(function(value) {
      if (value) {
        this.search = value
        this.loadClasses(
          this.perPage,
          this.page,
          this.sortField,
          this.sortOrder,
          this.search
        )
      } else {
        this.search = null
        this.loadClasses(
          this.perPage,
          this.page,
          this.sortField,
          this.sortOrder,
          this.search
        )
      }
    }, 500),

    // For load classes
    async loadClasses(
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
        nis: this.$route.params.nis,
      }

      this.isLoading = true
      try {
        await this.fetchClasses(data)
      } catch (err) {
        showToast(err, 'is-danger', 'is-bottom')
      }
      this.isLoading = false
    },

    // For Page Change
    onPageChange(page) {
      this.currentPage = page
      this.page = page
      this.loadClasses(
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
      this.loadClasses(
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
      this.loadClasses(
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
      this.searchClass(val)
    },
  },
};
</script>
