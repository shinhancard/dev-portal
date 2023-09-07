import {
  ClockConfig,
  HeaderWorldClock,
  HomePageCompanyLogo,
  HomePageStarredEntities,
  HomePageToolkit,
  WelcomeTitle,
} from '@backstage/plugin-home';
import { Content, Header, Page } from '@backstage/core-components';
import { HomePageSearchBar } from '@backstage/plugin-search';
import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import GitHubIcon from '@material-ui/icons/GitHub';
import { Grid, makeStyles } from '@material-ui/core';

const clockConfigs: ClockConfig[] = [
  {
    label: '대한민국',
    timeZone: 'Asia/Seoul',
  },
  {
    label: '베트남',
    timeZone: 'Asia/Ho_Chi_Minh',
  },
  {
    label: '인도네시아(서부)',
    timeZone: 'Asia/Jakarta',
  },
  {
    label: '미국',
    timeZone: 'UTC',
  },
];

const timeFormat: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
};

const useStyles = makeStyles(theme => ({
  searchBarInput: {
    maxWidth: '60vw',
    margin: 'auto',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '50px',
    boxShadow: theme.shadows[1],
  },
  searchBarOutline: {
    borderStyle: 'none',
  },
}));

const customTools = [
  {
    url: 'https://swa-backstage.shrnd.link',
    label: '신한카드 개발자 포탈',
    icon: <HomeIcon />,
  },
  {
    url: 'https://swa-backstage.shrnd.link',
    label: 'github',
    icon: <GitHubIcon />,
  },
  {
    url: 'https://swa-grafana.shrnd.link',
    label: 'grafana',
    icon: <AccessAlarmIcon />,
  },
  {
    url: 'https://swa-jaeger.shrnd.link',
    label: 'jaeger',
    icon: <AccessAlarmIcon />,
  },
];

export const HomePage = () => {
  const classes = useStyles();
  return (
    <Page themeId="home">
      <Header title={<WelcomeTitle />} pageTitleOverride="Home">
        <HeaderWorldClock
          clockConfigs={clockConfigs}
          customTimeFormat={timeFormat}
        />
      </Header>
      <Content>
        <Grid container justifyContent="center" spacing={6}>
          <Grid container item xs={12} justifyContent="center">
            <HomePageCompanyLogo />
          </Grid>
          <Grid container item xs={12} justifyContent="center">
            <HomePageSearchBar
              InputProps={{
                classes: {
                  root: classes.searchBarInput,
                  notchedOutline: classes.searchBarOutline,
                },
              }}
              placeholder="Search"
            />
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={12} md={6}>
              <HomePageStarredEntities />
            </Grid>
            <Grid item xs={12} md={6}>
              <HomePageToolkit tools={customTools} />
            </Grid>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
