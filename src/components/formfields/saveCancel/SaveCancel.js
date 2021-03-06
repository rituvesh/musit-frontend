import React, { PropTypes } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { I18n } from 'react-i18nify';

const SaveCancel = props => (
  <Row>
    <Col
      xs={6}
      sm={5}
      md={2}
      mdOffset={3}
      style={{ border: 'none', textAlign: 'center' }}
    >
      <Button
        id={`Save_${props.id || 1}`}
        onClick={props.onClickSave}
        className="submitButton"
        bsStyle="primary"
        disabled={props.saveDisabled}
      >
        {props.saveLabel || I18n.t('musit.texts.save')}
      </Button>
    </Col>
    <Col xs={6} sm={5} md={2} style={{ border: 'none', textAlign: 'center' }}>
      <Button
        id={`Cancel_${props.id || 1}`}
        onClick={props.onClickCancel}
        className="cancelButton"
        bsStyle="link"
        disabled={props.cancelDisabled}
      >
        {props.cancelLabel || I18n.t('musit.texts.cancel')}
      </Button>
    </Col>
  </Row>
);

SaveCancel.propTypes = {
  id: PropTypes.string,
  saveLabel: PropTypes.string,
  saveDisabled: PropTypes.bool,
  onClickSave: PropTypes.func,
  cancelLabel: PropTypes.string,
  cancelDisabled: PropTypes.bool,
  onClickCancel: PropTypes.func
};

SaveCancel.displayName = 'SaveCancel';

export default SaveCancel;
