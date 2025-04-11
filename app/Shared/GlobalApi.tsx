// showLastCommitMessageForThisLibrary.js
import { create } from 'apisauce'

// define the api
const IP = process.env.EXPO_PUBLIC_IP
console.log(IP);

const api = create({
  baseURL:  `http://${IP}:3000/api/`,
  headers: { 'X-API-KEY': '9bc2934c2e4cc04702980a8af792155186f85aba59333ac14234579fefcc071b691fbc20851004209235ad060c69d0f9d53e164cd8e4d2922de4ccb291b69ad6ca5ea26294bd35ef92c2bfc8e2cb91c89e4ae87645101161918a772de8b089718fc12ec8b6a3696c530d4af1a78240784d33a280b109bf882b326c398e4a0729', },
})

const getSlider =()=>api.get('/sliders?populate=*');

const getVideoCourse = () => api.get('/video-courses?populate=*');

const getCourseList = () => api.get('/course-lists?populate=*');

export default {
  getSlider,
  getVideoCourse,
  getCourseList
} 