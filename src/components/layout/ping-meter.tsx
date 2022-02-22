import React from "react";
import styled from "styled-components";
import { ping } from "../../util/api/http/ping";

export const Wrapper = styled.div`
  position: fixed;
  top: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.6rem;
  font-weight: bold;
`;

let timeout: number;

export const PingMeter = () => {
  const [latency, setLatency] = React.useState(0);
  const color = React.useMemo(() => {
    if (latency < 100) return "teal";
    if (latency < 300) return "yellow";
    if (latency < 600) return "orange";
    return "red";
  }, [latency]);

  const getPing = React.useCallback(async () => {
    setLatency(await ping());
    timeout = setTimeout(getPing, 2000);
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    getPing();

    return () => {
      clearTimeout(timeout);
    };
  }, [getPing]);

  return (
    <Wrapper>
      <span style={{ color: `var(--${color})` }}>{latency} ms</span>
    </Wrapper>
  );
};
