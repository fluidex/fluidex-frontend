import React, { PureComponent } from "react";
import styles from "./chart.module.scss";
import resolutions from "./resolutions";

// 1min 5min 15min 30min 1hour 4hour 1day 5day 1week 1mon
let scriptHasBeenLoaded = false;

class ProfessionalChart extends PureComponent {
  state = {
    curResolution: "15",
    loading: false,
  };

  initTradingView = () => {
    // const udf_datafeed = new Datafeeds.UDFCompatibleDatafeed(window.API_PREFIX + "tradingview");
    const udf_datafeed = new Datafeeds.UDFCompatibleDatafeed(
      "/api/exchange/panel/tradingview"
    );
    this.widget = window.tvWidget = new TradingView.widget({
      symbol: this.props.coinPair.id,
      timezone: "Asia/Hong_Kong",
      autosize: true,
      period: "1w",
      // hideideas: false,
      interval: this.state.curResolution,
      theme: "Dark",
      style: "1",
      toolbar_bg: "#292d35",
      loading_screen: { backgroundColor: "#292d35" },
      container_id: "tv_chart_container",
      hide_side_toolbar: true,
      datafeed: udf_datafeed,
      library_path: process.env.PUBLIC_URL + "/tradingView/charting_library/",
      locale: this.props.lang || "en",
      //	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
      drawings_access: {
        type: "black",
        tools: [
          {
            name: "Regression Trend",
          },
        ],
      },
      // huobi config
      disabled_features: [
        "symbol_search_hot_key",
        "compare_symbol",
        "display_market_status",
        "go_to_date",
        "header_compare",
        "header_interval_dialog_button",
        "header_indicators",
        "header_chart_type",
        "header_resolutions",
        "header_screenshot",
        "header_symbol_search",
        "header_undo_redo",
        "legend_context_menu",
        "show_hide_button_in_legend",
        "show_interval_dialog_on_key_press",
        "snapshot_trading_drawings",
        "symbol_info",
        "timeframes_toolbar",
        "use_localstorage_for_settings",
        "save_chart_properties_to_local_storage",
        "volume_force_overlay",
        "header_widget_dom_node",
        "timezone_menu",
      ],
      enabled_features: [
        "dont_show_boolean_study_arguments",
        "hide_last_na_study_output",
        "move_logo_to_main_pane",
        "same_data_requery",
        "side_toolbar_in_fullscreen_mode",
        "keep_left_toolbar_visible_on_small_screens",
        "disable_resolution_rebuild",
      ],
      custom_css_url: process.env.PUBLIC_URL + "/chart_override.css",
      overrides: {
        "mainSeriesProperties.style": 1,
        "paneProperties.background": "#292d35",
        "paneProperties.vertGridProperties.color": "#101218",
        "paneProperties.horzGridProperties.color": "rgba(255,255,255,0.1)",
        "symbolWatermarkProperties.transparency": 90,
        "scalesProperties.textColor": "#AAA",
        volumePaneSize: "tiny",
        "paneProperties.legendProperties.showLegend": false,
      },
      debug: false,
    });
    const colors = ["#965fc4", "#84aad5", "#55b263", "#b7248a"];
    this.widget.onChartReady(() => {
      [5, 10, 30, 60].map((item, idx) =>
        this.widget
          .chart()
          .createStudy("Moving Average", false, false, [item], null, {
            precision: 2,
            "plot.color.0": colors[idx],
            "Plot.linewidth": 1,
          })
      );
      // this.widget.chart().createStudy("Moving Average Exponential", false, false, [5], null, {
      //   "plot.color": "#989898",
      //   "plot.linewidth": 1
      // });
      // const areaBtn = this.widget.createButton()
      // areaBtn.on('click', event => {
      //     const $target = event.currentTarget
      //     const chart = this.widget.activeChart()
      //     chart.setChartType(chart.chartType() === 3 ? 1: 3)

      //     if (chart.chartType() === 3) {
      //       $target.classList.add('selected')
      //     } else {
      //       $target.classList.remove('selected')
      //     }
      //   }).append(`<span>Time</span>`)
      // this.widget.chart().createStudy("MA Cross", false, false, [5, 10, 30, 60])
      resolutions.forEach((item, idx) => {
        const chart = this.widget.activeChart();
        const button = this.widget.createButton();
        this.buttons = this.buttons || [];
        this.buttons[idx] = button;
        button[0].classList.add("resolution-btn");
        button
          .on("click", (event) => {
            const $target = event.currentTarget;
            const $siblings =
              $target.parentNode.parentNode.parentNode.querySelectorAll(
                ".selected.resolution-btn"
              );
            $siblings.forEach((el) => {
              el.classList.remove("selected");
            });
            $target.classList.add("selected");

            chart.setResolution(item.resolution);
          })
          .append(`<span>${item.slug}</span>`);

        if (chart.resolution() === item.resolution) {
          button[0].classList.add("selected");
        }
      });
    });
  };

  loadScript = () => {
    if (scriptHasBeenLoaded) {
      return Promise.resolve();
    }

    const scripts = [
      "/tradingView/charting_library/charting_library.min.js",
      "/tradingView/datafeeds/udf/dist/polyfills.js",
      "/tradingView/datafeeds/udf/dist/bundle.js",
    ];

    function load(url) {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = process.env.PUBLIC_URL + url;
        script.onerror = reject;
        script.onload = resolve;
        document.head.appendChild(script);
      });
    }

    return Promise.all(scripts.map((url) => load(url))).then(() => {
      scriptHasBeenLoaded = true;
    });
  };

  componentDidMount() {
    this.loadScript().then(this.initTradingView);
  }

  componentWillUnmount() {
    this.widget && this.widget._ready && this.widget.remove();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.coinPair.id !== this.props.coinPair.id) {
      if (this.widget && this.widget._ready && this.widget.setSymbol) {
        this.widget.setSymbol(this.props.coinPair.id, 60);

        // hack
        const iframe = document.querySelector(
          "#tv_chart_container iframe"
        ).contentWindow;
        const buttons = iframe.document.querySelectorAll(".resolution-btn");
        const defActiveBtn = buttons[4];

        buttons.forEach((item) => {
          item.classList.remove("selected");
        });

        defActiveBtn.classList.add("selected");
        // hack end
      }
    }
  }

  render() {
    return <div className={styles.wrap} id="tv_chart_container"></div>;
  }
}

export default ProfessionalChart;
