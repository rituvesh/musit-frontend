import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import Analysis from '../../../models/analysis';

export const getAnalysisTypes$ = createAction('getAnalysisTypes$').switchMap(
  Analysis.getAnalysisTypes()
);

export const reducer$ = actions =>
  Observable.merge(
    actions.getAnalysisTypes$.map(analysisTypes =>
      state => ({
        ...state,
        analysisTypes
      }))
  );

export const store$ = (actions$ = { getAnalysisTypes$ }) =>
  createStore(
    'analysisTypeStore',
    reducer$(actions$),
    Observable.of({ analysisTypes: [] })
  );

export default store$();
