import { Footer as CommonFooter } from "fluidex-common/lib/components";
import React from "react";
import { connect } from "react-redux";

function Footer(props) {
  return (
    <div style={{ marginTop: 10 }}>
      <CommonFooter lang={props.lang} />
    </div>
  );
}

const mapState = (state) => ({
  lang: state.lang,
});

export default connect(mapState)(Footer);
