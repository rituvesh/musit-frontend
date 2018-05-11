// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import type { AppSession } from '../../types/appSession';
import type {
  ExtraAttribute,
  AnalysisEvent,
  ExtraResultAttributeValues
} from '../../types/analysis';
import type { FormData } from './shared/formType';
import PersonRoleDate from '../../components/person/PersonRoleDate';
import MetaInformation from '../../components/metainfo';
import ObjectResultTable from './components/ExpandableObjectResultTable';
import AddRestriction from './components/AddRestriction';
import ViewRestriction from './components/ViewRestriction';
import EditResult from './components/EditResult';
import FormDescriptionAttribute from './components/FormDescriptionAttribute';
import FormAnalysisType from './components/FormAnalysisType';
import { getStatusText, getParentObjectId } from './shared/getters';
import type { Predefined } from '../../types/predefined';
import type { Restriction } from '../../types/analysis';
import toString from 'lodash/toString';
import toArray from 'lodash/toArray';
import ValidatedFormGroup, { isValid } from '../../forms/components/ValidatedFormGroup';
import {
  FormInput,
  FormSelect,
  FormTextArea,
  FormText,
  FormInputSelect
} from '../../forms/components';
import type { AnalysisCollection } from '../../types/analysis';
import type { History } from '../../types/Routes';
import Loader from 'react-loader';

export type Props = {
  form: FormData,
  store: { analysis: ?AnalysisCollection, showRestrictionCancelDialog?: ?boolean },
  updateForm: Function,
  updateArrayField: Function,
  updateBooleanField: Function,
  updateStringField: Function,
  updateAnalysisTypeId: Function,
  updateAnalysisCategory: Function,
  updateExtraDescriptionAttribute: Function,
  getExtraDescriptionAttributeValue: (name: string) => ?string | ?Array<string | number>,
  extraDescriptionAttributes: Array<ExtraAttribute>,
  extraResultAttributes: ?ExtraResultAttributeValues,
  updateExtraResultAttribute: (name: string, value: string | number) => mixed,
  analysisTypeTerm: string,
  appSession: AppSession,
  objects: Array<AnalysisEvent>,
  predefined: Predefined,
  clickSave: Function,
  clickCancel: Function,
  history: History,
  loadingAnalysis: boolean,
  toggleCancelDialog?: Function,
  isFormValid: boolean,
  isRestrictionValidForCancellation: boolean
};

