import React from "react";
import ProfessionalChart from "./ProfessionalChart";
import SimpleChart from "./SimpleChart";

const Chart =
  process.env.CHART === "PROFESSIONAL" ? ProfessionalChart : SimpleChart;

const chart = ({ pairs, coinPair, lang }) => {
  return <Chart pairs={pairs} coinPair={coinPair} lang={lang} />;
};

export default chart;
