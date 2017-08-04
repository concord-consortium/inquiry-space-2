import React, { PureComponent } from 'react'
import Ramp from './ramp'
import StaticElements from './simulation-static-elements'
import InclineControl from './incline-control'
import Car from './car'
import SimulationEditor from './simulation-editor'
import { calculateRampAngle } from '../utils'

import '../../css/app.less';
import '../../css/simulation-editor.less';

import { Layer, Rect, Stage, Group } from 'react-konva'

// Meters of runoff at the end of the ramp
const RUNOFF_LENGTH_SCALE = 5
const RAMP_LENGTH_SCALE = 1
const TOP_PADDING = 100 // pixels
const SIM_PADDING = 10 // pixels

const DEFAULT_SIMULATION = {
  gravity: 9.81,
  mass: 0.05, // going to assume a car weighing 50 grams
  rampFriction: 0.01,
  groundFriction: -1
}

export default class SimulationBase extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      simConstants: DEFAULT_SIMULATION,
      isRunning: false
    }
    this.setInclinePos = this.setInclinePos.bind(this)
    this.setConstants = this.setConstants.bind(this)
    this.setSimulationRunning = this.setSimulationRunning.bind(this)
    this.toggleSimulationRunning = this.toggleSimulationRunning.bind(this)
    this.updateDimensions = this.updateDimensions.bind(this)
  }

  componentWillMount() {
    console.log(this.refs.simContainer)
    this.updateDimensions()
  }

  updateDimensions() {
    let width = this.props.width ? (this.props.width != document.body.clientWidth ? document.body.clientWidth : this.props.width) : document.body.clientWidth
    width -= SIM_PADDING

    let rampEndX = width / 4
    let scale = (width - rampEndX)/ RUNOFF_LENGTH_SCALE // pixels per meter

    // height has to go up to 1m above ground, so may need to adjust for this

    let height = this.props.height ? (this.props.height != document.body.clientHeight ? document.body.clientHeight : this.props.height) : document.body.clientHeight
    height -= SIM_PADDING
    let groundheight = this.props.groundheight ? this.props.groundheight : 30


    let newSettings = {
        RampTopY: TOP_PADDING,
        RampBottomY: height - groundheight,
        RampStartX: 50,
        RampEndX: rampEndX,
        CarInitialX: 0,// calculate! width / 8,
        SimWidth: width,
        SimHeight: height,
        GroundHeight: groundheight,
        Scale: scale
    }

    newSettings.RampTopY = TOP_PADDING + (RAMP_LENGTH_SCALE + (RAMP_LENGTH_SCALE * 0.25)) * Math.sin(60)
    newSettings.RampAngle = calculateRampAngle(newSettings.SimHeight, newSettings.RampTopY, newSettings.GroundHeight, newSettings.RampStartX, newSettings.RampEndX)
    newSettings.CarInitialX = RAMP_LENGTH_SCALE * Math.cos(newSettings.RampAngle)

    this.setState({ simSettings: newSettings })
  }

  componentDidMount() {
    console.log(this.refs.simContainer)
    window.addEventListener("resize", this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  setInclinePos(p) {
    this.setState({ simSettings: p })
  }

  setConstants(constantProp, value) {
    let newConstants = this.state.simConstants
    newConstants[constantProp] = value
    this.setState({ newConstants })
  }

  toggleSimulationRunning() {
    const { isRunning } = this.state
    this.setSimulationRunning(!isRunning)
  }
  setSimulationRunning(running) {
    this.setState({ isRunning: running })
  }

  render() {
    const { simSettings, simConstants, isRunning } = this.state
    let runText = isRunning ? "Stop" : "Run"
    let runSimulationClass = isRunning ? "run-simulation running" : "run-simulation stopped"

    return (
      <div className="ramp-simulation" ref="simContainer">
        <div className={runSimulationClass} onClick={this.toggleSimulationRunning}>{runText}</div>
        <SimulationEditor {...this.state} onChange={this.setConstants} />
        <Stage width={simSettings.SimWidth} height={simSettings.SimHeight}>
          <Layer>
            <Ramp simSettings={simSettings} />
            <InclineControl simSettings={simSettings} onInclineChanged={this.setInclinePos} />
            <StaticElements simSettings={simSettings} />
            <Car simSettings={simSettings} simConstants={simConstants} isRunning={isRunning} onSimulationRunningChange={this.setSimulationRunning} />
          </Layer>
        </Stage>
      </div>
    )
  }
}

