import './LoginComponent.css';
import React from 'react';
import { Grid, Row } from 'react-bootstrap';
import { I18n } from 'react-i18nify';
import NorwegianTranslation from './LoginComponent_no.html.jsx';
import EnglishTranslation from './LoginComponent_en.html.jsx';
import Logos from '../../components/logos/Logos';
import LoginButton from './loginButton';
import TermsAndConditions from './TermsAndConditions';

export default class WelcomeContainer extends React.Component {
  static propTypes = {
    user: React.PropTypes.object,
    setUser: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { showModal: false };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  showModal(e) {
    e.preventDefault();
    this.setState({ showModal: true });
  }

  hideModal(e) {
    e.preventDefault();
    this.setState({ showModal: false });
  }

  render() {
    const Translated = I18n._locale === 'no' ? NorwegianTranslation : EnglishTranslation;
    return (
      <div>
        <main>
          <Grid>
            <Row className="row-centered">
              <div className="welcomePanel">
                <div>
                  {!this.props.user &&
                  <LoginButton setUser={this.props.setUser}>
                    <span className="buttonText">
                      {I18n.t('musit.login')}
                    </span>
                  </LoginButton>
                  }
                  <div className="title">
                    <Translated {...this.props} showModal={this.showModal} />
                  </div>
                  <Logos style={{ marginTop: 100 }}/>
                </div>
              </div>
            </Row>
          </Grid>
        </main>
        <TermsAndConditions isVisible={this.state.showModal} hideModal={this.hideModal} />
      </div>
    );
  }
}