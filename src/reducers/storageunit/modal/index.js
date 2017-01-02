import Config from '../../../config';
import { apiUrl } from '../../../util';
import { getPath } from '../../helper';
import { getState } from '../../../reducers/public';

const ID = 'storageUnitModal';

export const LOAD_CHILDREN = 'musit/storageunit-modal/LOAD_CHILDREN';
export const LOAD_CHILDREN_SUCCESS = 'musit/storageunit-modal/LOAD_CHILDREN_SUCCESS';
export const LOAD_CHILDREN_FAIL = 'musit/storageunit-modal/LOAD_CHILDREN_FAIL';
export const LOAD_NODE = 'musit/storageunit-modal/LOAD_NODE';
export const LOAD_NODE_SUCCESS = 'musit/storageunit-modal/LOAD_NODE_SUCCESS';
export const LOAD_NODE_FAIL = 'musit/storageunit-modal/LOAD_NODE_FAIL';
export const CLEAR = 'musit/storageunit-modal/CLEAR';

const initialState = { root: {} };

const storageUnitModalReducer = (state = initialState, action = {}) => {
  switch (action.type) {
  case LOAD_CHILDREN:
    return {
      ...state,
      loading: true
    };
  case LOAD_CHILDREN_SUCCESS:
    return {
      ...state,
      loading: false,
      loaded: true,
      data: action.result
    };
  case LOAD_CHILDREN_FAIL:
    return {
      ...state,
      loading: false,
      loaded: false,
      error: action.error
    };

  case LOAD_NODE:
    return {
      ...state,
      loading: true
    };
  case LOAD_NODE_SUCCESS:
    return {
      ...state,
      root: {
        ...state.root,
        loading: false,
        loaded: true,
        data: {
          ...action.result,
          breadcrumb: getPath(action.result)
        }
      }
    };
  case LOAD_NODE_FAIL:
    return {
      ...state,
      root: {
        ...state.root,
        loading: false,
        loaded: false,
        error: action.error
      }
    };
  case CLEAR: {
    return {
      ...state,
      root: {},
      data: []
    };
  }
  default:
    return state;
  }
};

export default { ID, reducer: storageUnitModalReducer };

export const loadNode = (id, museumId) => {
  const url = apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${id}`);
  return {
    types: [LOAD_NODE, LOAD_NODE_SUCCESS, LOAD_NODE_FAIL],
    promise: (client) => client.get(url)
  };
};

export const loadChildren = (id, museumId, currentPage, perPage, callback) => {
  let url;
  if (id) {
    url = apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${id}/children?limit=${perPage}&page=${currentPage}`);
  } else {
    url = apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/root`);
  }
  return {
    types: [LOAD_CHILDREN, LOAD_CHILDREN_SUCCESS, LOAD_CHILDREN_FAIL],
    promise: (client) => client.get(url),
    callback
  };
};

export const clear = () => {
  return {
    type: CLEAR
  };
};

export const isMoveDialogActive = () => {
  const data = getState(ID, 'data');
  const hasData = data && data.length > 0;
  const hasRoot = Object.keys(getState(ID, 'root')).length > 0;
  return hasData || hasRoot;
};
