import Vue from 'vue'
import Vuex from 'vuex'
import teacher from './teacher.module'
import student from './student.module'
import course from './course.module'
import schedule from './schedule.module'
import classes from './class.module'
import schoolYear from './schoolYear.module'
import grade from './grade.module'
import user from './user.module'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    teacher,
    student,
    course,
    schedule,
    classes,
    grade,
    schoolYear,
    user,
  },
})
