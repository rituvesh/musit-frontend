import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import * as ajax from '../../shared/RxAjax';
import MusitObject from '../../models/object';
import { getPath } from '../../shared/util';


export const searchForObjects = ({ simpleGet }) => (cmd) => {
  return MusitObject.searchForObjects(simpleGet)(cmd.params, cmd.page, cmd.museumId, cmd.collectionId, cmd);
};

const initialState = {
  data: {
    totalMatches: 0,
    matches: []
  },
  params: {
    currentPage: 1,
    perPage: 50
  }
};

export const clearSearch$ =  createAction('clearSearch$');
export const searchForObjects$ = createAction('searchForObjects$').switchMap(searchForObjects(ajax));
export const onChangeField$ = createAction('onChangeField$');

export const reducer$ = (actions) => Observable.merge(
  actions.clearSearch$.map(() => () => initialState),
  actions.searchForObjects$.map((result) => (state) => ({
    ...state,
    loading: false,
    loaded: true,
    data: {
      totalMatches: result.totalMatches,
      matches: result.matches ? result.matches.map(data => {
        return new MusitObject({
          ...data,
          breadcrumb: getPath(data)
        });
      }) : []
    },
    error: null
  })),
  actions.onChangeField$.map((props) => (state) => ({
    ...state,
    params: {
      ...state.params,
      [props.field]: props.value
    }
  }))
);

export default createStore('objectSearchStore$', reducer$({
  clearSearch$,
  searchForObjects$,
  onChangeField$
}), Observable.of(initialState));
