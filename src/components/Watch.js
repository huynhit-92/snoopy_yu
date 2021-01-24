import { Component } from 'react'
import { fetchCaption } from '../config/enviroment'
import ReactPlayer from 'react-player'
import parser from 'fast-xml-parser'
import _ from 'lodash'
import Kuroshiro from "kuroshiro"
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji"
import ReactHtmlParser from 'react-html-parser'

export default class Watch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playing: false,
      captions: [],
      vidId: props.match.params.id,
      currentSecond: 1,
      kuroshiro: null
    }
  }

  changePlaying = () => {
    this.setState({ playing: !this.state.playing })
  }

  playButtonClass = () => {
    let className = this.state.playing ? 'fa-pause' : 'fa-play-circle'
    return `fa ${className} fa-2x`
  }

  componentDidMount() {
    this.fetchVidCaption()
  }

  fetchVidCaption() {
    fetchCaption(this.state.vidId).then((result) => {
      let captions = parser.parse(result.data, { ignoreAttributes: false })['transcript']
      if (_.isEmpty(captions)) { return }
      captions = captions['text'].map(e => ({
        text: e['#text'],
        start: parseFloat(e['@_start']),
        end: parseFloat(e['@_start']) + parseFloat(e['@_dur']),
        translatedCaption: ""
      }))
      this.setState({ captions: captions })

      let texts = captions.map(e => e['text']).join("$$$")
      this.translateCaption(texts, { mode: 'furigana' })
    })
  }

  async translateCaption(texts, options = {}) {
    if (!this.state.kuroshiro) {
      let kuroshiro = new Kuroshiro()
      await kuroshiro.init(new KuromojiAnalyzer({ dictPath: '/dict/' }))
      this.setState({ kuroshiro: kuroshiro })
    }
    let translatedCaptions = await this.state.kuroshiro.convert(texts, {mode:"furigana", to:"hiragana"})
    translatedCaptions = translatedCaptions.split("$$$")
    let newCaptions = _.map(this.state.captions, (e, index) => {
      return { ...e, translatedCaption: translatedCaptions[index] }
    })
    this.setState({ captions: newCaptions })
  }

  onProgress = () => {
    this.setState({ currentSecond: this.player.getCurrentTime()})
  }

  ref = player => {
    this.player = player
  }

  getCaption = () => {
    if (_.isEmpty(this.state.captions)) { return "hien chua co sub" }
    let second = this.state.currentSecond;
    let caption = _.find(this.state.captions, e => (e['start'] < second || e['start'] - 0.5 < second ) && second < e['end'] - 0.5)
    return _.get(caption, 'translatedCaption')
  }

  seekTo = (second) => {
    this.player.seekTo(this.state.currentSecond + second)
  }

  render() {
    return(
      <div className="container py-2 justify-content-center">
        <div className="input-group justify-content-center col-md-6">
          <ReactPlayer
            ref={this.ref}
            url={`https://www.youtube.com/watch?v=${this.state.vidId}`}
            playing={this.state.playing}
            config={{
              youtube: {
                playerVars: { showinfo: 1 }
              }
            }}
            controls={true}
            onProgress={this.onProgress}
          />
          <div className="btn-toolbar col-md-12 justify-content-center" role="toolbar">
            <div className="btn-group justify-content-around col-md-8" role="group">
              <button className="btn btn-default" onClick={this.changePlaying}>
                <i className="fa fa-backward fa-2x"></i></button>
              <button className="btn btn-default" onClick={this.changePlaying}>
                <i className={this.playButtonClass()}></i></button>
              <button className="btn btn-default" onClick={() => this.seekTo(10)}>
                <i className="fa fa-forward fa-2x"></i></button>
            </div>
          </div>
          <div>
            <p className="h4 mt-2">{ ReactHtmlParser(this.getCaption()) }</p>
          </div>
        </div>
      </div>
    )
  }
}
