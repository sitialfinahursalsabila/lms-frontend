import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/pages/Home'
import Courses from './components/pages/Courses'
import Detail from './components/pages/Detail'
import Login from './components/pages/Login'
import Register from './components/pages/Register'
import MyLearning from './components/pages/account/MyLearning'
import MyCourses from './components/pages/account/MyCourses'
import WatchCourse from './components/pages/account/WatchCourse'
import ChangePassword from "./components/pages/account/ChangePassword"
import Dashboard from './components/pages/account/Dashboard'
import { Toaster } from 'react-hot-toast'
import RequiredAuth from './components/common/RequiredAuth'
import CreateCourse from './components/pages/account/courses/CreateCourse'
import EditCourse from './components/pages/account/courses/EditCourse'
import EditLesson from './components/pages/account/courses/EditLesson'
import LeaveRating from './components/pages/account/courses/LeaveRating'
import Profile from './components/pages/account/courses/profile'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path='/' element={<Home />} />
          <Route path='/courses' element={<Courses />} />
          <Route path='/detail/:id' element={<Detail />} />
          <Route path='/account/login' element={<Login />} />
          <Route path='/account/register' element={<Register />} />

          {/* Protected routes */}
          <Route path="/account/dashboard" element={
            <RequiredAuth><Dashboard /></RequiredAuth>
          } />

          <Route path="/account/profile" element={
            <RequiredAuth><Profile /></RequiredAuth>
          } />

          <Route path="/account/change-password" element={
            <RequiredAuth><ChangePassword /></RequiredAuth>
          } />

          <Route path="/account/my-learning" element={
            <RequiredAuth><MyLearning /></RequiredAuth>
          } />

          <Route path="/account/my-courses" element={
            <RequiredAuth><MyCourses /></RequiredAuth>
          } />

          <Route path="/account/watch-course/:id" element={
            <RequiredAuth><WatchCourse /></RequiredAuth>
          } />

          <Route path="/account/leave-rating/:id" element={
            <RequiredAuth><LeaveRating /></RequiredAuth>
          } />

          <Route path="/account/courses/create" element={
            <RequiredAuth><CreateCourse /></RequiredAuth>
          } />

          <Route path="/account/courses/edit/:id" element={
            <RequiredAuth><EditCourse /></RequiredAuth>
          } />

          <Route path="/account/courses/edit-lesson/:id/:courseId" element={
            <RequiredAuth><EditLesson /></RequiredAuth>
          } />
        </Routes>
      </BrowserRouter>

      <Toaster position="top-right" reverseOrder={false} />
    </>
  )
}

export default App