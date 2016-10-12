import { assert, React, ReactTestUtils } from '../../../../../test/setup';
import ControlView from '../ControlView';

describe('ControlView', () => {
  let temperatureButton;
  let relativeHumidityButton;

  const setup = () => {
    const myDiv = ReactTestUtils.renderIntoDocument(
      <ControlView
        id="1"
        translate={(key) => key}
        controlsJson={[
          {
            eventType: 'ControlTemperature',
            ok: true
          },
          {
            eventType: 'ControlRelativeHumidity',
            ok: true
          }
        ]}
      />
    );
    const inputComponent = ReactTestUtils.scryRenderedDOMComponentsWithTag(myDiv, 'button');
    temperatureButton = inputComponent[0];
    relativeHumidityButton = inputComponent[1];
  };

  it('Check the temperature component is created by checking down button id', () => {
    setup()
    assert(temperatureButton.getAttribute('id') === '1_ControlTemperature_downButton')
  })
  it('Check the relativeHumidity component is created by checking down button id', () => {
    setup()
    assert(relativeHumidityButton.getAttribute('id') === '1_ControlRelativeHumidity_downButton')
  })
})