import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Language from '../../components/language'
import ObservationPage from './page'
import Layout from '../../layout'
import Breadcrumb from '../../layout/Breadcrumb'
import { hashHistory } from 'react-router'
import { addObservation } from '../../reducers/observation'

const mapStateToProps = (state) => {
  return {
    actor: state.auth.actor,
    translate: (key, markdown) => Language.translate(key, markdown),
    path: state.storageGridUnit.root.path ?
          state.storageGridUnit.root.path.map((s) => {
            return {
              id: s.id, name: s.name, type: s.type, url: `/magasin/${s.id}` } }) :
      null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSaveObservation: (id, data) => {
      dispatch(addObservation(id, data, {
        onSuccess: () => hashHistory.goBack(),
        onFailure: () => alert('ikke istand til å lagre')
      }))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class AddObservationPage extends React.Component {

  static propTypes = {
    translate: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    onSaveObservation: PropTypes.func.isRequired,
    actor: PropTypes.object,
    path: React.PropTypes.arrayOf(React.PropTypes.object)
  }

  nodeTypes = [
    { type: 'Organisation', iconName: 'folder' },
    { type: 'Building', iconName: 'folder' },
    { type: 'Room', iconName: 'folder' },
    { type: 'StorageUnit', iconName: 'folder' }
  ]

  makeBreadcrumb(nodes, nodeTypes) {
    return nodes ? <Breadcrumb nodes={nodes} nodeTypes={nodeTypes} /> : null
  }

  render() {
    const nodes = this.props.path
    const breadcrumb = this.makeBreadcrumb(nodes, this.nodeTypes)
    return (
      <Layout
        title="Magasin"
        translate={this.props.translate}
        breadcrumb={breadcrumb}
        content={
          <div>
            <h4 style={{ textAlign: 'center' }}>{this.props.translate('musit.observation.page.titles.add')}</h4>
            <ObservationPage
              id={this.props.params.id}
              onSaveObservation={this.props.onSaveObservation}
              translate={this.props.translate}
              mode="ADD"
              doneBy={this.props.actor}
            />
          </div>
        }
      />
    )
  }
}