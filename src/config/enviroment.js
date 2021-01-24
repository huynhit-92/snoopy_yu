import axios from 'axios'

export const API_KEY = "AIzaSyAlfy4z3ic61tExYEvrZNUJiaPMoq1DkFs"
export const HOST = "https://youtube.googleapis.com/youtube/v3/"
export const CAPTION_HOST = "https://video.google.com/timedtext?"
export function fetch(path) {
  return axios.get(HOST + path + `key=${API_KEY}`)
}
export function fetchCaption(vidId, language = "ja") {
  return axios.get(CAPTION_HOST + `lang=${language}&v=${vidId}`)
}
