import React from "react";
import { connect } from "react-redux";
import TestModal from "./TestModal";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import UnauthModal from "./UnAuthModal";

const modalLookup = {
  TestModal,
  LoginModal,
  RegisterModal,
  UnauthModal
};

const ModalManager = props => {
  const { currentModal } = props;
  let renderedModal;

  if (currentModal) {
    const { modalType, modalProps } = currentModal; //from reudcer
    const ModalComponent = modalLookup[modalType]; //render from component

    renderedModal = <ModalComponent {...modalProps} />;
  }
  return <span>{renderedModal}</span>;
};

const mapStateToProps = state => ({
  currentModal: state.modals //props for this component
});

export default connect(mapStateToProps)(ModalManager);
