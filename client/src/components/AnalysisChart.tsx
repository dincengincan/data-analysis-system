import { useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  Box,
  Card,
  Chip,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

type AnalysisChartProps = {
  analysisData: AnalysisData[];
  geneName: string;
};

type AnalysisData = {
  expressionType: string;
  expressionValue: number;
  outlier: boolean;
  min: number;
  max: number;
  top: number;
};

export const AnalysisChart = ({
  analysisData: data,
  geneName,
}: AnalysisChartProps) => {
  const chartRef = useRef(null);

  const outliers = data?.filter((d) => d.outlier);

  useEffect(() => {
    if (!data) return;

    const margin = { top: 20, right: 50, bottom: 100, left: 100 };
    const width = 1000 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    // Remove existing svg elements
    d3.select(chartRef.current).selectAll("svg").remove();

    // Create a new svg element
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.expressionType))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.top ?? 0) as number])
      .range([height, 0]);

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-45)")
      .attr("font-size", "15px");

    // Add y-axis
    svg.append("g").call(d3.axisLeft(y)).attr("font-size", "15px");

    // Add horizontal line for min value
    svg
      .append("line")
      .attr("x1", 0)
      .attr("y1", y(d3.min(data, (d) => d.min) as number))
      .attr("x2", width)
      .attr("y2", y(d3.min(data, (d) => d.min) as number))
      .attr("stroke", "orange")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "10");

    // Add horizontal line for max value
    svg
      .append("line")
      .attr("x1", 0)
      .attr("y1", y(d3.max(data, (d) => d.max) as number))
      .attr("x2", width)
      .attr("y2", y(d3.max(data, (d) => d.max) as number))
      .attr("stroke", "orange")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "10");

    // Circles and text labels
    const circles = svg.selectAll("circle").data(data).enter().append("g");

    circles
      .append("circle")
      .attr("cx", (d) => {
        if (!d) {
          return "";
        }
        // @ts-expect-error: This shouldn't be undefined so ignoring.
        return x(d.expressionType) + x.bandwidth() / 2;
      })
      .attr("cy", (d) => y(d.expressionValue))
      .attr("r", 5)
      .attr("fill", (d) => (d.outlier ? "red" : "rgb(49, 134, 206)"));

    circles
      .append("text")
      // @ts-expect-error: This shouldn't be undefined so ignoring.
      .attr("x", (d) => x(d.expressionType) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.expressionValue) - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", (d) => (d.outlier ? "red" : "rgb(49, 134, 206)"))
      .text((d) => d.expressionValue);
  }, [data]);

  return (
    <Card sx={{ padding: 2 }}>
      <Typography variant="h5">
        {"Anomaly result for "}
        {geneName}
      </Typography>
      <Box
        paddingTop={2}
        flexWrap="wrap"
        display="flex"
        alignItems="center"
        gap={1}
      >
        <Typography
          variant="subtitle1"
          color={outliers?.length > 0 ? "red" : "rgb(49, 134, 206)"}
        >
          {outliers?.length > 0
            ? `There is ${outliers.length} outlier(s): `
            : "There is no outlier"}
        </Typography>
        {outliers?.length > 0 ? (
          <Box display="flex" gap={1}>
            {outliers.map((d) => (
              <Chip
                color="error"
                key={d.expressionType}
                label={`${d.expressionType}: ${d.expressionValue}`}
              />
            ))}
          </Box>
        ) : undefined}
      </Box>
      <div ref={chartRef} />
    </Card>
  );
};
