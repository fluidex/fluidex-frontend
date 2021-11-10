import { select } from "@/old_store";
import { Header as CommonHeader } from "fluidex-common/lib/components";
import cookie from "js-cookie";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

function Header(props) {
  const {
    lang,
    user,
    hasMetaMask,
    checkAuthorizationAndMaybeShowModal,
    location,
  } = props;

  function setLang(lang) {
    cookie.set("lang", lang);
    props.setLang(lang);
  }

  return (
    <div>
      <CommonHeader
        lang={lang}
        user={user || {}}
        pathname={location.pathname}
        checkAuthorizationAndMaybeShowModal={
          checkAuthorizationAndMaybeShowModal
        }
        hasMetaMask={hasMetaMask}
        onLanChange={setLang}
        onConnect={props.tryConnectingToMetaMask}
      />
    </div>
  );
}

const selection = select((models) => {
  return {
    user: models.user.fullDetails,
  };
});

const mapStateToProps = (state) => ({
  lang: state.lang,
  hasMetaMask: state.ethereum.hasMetaMask,
  ...selection(state),
});

const mapDispatchToProps = (dispatch) => ({
  setLang: dispatch.lang.setLang,
  tryConnectingToMetaMask: dispatch.ethereum.tryConnectingToMetaMask,
  checkAuthorizationAndMaybeShowModal:
    dispatch.user.checkAuthorizationAndMaybeShowModal,
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
// export default withRouter(connect(({mapStateToProps, mapDispatchToProps})=>({mapStateToProps, mapDispatchToProps}))(Header));
