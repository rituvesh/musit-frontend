// @flow
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import AnalysisInputFormComponent from '../AnalysisInputFormComponent';

describe('AnalysisInputFormComponent', () => {
  it('should trigger events on input change', () => {
    const onChangeQueryParam = sinon.spy();
    const onSearch = sinon.spy();
    const Comp = shallow(
      <AnalysisInputFormComponent
        onChangeQueryParam={onChangeQueryParam}
        onSearch={onSearch}
      />
    );

    Comp.find('input').simulate('change', { target: { value: 'foo' } });

    expect(onChangeQueryParam.callCount).toEqual(1);
    expect(onSearch.callCount).toEqual(0);
    expect(onChangeQueryParam.getCall(0).args).toEqual(['q', 'foo']);
  });

  it('should trigger events on click search', () => {
    const onChangeQueryParam = sinon.spy();
    const onSearch = sinon.spy();
    const preventDefault = sinon.spy();

    const Comp = shallow(
      <AnalysisInputFormComponent
        onChangeQueryParam={onChangeQueryParam}
        onSearch={onSearch}
      />
    );

    Comp.find('button').simulate('click', { preventDefault });

    expect(onChangeQueryParam.callCount).toEqual(0);
    expect(preventDefault.callCount).toEqual(1);
    expect(onSearch.callCount).toEqual(1);
  });
});
