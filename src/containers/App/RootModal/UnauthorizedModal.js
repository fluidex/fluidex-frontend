import { trans } from "@/i18n";
import { UNAUTHORIZED_STATES } from "@/models/user";
import { select } from "@/old_store";
import { Modal } from "antd";
import React from "react";
import { connect } from "react-redux";

const i18n = (lang, ...args) => trans("UNAUTHORIZED_MODAL", lang, ...args);

const UnauthorizedModal = ({
  lang,
  unauthorizedState,
  onClose,
  ...restProps
}) => {
  if (!Object.values(UNAUTHORIZED_STATES).includes(unauthorizedState)) {
    throw new Error(
      `The given unauthorized state is not recognised: ${unauthorizedState}`
    );
  }

  const stateToPrefixMap = {
    [UNAUTHORIZED_STATES.NOT_CONNECTED]: "NOT_CONNECTED",
  };
  const i18nEntryPrefix = stateToPrefixMap[unauthorizedState];

  return (
    <Modal
      {...restProps}
      visible
      title={i18n(lang, `${i18nEntryPrefix}_TITLE`)}
      onCancel={onClose}
      footer={null}
    >
      <span>{i18n(lang, `${i18nEntryPrefix}_CONTENT`)}</span>
    </Modal>
  );
};

const selection = select((models) => {
  return {
    unauthorizedState: models.user.unauthorizedState,
  };
});

const mapStateToProps = (state) => ({
  lang: state.lang,
  ...selection(state),
});

export default connect(mapStateToProps)(UnauthorizedModal);
