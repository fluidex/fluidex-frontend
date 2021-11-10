import axios from "axios";
import { dispose, init } from "klinecharts";
import React, { PureComponent } from "react";
import api from "../../../apis";
import styles from "./chart.module.scss";
import resolutions from "./resolutions";
const CancelToken = axios.CancelToken;

function chartOptions(lang) {
  return {
    grid: {
      horizontal: {
        color: "#393939",
      },
      vertical: {
        color: "#393939",
      },
    },
    candle: {
      bar: {
        upColor: "#2eb77a",
        downColor: "#ed275d",
        noChangeColor: "#2eb77a",
      },
      priceMark: {
        high: {
          color: "#D9D9D9",
        },
        low: {
          color: "#c8c9da",
        },
        last: {
          upColor: "#2eb77a",
          downColor: "#ed275d",
          noChangeColor: "#2eb77a",
        },
      },
      tooltip: {
        labels:
          lang === "zh"
            ? ["时间: ", "开: ", "收: ", "高: ", "低: ", "成交量: "]
            : ["T: ", "O: ", "C: ", "H: ", "L: ", "V: "],
        text: {
          color: "#c8c9da",
        },
      },
    },
    technicalIndicator: {
      bar: {
        upColor: "#2eb77a",
        downColor: "#ed275d",
        noChangeColor: "#2eb77a",
      },
      line: {
        size: 1,
        colors: ["#FF9600", "#9D65C9", "#2196F3", "#E11D74", "#01C5C4"],
      },
      circle: {
        upColor: "#2eb77a",
        downColor: "#ed275d",
        noChangeColor: "#2eb77a",
      },
      tooltip: {
        text: {
          color: "#c8c9da",
        },
      },
    },
    xAxis: {
      axisLine: {
        color: "rgba(200, 201, 218, 0.3)",
      },
      tickText: {
        color: "#c8c9da",
      },
      tickLine: {
        color: "rgba(200, 201, 218, 0.3)",
      },
    },
    yAxis: {
      axisLine: {
        color: "rgba(200, 201, 218, 0.3)",
      },
      tickText: {
        color: "#D9D9D9",
      },
      tickLine: {
        color: "rgba(200, 201, 218, 0.3)",
      },
    },
    separator: {
      color: "rgba(200, 201, 218, 0.3)",
      activeBackgroundColor: "rgba(33, 150, 243, 0.08)",
    },
    crosshair: {
      horizontal: {
        line: {
          color: "#888888",
        },
        text: {
          color: "#c8c9da",
          borderColor: "#505050",
          backgroundColor: "#505050",
        },
      },
      vertical: {
        line: {
          color: "#888888",
        },
        text: {
          color: "#c8c9da",
          borderColor: "#505050",
          backgroundColor: "#505050",
        },
      },
    },
  };
}

const POLLING_INTERVAL = 3000;

export default class SimpleChart extends PureComponent {
  state = {
    resolution: {
      slug: "15min",
      resolution: "15",
    },
  };

  /**
   * 调整图表尺寸
   */
  chartResize = () => {
    this.chart && this.chart.resize();
  };

  /**
   * 图表数据请求
   * @param {*} param0
   * @param {*} cancelToken
   * @param {*} success
   * @param {*} error
   */
  chartDataRequest({ from, to }, cancelToken, success, error) {
    const coinPairId = (this.props.coinPair || {}).id;
    const resolution = this.state.resolution.resolution;
    const url = `/api/exchange/panel/tradingview/history?symbol=${coinPairId}&resolution=${resolution}&from=${from}&to=${to}`;
    api
      .get(url, { cancelToken })
      .then((response) => {
        const result = response.data;
        let kLineDataList = [];
        if (result && result.s === "ok") {
          const opens = result.o || [];
          const closes = result.c || [];
          const lows = result.l || [];
          const highs = result.h || [];
          const volumes = result.v || [];
          kLineDataList = (result.t || []).map((timestamp, index) => ({
            timestamp: timestamp * 1000,
            open: opens[index],
            close: closes[index],
            high: highs[index],
            low: lows[index],
            volume: volumes[index],
          }));
        }
        success(kLineDataList);
      })
      .catch((err) => {
        error && error(err);
      });
  }

  /**
   * 获取最新的一条k线数据
   */
  getLastChartData() {
    const { coinPair } = this.props;
    if (coinPair && this.chart) {
      this.cancelLastDataRequest("poll");
      const resolution = this.state.resolution.resolution;
      const timestamp = Math.floor(Date.now() / 1000);
      const from = timestamp - (timestamp % (+resolution * 60));
      const to = from + +resolution * 60;
      this.chartDataRequest(
        { from, to },
        new CancelToken((cancel) => {
          this.lastChartDataCancelToken = cancel;
        }),
        (kLineDataList) => {
          if (kLineDataList.length > 0) {
            this.chart.updateData(kLineDataList[0]);
          }
          this.pollLastChartDataTimer = setTimeout(() => {
            this.getLastChartData();
          }, POLLING_INTERVAL);
        },
        (_) => {
          this.pollLastChartDataTimer = setTimeout(() => {
            this.getLastChartData();
          }, POLLING_INTERVAL);
        }
      );
    }
  }

