import inject from 'react-rxjs/dist/RxInject';
import React from 'react';
import AnalysisViewComponent from './AnalysisViewComponent';
import { makeUrlAware } from '../app/appSession';
import flowRight from 'lodash/flowRight';
import mount from '../../shared/mount';
import store$, { getAnalysisTypes$ } from './analysisStore';
import Analysis from '../../models/analysis';
import { toPromise } from '../../shared/util';
import analysisForm from './analysisForm';
const { form$, loadForm$ } = analysisForm;

const data = {
  appSession$: { type: React.PropTypes.object.isRequired },
  store$,
  form$
};

const commands = {
  loadForm$,
  getAnalysisTypes$
};

const props = {
  loadAnalysis: toPromise(Analysis.getAnalysisWithDetails())
};

export const onMount = (
  { getAnalysisTypes, appSession, loadForm, loadAnalysis, params }
) => {
  const inputParams = {
    museumId: appSession.museumId,
    id: params.analysisId,
    collectionId: appSession.collectionId,
    token: appSession.accessToken
  };
  getAnalysisTypes(inputParams);
  loadAnalysis(inputParams).then(analysis => loadForm(Analysis.fromJsonToForm(analysis)));
};

export default flowRight([inject(data, commands, props), mount(onMount), makeUrlAware])(
  AnalysisViewComponent
);
