import { Component } from "react"
import { fetch } from "../config/enviroment"
import ReactPlayer from 'react-player'
import _ from 'lodash'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      q: "",
      videos: []
    }
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.search()
  }

  handleChange(e) {
    this.setState({q: e.target.value})
    this.search()
  }

  search = _.throttle(function () {
    let self = this
    let fetchVideo = !!this.state.q ? fetch(`search?part=snippet&q=${this.state.q}&type=video&videoCaption=any&`) : fetch("videos?chart=mostPopular&")
    fetchVideo.then(function (results) {
      self.setState({ videos: results.data.items })
    })
  }, 1000);

  render() {
    return(
      <div className="container py-2 justify-content-center">
        <div className="row justify-content-center">
          <div className="input-group col-md-4">
            <input className="form-control py-2 border-right-0 border" type="search" value={this.state.q} placeholder="search" onChange={this.handleChange} />
            <span className="input-group-append">
              <button className="btn btn-outline-secondary border-left-0 border" type="button" onClick={() => this.search() }>
                  <i className="fa fa-search"></i>
              </button>
            </span>
          </div>
        </div>
        { this.state.videos.map((video) => {
            let vidId = video.id
            if (_.isObject(vidId)) { vidId = vidId.videoId }
            return  <div className="row justify-content-center mt-3">
                <div className="input-group justify-content-center col-md-4">
                  <div className="card border-primary justify-content-center mb-1">
                    <ReactPlayer
                      url={`https://www.youtube.com/watch?v=${vidId}`}
                      width="320px"
                      height="180px"
                    />
                    <div className="btn-toolbar justify-content-center" role="toolbar">
                      <div className="btn-group" role="group" onClick={(e) => {
                        e.preventDefault();
                        this.props.history.push(`/watch/${vidId}`)}}>
                        <button className="btn btn-default"><i className="fa fa-play-circle fa-2x"></i></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          )
        }
      </div>
    )
  }
}
