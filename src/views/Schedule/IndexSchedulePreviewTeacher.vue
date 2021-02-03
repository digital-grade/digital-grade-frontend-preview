<template>
  <div class="content">
    <b-field grouped position="is-left">
      <b-icon icon="calendar-alt" custom-size="3x" class="content-icon"></b-icon>
      <h1 class="content-title">Schedules</h1>
    </b-field>

    <template v-if="!isLoading">
      <div class="level">
        <div class="level-left"></div>
        <div class="level-right">
          <router-link to="/schedule/create">
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
        :data="schedules && schedules.data ? schedules.data : []"
        :current-page.sync="currentPage"
        paginated
        backend-pagination
        :total="schedules.meta && schedules.meta.total ? schedules.meta.total : 0"
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
          v-slot="props"
          width="1%"
        >
          {{ props.index + schedules.meta.from }}
        </b-table-column>

        <!-- For class -->
        <b-table-column
          field="class"
          label="Class"
          v-slot="props"
          width="5%"
        >
          {{ props.row.class }}
        </b-table-column>

        <!-- For course -->
        <b-table-column
          field="course"
          label="Course"
          v-slot="props"
          width="10%"
        >
          {{ props.row.course }}
        </b-table-column>

        <!-- For School Year -->
        <b-table-column
          field="school_year"
          label="School Year"
          v-slot="props"
          width="10%"
        >
          {{ props.row.schoolYear }}
        </b-table-column>

        <!-- For day -->
        <b-table-column
          field="day"
          label="Day"
          v-slot="props"
          width="10%"
        >
          <template v-if="props.row.day == 'monday'">
            Monday
          </template>
          <template v-else-if="props.row.day == 'tuesday'">
            Tuesday
          </template>
          <template v-else-if="props.row.day == 'wednesday'">
            Wednesday
          </template>
          <template v-else-if="props.row.day == 'thursday'">
            Thursday
          </template>
          <template v-else-if="props.row.day == 'friday'">
            Friday
          </template>
          <template v-else-if="props.row.day == 'saturday'">
            Saturday
          </template>
          <template v-else-if="props.row.day == 'sunday'">
            Sunday
          </template>
        </b-table-column>

        <!-- For date of birth -->
        <b-table-column
          field="start_time"
          label="Schedule"
          v-slot="props"
          width="10%"
        >
          {{ props.row.startTime }} - {{ props.row.endTime }}
        </b-table-column>

        <!-- For action -->
        <b-table-column
          label="Action"
          v-slot="props"
          width="10%"
        >
          <router-link :to="'/teacher/preview/schedule/' + $route.params.nip + '/list/' + props.row.id">
            <b-button
              type="is-primary is-small has-text-weight-bold"
              icon-left="list"
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
  name: 'schedule',
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
      schedules: "schedule/getSchedules",
    }),
  },
  async created() {
    await this.loadSchedules(
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
      fetchSchedules: 'schedule/fetchSchedulesByNip',
      deleteScheduleData: 'schedule/deleteSchedule',
    }),

    // For search schedule
    searchSchedule: debounce(function(value) {
      if (value) {
        this.search = value
        this.loadSchedules(
          this.perPage,
          this.page,
          this.sortField,
          this.sortOrder,
          this.search
        )
      } else {
        this.search = null
        this.loadSchedules(
          this.perPage,
          this.page,
          this.sortField,
          this.sortOrder,
          this.search
        )
      }
    }, 500),

    // For load schedules
    async loadSchedules(
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
        nip: this.$route.params.nip,
      }

      this.isLoading = true
      try {
        await this.fetchSchedules(data)
      } catch (err) {
        showToast(err, 'is-danger', 'is-bottom')
      }
      this.isLoading = false
    },

    // For delete popup
    deletePopup(id) {
      this.$buefy.dialog.confirm({
        title: "Delete Schedule",
        message: `Are you sure want to delete this schedule?`,
        cancelText: "No, cancel it!",
        confirmText: "Yes, delete it!",
        type: "is-primary",
        onConfirm: () => this.deleteSchedule(id)
      });
    },

    // For delete schedule
    async deleteSchedule(id) {
      this.isLoading = true;

      try {
        await this.deleteScheduleData(id)

        showToast('Delete Schedule Success', 'is-success', 'is-bottom')
      } catch (err) {
        showToast(err, 'is-danger', 'is-bottom')
      }

      this.loadSchedules(
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
      this.loadSchedules(
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
      this.loadSchedules(
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
      this.loadSchedules(
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
      this.searchSchedule(val)
    },
  },
};
</script>
