import Vue from 'vue'
import VueRouter from 'vue-router'

// For Auth
import Home from '@/views/Authentication/Home'

// For Dashboard
import Dashboard from '@/views/Dashboard/Dashboard'

// For Teacher
import Teacher from '@/views/Teacher/IndexTeacher'
import FormTeacher from '@/views/Teacher/FormTeacher'

// For Student
import Student from '@/views/Student/IndexStudent'
import FormStudent from '@/views/Student/FormStudent'

// For Course
import Course from '@/views/Course/IndexCourse'
import FormCourse from '@/views/Course/FormCourse'

// For Class
import Class from '@/views/Class/IndexClass'
import FormClass from '@/views/Class/FormClass'
import DetailClassPreviewStudent from '@/views/Class/DetailClassPreviewStudent'
import ClassPreviewStudent from '@/views/Class/IndexClassPreviewStudent'

// For Schedule
import Schedule from '@/views/Schedule/IndexSchedule'
import SchedulePreviewTeacher from '@/views/Schedule/IndexSchedulePreviewTeacher'
// import SchedulePreviewStudent from '@/views/Schedule/IndexSchedulePreviewStudent'
import FormSchedule from '@/views/Schedule/FormSchedule'

// For Grade
import Grade from '@/views/Grade/FormGrade'

// For profile
import Profile from '@/views/Profile/Profile'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      /** For Dashboard */
      {
        path: "",
        name: "Dashboard",
        component: Dashboard,
      },
      /** End For Dashboard */

      /** For Profile */
      {
        path: '/profile',
        name: 'Profile',
        component: Profile,
      },
      /** End For Profile */

      /** For Teacher */
      {
        path: '/teacher',
        name: 'Teacher.Index',
        component: Teacher,
      },
      {
        path: '/teacher/create',
        name: 'Teacher.Create',
        component: FormTeacher,
      },
      {
        path: '/teacher/edit/:nip',
        name: 'Teacher.Edit',
        component: FormTeacher,
      },
      {
        path: '/teacher/preview/:nip',
        name: 'Teacher.Preview',
        component: Dashboard,
      },
      {
        path: '/teacher/preview/profile/:nip',
        name: 'Teacher.Preview.Profile',
        component: Dashboard,
      },
      {
        path: '/teacher/preview/schedule/:nip',
        name: 'Teacher.Preview.Schedule',
        component: SchedulePreviewTeacher,
      },
      {
        path: '/teacher/preview/schedule/:nip/list/:scheduleId',
        name: 'Teacher.Preview.Schedule.Grade',
        component: Grade,
      },
      /** End For Teacher */

      /** For Student */
      {
        path: '/student',
        name: 'Student.Index',
        component: Student,
      },
      {
        path: '/student/create',
        name: 'Student.Create',
        component: FormStudent,
      },
      {
        path: '/student/edit/:nis',
        name: 'Student.Edit',
        component: FormStudent,
      },
      {
        path: '/student/preview/:nis',
        name: 'Student.Preview',
        component: Dashboard,
      },
      // {
      //   path: '/student/preview/schedule/:nis',
      //   name: 'Student.Preview.Schedule',
      //   component: SchedulePreviewStudent,
      // },
      {
        path: '/student/preview/class/:nis',
        name: 'Student.Preview.Class',
        component: ClassPreviewStudent,
      },
      {
        path: '/student/preview/class/:nis/schedule/:classId',
        name: 'Student.Preview.Class.Schedule',
        component: DetailClassPreviewStudent,
      },
      /** End For Student */

      /** For Course */
      {
        path: '/course',
        name: 'Course.Index',
        component: Course,
      },
      {
        path: '/course/create',
        name: 'Course.Create',
        component: FormCourse,
      },
      {
        path: '/course/edit/:courseId',
        name: 'Course.Edit',
        component: FormCourse,
      },
      /** End For Course */

      /** For Class */
      {
        path: '/class',
        name: 'Class.Index',
        component: Class,
      },
      {
        path: '/class/create',
        name: 'Class.Create',
        component: FormClass,
      },
      {
        path: '/class/edit/:classId',
        name: 'Class.Edit',
        component: FormClass,
      },
      /** End For Class */

      /** For Schedule */
      {
        path: '/schedule',
        name: 'Schedule.Index',
        component: Schedule,
      },
      {
        path: '/schedule/create',
        name: 'Schedule.Create',
        component: FormSchedule,
      },
      {
        path: '/schedule/edit/:scheduleId',
        name: 'Schedule.Edit',
        component: FormSchedule,
      },
      /** End For Schedule */
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
