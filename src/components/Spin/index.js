import cn from "classnames";
import debounce from "lodash/debounce";
import omit from "lodash/omit";
import * as React from "react";
import styles from "./loading.module.scss";

function renderIndicator(props) {
  const { indicator } = props;
  const dotClassName = styles.dot;
  if (React.isValidElement(indicator)) {
    return React.cloneElement(indicator, {
      className: cn(indicator.props.className, dotClassName),
    });
  }

  return (
    <section className={cn(dotClassName, styles["ldr"])}>
      <div className={styles["ldr-blk"]}></div>
      <div className={cn(styles["ldr-blk"], styles["an_delay"])}></div>
      <div className={cn(styles["ldr-blk"], styles["an_delay"])}></div>
      <div className={styles["ldr-blk"]}></div>
    </section>
  );
}

function shouldDelay(loading, delay) {
  return !!loading && !!delay && !isNaN(Number(delay));
}

export default class Spin extends React.Component {
  static defaultProps = {
    loading: true,
    wrapperClassName: "",
    hasOverlay: true,
  };

  constructor(props) {
    super(props);

    const { loading, delay } = props;
    const shouldBeDelayed = shouldDelay(loading, delay);
    this.state = {
      loading: loading && !shouldBeDelayed,
    };
    this.originalUpdateSpinning = this.updateSpinning;
    this.debouncifyUpdateSpinning(props);
  }

  isNestedPattern() {
    return !!(this.props && this.props.children);
  }

  componentWillUnmount() {
    this.cancelExistingSpin();
  }

  cancelExistingSpin() {
    const updateSpinning = this.updateSpinning;
    if (updateSpinning && updateSpinning.cancel) {
      updateSpinning.cancel();
    }
  }

  componentDidMount() {
    this.updateSpinning();
  }

  componentDidUpdate() {
    this.debouncifyUpdateSpinning();
    this.updateSpinning();
  }

  debouncifyUpdateSpinning = (props) => {
    const { delay } = props || this.props;
    if (delay) {
      this.cancelExistingSpin();
      this.updateSpinning = debounce(this.originalUpdateSpinning, delay);
    }
  };

  updateSpinning = () => {
    const { loading } = this.props;
    const { loading: currentSpinning } = this.state;
    if (currentSpinning !== loading) {
      this.setState({ loading });
    }
  };

  render() {
    const {
      className,
      tip,
      wrapperClassName,
      style,
      hasOverlay,
      ...restProps
    } = this.props;
    const { loading } = this.state;
    const spinClassName = cn(
      styles["spin"],
      {
        [styles["running"]]: loading,
        [styles["show-tips"]]: !!tip,
      },
      className
    );

    // fix https://fb.me/react-unknown-prop
    const divProps = omit(restProps, ["loading", "delay", "indicator"]);
    const spinElement = (
      <div {...divProps} style={style} className={spinClassName}>
        {renderIndicator(this.props)}
        {tip && <div className={styles["tips"]}>{tip}</div>}
      </div>
    );

    if (this.isNestedPattern()) {
      const containerClassName = cn(
        styles["container"],
        {
          [styles["blur"]]: loading,
        },
        hasOverlay && styles.hasOverlay
      );

      return (
        <div {...divProps} className={cn(styles["nested"], wrapperClassName)}>
          {loading && <div key="loading">{spinElement}</div>}
          <div className={containerClassName}>{this.props.children}</div>
        </div>
      );
    }

    return spinElement;
  }
}