  /**
   * 加载历史数据(包含第一次加载和加载更多)
   * @param {是否是第一次加载} firstLoad
   * @param {结束时间} to
   */
  getHistoryChartData(firstLoad, to) {
    const { coinPair } = this.props;
    if (coinPair && this.chart) {
      this.cancelHistoryDataRequest("change id or resolution");
      const resolution = this.state.resolution.resolution;
      if (firstLoad) {
        this.cancelLastDataRequest("change id or resolution");
        to = Math.floor(Date.now() / 1000);
      } else {
        to -= 60 * +resolution;
      }
      // 一次请求500条数据
      const from = to - 60 * 500 * +resolution;
      this.chartDataRequest(
        { from, to },
        new CancelToken((cancel) => {
          this.historyChartDataCancelToken = cancel;
        }),
        (kLineDataList) => {
          const more = kLineDataList.length === 500;
          if (firstLoad) {
            this.chart.applyNewData(kLineDataList, more);
          } else {
            this.chart.applyMoreData(kLineDataList, more);
          }
          this.getLastChartData();
        },
        (_) => {
          if (firstLoad) {
            this.chart.applyNewData([], false);
          } else {
            this.chart.applyMoreData([], false);
          }
        }
      );
    }
  }

  /**
   * 设置图表精度
   */
  setChartPrecision() {
    if (this.chart) {
      const { coinPair, pairs = [] } = this.props;
      const pair = pairs.find((item) => item.name === coinPair.id) || {};
      const pricePrecision = pair.price_precision;
      const volumePrecision = pair.amount_precision;
      this.chart.setPriceVolumePrecision(
        pricePrecision || pricePrecision === 0 ? pricePrecision : 2,
        volumePrecision || volumePrecision === 0 ? volumePrecision : 4
      );
    }
  }

  /**
   * 取消历史数据请求
   * @param {取消原因} reason
   */
  cancelHistoryDataRequest(reason) {
    if (this.historyChartDataCancelToken) {
      this.historyChartDataCancelToken(reason);
      this.historyChartDataCancelToken = null;
    }
  }

  /**
   * 取消最新数据请求
   * @param {取消原因} reason
   */
  cancelLastDataRequest(reason) {
    clearTimeout(this.pollLastChartDataTimer);
    if (this.lastChartDataCancelToken) {
      this.lastChartDataCancelToken(reason);
      this.lastChartDataCancelToken = null;
    }
  }

  componentDidMount() {
    const { lang } = this.props;
    window.addEventListener("resize", this.chartResize);
    this.chart = init("simple_chart_container", chartOptions(lang));
    this.chart.loadMore((timestamp) => {
      this.getHistoryChartData(false, timestamp);
    });
    this.setChartPrecision();
    this.chart.createTechnicalIndicator("MA", false, { id: "candle_pane" });
    this.chart.createTechnicalIndicator("VOL", false, { height: 110 });
    this.getHistoryChartData(true);
  }

  componentDidUpdate(prevProps, prevState) {
    const { lang, coinPair } = this.props;
    const { resolution } = this.state;
    if (this.chart) {
      if (prevProps.lang !== lang) {
        this.chart.setStyleOptions(chartOptions(lang));
      }
      const compareCoinPairId =
        (prevProps.coinPair || {}).id !== (coinPair || {}).id;
      if (compareCoinPairId || prevState.resolution.slug !== resolution.slug) {
        if (compareCoinPairId) {
          this.setChartPrecision();
        }
        this.getHistoryChartData(true);
      }
    }
  }

  componentWillUnmount() {
    this.cancelHistoryDataRequest("page exit");
    this.cancelLastDataRequest("page exit");
    window.removeEventListener("resize", this.chartResize);
    dispose("simple_chart_container");
  }

  changeResolution = (slug, resolution) => () => {
    if (this.state.resolution.slug !== slug) {
      this.setState({
        resolution: {
          slug,
          resolution,
        },
      });
    }
  };

  render() {
    return (
      <div className={styles.wrap}>
        <ul className={styles.resolutionContainer}>
          {resolutions.map(({ slug, resolution }) => (
            <li key={slug}>
              <button
                className={
                  slug === this.state.resolution.slug ? styles.selected : ""
                }
                onClick={this.changeResolution(slug, resolution)}
              >
                {slug}
              </button>
            </li>
          ))}
        </ul>
        <div id="simple_chart_container" className={styles.chartContent}></div>
      </div>
    );
  }
}
