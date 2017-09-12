// @flow
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import AnalysisViewComponent from '../AnalysisViewComponent';
import { fieldsArray } from '../analysisForm';
import type { Field } from 'forms/form';
import type { FormData } from '../shared/formType';
import {
  appSession,
  analysis,
  history,
  createAnalysisEventWithObject
} from '../../../testutils/sampleDataForTest';
import { initialState } from '../../../stores/predefined';

const objectsData = [
  createAnalysisEventWithObject(
    1,
    '1cbf15cb-8348-4e66-99a4-bc314da57a42',
    '123',
    '12345678911',
    'Spyd'
  ),
  createAnalysisEventWithObject(
    2,
    '1cbf15cb-8348-4e66-99a4-bc314da57a42',
    '124',
    '12345678912',
    'Beltering'
  ),
  createAnalysisEventWithObject(
    3,
    '1cbf15cb-8348-4e66-99a4-bc314da57a42',
    '125',
    '12345678913',
    'Øsekar'
  )
];

const form: FormData = (fieldsArray.reduce(
  (acc, field: Field<any>) => ({
    ...acc,
    [field.name]: {
      ...field,
      rawValue: field.mapper.toRaw(field.defaultValue)
    }
  }),
  {}
): any);

form.persons.value = [
  {
    name: 'jarl',
    role: 'responsible'
  },
  {
    name: 'line',
    role: 'creator',
    date: '2017-06-29T07:54:22+00:00'
  }
];

form.restrictions.value = true;
form.restriction.value = {
  requester: '3cbf15cb-8348-4e66-99a4-bc314da57444',
  requesterName: 'Jarl',
  reason: 'fin årsak',
  caseNumbers: ['dddd', '44555', '55555'],
  expirationDate: '2017-03-29T07:54:22+00:00',
  cancelledReason: 'meh'
};

const extraAttributes = [
  {
    attributeKey: 'method',
    attributeType: 'Int',
    attributeValue: 'moro metode'
  }
];

const nullFn = () => null;
const emptyMatch = { params: { analysisId: '23' } };

describe('AnalysisViewComponent', () => {
  it('should render properly', () => {
    const wrapper = shallow(
      <AnalysisViewComponent
        clearForm={nullFn}
        loadForm={nullFn}
        getAnalysis={nullFn}
        updateAnalysis={nullFn}
        clearStore={nullFn}
        predefined={initialState}
        match={emptyMatch}
        form={form}
        store={{ analysis, showCancelDialog: false }}
        extraDescriptionAttributes={extraAttributes}
        extraResultAttributes={{}}
        statusText="Fin status"
        labPlaceText="Fin lab"
        analysisTypeTerm="kul analysetype"
        analysisPurpose="fin purpose"
        objects={objectsData}
        clickEdit={() => {}}
        clickCancel={() => {}}
        appSession={appSession}
        history={history}
        hasRestrictions={true}
        updateRestriction={nullFn}
        loadingAnalysis={false}
        cancelRestriction={nullFn}
        toggleCancelDialog={nullFn}
        isRestrictionValidForCancellation={false}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});

const extraAttributeTypes = [
  {
    attributeKey: 'types',
    attributeType: 'Array[Int]',
    allowedValues: [
      { id: 1, enLabel: 'Lead 210 Pb', noLabel: 'Bly 210 Pb' },
      { id: 2, enLabel: 'Strontium 87Sr/86Sr', noLabel: 'Strontium 87Sr/86Sr' },
      {
        id: 3,
        enLabel: 'Strontium/Neodymium (Sr/Nd)',
        noLabel: 'Strontium/Neodymium (Sr/Nd)'
      },
      { id: 4, enLabel: 'Carbon 13C/12C', noLabel: 'Karbon 13C/12C' },
      { id: 5, enLabel: 'Nitrogen 15N/14N', noLabel: 'Nitrogen 15N/14N' },
      { id: 6, enLabel: 'Oxygen O18/O16', noLabel: 'Oksygen O18/O16' },
      { id: 7, enLabel: 'Sulphur 34S/32S', noLabel: 'Svovel 34S/32S' },
      { id: 8, enLabel: 'Hydrogen 2H/1H', noLabel: 'Hydrogen 2H/1H' }
    ],
    attributeValue: [1, 2, 3, 4, 5, 6]
  }
];

describe('AnalysisViewComponent with extra attribute types', () => {
  it('should render Analysis view component', () => {
    const wrapper = shallow(
      <AnalysisViewComponent
        clearForm={nullFn}
        loadForm={nullFn}
        getAnalysis={nullFn}
        updateAnalysis={nullFn}
        clearStore={nullFn}
        predefined={initialState}
        match={emptyMatch}
        form={form}
        store={{ analysis, showCancelDialog: false }}
        extraDescriptionAttributes={extraAttributeTypes}
        extraResultAttributes={{}}
        statusText="Fin status"
        labPlaceText="Fin lab"
        analysisTypeTerm="Isotope analysis"
        analysisPurpose="fin purpose"
        objects={objectsData}
        clickEdit={() => {}}
        clickCancel={() => {}}
        appSession={appSession}
        history={history}
        hasRestrictions={true}
        updateRestriction={() => null}
        loadingAnalysis={false}
        cancelRestriction={() => null}
        toggleCancelDialog={() => null}
        isRestrictionValidForCancellation={false}
      />
    );

    expect(
      wrapper.find('#avc--extraDescriptionAttributesTypes > li').getNodes()[0].props
        .children.props.en
    ).toBe('Lead 210 Pb');
    wrapper
      .find('#avc--extraDescriptionAttributesTypes > li')
      .getNodes()
      .map((list, i) => {
        expect(list.props.children.props.en).toBe(
          extraAttributeTypes[0].allowedValues[i].enLabel
        );
      });
  });
});
