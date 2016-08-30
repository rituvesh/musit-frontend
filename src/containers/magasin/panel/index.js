import { connect } from 'react-redux';
import { hashHistory } from 'react-router'
import Language from '../../../components/language'
import { load, insert as insertStorageUnitContainer } from '../../../reducers/storageunit/panel';
import { suggestAddress, clearSuggest } from '../../../reducers/suggest'
import StorageUnitContainerImpl from './StorageUnitContainer'

const mapStateToProps = (state) => {
  return {
    unit: (state.storagePanelUnit && state.storagePanelUnit.data) ? state.storagePanelUnit.data : {},
    translate: (key, markdown) => Language.translate(key, markdown),
    suggest: state.suggest
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLagreClick: (data) => {
      dispatch(insertStorageUnitContainer(data), {
        onSuccess: () => hashHistory.goBack(),
        onFailure: () => { /* alert('Kunne ikke lagre node') */ }
      })
    },
    loadStorageUnit: (id) => {
      dispatch(load(id))
    },
    onAddressSuggestionsUpdateRequested: ({ value, reason }) => {
      // Should only autosuggest on typing if you have more then 3 characters
      if (reason && (reason === 'type') && value && value.length >= 3) {
        dispatch(suggestAddress('addressField', value))
      } else {
        dispatch(clearSuggest('addressField'))
      }
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class StorageUnitContainer extends StorageUnitContainerImpl {}
