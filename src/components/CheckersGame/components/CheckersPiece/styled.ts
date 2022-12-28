import styled from 'styled-components';

export const CheckerPieceWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #fff;
  border: 2px solid #333;

  &.white {
    background-color: #b7a484;
  }

  &.black {
    background-color: rgb(32, 32, 32);
  }

  &.selected {
    border-color: #c5b257;
  }
`;

export const CheckerPieceInner = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background-color: #fff;
  border: 2px solid #333;

  &.king {
    background: url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"%3E%3Cpath fill="gold" d="m12 8l3 5.2l3-2.7l-.7 3.5H6.7L6 10.5l3 2.7L12 8m0-4l-3.5 6L3 5l2 11h14l2-11l-5.5 5L12 4m7 14H5v1c0 .6.4 1 1 1h12c.6 0 1-.4 1-1v-1Z"%2F%3E%3C%2Fsvg%3E')
      no-repeat;
    background-size: 80% auto;
    background-position: center;
  }

  &.black {
    background-color: black;
  }
  &.white {
    background-color: wheat;
  }
`;