export default function AnalysisFormComponent(props: Props) {
  return !props.store.loadingAnalysis ? (
    <div className="container">
      <div className="page-header">
        <h1>{I18n.t('musit.analysis.analysis')}</h1>
      </div>
      <form className="form-horizontal">
        {props.form.id.value && (
          <div>
            <MetaInformation
              updatedBy={props.form.updatedByName.value}
              updatedDate={props.form.updatedDate.value}
              registeredBy={props.form.registeredByName.value}
              registeredDate={props.form.registeredDate.value}
            />
            <hr />
          </div>
        )}
        {!props.form.id.value ? (
          <FormAnalysisType
            id="type"
            label={I18n.t('musit.analysis.analysisType')}
            labelWidth={2}
            elementWidth={6}
            hasError={!isValid({ fields: [props.form.analysisTypeId] })}
            category={
              props.form.analysisTypeCategory.rawValue ? (
                props.form.analysisTypeCategory.rawValue.toString()
              ) : null
            }
            categories={props.predefined.categories}
            onChangeCategory={props.updateAnalysisCategory}
            type={
              props.form.analysisTypeId.rawValue ? (
                props.form.analysisTypeId.rawValue.toString()
              ) : null
            }
            types={props.predefined.analysisTypes}
            onChangeType={props.updateAnalysisTypeId}
            language={props.appSession.language}
          />
        ) : (
          <FormText
            id="type"
            label={I18n.t('musit.analysis.analysisType')}
            labelWidth={2}
            elementWidth={6}
            value={props.analysisTypeTerm}
          />
        )}
        {props.extraDescriptionAttributes.map((attr, i) => (
          <FormDescriptionAttribute
            id="type"
            label={I18n.t('musit.analysis.analysisAttributes.' + attr.attributeKey)}
            labelWidth={2}
            elementWidth={3}
            key={i}
            value={props.getExtraDescriptionAttributeValue(attr.attributeKey)}
            onChange={props.updateExtraDescriptionAttribute(
              attr.attributeKey,
              attr.attributeType
            )}
            attr={attr}
          />
        ))}
        <FormInputSelect
          id="reason"
          label={I18n.t('musit.analysis.reason')}
          labelWidth={2}
          elementWidth={3}
          value={props.form.reason.rawValue ? props.form.reason.rawValue.toString() : ''}
          onChange={props.updateStringField(props.form.reason.name)}
          chooseLabel={I18n.t('musit.analysis.chooseReason')}
          values={
            props.predefined.purposes ? (
              props.predefined.purposes.map(p => ({
                id: p.id,
                value: props.appSession.language.isEn ? p.enPurpose : p.noPurpose
              }))
            ) : (
              []
            )
          }
        />
        <ValidatedFormGroup fields={[props.form.status]}>
          <label className="control-label col-md-2" htmlFor="status">
            {I18n.t('musit.analysis.status')}
          </label>
          <div className="col-md-3">
            <select
              id="status"
              className="form-control"
              value={props.form.status.rawValue || ''}
              onChange={props.updateStringField(props.form.status.name)}
            >
              <option value="">{I18n.t('musit.analysis.chooseStatus')}</option>
              <option value="1">{getStatusText(1)}</option>
              <option value="2">{getStatusText(2)}</option>
              <option value="3">{getStatusText(3)}</option>
              <option value="4">{getStatusText(4)}</option>
            </select>
          </div>
        </ValidatedFormGroup>
        <FormSelect
          id="place"
          label={I18n.t('musit.analysis.place')}
          labelWidth={2}
          elementWidth={3}
          value={props.form.orgId.rawValue ? props.form.orgId.rawValue.toString() : ''}
          onChange={props.updateStringField(props.form.orgId.name)}
          chooseLabel={I18n.t('musit.analysis.choosePlace')}
          values={
            props.predefined.analysisLabList ? (
              props.predefined.analysisLabList.map(p => ({
                id: p.id,
                value: p.fullName
              }))
            ) : (
              []
            )
          }
        />
        <FormInput
          id="casenumber"
          label={I18n.t('musit.analysis.caseNumber')}
          labelWidth={2}
          elementWidth={3}
          value={
            (Array.isArray(props.form.caseNumbers.rawValue) &&
              props.form.caseNumbers.rawValue.join(', ')) ||
            ''
          }
          onChange={props.updateArrayField(props.form.caseNumbers.name)}
        />
        <hr />
        <FormTextArea
          id="note"
          label={I18n.t('musit.analysis.note')}
          labelWidth={2}
          elementWidth={6}
          value={props.form.note.rawValue ? props.form.note.rawValue.toString() : ''}
          onChange={props.updateStringField(props.form.note.name)}
          rows={5}
        />
        <div className="form-group">
          <label className="control-label">
            {I18n.t('musit.analysis.personTillAnalysis')}
          </label>
        </div>
        <PersonRoleDate
          appSession={props.appSession}
          personData={toArray(props.form.persons.value)}
          updateForm={props.updateForm}
          fieldName={props.form.persons.name}
          getDisplayNameForRole={(r: string) => I18n.t(`musit.analysis.roles.${r}`)}
          roles={['responsible', 'doneBy', 'administrator', 'completedBy']}
          showDateForRole={(roleName: string) =>
            ['completedBy', 'doneBy'].some(e => e === roleName)}
        />
        <hr />
        <div className="well">
          <div className="form-group">
            <label className="col-md-12" htmlFor="objects">
              {I18n.t('musit.analysis.objectOrSample')}
            </label>
          </div>
          <div className="form-group">
            <div className="col-md-12 col-md-offset-0">
              <ObjectResultTable
                data={props.objects}
                extraAttributes={props.extraResultAttributes}
                updateForm={props.updateForm}
                appSession={props.appSession}
                history={props.history}
              />
            </div>
          </div>
          <hr />
          <EditResult
            extraAttributes={props.extraResultAttributes}
            updateExtraResultAttribute={props.updateExtraResultAttribute}
            externalSource={toArray(props.form.externalSource.rawValue).join(',')}
            updateExternalSource={rawValue =>
              props.updateForm({
                name: props.form.externalSource.name,
                rawValue: rawValue.split(',').map(v => v.trim())
              })}
            comments={toString(props.form.comments.rawValue)}
            updateComments={rawValue =>
              props.updateForm({ name: props.form.comments.name, rawValue })}
            resultFiles={props.form.resultFiles.value}
            updateResultFiles={files =>
              props.updateForm({ name: props.form.resultFiles.name, rawValue: files })}
            appSession={props.appSession}
            history={props.history}
            parentObjectId={
              props.objects && props.objects.length === 1 ? (
                getParentObjectId(props.objects[0])
              ) : null
            }
            files={props.store.analysis ? props.store.analysis.files : []}
          />
          <div className="form-group">
            <label className="control-label col-md-2" htmlFor="isRestricted">
              {I18n.t('musit.analysis.restrictions.restrictions')}
            </label>
            <div className="col-md-10">
              {(!props.form.id.value ||
                (props.form.restriction &&
                  props.form.restriction.rawValue &&
                  JSON.stringify(props.form.restriction.rawValue) === '{}') ||
                !(
                  props.form.restriction &&
                  props.form.restriction.rawValue &&
                  (props.form.restriction.rawValue.expirationDate ||
                    props.form.restriction.rawValue.reason ||
                    (props.form.restriction.rawValue.caseNumbers &&
                    (props.form.restriction.rawValue.caseNumbers: any).length > 0
                      ? true
                      : false) ||
                    (props.form.restriction.rawValue.requester
                      ? props.form.restriction.rawValue.requester
                      : false))
                )) && (
                <div className="btn-group" data-toggle="buttons">
                  <label
                    className={`btn btn-default ${props.form.restrictions.value
                      ? 'active'
                      : ''}`}
                  >
                    <input
                      type="radio"
                      name="options"
                      onClick={props.updateBooleanField(
                        props.form.restrictions.name,
                        true
                      )}
                    />{' '}
                    {I18n.t('musit.texts.yes')}
                  </label>

                  <label
                    className={`btn btn-default ${!props.form.restrictions.value
                      ? 'active'
                      : ''}`}
                  >
                    <input
                      type="radio"
                      name="options"
                      onClick={props.updateBooleanField(
                        props.form.restrictions.name,
                        false
                      )}
                    />{' '}
                    {I18n.t('musit.texts.no')}
                  </label>
                </div>
              )}
            </div>
          </div>
          <FormRestriction
            appSession={props.appSession}
            form={props.form}
            updateForm={props.updateForm}
            clickSave={props.clickSave}
            showCancelDialog={props.store.showRestrictionCancelDialog}
            toggleCancelDialog={props.toggleCancelDialog}
            isRestrictionValidForCancellation={props.isRestrictionValidForCancellation}
          />
        </div>
        <hr />
        {console.log('props.form.restriction ', props.form.restriction)}
        <button
          className="btn btn-primary"
          disabled={
            !props.isFormValid ||
            !props.appSession.rolesForModules.collectionManagementWrite ||
            (props.form.restrictions.value &&
              !(
                props.form.restrictions.value &&
                props.form.restriction &&
                props.form.restriction.rawValue &&
                props.form.restriction.rawValue.expirationDate &&
                props.form.restriction.rawValue.reason &&
                (props.form.restriction.rawValue.requester
                  ? props.form.restriction.rawValue.requester
                  : false)
              ))
          }
          onClick={props.clickSave}
        >
          {I18n.t('musit.texts.save')}
        </button>{' '}
        <button className="btn btn-default" onClick={props.clickCancel}>
          {I18n.t('musit.texts.cancel')}
        </button>
      </form>
    </div>
  ) : (
    <Loader loaded={false} />
  );
}

function FormRestriction(props) {
  const hasRestriction = props.form.restrictions.value;
  const restrictionObj: ?Restriction = props.form.restriction.value;
  if (!restrictionObj) {
    return null;
  }
  const isRegistered = restrictionObj.registeredStamp;
  const isEmptyOrInProgress = !restrictionObj.registeredStamp;
  const restrictionProps = {
    appSession: props.appSession,
    restriction: restrictionObj,
    updateRestriction: restriction => {
      console.log('FormRestriction > restriction', restriction);
      return props.updateForm({
        name: props.form.restriction.name,
        rawValue: restriction
      });
    }
  };
  return hasRestriction && isEmptyOrInProgress ? (
    <AddRestriction {...restrictionProps} />
  ) : isRegistered ? (
    <ViewRestriction
      {...restrictionProps}
      showCancelDialog={props.showCancelDialog}
      toggleCancelDialog={props.toggleCancelDialog}
      cancelRestriction={() => {
        props.clickSave({ preventDefault: () => null });
      }}
      isRestrictionValidForCancellation={props.isRestrictionValidForCancellation}
    />
  ) : null;
}
