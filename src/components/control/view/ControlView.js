import React, { Component, PropTypes } from 'react'
import { Panel, FormGroup, Button, Col, Row } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import * as ObservationRender from '../../observation/render'

export default class ControlView extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    translate: PropTypes.func.isRequired,
    controlsJson: PropTypes.arrayOf(PropTypes.shape({
      eventType: PropTypes.string,
      ok: PropTypes.string.bool
    })),
  }

  static iconMap = {
    ControlAlcohol: 'musitalcoholicon',
    ControlCleaning: 'musitcleaningicon',
    ControlGas: 'musitgasicon',
    ControlHypoxicAir: 'musithypoxicairicon',
    ControlLightingCondition: 'musitlightingcondicon',
    ControlMold: 'musitmoldicon',
    ControlPest: 'musitpesticon',
    ControlRelativeHumidity: 'musitrelhumidityicon',
    ControlTemperature: 'musittemperatureicon'

  }
  static typeMap = {
    ControlAlcohol: 'controlAlcohol',
    ControlCleaning: 'controlCleaning',
    ControlGas: 'controlGas',
    ControlHypoxicAir: 'controlHypoxicAir',
    ControlLightingCondition: 'controlLightingCondition',
    ControlMold: 'controlMold',
    ControlPest: 'controlPest',
    ControlRelativeHumidity: 'controlRelativeHumidity',
    ControlTemperature: 'controlTemperature'
  }

  constructor(props) {
    super(props);
    this.state = {
      ControlAlcohol: {
        open: false
      },
      ControlCleaning: {
        open: false
      },
      ControlGas: {
        open: false
      },
      ControlHypoxicAir: {
        open: false
      },
      ControlLightingCondition: {
        open: false
      },
      ControlMold: {
        open: false
      },
      ControlPest: {
        open: false
      },
      ControlRelativeHumidity: {
        open: false
      },
      ControlTemperature: {
        open: false
      }
    };

    this.showObservation = (control) => {
      let lv = ''
      const { eventType, ok } = control
      if (!ok) {
        const motivatesArr = control['subEvents-motivates'];
        const motivates = motivatesArr ? motivatesArr[0] : {}
        switch (eventType) {
          case 'ControlTemperature':
            lv = (<ObservationRender.RenderFromToNumberComment
              disabled
              translate={this.props.translate}
              type="temperature"
              valueProps={{
                fromValue: JSON.stringify(motivates.from),
                toValue: JSON.stringify(motivates.to),
                commentValue: motivates.note
              }}
            />)
            break
          case 'ControlAlcohol':
            lv = (<ObservationRender.RenderAlcohol
              disabled
              translate={this.props.translate}
              valueProps={{
                status: motivates.condition,
                volume: JSON.stringify(motivates.volume.toString()),
                comment: motivates.note
              }}
            />)
            break
          case 'ControlCleaning':
            lv = (<ObservationRender.RenderDoubleTextArea
              disabled
              translate={this.props.translate}
              type="cleaning"
              valueProps={{
                leftValue: motivates.cleaning,
                rightValue: motivates.note
              }}
            />)
            break
          case 'ControlGas':
            lv = (<ObservationRender.RenderDoubleTextArea
              disabled
              type="gas"
              translate={this.props.translate}
              valueProps={{
                leftValue: motivates.gas,
                rightValue: motivates.note
              }}
            />)
            break
          case 'ControlHypoxicAir':
            lv = (<ObservationRender.RenderFromToNumberComment
              disabled
              type="inertAir"
              translate={this.props.translate}
              valueProps={{
                fromValue: JSON.stringify(motivates.from),
                toValue: JSON.stringify(motivates.to),
                commentValue: motivates.note
              }}
            />)
            break
          case 'ControlLightingCondition':
            lv = (<ObservationRender.RenderDoubleTextArea
              disabled
              type="lux"
              translate={this.props.translate}
              valueProps={{
                leftValue: motivates.lightingCondition,
                rightValue: motivates.note
              }}
            />)
            break
          case 'ControlMold':
            lv = (<ObservationRender.RenderDoubleTextArea
              disabled
              type="mold"
              translate={this.props.translate}
              valueProps={{
                leftValue: motivates.mold,
                rightValue: motivates.note
              }}
            />)
            break
          case 'ControlPest':
            lv = (<ObservationRender.RenderPest
              disabled
              translate={this.props.translate}
              canEdit={false}
              valueProps={{
                observations: motivates.lifeCycles.map(lc => {
                  return {
                    lifeCycle: lc.stage,
                    count: JSON.stringify(lc.number)
                  }
                }),
                identificationValue: motivates.identification,
                commentValue: motivates.note
              }}
            />)
            break
          case 'ControlRelativeHumidity':
            lv = (<ObservationRender.RenderFromToNumberComment
              disabled
              translate={this.props.translate}
              type="cleaning"
              valueProps={{
                fromValue: JSON.stringify(motivates.from),
                toValue: JSON.stringify(motivates.to),
                commentValue: motivates.note
              }}
            />)
            break
          default:
            lv = ''
            break
        }
      }
      return lv
    }
  }


  render() {
    const { id } = this.props
    const observation = (fontName, observationType) => {
      return (
        <Col xs={5} sm={5} >
          <span className={`icon icon-${fontName}`} />
          {` ${observationType}`}
        </Col>
    ) }
    const controlOk = (
      <Col xs={5} sm={5} >
        <FontAwesome name="check" />
        {`  ${this.props.translate('musit.texts.ok')}`}
      </Col>
    )
    const controlNotOk = (
      <Col xs={5} sm={5} >
        <FontAwesome name="close" />
        {`  ${this.props.translate('musit.texts.notOk')}`}
      </Col>
    )
    const downButton = (observationType, ok) => {
      return (
        <Col xs={2} sm={2} >
          <Button
            id={`${id}_${observationType}_downButton`}
            onClick={() => this.setState({ [observationType]: { open: !this.state[observationType].open } })}
            bsStyle="link"
          >
            {ok ? null : <FontAwesome name="sort-desc" />}
          </Button>
        </Col>
      ) }
    const oneTableRow = (control, i) => {
      const { eventType, ok } = control
      return (
        <div key={i}>
          <Row>
            {observation(ControlView.iconMap[eventType],
              this.props.translate(`musit.viewControl.${ControlView.typeMap[eventType]}`))}
            {ok ? controlOk : controlNotOk}
            {downButton(eventType, ok)}
          </Row>
          <Row>
            <Panel collapsible expanded={this.state[eventType].open}>
              {this.showObservation(control)}
            </Panel>
          </Row>
        </div>
      ) }

    return (
      <FormGroup>
        {this.props.controlsJson ? this.props.controlsJson.map((c, i) =>
          oneTableRow(c, i)
        ) : null}
      </FormGroup>
    )
  }
}