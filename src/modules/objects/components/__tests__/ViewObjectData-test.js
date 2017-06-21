import { shallow } from 'enzyme';
import React from 'react';
import ViewObjectData from '../ViewObjectData';

describe('ViewObjectData', () => {
  it('should display nathist-component if collection=5 (one of nathist)', () => {
    const wrapper = shallow(
      <ViewObjectData
        objectData={{
          uuid: '22233-4443-222-333',
          museumNo: 'O-L-3444',
          objectType: 'Collection',
          collection: 5,
          currentLocation: { pathNames: [] }
        }}
      />
    );
    expect(wrapper.find('div.Nathist').length).toBe(1);
  });
});
